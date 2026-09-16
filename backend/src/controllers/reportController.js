import { User } from '../models/User.js';
import { Complaint } from '../models/Complaint.js';
import { ServiceRequest } from '../models/ServiceRequest.js';
import { Notice } from '../models/Notice.js';
import { Project } from '../models/Project.js';
import { Event } from '../models/Event.js';

// @desc    Get complete administrative dashboard stats
// @route   GET /api/reports/dashboard-stats
// @access  Private (Admin / Staff)
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalCitizens,
      activeCitizens,
      totalStaff,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      inProgressComplaints,
      totalRequests,
      pendingRequests,
      approvedRequests,
      totalNotices,
      activeProjects,
      totalEvents,
    ] = await Promise.all([
      User.countDocuments({ role: 'citizen' }),
      User.countDocuments({ role: 'citizen', isActive: true }),
      User.countDocuments({ role: 'staff' }),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.countDocuments({ status: { $in: ['In Progress', 'Assigned', 'Under Review'] } }),
      ServiceRequest.countDocuments(),
      ServiceRequest.countDocuments({ status: { $in: ['Submitted', 'Under Review', 'Processing'] } }),
      ServiceRequest.countDocuments({ status: 'Approved' }),
      Notice.countDocuments({ isPublished: true }),
      Project.countDocuments({ status: { $in: ['In Progress', 'Approved'] } }),
      Event.countDocuments(),
    ]);

    // Breakdown of complaints by category
    const complaintsByCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Breakdown of complaints by status
    const complaintsByStatus = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Breakdown of requests by type
    const requestsByType = await ServiceRequest.aggregate([
      { $group: { _id: '$requestType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Projects status breakdown
    const projectsByStatus = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        cards: {
          totalCitizens,
          activeCitizens,
          totalStaff,
          totalComplaints,
          pendingComplaints,
          resolvedComplaints,
          inProgressComplaints,
          totalRequests,
          pendingRequests,
          approvedRequests,
          totalNotices,
          activeProjects,
          totalEvents,
        },
        complaintsByCategory,
        complaintsByStatus,
        requestsByType,
        projectsByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export Complaints to CSV
// @route   GET /api/reports/complaints/export-csv
// @access  Private (Admin / Staff)
export const exportComplaintsCsv = async (req, res, next) => {
  try {
    const { status, wardNumber, category, startDate, endDate } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (wardNumber && wardNumber !== 'All') query.wardNumber = Number(wardNumber);
    if (category && category !== 'All') query.category = category;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const complaints = await Complaint.find(query)
      .populate('citizen', 'name mobile')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });

    // Build CSV string
    const headers = [
      'Complaint ID',
      'Citizen Name',
      'Citizen Mobile',
      'Category',
      'Title',
      'Ward',
      'Location',
      'Status',
      'Priority',
      'Assigned To',
      'Created Date',
      'Resolved Date',
    ];

    const rows = complaints.map((c) => [
      `"${c.complaintId}"`,
      `"${c.citizen?.name || 'N/A'}"`,
      `"${c.citizen?.mobile || 'N/A'}"`,
      `"${c.category}"`,
      `"${(c.title || '').replace(/"/g, '""')}"`,
      `"${c.wardNumber}"`,
      `"${(c.location || '').replace(/"/g, '""')}"`,
      `"${c.status}"`,
      `"${c.priority}"`,
      `"${c.assignedTo?.name || 'Unassigned'}"`,
      `"${new Date(c.createdAt).toLocaleDateString()}"`,
      `"${c.resolvedAt ? new Date(c.resolvedAt).toLocaleDateString() : 'N/A'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="yewla_gp_complaints.csv"');
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
