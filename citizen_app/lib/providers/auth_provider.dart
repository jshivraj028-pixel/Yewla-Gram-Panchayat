import 'dart:typed_data';
import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _user;
  bool _isLoading = true;
  String? _errorMessage;

  UserModel? get user => _user;
  bool get isAuthenticated => _user != null && _user!.token.isNotEmpty;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  AuthProvider() {
    checkAuthSession();
  }

  Future<void> checkAuthSession() async {
    _isLoading = true;
    notifyListeners();
    try {
      _user = await AuthService.getSavedUser();
    } catch (e) {
      _user = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> login(String identifier, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    final res = await AuthService.login(identifier, password);
    _isLoading = false;

    if (res.success && res.data != null) {
      _user = UserModel.fromJson(res.data);
      notifyListeners();
      return true;
    } else {
      _errorMessage = res.message;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register({
    required String name,
    required String mobile,
    String? email,
    required String password,
    required String address,
    required int wardNumber,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    final res = await AuthService.register(
      name: name,
      mobile: mobile,
      email: email,
      password: password,
      address: address,
      wardNumber: wardNumber,
    );
    _isLoading = false;

    if (res.success && res.data != null) {
      _user = UserModel.fromJson(res.data);
      notifyListeners();
      return true;
    } else {
      _errorMessage = res.message;
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateProfile({
    String? name,
    String? email,
    String? address,
    int? wardNumber,
    String? avatar,
    String? filePath,
    Uint8List? fileBytes,
    String? fileName,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    final res = await AuthService.updateProfile(
      name: name,
      email: email,
      address: address,
      wardNumber: wardNumber,
      avatar: avatar,
      filePath: filePath,
      fileBytes: fileBytes,
      fileName: fileName,
    );

    _isLoading = false;
    if (res.success && res.data != null) {
      try {
        final token = _user?.token ?? '';
        final map = Map<String, dynamic>.from(res.data as Map);
        _user = UserModel.fromJson(map, token: token);
      } catch (e) {
        debugPrint('Error updating user model: $e');
      }
      notifyListeners();
      return true;
    } else {
      _errorMessage = res.message;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await AuthService.logout();
    _user = null;
    notifyListeners();
  }
}
