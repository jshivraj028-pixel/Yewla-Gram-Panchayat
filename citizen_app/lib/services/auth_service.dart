import 'dart:convert';
import 'dart:typed_data';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/network/api_client.dart';
import '../models/user_model.dart';

class AuthService {
  static const String _userKey = 'user_data';

  static Future<UserModel?> getSavedUser() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString(_userKey);
    final token = prefs.getString('auth_token');
    if (jsonStr != null && token != null) {
      return UserModel.fromJson(jsonDecode(jsonStr), token: token);
    }
    return null;
  }

  static Future<ApiResponse> login(String identifier, String password) async {
    final res = await ApiClient.post('/auth/login', {
      'identifier': identifier,
      'password': password,
    });

    if (res.success && res.data != null) {
      final token = res.data['token'];
      if (token != null) {
        await ApiClient.saveToken(token);
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(_userKey, jsonEncode(res.data));
      }
    }
    return res;
  }

  static Future<ApiResponse> register({
    required String name,
    required String mobile,
    String? email,
    required String password,
    required String address,
    required int wardNumber,
  }) async {
    final res = await ApiClient.post('/auth/register', {
      'name': name,
      'mobile': mobile,
      'email': email,
      'password': password,
      'address': address,
      'wardNumber': wardNumber,
    });

    if (res.success && res.data != null) {
      final token = res.data['token'];
      if (token != null) {
        await ApiClient.saveToken(token);
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(_userKey, jsonEncode(res.data));
      }
    }
    return res;
  }

  static Future<void> logout() async {
    await ApiClient.clearToken();
  }

  static Future<ApiResponse> updateProfile({
    String? name,
    String? email,
    String? address,
    int? wardNumber,
    String? avatar,
    String? filePath,
    Uint8List? fileBytes,
    String? fileName,
  }) async {
    ApiResponse res;
    if (fileBytes != null || (filePath != null && filePath.isNotEmpty)) {
      final fields = <String, String>{};
      if (name != null) fields['name'] = name;
      if (email != null) fields['email'] = email;
      if (address != null) fields['address'] = address;
      if (wardNumber != null) fields['wardNumber'] = wardNumber.toString();

      res = await ApiClient.multipartPut(
        '/auth/profile',
        fields,
        fileField: 'avatar',
        filePath: filePath,
        fileBytes: fileBytes,
        fileName: fileName ?? 'profile.jpg',
      );
    } else {
      final body = <String, dynamic>{};
      if (name != null) body['name'] = name;
      if (email != null) body['email'] = email;
      if (address != null) body['address'] = address;
      if (wardNumber != null) body['wardNumber'] = wardNumber;
      if (avatar != null) body['avatar'] = avatar;

      res = await ApiClient.put('/auth/profile', body);
    }

    if (res.success && res.data != null) {
      try {
        final prefs = await SharedPreferences.getInstance();
        final currentStr = prefs.getString(_userKey);
        if (currentStr != null) {
          final currentMap = jsonDecode(currentStr) as Map<String, dynamic>;
          currentMap.addAll(Map<String, dynamic>.from(res.data));
          await prefs.setString(_userKey, jsonEncode(currentMap));
        }
      } catch (_) {}
    }
    return res;
  }

  static Future<ApiResponse> changePassword(String currentPassword, String newPassword) async {
    return await ApiClient.put('/auth/change-password', {
      'currentPassword': currentPassword,
      'newPassword': newPassword,
    });
  }
}
