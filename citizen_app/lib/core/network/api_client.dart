import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/app_constants.dart';

class ApiResponse {
  final bool success;
  final String message;
  final dynamic data;
  final dynamic pagination;

  ApiResponse({
    required this.success,
    required this.message,
    this.data,
    this.pagination,
  });

  factory ApiResponse.fromJson(Map<String, dynamic> json) {
    return ApiResponse(
      success: json['success'] ?? false,
      message: json['message'] ?? '',
      data: json['data'],
      pagination: json['pagination'],
    );
  }
}

class ApiClient {
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  static Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('user_data');
  }

  static Future<Map<String, String>> _getHeaders({bool isJson = true}) async {
    final token = await getToken();
    final headers = <String, String>{
      'Accept': 'application/json',
    };
    if (isJson) {
      headers['Content-Type'] = 'application/json';
    }
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  static Future<ApiResponse> get(String endpoint) async {
    try {
      final uri = Uri.parse('${AppConstants.baseUrl}$endpoint');
      final headers = await _getHeaders();
      final response = await http.get(uri, headers: headers).timeout(
            const Duration(seconds: 15),
          );

      final decoded = jsonDecode(response.body);
      return ApiResponse.fromJson(decoded);
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error or server unavailable: $e',
      );
    }
  }

  static Future<ApiResponse> post(String endpoint, Map<String, dynamic> body) async {
    try {
      final uri = Uri.parse('${AppConstants.baseUrl}$endpoint');
      final headers = await _getHeaders();
      final response = await http
          .post(uri, headers: headers, body: jsonEncode(body))
          .timeout(const Duration(seconds: 15));

      final decoded = jsonDecode(response.body);
      return ApiResponse.fromJson(decoded);
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error or server unavailable: $e',
      );
    }
  }

  static Future<ApiResponse> put(String endpoint, Map<String, dynamic> body) async {
    try {
      final uri = Uri.parse('${AppConstants.baseUrl}$endpoint');
      final headers = await _getHeaders();
      final response = await http
          .put(uri, headers: headers, body: jsonEncode(body))
          .timeout(const Duration(seconds: 15));

      final decoded = jsonDecode(response.body);
      return ApiResponse.fromJson(decoded);
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: $e',
      );
    }
  }

  static Future<ApiResponse> patch(String endpoint, Map<String, dynamic> body) async {
    try {
      final uri = Uri.parse('${AppConstants.baseUrl}$endpoint');
      final headers = await _getHeaders();
      final response = await http
          .patch(uri, headers: headers, body: jsonEncode(body))
          .timeout(const Duration(seconds: 15));

      final decoded = jsonDecode(response.body);
      return ApiResponse.fromJson(decoded);
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: $e',
      );
    }
  }

  static Future<ApiResponse> delete(String endpoint) async {
    try {
      final uri = Uri.parse('${AppConstants.baseUrl}$endpoint');
      final headers = await _getHeaders();
      final response = await http
          .delete(uri, headers: headers)
          .timeout(const Duration(seconds: 15));

      final decoded = jsonDecode(response.body);
      return ApiResponse.fromJson(decoded);
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: $e',
      );
    }
  }

  static Future<ApiResponse> multipartRequest(
    String endpoint,
    String method,
    Map<String, String> fields, {
    String? fileField,
    String? filePath,
    Uint8List? fileBytes,
    String? fileName,
  }) async {
    try {
      final uri = Uri.parse('${AppConstants.baseUrl}$endpoint');
      final token = await getToken();

      final request = http.MultipartRequest(method, uri);
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }
      request.fields.addAll(fields);

      if (fileField != null) {
        if (fileBytes != null) {
          final cleanName = (fileName != null && fileName.isNotEmpty) ? fileName : 'avatar.jpg';
          final ext = cleanName.split('.').last.toLowerCase();
          final mimeType = (ext == 'png')
              ? MediaType('image', 'png')
              : (ext == 'webp')
                  ? MediaType('image', 'webp')
                  : MediaType('image', 'jpeg');

          request.files.add(
            http.MultipartFile.fromBytes(
              fileField,
              fileBytes,
              filename: cleanName.contains('.') ? cleanName : '$cleanName.jpg',
              contentType: mimeType,
            ),
          );
        } else if (filePath != null && filePath.isNotEmpty) {
          request.files.add(
            await http.MultipartFile.fromPath(fileField, filePath),
          );
        }
      }

      final streamedResponse = await request.send().timeout(const Duration(seconds: 30));
      final response = await http.Response.fromStream(streamedResponse);
      final decoded = jsonDecode(response.body);
      return ApiResponse.fromJson(decoded);
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Upload error: $e',
      );
    }
  }

  static Future<ApiResponse> multipartPost(
    String endpoint,
    Map<String, String> fields, {
    String? fileField,
    String? filePath,
    Uint8List? fileBytes,
    String? fileName,
  }) {
    return multipartRequest(
      endpoint,
      'POST',
      fields,
      fileField: fileField,
      filePath: filePath,
      fileBytes: fileBytes,
      fileName: fileName,
    );
  }

  static Future<ApiResponse> multipartPut(
    String endpoint,
    Map<String, String> fields, {
    String? fileField,
    String? filePath,
    Uint8List? fileBytes,
    String? fileName,
  }) {
    return multipartRequest(
      endpoint,
      'PUT',
      fields,
      fileField: fileField,
      filePath: filePath,
      fileBytes: fileBytes,
      fileName: fileName,
    );
  }
}
