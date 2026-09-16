import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Image title is required'],
      trim: true,
    },
    marathiTitle: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      enum: ['Event', 'Development', 'Gram Sabha', 'Village Heritage', 'Agriculture', 'Other'],
      default: 'Event',
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },
    eventDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Gallery = mongoose.model('Gallery', gallerySchema);
