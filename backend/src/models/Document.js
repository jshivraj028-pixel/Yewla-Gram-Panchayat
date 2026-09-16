import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
    },
    marathiTitle: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Gram Sabha Documents',
        'Notices',
        'Forms',
        'Reports',
        'Development Documents',
        'Citizen Charter',
        'Public Information',
      ],
      default: 'Forms',
      index: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: String,
      default: '1.2 MB',
    },
    fileType: {
      type: String,
      default: 'PDF',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const Document = mongoose.model('Document', documentSchema);
