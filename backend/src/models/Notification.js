import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null means broadcast notification to all citizens
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    marathiTitle: {
      type: String,
      default: '',
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    marathiMessage: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['Complaint', 'Request', 'Notice', 'Event', 'Scheme', 'System'],
      default: 'System',
      index: true,
    },
    referenceId: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);
