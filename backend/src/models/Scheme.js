import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Scheme name is required'],
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
        'Agriculture',
        'Education',
        'Housing',
        'Women & Child',
        'Employment',
        'Senior Citizens',
        'Health',
        'Social Welfare',
      ],
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    marathiDescription: {
      type: String,
      default: '',
    },
    eligibility: {
      type: String,
      default: '',
    },
    marathiEligibility: {
      type: String,
      default: '',
    },
    requiredDocuments: [
      {
        type: String,
      },
    ],
    applicationProcess: {
      type: String,
      default: '',
    },
    marathiApplicationProcess: {
      type: String,
      default: '',
    },
    officialLink: {
      type: String,
      default: '',
    },
    benefitAmount: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Scheme = mongoose.model('Scheme', schemeSchema);
