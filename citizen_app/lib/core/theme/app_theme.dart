import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_constants.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppConstants.primary,
        primary: AppConstants.primary,
        secondary: AppConstants.secondary,
        tertiary: AppConstants.accent,
        surface: AppConstants.surface,
        background: AppConstants.background,
        onSurface: AppConstants.textPrimary,
        onBackground: AppConstants.textPrimary,
      ),
      scaffoldBackgroundColor: AppConstants.background,
      textTheme: GoogleFonts.interTextTheme(
        ThemeData.light().textTheme.apply(
          bodyColor: AppConstants.textPrimary,
          displayColor: AppConstants.textPrimary,
        ),
      ),
      appBarTheme: AppBarTheme(
        elevation: 0,
        centerTitle: false,
        backgroundColor: AppConstants.primary,
        foregroundColor: Colors.white,
        titleTextStyle: GoogleFonts.outfit(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: Colors.white,
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      cardTheme: CardThemeData(
        elevation: 1,
        color: AppConstants.surface,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppConstants.border, width: 1),
        ),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: Colors.white,
        titleTextStyle: GoogleFonts.outfit(
          color: AppConstants.textPrimary,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
        contentTextStyle: GoogleFonts.inter(
          color: AppConstants.textSecondary,
          fontSize: 14,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppConstants.border),
        ),
      ),
      listTileTheme: const ListTileThemeData(
        textColor: AppConstants.textPrimary,
        iconColor: AppConstants.textSecondary,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppConstants.primary,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 50),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.outfit(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
          elevation: 2,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        hintStyle: const TextStyle(color: Color(0xFF94A3B8)),
        labelStyle: const TextStyle(color: Color(0xFF475569)),
        prefixIconColor: const Color(0xFF64748B),
        suffixIconColor: const Color(0xFF64748B),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppConstants.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppConstants.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppConstants.primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.red),
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    const darkBackground = Color(0xFF0F172A);
    const darkSurface = Color(0xFF1E293B);
    const darkBorder = Color(0xFF334155);
    const primaryEmerald = Color(0xFF10B981);
    const darkAppBar = Color(0xFF0A3D2A);

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: const ColorScheme.dark(
        primary: primaryEmerald,
        secondary: Color(0xFF38BDF8),
        tertiary: AppConstants.accent,
        surface: darkSurface,
        background: darkBackground,
        onPrimary: Colors.white,
        onSurface: Color(0xFFF1F5F9),
        onBackground: Color(0xFFF1F5F9),
      ),
      scaffoldBackgroundColor: darkBackground,
      cardColor: darkSurface,
      textTheme: GoogleFonts.interTextTheme(
        ThemeData.dark().textTheme.apply(
          bodyColor: const Color(0xFFF1F5F9),
          displayColor: Colors.white,
        ),
      ),
      appBarTheme: AppBarTheme(
        elevation: 0,
        centerTitle: false,
        backgroundColor: darkAppBar,
        foregroundColor: Colors.white,
        titleTextStyle: GoogleFonts.outfit(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: Colors.white,
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      cardTheme: CardThemeData(
        elevation: 1,
        color: darkSurface,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: darkBorder, width: 1),
        ),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: darkSurface,
        titleTextStyle: GoogleFonts.outfit(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
        contentTextStyle: GoogleFonts.inter(
          color: const Color(0xFFCBD5E1),
          fontSize: 14,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: darkBorder),
        ),
      ),
      listTileTheme: const ListTileThemeData(
        textColor: Color(0xFFF1F5F9),
        iconColor: Color(0xFFCBD5E1),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryEmerald,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 50),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.outfit(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
          elevation: 2,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: darkSurface,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        hintStyle: const TextStyle(color: Color(0xFF94A3B8)),
        labelStyle: const TextStyle(color: Color(0xFFCBD5E1)),
        prefixIconColor: const Color(0xFF94A3B8),
        suffixIconColor: const Color(0xFF94A3B8),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: darkBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: darkBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: primaryEmerald, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.redAccent),
        ),
      ),
    );
  }
}
