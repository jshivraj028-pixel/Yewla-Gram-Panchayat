import { ServiceRequest } from '../models/ServiceRequest.js';
import { Notification } from '../models/Notification.js';
import { generatePdfBuffer } from '../utils/pdfGenerator.js';

// Helper to generate sequential Request ID
const generateRequestId = async () => {
  const count = await ServiceRequest.countDocuments();
  const nextNumber = (count + 1).toString().padStart(6, '0');
  return `GP-REQ-${nextNumber}`;
};

// @desc    Submit a service request
// @route   POST /api/requests
// @access  Private (Citizen)
export const createRequest = async (req, res, next) => {
  try {
    const { requestType, subject, details } = req.body;

    if (!requestType || !subject || !details) {
      return res.status(400).json({
        success: false,
        message: 'Please provide request type, subject, and details',
      });
    }

    const requestId = await generateRequestId();

    const attachments = [];
    if (req.file) {
      attachments.push({
        fileName: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
      });
    }

    const serviceRequest = await ServiceRequest.create({
      requestId,
      citizen: req.user._id,
      requestType,
      subject,
      details,
      attachments,
      status: 'Submitted',
    });

    await Notification.create({
      recipient: req.user._id,
      title: 'Service Request Submitted',
      marathiTitle: 'सेवा अर्ज सादर केला',
      message: `Your request #${serviceRequest.requestId} for '${requestType}' has been received.`,
      marathiMessage: `तुमचा अर्ज #${serviceRequest.requestId} (${requestType}) स्वीकारला गेला आहे.`,
      type: 'Request',
      referenceId: serviceRequest.requestId,
    });

    res.status(201).json({
      success: true,
      message: 'Service request submitted successfully',
      data: serviceRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get service requests (role-aware + filterable + paginated)
// @route   GET /api/requests
// @access  Private
export const getRequests = async (req, res, next) => {
  try {
    const { status, requestType, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (req.user.role === 'citizen') {
      query.citizen = req.user._id;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (requestType && requestType !== 'All') {
      query.requestType = requestType;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ requestId: searchRegex }, { subject: searchRegex }, { details: searchRegex }];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [requests, total] = await Promise.all([
      ServiceRequest.find(query)
        .populate('citizen', 'name mobile email wardNumber address avatar')
        .populate('processedBy', 'name designation avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      ServiceRequest.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: requests,
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

// @desc    Get single request by ID
// @route   GET /api/requests/:id
// @access  Private
export const getRequestById = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('citizen', 'name mobile email wardNumber address avatar')
      .populate('processedBy', 'name designation avatar');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found',
      });
    }

    if (req.user.role === 'citizen' && request.citizen._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this request',
      });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service request status (Admin/Staff)
// @route   PATCH /api/requests/:id/status
// @access  Private (Admin / Staff)
export const updateRequestStatus = async (req, res, next) => {
  try {
    const { status, remarks, certificateUrl } = req.body;

    const request = await ServiceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found',
      });
    }

    if (status) request.status = status;
    if (remarks) request.remarks = remarks;
    if (certificateUrl) request.certificateUrl = certificateUrl;
    request.processedBy = req.user._id;

    await request.save();

    // Notify citizen
    await Notification.create({
      recipient: request.citizen,
      title: `Service Request #${request.requestId} Updated`,
      marathiTitle: `सेवा अर्ज #${request.requestId} अद्यतनित केला`,
      message: `Your request status is now: ${request.status}. ${remarks ? 'Remark: ' + remarks : ''}`,
      marathiMessage: `तुमच्या अर्जाची सद्यस्थिती: ${request.status}. ${remarks ? 'शेरा: ' + remarks : ''}`,
      type: 'Request',
      referenceId: request.requestId,
    });

    res.json({
      success: true,
      message: 'Service request updated successfully',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadRequestReceipt = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('citizen', 'name mobile address wardNumber');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    const complainantName = request.citizen?.name || 'Citizen';
    const complainantMobile = request.citizen?.mobile || 'N/A';
    const regDate = new Date(request.createdAt).toLocaleDateString('en-GB');

    const buffer = generatePdfBuffer({
      title: 'CERTIFICATE & SERVICE APPLICATION RECEIPT',
      subtitle: 'Official Application Slip (GramSeva Citizen Portal)',
      category: request.requestType,
      refNo: request.requestId,
      date: regDate,
      contentLines: [
        `1. Application Tracking ID: ${request.requestId}`,
        `2. Applicant Citizen: ${complainantName} (Mobile: ${complainantMobile})`,
        `3. Applied Service: ${request.requestType}`,
        `4. Subject / Purpose: ${request.subject}`,
        `5. Current Processing Status: ${request.status}`,
        `6. Remarks: ${request.adminRemarks || 'Application under official scrutiny'}`,
        `7. SLA: Service certificate typically issued within 3 to 5 working days.`,
        `8. Verification: Present this acknowledgement slip at Gram Panchayat counter.`,
      ],
    });

    const filename = `Receipt_${request.requestId}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  } catch (error) {
    next(error);
  }
};
