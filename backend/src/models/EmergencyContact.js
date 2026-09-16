import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
    },
    marathiName: {
      type: String,
      default: '',
      trim: true,
    },
    department: {
      type: String,
      required: true,
      enum: [
        'Police',
        'Ambulance',
        'Fire Brigade',
        'Gram Panchayat Office',
        'Electricity',
        'Water Department',
        'Healthcare',
        'Women Helpline',
        'Disaster Management',
      ],
      index: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    altPhoneNumber: {
      type: String,
      default: '',
      trim: true,
    },
    address: {
      type: String,
      default: 'Yewla, Dist. Jalna',
    },
    isAvailable24x7: {
      type: Boolean,
      default: true,
    },
    priorityOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

emergencyContactSchema.index({ priorityOrder: 1, department: 1 });

export const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);
