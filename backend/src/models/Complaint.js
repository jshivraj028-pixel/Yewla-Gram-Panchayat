import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Road',
        'Water',
        'Street Light',
        'Drainage',
        'Garbage',
        'Sanitation',
        'Electricity',
        'Public Property',
        'Other',
      ],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    photo: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location details are required'],
      trim: true,
    },
    wardNumber: {
      type: Number,
      required: [true, 'Ward number is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    adminRemarks: {
      type: String,
      trim: true,
      default: '',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast admin querying
complaintSchema.index({ status: 1, wardNumber: 1 });
complaintSchema.index({ createdAt: -1 });

export const Complaint = mongoose.model('Complaint', complaintSchema);
