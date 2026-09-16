import 'package:flutter/material.dart';
import '../../core/constants/app_constants.dart';
import '../../models/notification_model.dart';
import '../../services/common_service.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  List<NotificationModel> _notifications = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchNotifications();
  }

  Future<void> _fetchNotifications() async {
    setState(() => _isLoading = true);
    final data = await CommonService.getNotifications();
    if (mounted) {
      setState(() {
        _notifications = data;
        _isLoading = false;
      });
    }
  }

  IconData _getTypeIcon(String type) {
    switch (type) {
      case 'Complaint':
        return Icons.report_problem;
      case 'Request':
        return Icons.assignment;
      case 'Notice':
        return Icons.campaign;
      case 'Event':
        return Icons.event;
      default:
        return Icons.notifications;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? Colors.white : AppConstants.textPrimary;
    final textSecondary = isDark ? const Color(0xFF94A3B8) : AppConstants.textSecondary;
    final readCardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final unreadCardBg = isDark ? const Color(0xFF1E3A8A).withOpacity(0.35) : Colors.blue.shade50.withOpacity(0.6);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications / सूचना'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _notifications.isEmpty
              ? Center(child: Text('No new notifications.', style: TextStyle(color: textSecondary)))
              : RefreshIndicator(
                  onRefresh: _fetchNotifications,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _notifications.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (ctx, i) {
                      final notif = _notifications[i];
                      return Card(
                        color: notif.isRead ? readCardBg : unreadCardBg,
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(14),
                          leading: CircleAvatar(
                            backgroundColor: (isDark ? const Color(0xFF10B981) : AppConstants.primary).withOpacity(0.18),
                            child: Icon(_getTypeIcon(notif.type), color: isDark ? const Color(0xFF34D399) : AppConstants.primary, size: 20),
                          ),
                          title: Text(
                            notif.title,
                            style: TextStyle(
                              fontWeight: notif.isRead ? FontWeight.w600 : FontWeight.bold,
                              fontSize: 14,
                              color: textPrimary,
                            ),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 4),
                              Text(notif.message, style: TextStyle(fontSize: 12.5, color: isDark ? const Color(0xFFCBD5E1) : Colors.black87)),
                              const SizedBox(height: 6),
                              Text(
                                '${notif.createdAt.day}/${notif.createdAt.month}/${notif.createdAt.year}',
                                style: TextStyle(fontSize: 11, color: textSecondary),
                              ),
                            ],
                          ),
                          trailing: !notif.isRead
                              ? Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: AppConstants.accent,
                                    shape: BoxShape.circle,
                                  ),
                                )
                              : null,
                          onTap: () async {
                            if (!notif.isRead) {
                              await CommonService.markNotificationRead(notif.id);
                              _fetchNotifications();
                            }
                          },
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}
