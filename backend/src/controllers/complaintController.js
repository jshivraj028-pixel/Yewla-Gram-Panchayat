import { Complaint } from '../models/Complaint.js';
import { ComplaintHistory } from '../models/ComplaintHistory.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { generatePdfBuffer } from '../utils/pdfGenerator.js';

// Helper to generate sequential Complaint ID
const generateComplaintId = async () => {
  const count = await Complaint.countDocuments();
  const nextNumber = (count + 1).toString().padStart(6, '0');
  return `GP-CMP-${nextNumber}`;
};

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Citizen)
export const createComplaint = async (req, res, next) => {
  try {
    const { category, title, description, location, wardNumber, priority } = req.body;

    if (!category || !title || !description || !location || !wardNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category, title, description, location, and ward number',
      });
    }

    const complaintId = await generateComplaintId();

    // Check if photo was uploaded
    let photoUrl = '';
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.photo) {
      photoUrl = req.body.photo;
    }

    const complaint = await Complaint.create({
      complaintId,
      citizen: req.user._id,
      category,
      title,
      description,
      location,
      wardNumber: Number(wardNumber),
      priority: priority || 'Medium',
      photo: photoUrl,
      status: 'Pending',
    });

    // Create initial history record
    await ComplaintHistory.create({
      complaint: complaint._id,
      complaintId: complaint.complaintId,
      oldStatus: '',
      newStatus: 'Pending',
      changedBy: req.user._id,
      changedByName: req.user.name,
      changedByRole: req.user.role,
      remark: 'Complaint registered by citizen',
    });

    // Create confirmation notification for citizen
    await Notification.create({
      recipient: req.user._id,
      title: 'Complaint Registered',
      marathiTitle: 'तक्रार नोंदवली गेली',
      message: `Your complaint #${complaint.complaintId} (${category}) has been submitted successfully.`,
      marathiMessage: `तुमची तक्रार #${complaint.complaintId} (${category}) यशस्वीरित्या नोंदवली गेली आहे.`,
      type: 'Complaint',
      referenceId: complaint.complaintId,
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaints (role-aware + filterable + paginated)
// @route   GET /api/complaints
// @access  Private
export const getComplaints = async (req, res, next) => {
  try {
    const {
      status,
      category,
      wardNumber,
      search,
      scope,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    // Role-based filtering
    if (req.user.role === 'citizen') {
      // If scope is explicitly 'my', only return current citizen's complaints.
      // Otherwise (e.g. 'all' or default community view), citizens can view all complaints.
      if (scope === 'my') {
        query.citizen = req.user._id;
      }
    } else if (req.user.role === 'staff') {
      // Staff can see complaints assigned to them or unassigned
      if (req.query.assignedOnly === 'true') {
        query.assignedTo = req.user._id;
      }
    }

    // Additional filters
    if (status && status !== 'All') {
      query.status = status;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (wardNumber && wardNumber !== 'All') {
      query.wardNumber = Number(wardNumber);
    }

    // Search query across complaintId, title, description, location
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { complaintId: searchRegex },
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const sortOption = { [sortBy]: order === 'asc' ? 1 : -1 };

    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .populate('citizen', 'name mobile email wardNumber address avatar')
        .populate('assignedTo', 'name mobile designation avatar')
        .populate('comments.user', 'name mobile avatar role designation')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Complaint.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: complaints,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint by ID with full history timeline
// @route   GET /api/complaints/:id
// @access  Private
export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('citizen', 'name mobile email wardNumber address avatar')
      .populate('assignedTo', 'name mobile designation avatar')
      .populate('comments.user', 'name mobile avatar role designation');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Retrieve timeline history
    const history = await ComplaintHistory.find({ complaint: complaint._id })
      .populate('changedBy', 'name role designation')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: {
        complaint,
        history,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status, assignment, and remarks (Admin/Staff)
// @route   PATCH /api/complaints/:id/status
// @access  Private (Admin / Staff)
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, assignedTo, adminRemarks, priority } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    const oldStatus = complaint.status;
    let assignedStaffName = '';

    if (assignedTo) {
      const staffUser = await User.findById(assignedTo);
      if (staffUser) {
        complaint.assignedTo = staffUser._id;
        assignedStaffName = staffUser.name;
      }
    }

    if (priority) {
      complaint.priority = priority;
    }

    if (adminRemarks) {
      complaint.adminRemarks = adminRemarks;
    }

    if (status) {
      complaint.status = status;
      if (status === 'Resolved') {
        complaint.resolvedAt = new Date();
      }
    }

    await complaint.save();

    // Create audit history
    await ComplaintHistory.create({
      complaint: complaint._id,
      complaintId: complaint.complaintId,
      oldStatus,
      newStatus: status || oldStatus,
      changedBy: req.user._id,
      changedByName: req.user.name,
      changedByRole: req.user.role,
      assignedToName: assignedStaffName,
      remark: adminRemarks || `Status changed from ${oldStatus} to ${status || oldStatus}`,
    });

    // Notify the citizen
    await Notification.create({
      recipient: complaint.citizen,
      title: `Complaint #${complaint.complaintId} Updated`,
      marathiTitle: `तक्रार #${complaint.complaintId} अद्यतनित केली`,
      message: `Status: ${status || oldStatus}. ${adminRemarks ? 'Remark: ' + adminRemarks : ''}`,
      marathiMessage: `स्थिती: ${status || oldStatus}. ${adminRemarks ? 'शेरा: ' + adminRemarks : ''}`,
      type: 'Complaint',
      referenceId: complaint.complaintId,
    });

    res.json({
      success: true,
      message: 'Complaint updated successfully',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaint analytics summary for dashboard
// @route   GET /api/complaints/analytics
// @access  Private (Admin / Staff)
export const getComplaintAnalytics = async (req, res, next) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const underReview = await Complaint.countDocuments({ status: 'Under Review' });
    const inProgress = await Complaint.countDocuments({ status: { $in: ['Assigned', 'In Progress'] } });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const rejected = await Complaint.countDocuments({ status: 'Rejected' });

    // Complaints by category
    const byCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Complaints by ward
    const byWard = await Complaint.aggregate([
      { $group: { _id: '$wardNumber', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        total,
        pending,
        underReview,
        inProgress,
        resolved,
        rejected,
        resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
        byCategory,
        byWard,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const downloadComplaintReceipt = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('citizen', 'name mobile address wardNumber')
      .populate('assignedTo', 'name designation mobile');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const complainantName = complaint.citizen?.name || 'Citizen';
    const complainantMobile = complaint.citizen?.mobile || 'N/A';
    const regDate = new Date(complaint.createdAt).toLocaleDateString('en-GB');

    const buffer = generatePdfBuffer({
      title: 'GRIEVANCE REGISTRATION ACKNOWLEDGMENT RECEIPT',
      subtitle: 'Official Redressal Tracking Slip (GramSeva Citizen Portal)',
      category: `Type: ${complaint.category} | Ward: ${complaint.wardNumber}`,
      refNo: complaint.complaintId,
      date: regDate,
      contentLines: [
        `1. Tracking Complaint ID: ${complaint.complaintId}`,
        `2. Complainant Citizen: ${complainantName} (Mobile: ${complainantMobile})`,
        `3. Problem Location: Ward ${complaint.wardNumber}, ${complaint.location || 'Yewla, Dist. Jalna'}`,
        `4. Subject / Title: ${complaint.title}`,
        `5. Redressal Status: ${complaint.status} (Priority: ${complaint.priority || 'Normal'})`,
        `6. Assigned Officer: ${complaint.assignedTo ? `${complaint.assignedTo.name} (${complaint.assignedTo.designation || 'Staff'})` : 'Panchayat Redressal Cell'}`,
        `7. Citizen Notice: Keep this receipt for tracking inspection and resolution milestones.`,
        `8. Helpline Support: 02559-222100 | contact@yewlagp.in | Yewla Gram Panchayat Bhavan`,
      ],
    });

    const filename = `Receipt_${complaint.complaintId}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on a complaint
// @route   POST /api/complaints/:id/like
// @access  Private
export const toggleLikeComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (!complaint.likes) {
      complaint.likes = [];
    }

    const userIdStr = req.user._id.toString();
    const index = complaint.likes.findIndex((id) => id.toString() === userIdStr);

    if (index === -1) {
      complaint.likes.push(req.user._id);
    } else {
      complaint.likes.splice(index, 1);
    }

    await complaint.save();

    res.json({
      success: true,
      message: index === -1 ? 'Liked complaint' : 'Unliked complaint',
      data: {
        likesCount: complaint.likes.length,
        isLiked: index === -1,
        likes: complaint.likes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to a complaint
// @route   POST /api/complaints/:id/comments
// @access  Private
export const addCommentToComplaint = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (!complaint.comments) {
      complaint.comments = [];
    }

    complaint.comments.push({
      user: req.user._id,
      text: text.trim(),
      createdAt: new Date(),
    });

    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate('comments.user', 'name mobile avatar role designation');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: updated.comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment from a complaint
// @route   DELETE /api/complaints/:id/comments/:commentId
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const comment = complaint.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Only comment author or admin can delete
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    comment.deleteOne();
    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate('comments.user', 'name mobile avatar role designation');

    res.json({
      success: true,
      message: 'Comment deleted successfully',
      data: updated.comments,
    });
  } catch (error) {
    next(error);
  }
};
