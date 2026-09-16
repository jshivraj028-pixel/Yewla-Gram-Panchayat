class EmergencyContactModel {
  final String id;
  final String name;
  final String marathiName;
  final String department;
  final String phoneNumber;
  final String altPhoneNumber;
  final String address;

  EmergencyContactModel({
    required this.id,
    required this.name,
    this.marathiName = '',
    required this.department,
    required this.phoneNumber,
    this.altPhoneNumber = '',
    this.address = '',
  });

  factory EmergencyContactModel.fromJson(Map<String, dynamic> json) {
    return EmergencyContactModel(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      marathiName: json['marathiName'] ?? '',
      department: json['department'] ?? 'Police',
      phoneNumber: json['phoneNumber'] ?? '',
      altPhoneNumber: json['altPhoneNumber'] ?? '',
      address: json['address'] ?? '',
    );
  }
}
