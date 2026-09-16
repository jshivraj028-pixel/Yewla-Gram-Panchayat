import { Notice } from '../models/Notice.js';
import { Notification } from '../models/Notification.js';

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public / Private
export const getNotices = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 10, all = 'false' } = req.query;

    const query = {};

    // Citizens only see published notices
    if (all !== 'true' || !req.user || req.user.role === 'citizen') {
      query.isPublished = true;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { marathiTitle: searchRegex },
        { description: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [notices, total] = await Promise.all([
      Notice.find(query)
        .populate('author', 'name designation')
        .sort({ isPinned: -1, publishedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Notice.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: notices,
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

// @desc    Get single notice by ID
// @route   GET /api/notices/:id
// @access  Public
export const getNoticeById = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id).populate('author', 'name designation');
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found',
      });
    }

    res.json({
      success: true,
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create notice (Admin / Staff)
// @route   POST /api/notices
// @access  Private (Admin / Staff)
export const createNotice = async (req, res, next) => {
  try {
    const {
      title,
      marathiTitle,
      description,
      marathiDescription,
      category,
      isPinned,
      isPublished,
      expiresAt,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and description',
      });
    }

    let image = '';
    let pdfDocument = '';

    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        image = `/uploads/${req.files.image[0].filename}`;
      }
      if (req.files.pdfDocument && req.files.pdfDocument[0]) {
        pdfDocument = `/uploads/${req.files.pdfDocument[0].filename}`;
      }
    }

    const notice = await Notice.create({
      title,
      marathiTitle: marathiTitle || '',
      description,
      marathiDescription: marathiDescription || '',
      category: category || 'General',
      image: image || req.body.image || '',
      pdfDocument: pdfDocument || req.body.pdfDocument || '',
      isPinned: isPinned === 'true' || isPinned === true,
      isPublished: isPublished !== 'false' && isPublished !== false,
      expiresAt: expiresAt || null,
      author: req.user._id,
    });

    // Broadcast notification to all citizens
    await Notification.create({
      recipient: null, // broadcast
      title: `Notice: ${title}`,
      marathiTitle: `सूचना: ${marathiTitle || title}`,
      message: description.substring(0, 150) + (description.length > 150 ? '...' : ''),
      marathiMessage: (marathiDescription || description).substring(0, 150),
      type: 'Notice',
      referenceId: notice._id.toString(),
    });

    res.status(201).json({
      success: true,
      message: 'Notice published successfully',
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private (Admin / Staff)
export const updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found',
      });
    }

    const fields = [
      'title',
      'marathiTitle',
      'description',
      'marathiDescription',
      'category',
      'isPinned',
      'isPublished',
      'expiresAt',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        notice[field] = req.body[field];
      }
    });

    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        notice.image = `/uploads/${req.files.image[0].filename}`;
      }
      if (req.files.pdfDocument && req.files.pdfDocument[0]) {
        notice.pdfDocument = `/uploads/${req.files.pdfDocument[0].filename}`;
      }
    }

    await notice.save();

    res.json({
      success: true,
      message: 'Notice updated successfully',
      data: notice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private (Admin)
export const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found',
      });
    }

    await notice.deleteOne();

    res.json({
      success: true,
      message: 'Notice deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
