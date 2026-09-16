import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
  {
    requestId: {
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
    requestType: {
      type: String,
      required: [true, 'Request type is required'],
      enum: [
        'Birth Certificate Verification',
        'Death Certificate Verification',
        'Marriage Certificate Endorsement',
        'Income & Caste Recommendation',
        'Water Connection Permission',
        'Property Assessment Extract',
        'Construction NOC',
        'Trade License NOC',
        'General Panchayat Service',
      ],
      index: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    details: {
      type: String,
      required: [true, 'Details are required'],
      trim: true,
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Processing', 'Approved', 'Rejected'],
      default: 'Submitted',
      index: true,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    remarks: {
      type: String,
      default: '',
    },
    certificateUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

serviceRequestSchema.index({ citizen: 1, createdAt: -1 });

export const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
