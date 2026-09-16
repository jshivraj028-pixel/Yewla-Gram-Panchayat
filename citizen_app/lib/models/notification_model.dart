class NotificationModel {
  final String id;
  final String title;
  final String marathiTitle;
  final String message;
  final String marathiMessage;
  final String type;
  final String referenceId;
  final bool isRead;
  final DateTime createdAt;

  NotificationModel({
    required this.id,
    required this.title,
    this.marathiTitle = '',
    required this.message,
    this.marathiMessage = '',
    required this.type,
    this.referenceId = '',
    this.isRead = false,
    required this.createdAt,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      marathiTitle: json['marathiTitle'] ?? '',
      message: json['message'] ?? '',
      marathiMessage: json['marathiMessage'] ?? '',
      type: json['type'] ?? 'System',
      referenceId: json['referenceId'] ?? '',
      isRead: json['isRead'] ?? false,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }
}
