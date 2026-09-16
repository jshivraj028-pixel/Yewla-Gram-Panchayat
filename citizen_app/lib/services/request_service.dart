import '../core/network/api_client.dart';
import '../models/request_model.dart';

class RequestService {
  static Future<List<ServiceRequestModel>> getRequests() async {
    final res = await ApiClient.get('/requests');
    if (res.success && res.data != null && res.data is List) {
      return (res.data as List).map((json) => ServiceRequestModel.fromJson(json)).toList();
    }
    return [];
  }

  static Future<ApiResponse> createRequest({
    required String requestType,
    required String subject,
    required String details,
  }) async {
    return await ApiClient.post('/requests', {
      'requestType': requestType,
      'subject': subject,
      'details': details,
    });
  }
}
