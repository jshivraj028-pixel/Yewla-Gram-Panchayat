import { User } from '../models/User.js';
import { generateToken } from '../utils/token.js';

// @desc    Register a new citizen
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, mobile, email, password, address, wardNumber } = req.body;

    // Validation
    if (!name || !mobile || !password || !wardNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, mobile number, password, and ward number',
      });
    }

    if (mobile.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if mobile already exists
    const userExists = await User.findOne({ mobile });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'A user with this mobile number is already registered',
      });
    }

    // Role cannot be escalated during registration - always defaults to citizen
    const user = await User.create({
      name,
      mobile,
      email: email || undefined,
      password,
      address: address || '',
      wardNumber: Number(wardNumber),
      role: 'citizen',
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Citizen registration successful',
      data: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        address: user.address,
        wardNumber: user.wardNumber,
        avatar: user.avatar || '',
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // identifier can be mobile or email

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide mobile/email and password',
      });
    }

    // Search user by mobile or email
    const user = await User.findOne({
      $or: [{ mobile: identifier.trim() }, { email: identifier.trim().toLowerCase() }],
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your mobile/email and password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is deactivated. Please contact the Gram Panchayat administrator.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your mobile/email and password.',
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        address: user.address,
        wardNumber: user.wardNumber,
        designation: user.designation,
        avatar: user.avatar || '',
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, address, wardNumber, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    } else if (avatar !== undefined) {
      user.avatar = avatar;
    }
    if (name) user.name = name;
    if (email !== undefined) user.email = email;
    if (address !== undefined) user.address = address;
    if (wardNumber !== undefined) user.wardNumber = Number(wardNumber);

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        mobile: updatedUser.mobile,
        email: updatedUser.email,
        role: updatedUser.role,
        address: updatedUser.address,
        wardNumber: updatedUser.wardNumber,
        designation: updatedUser.designation,
        avatar: updatedUser.avatar || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password does not match',
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};
