import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Do not include in queries by default
    },
    role: {
      type: String,
      enum: ['citizen', 'staff', 'admin'],
      default: 'citizen',
      index: true,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    wardNumber: {
      type: Number,
      required: [true, 'Ward number is required'],
      min: 1,
      max: 20,
      index: true,
    },
    designation: {
      type: String,
      trim: true,
      default: '', // For staff/admin: e.g. "Gram Sevak", "Sarpanch", "Junior Engineer"
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
