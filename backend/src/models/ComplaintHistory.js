import mongoose from 'mongoose';

const complaintHistorySchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
      index: true,
    },
    complaintId: {
      type: String,
      required: true,
      index: true,
    },
    oldStatus: {
      type: String,
      default: '',
    },
    newStatus: {
      type: String,
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    changedByName: {
      type: String,
      default: '',
    },
    changedByRole: {
      type: String,
      default: '',
    },
    assignedToName: {
      type: String,
      default: '',
    },
    remark: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

complaintHistorySchema.index({ complaint: 1, createdAt: 1 });

export const ComplaintHistory = mongoose.model('ComplaintHistory', complaintHistorySchema);
