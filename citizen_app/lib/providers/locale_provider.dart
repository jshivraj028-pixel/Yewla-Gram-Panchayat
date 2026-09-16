import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/localization/app_locale.dart';

class LocaleProvider extends ChangeNotifier {
  AppLanguage _language = AppLanguage.en;

  AppLanguage get language => _language;
  bool get isMarathi => _language == AppLanguage.mr;

  LocaleProvider() {
    _loadSavedLanguage();
  }

  Future<void> _loadSavedLanguage() async {
    final prefs = await SharedPreferences.getInstance();
    final code = prefs.getString('app_lang') ?? 'en';
    _language = code == 'mr' ? AppLanguage.mr : AppLanguage.en;
    AppLocale.currentLanguage = _language;
    notifyListeners();
  }

  Future<void> toggleLanguage() async {
    _language = _language == AppLanguage.en ? AppLanguage.mr : AppLanguage.en;
    AppLocale.currentLanguage = _language;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('app_lang', _language == AppLanguage.mr ? 'mr' : 'en');
    notifyListeners();
  }
}
