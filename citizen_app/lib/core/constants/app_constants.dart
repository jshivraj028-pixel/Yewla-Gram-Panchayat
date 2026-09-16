import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class AppConstants {
  static const String appName = 'GramSeva';
  static const String appSubtitle = 'Yewla Gram Panchayat';
  static const String appVersion = '1.0.0';

  // Base API URL with intelligent platform detection
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:5000/api';
    } else if (defaultTargetPlatform == TargetPlatform.android) {
      // Android emulator uses 10.0.2.2 to connect to host localhost
      return 'http://10.0.2.2:5000/api';
    } else {
      return 'http://localhost:5000/api';
    }
  }

  static String get hostUrl {
    return baseUrl.replaceAll('/api', '');
  }

  static String getImageUrl(String? path) {
    if (path == null || path.isEmpty) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    final cleanPath = path.startsWith('/') ? path : '/$path';
    return '$hostUrl$cleanPath';
  }

  // Wards list
  static const List<int> wardNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Complaint Categories
  static const List<String> complaintCategories = [
    'Road',
    'Water',
    'Street Light',
    'Drainage',
    'Garbage',
    'Sanitation',
    'Electricity',
    'Public Property',
    'Other',
  ];

  // Service Request Types
  static const List<String> requestTypes = [
    'Birth Certificate Verification',
    'Death Certificate Verification',
    'Marriage Certificate Endorsement',
    'Income & Caste Recommendation',
    'Water Connection Permission',
    'Property Assessment Extract',
    'Construction NOC',
    'Trade License NOC',
    'General Panchayat Service',
  ];

  // Primary Palette
  static const Color primary = Color(0xFF0F5A3E); // Civic Forest Green
  static const Color primaryLight = Color(0xFF1B8A60);
  static const Color primaryDark = Color(0xFF073825);
  static const Color secondary = Color(0xFF1E293B); // Deep Slate Navy
  static const Color accent = Color(0xFFD97706); // Golden Amber
  static const Color background = Color(0xFFF8FAFC); // Crisp Off-white
  static const Color surface = Colors.white;
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color border = Color(0xFFE2E8F0);

  // Status Colors
  static const Color statusPending = Color(0xFFF59E0B);
  static const Color statusUnderReview = Color(0xFF3B82F6);
  static const Color statusInProgress = Color(0xFF8B5CF6);
  static const Color statusResolved = Color(0xFF10B981);
  static const Color statusRejected = Color(0xFFEF4444);
}
