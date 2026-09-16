import { Scheme } from '../models/Scheme.js';

export const getSchemes = async (req, res, next) => {
  try {
    const { category, search, activeOnly = 'true' } = req.query;
    const query = {};

    if (activeOnly === 'true') {
      query.isActive = true;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { marathiName: regex }, { description: regex }];
    }

    const schemes = await Scheme.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: schemes,
      count: schemes.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getSchemeById = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found' });
    }
    res.json({ success: true, data: scheme });
  } catch (error) {
    next(error);
  }
};

export const createScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Scheme created successfully',
      data: scheme,
    });
  } catch (error) {
    next(error);
  }
};

export const updateScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found' });
    }
    res.json({ success: true, message: 'Scheme updated successfully', data: scheme });
  } catch (error) {
    next(error);
  }
};

export const deleteScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found' });
    }
    res.json({ success: true, message: 'Scheme deleted successfully' });
  } catch (error) {
    next(error);
  }
};
