import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'English title is required'],
      trim: true,
    },
    marathiTitle: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    marathiDescription: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: ['Gram Sabha', 'Health', 'Agriculture', 'General', 'Tender', 'Schemes', 'Tax Notice'],
      default: 'General',
      index: true,
    },
    image: {
      type: String,
      default: '',
    },
    pdfDocument: {
      type: String,
      default: '',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

noticeSchema.index({ isPublished: 1, isPinned: -1, publishedAt: -1 });

export const Notice = mongoose.model('Notice', noticeSchema);
