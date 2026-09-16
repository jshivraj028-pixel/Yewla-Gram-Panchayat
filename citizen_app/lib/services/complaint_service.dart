import 'dart:typed_data';
import '../core/network/api_client.dart';
import '../models/complaint_model.dart';

class ComplaintService {
  static Future<List<ComplaintModel>> getComplaints({
    String? status,
    String? category,
    String scope = 'all',
    int? wardNumber,
    String? search,
  }) async {
    String query = '';
    final params = <String>[];
    if (scope.isNotEmpty) params.add('scope=$scope');
    if (status != null && status != 'All') params.add('status=$status');
    if (category != null && category != 'All') params.add('category=$category');
    if (wardNumber != null && wardNumber > 0) params.add('wardNumber=$wardNumber');
    if (search != null && search.trim().isNotEmpty) params.add('search=${Uri.encodeComponent(search.trim())}');
    params.add('limit=50');

    if (params.isNotEmpty) query = '?${params.join('&')}';

    final res = await ApiClient.get('/complaints$query');
    if (res.success && res.data != null && res.data is List) {
      return (res.data as List).map((json) => ComplaintModel.fromJson(json)).toList();
    }
    return [];
  }

  static Future<ComplaintModel?> getComplaintById(String id) async {
    final res = await ApiClient.get('/complaints/$id');
    if (res.success && res.data != null && res.data['complaint'] != null) {
      return ComplaintModel.fromJson(
        res.data['complaint'],
        historyList: res.data['history'],
      );
    }
    return null;
  }

  static Future<List<String>?> toggleLike(String complaintId) async {
    final res = await ApiClient.post('/complaints/$complaintId/like', {});
    if (res.success && res.data != null && res.data['likes'] != null) {
      final list = res.data['likes'] as List;
      return list.map((id) => id.toString()).toList();
    }
    return null;
  }

  static Future<List<ComplaintCommentModel>?> addComment(String complaintId, String text) async {
    final res = await ApiClient.post('/complaints/$complaintId/comments', {'text': text});
    if (res.success && res.data != null && res.data is List) {
      return (res.data as List)
          .map((cm) => ComplaintCommentModel.fromJson(cm))
          .toList();
    }
    return null;
  }

  static Future<List<ComplaintCommentModel>?> deleteComment(String complaintId, String commentId) async {
    final res = await ApiClient.delete('/complaints/$complaintId/comments/$commentId');
    if (res.success && res.data != null && res.data is List) {
      return (res.data as List)
          .map((cm) => ComplaintCommentModel.fromJson(cm))
          .toList();
    }
    return null;
  }

  static Future<ApiResponse> createComplaint({
    required String category,
    required String title,
    required String description,
    required String location,
    required int wardNumber,
    String priority = 'Medium',
    String? photoPath,
    Uint8List? photoBytes,
    String? photoName,
  }) async {
    final fields = {
      'category': category,
      'title': title,
      'description': description,
      'location': location,
      'wardNumber': wardNumber.toString(),
      'priority': priority,
    };

    if (photoPath != null || photoBytes != null) {
      return await ApiClient.multipartPost(
        '/complaints',
        fields,
        fileField: 'photo',
        filePath: photoPath,
        fileBytes: photoBytes,
        fileName: photoName,
      );
    } else {
      return await ApiClient.post('/complaints', fields);
    }
  }
}
