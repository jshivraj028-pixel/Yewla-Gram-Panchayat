import fs from 'fs';
import path from 'path';
import { Document } from '../models/Document.js';
import { generatePdfBuffer } from '../utils/pdfGenerator.js';

export const getDocuments = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { marathiTitle: regex }];
    }

    const documents = await Document.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: documents,
      count: documents.length,
    });
  } catch (error) {
    next(error);
  }
};

export const createDocument = async (req, res, next) => {
  try {
    const { title, marathiTitle, category, fileUrl, fileSize, fileType } = req.body;

    let docUrl = fileUrl;
    if (req.file) {
      docUrl = `/uploads/${req.file.filename}`;
    }

    const document = await Document.create({
      title,
      marathiTitle: marathiTitle || '',
      category: category || 'Forms',
      fileUrl: docUrl,
      fileSize: fileSize || '1.5 MB',
      fileType: fileType || 'PDF',
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const downloadDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    let filename = path.basename(document.fileUrl || '');
    if (!filename || filename === '.' || !filename.endsWith('.pdf')) {
      filename = `${document.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    }

    const uploadDir = path.resolve('uploads');
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      const buffer = generatePdfBuffer({
        title: document.title,
        subtitle: document.marathiTitle || document.category,
        category: document.category,
        refNo: `GP-DOC-${document._id.toString().substring(18).toUpperCase()}`,
      });
      fs.writeFileSync(filePath, buffer);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};
