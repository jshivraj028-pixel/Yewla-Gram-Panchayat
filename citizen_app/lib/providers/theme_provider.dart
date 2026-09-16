import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeProvider extends ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.light;

  ThemeMode get themeMode => _themeMode;
  bool get isDarkMode => _themeMode == ThemeMode.dark;

  ThemeProvider() {
    _loadSavedTheme();
  }

  Future<void> _loadSavedTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final savedMode = prefs.getString('app_theme_mode') ?? 'light';
    _themeMode = savedMode == 'dark' ? ThemeMode.dark : ThemeMode.light;
    notifyListeners();
  }

  Future<void> toggleTheme() async {
    _themeMode = _themeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('app_theme_mode', _themeMode == ThemeMode.dark ? 'dark' : 'light');
    notifyListeners();
  }
}
