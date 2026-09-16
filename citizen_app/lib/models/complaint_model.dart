class ComplaintCommentModel {
  final String id;
  final String userId;
  final String userName;
  final String userAvatar;
  final String userRole;
  final String text;
  final DateTime createdAt;

  ComplaintCommentModel({
    required this.id,
    required this.userId,
    required this.userName,
    this.userAvatar = '',
    this.userRole = 'citizen',
    required this.text,
    required this.createdAt,
  });

  factory ComplaintCommentModel.fromJson(Map<String, dynamic> json) {
    String uId = '';
    String uName = 'Citizen';
    String uAvatar = '';
    String uRole = 'citizen';

    if (json['user'] != null) {
      if (json['user'] is Map) {
        uId = json['user']['_id']?.toString() ?? json['user']['id']?.toString() ?? '';
        uName = json['user']['name']?.toString() ?? 'Citizen';
        uAvatar = json['user']['avatar']?.toString() ?? '';
        uRole = json['user']['role']?.toString() ?? 'citizen';
      } else {
        uId = json['user'].toString();
      }
    }

    return ComplaintCommentModel(
      id: json['_id']?.toString() ?? json['id']?.toString() ?? '',
      userId: uId,
      userName: uName,
      userAvatar: uAvatar,
      userRole: uRole,
      text: json['text']?.toString() ?? '',
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }
}

class ComplaintHistoryModel {
  final String id;
  final String oldStatus;
  final String newStatus;
  final String changedByName;
  final String changedByRole;
  final String remark;
  final DateTime createdAt;

  ComplaintHistoryModel({
    required this.id,
    required this.oldStatus,
    required this.newStatus,
    required this.changedByName,
    required this.changedByRole,
    required this.remark,
    required this.createdAt,
  });

  factory ComplaintHistoryModel.fromJson(Map<String, dynamic> json) {
    return ComplaintHistoryModel(
      id: json['_id'] ?? '',
      oldStatus: json['oldStatus'] ?? '',
      newStatus: json['newStatus'] ?? '',
      changedByName: json['changedByName'] ?? 'Officer',
      changedByRole: json['changedByRole'] ?? 'Admin',
      remark: json['remark'] ?? '',
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }
}

class ComplaintModel {
  final String id;
  final String complaintId;
  final String category;
  final String title;
  final String description;
  final String location;
  final int wardNumber;
  final String status;
  final String priority;
  final String photo;
  final String adminRemarks;
  final String? assignedToName;
  final String citizenId;
  final String citizenName;
  final String citizenMobile;
  final String citizenAvatar;
  final int? citizenWard;
  final List<String> likes;
  final List<ComplaintCommentModel> comments;
  final DateTime createdAt;
  final DateTime? resolvedAt;
  final List<ComplaintHistoryModel> history;

  ComplaintModel({
    required this.id,
    required this.complaintId,
    required this.category,
    required this.title,
    required this.description,
    required this.location,
    required this.wardNumber,
    required this.status,
    required this.priority,
    this.photo = '',
    this.adminRemarks = '',
    this.assignedToName,
    this.citizenId = '',
    this.citizenName = 'Citizen',
    this.citizenMobile = '',
    this.citizenAvatar = '',
    this.citizenWard,
    this.likes = const [],
    this.comments = const [],
    required this.createdAt,
    this.resolvedAt,
    this.history = const [],
  });

  bool isLikedBy(String? currentUserId) {
    if (currentUserId == null || currentUserId.isEmpty) return false;
    return likes.contains(currentUserId);
  }

  int get likesCount => likes.length;
  int get commentsCount => comments.length;

  ComplaintModel copyWith({
    List<String>? likes,
    List<ComplaintCommentModel>? comments,
    String? status,
    String? adminRemarks,
  }) {
    return ComplaintModel(
      id: id,
      complaintId: complaintId,
      category: category,
      title: title,
      description: description,
      location: location,
      wardNumber: wardNumber,
      status: status ?? this.status,
      priority: priority,
      photo: photo,
      adminRemarks: adminRemarks ?? this.adminRemarks,
      assignedToName: assignedToName,
      citizenId: citizenId,
      citizenName: citizenName,
      citizenMobile: citizenMobile,
      citizenAvatar: citizenAvatar,
      citizenWard: citizenWard,
      likes: likes ?? this.likes,
      comments: comments ?? this.comments,
      createdAt: createdAt,
      resolvedAt: resolvedAt,
      history: history,
    );
  }

  factory ComplaintModel.fromJson(Map<String, dynamic> json, {List<dynamic>? historyList}) {
    String? assignedName;
    if (json['assignedTo'] != null && json['assignedTo'] is Map) {
      assignedName = json['assignedTo']['name'];
    }

    String cId = '';
    String cName = 'Citizen';
    String cMobile = '';
    String cAvatar = '';
    int? cWard;
    if (json['citizen'] != null) {
      if (json['citizen'] is Map) {
        cId = json['citizen']['_id']?.toString() ?? '';
        cName = json['citizen']['name']?.toString() ?? 'Citizen';
        cMobile = json['citizen']['mobile']?.toString() ?? '';
        cAvatar = json['citizen']['avatar']?.toString() ?? '';
        if (json['citizen']['wardNumber'] != null) {
          cWard = int.tryParse(json['citizen']['wardNumber'].toString());
        }
      } else {
        cId = json['citizen'].toString();
      }
    }

    final List<String> parsedLikes = [];
    if (json['likes'] != null && json['likes'] is List) {
      for (var l in json['likes']) {
        if (l is Map) {
          parsedLikes.add(l['_id']?.toString() ?? l['id']?.toString() ?? '');
        } else {
          parsedLikes.add(l.toString());
        }
      }
    }

    final List<ComplaintCommentModel> parsedComments = [];
    if (json['comments'] != null && json['comments'] is List) {
      for (var cm in json['comments']) {
        if (cm is Map<String, dynamic>) {
          parsedComments.add(ComplaintCommentModel.fromJson(cm));
        }
      }
    }

    final List<ComplaintHistoryModel> parsedHistory = [];
    if (historyList != null) {
      for (var item in historyList) {
        parsedHistory.add(ComplaintHistoryModel.fromJson(item));
      }
    }

    return ComplaintModel(
      id: json['_id'] ?? '',
      complaintId: json['complaintId'] ?? '',
      category: json['category'] ?? 'Other',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      location: json['location'] ?? '',
      wardNumber: json['wardNumber'] ?? 1,
      status: json['status'] ?? 'Pending',
      priority: json['priority'] ?? 'Medium',
      photo: json['photo'] ?? '',
      adminRemarks: json['adminRemarks'] ?? '',
      assignedToName: assignedName,
      citizenId: cId,
      citizenName: cName,
      citizenMobile: cMobile,
      citizenAvatar: cAvatar,
      citizenWard: cWard,
      likes: parsedLikes,
      comments: parsedComments,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
      resolvedAt: json['resolvedAt'] != null
          ? DateTime.parse(json['resolvedAt'])
          : null,
      history: parsedHistory,
    );
  }
}
