class ProjectModel {
  final String id;
  final String name;
  final String marathiName;
  final String category;
  final String description;
  final String location;
  final int wardNumber;
  final double budget;
  final double spent;
  final String contractorName;
  final String status;
  final int progressPercentage;
  final List<String> images;

  ProjectModel({
    required this.id,
    required this.name,
    this.marathiName = '',
    required this.category,
    required this.description,
    required this.location,
    required this.wardNumber,
    required this.budget,
    required this.spent,
    this.contractorName = '',
    required this.status,
    required this.progressPercentage,
    this.images = const [],
  });

  factory ProjectModel.fromJson(Map<String, dynamic> json) {
    return ProjectModel(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      marathiName: json['marathiName'] ?? '',
      category: json['category'] ?? 'Road Construction',
      description: json['description'] ?? '',
      location: json['location'] ?? '',
      wardNumber: json['wardNumber'] ?? 1,
      budget: (json['budget'] ?? 0).toDouble(),
      spent: (json['spent'] ?? 0).toDouble(),
      contractorName: json['contractorName'] ?? '',
      status: json['status'] ?? 'In Progress',
      progressPercentage: json['progressPercentage'] ?? 0,
      images: json['images'] != null ? List<String>.from(json['images']) : [],
    );
  }
}
