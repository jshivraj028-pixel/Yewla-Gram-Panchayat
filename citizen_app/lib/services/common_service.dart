import '../core/network/api_client.dart';
import '../models/scheme_model.dart';
import '../models/event_model.dart';
import '../models/project_model.dart';
import '../models/emergency_model.dart';
import '../models/notification_model.dart';

class CommonService {
  static Future<List<SchemeModel>> getSchemes({String? category}) async {
    final query = (category != null && category != 'All') ? '?category=$category' : '';
    final res = await ApiClient.get('/schemes$query');
    if (res.success && res.data != null && res.data is List) {
      return (res.data as List).map((json) => SchemeModel.fromJson(json)).toList();
    }
    return [];
  }

  static Future<List<EventModel>> getEvents() async {
    final res = await ApiClient.get('/events');
    if (res.success && res.data != null && res.data is List) {
      return (res.data as List).map((json) => EventModel.fromJson(json)).toList();
    }
    return [];
  }

  static Future<List<ProjectModel>> getProjects({String? category}) async {
    final query = (category != null && category != 'All') ? '?category=$category' : '';
    final res = await ApiClient.get('/projects$query');
    if (res.success && res.data != null && res.data is List) {
      return (res.data as List).map((json) => ProjectModel.fromJson(json)).toList();
    }
    return [];
  }

  static Future<List<EmergencyContactModel>> getEmergencyContacts() async {
    final res = await ApiClient.get('/emergency-contacts');
    if (res.success && res.data != null && res.data is List) {
      return (res.data as List).map((json) => EmergencyContactModel.fromJson(json)).toList();
    }
    return [];
  }

  static Future<List<NotificationModel>> getNotifications() async {
    final res = await ApiClient.get('/notifications');
    if (res.success && res.data != null && res.data is List) {
      return (res.data as List).map((json) => NotificationModel.fromJson(json)).toList();
    }
    return [];
  }

  static Future<void> markNotificationRead(String id) async {
    await ApiClient.patch('/notifications/$id/read', {});
  }
}
