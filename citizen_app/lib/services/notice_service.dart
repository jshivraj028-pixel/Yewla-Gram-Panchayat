import '../core/network/api_client.dart';
import '../models/notice_model.dart';

class NoticeService {
  static Future<List<NoticeModel>> getNotices({String? category, String? search}) async {
    final params = <String>[];
    if (category != null && category != 'All') params.add('category=$category');
    if (search != null && search.isNotEmpty) params.add('search=$search');
    final query = params.isNotEmpty ? '?${params.join('&')}' : '';

    final res = await ApiClient.get('/notices$query');
    if (res.success && res.data != null && res.data is List) {
      return (res.data as List).map((json) => NoticeModel.fromJson(json)).toList();
    }
    return [];
  }

  static Future<NoticeModel?> getNoticeById(String id) async {
    final res = await ApiClient.get('/notices/$id');
    if (res.success && res.data != null) {
      return NoticeModel.fromJson(res.data);
    }
    return null;
  }
}
