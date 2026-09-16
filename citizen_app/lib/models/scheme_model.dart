class SchemeModel {
  final String id;
  final String name;
  final String marathiName;
  final String category;
  final String description;
  final String marathiDescription;
  final String eligibility;
  final String marathiEligibility;
  final List<String> requiredDocuments;
  final String applicationProcess;
  final String officialLink;
  final String benefitAmount;

  SchemeModel({
    required this.id,
    required this.name,
    this.marathiName = '',
    required this.category,
    required this.description,
    this.marathiDescription = '',
    this.eligibility = '',
    this.marathiEligibility = '',
    this.requiredDocuments = const [],
    this.applicationProcess = '',
    this.officialLink = '',
    this.benefitAmount = '',
  });

  factory SchemeModel.fromJson(Map<String, dynamic> json) {
    return SchemeModel(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      marathiName: json['marathiName'] ?? '',
      category: json['category'] ?? 'Agriculture',
      description: json['description'] ?? '',
      marathiDescription: json['marathiDescription'] ?? '',
      eligibility: json['eligibility'] ?? '',
      marathiEligibility: json['marathiEligibility'] ?? '',
      requiredDocuments: json['requiredDocuments'] != null
          ? List<String>.from(json['requiredDocuments'])
          : [],
      applicationProcess: json['applicationProcess'] ?? '',
      officialLink: json['officialLink'] ?? '',
      benefitAmount: json['benefitAmount'] ?? '',
    );
  }
}
