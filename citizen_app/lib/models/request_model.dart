class ServiceRequestModel {
  final String id;
  final String requestId;
  final String requestType;
  final String subject;
  final String details;
  final String status;
  final String remarks;
  final String certificateUrl;
  final DateTime createdAt;

  ServiceRequestModel({
    required this.id,
    required this.requestId,
    required this.requestType,
    required this.subject,
    required this.details,
    required this.status,
    this.remarks = '',
    this.certificateUrl = '',
    required this.createdAt,
  });

  factory ServiceRequestModel.fromJson(Map<String, dynamic> json) {
    return ServiceRequestModel(
      id: json['_id'] ?? '',
      requestId: json['requestId'] ?? '',
      requestType: json['requestType'] ?? '',
      subject: json['subject'] ?? '',
      details: json['details'] ?? '',
      status: json['status'] ?? 'Submitted',
      remarks: json['remarks'] ?? '',
      certificateUrl: json['certificateUrl'] ?? '',
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }
}
