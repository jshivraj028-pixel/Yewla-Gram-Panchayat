import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { ensureDefaultPdfsExist } from './utils/pdfGenerator.js';

const app = express();

// Security middleware with relaxed cross-origin resource policy for uploaded files
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Enable CORS for all origins (Admin dashboard + Flutter web & mobile)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// HTTP request logger
app.use(morgan('dev'));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static directory for file uploads
const uploadDir = path.resolve('uploads');
ensureDefaultPdfsExist(uploadDir);
app.use(
  '/uploads',
  express.static(uploadDir, {
    setHeaders: (res) => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  })
);

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 attempts per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    system: 'Yewla Gram Panchayat Citizen Service & Management API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/emergency-contacts', emergencyRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// Catch 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handling
app.use(errorHandler);

export default app;
