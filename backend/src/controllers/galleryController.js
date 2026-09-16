import { Gallery } from '../models/Gallery.js';

export const getGalleryImages = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    const images = await Gallery.find(query).sort({ eventDate: -1, createdAt: -1 });

    res.json({
      success: true,
      data: images,
      count: images.length,
    });
  } catch (error) {
    next(error);
  }
};

export const createGalleryImage = async (req, res, next) => {
  try {
    const { title, marathiTitle, category, caption, eventDate } = req.body;

    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const item = await Gallery.create({
      title,
      marathiTitle: marathiTitle || '',
      category: category || 'Event',
      imageUrl,
      caption: caption || '',
      eventDate: eventDate || Date.now(),
    });

    res.status(201).json({
      success: true,
      message: 'Gallery item added successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryImage = async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    res.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (error) {
    next(error);
  }
};
