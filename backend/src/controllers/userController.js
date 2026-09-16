import { User } from '../models/User.js';
import { Complaint } from '../models/Complaint.js';
import { ServiceRequest } from '../models/ServiceRequest.js';

// @desc    Get all users with filtering and pagination
// @route   GET /api/users
// @access  Private (Admin)
export const getUsers = async (req, res, next) => {
  try {
    const { role, wardNumber, isActive, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (role && role !== 'All') {
      query.role = role;
    }

    if (wardNumber && wardNumber !== 'All') {
      query.wardNumber = Number(wardNumber);
    }

    if (isActive !== undefined && isActive !== 'All') {
      query.isActive = isActive === 'true';
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { mobile: regex }, { email: regex }];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: users,
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

// @desc    Toggle user status (Active / Inactive)
// @route   PATCH /api/users/:id/status
// @access  Private (Admin)
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent self-deactivation
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own admin account',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        _id: user._id,
        name: user.name,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role & details
// @route   PATCH /api/users/:id/role
// @access  Private (Admin)
export const updateUserRole = async (req, res, next) => {
  try {
    const { role, designation } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role) {
      if (!['citizen', 'staff', 'admin'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role' });
      }
      user.role = role;
    }

    if (designation !== undefined) {
      user.designation = designation;
    }

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        role: user.role,
        designation: user.designation,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile with their complaints and activity
// @route   GET /api/users/:id/profile
// @access  Private (Authenticated users)
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch user complaints with populated comments and likes
    const [complaints, totalRequests] = await Promise.all([
      Complaint.find({ citizen: user._id })
        .populate('citizen', 'name avatar mobile wardNumber')
        .populate('assignedTo', 'name mobile designation avatar')
        .populate('comments.user', 'name avatar role designation')
        .sort({ createdAt: -1 }),
      ServiceRequest.countDocuments({ citizen: user._id }),
    ]);

    const totalComplaints = complaints.length;
    const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved').length;
    const pendingComplaints = complaints.filter((c) => c.status === 'Pending').length;

    res.json({
      success: true,
      data: {
        user,
        stats: {
          totalComplaints,
          resolvedComplaints,
          pendingComplaints,
          totalRequests,
        },
        complaints,
      },
    });
  } catch (error) {
    next(error);
  }
};
