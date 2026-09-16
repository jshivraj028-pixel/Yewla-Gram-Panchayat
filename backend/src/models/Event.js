import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    marathiTitle: {
      type: String,
      default: '',
      trim: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: ['Gram Sabha', 'Medical Camp', 'Agricultural Workshop', 'Cultural Program', 'Ward Meeting', 'Vaccination Drive', 'Other'],
      default: 'Gram Sabha',
      index: true,
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
      index: true,
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      default: 'Gram Panchayat Office, Yewla',
    },
    description: {
      type: String,
      default: '',
    },
    marathiDescription: {
      type: String,
      default: '',
    },
    agenda: [
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
    photos: [
      {
        type: String,
      },
    ],
    minutesOfMeeting: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
  },
  {
    timestamps: true,
  }
);

export const Event = mongoose.model('Event', eventSchema);
