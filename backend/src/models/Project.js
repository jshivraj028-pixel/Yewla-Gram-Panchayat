import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    marathiName: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Road Construction',
        'Water Supply',
        'Drainage',
        'Street Lighting',
        'Community Building',
        'Sanitation',
        'Solar Energy',
        'Other',
      ],
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    wardNumber: {
      type: Number,
      default: 1,
    },
    budget: {
      type: Number,
      required: true,
    },
    spent: {
      type: Number,
      default: 0,
    },
    contractorName: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      required: true,
    },
    expectedCompletionDate: {
      type: Date,
      required: true,
    },
    actualCompletionDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['Planned', 'Approved', 'In Progress', 'Completed', 'Delayed'],
      default: 'In Progress',
      index: true,
    },
    progressPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    documents: [
      {
        title: String,
        fileUrl: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model('Project', projectSchema);
