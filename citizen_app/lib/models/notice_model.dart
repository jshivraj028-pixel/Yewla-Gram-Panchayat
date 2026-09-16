class NoticeModel {
  final String id;
  final String title;
  final String marathiTitle;
  final String description;
  final String marathiDescription;
  final String category;
  final String image;
  final String pdfDocument;
  final bool isPinned;
  final DateTime publishedAt;

  NoticeModel({
    required this.id,
    required this.title,
    this.marathiTitle = '',
    required this.description,
    this.marathiDescription = '',
    required this.category,
    this.image = '',
    this.pdfDocument = '',
    this.isPinned = false,
    required this.publishedAt,
  });

  factory NoticeModel.fromJson(Map<String, dynamic> json) {
    return NoticeModel(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      marathiTitle: json['marathiTitle'] ?? '',
      description: json['description'] ?? '',
      marathiDescription: json['marathiDescription'] ?? '',
      category: json['category'] ?? 'General',
      image: json['image'] ?? '',
      pdfDocument: json['pdfDocument'] ?? '',
      isPinned: json['isPinned'] ?? false,
      publishedAt: json['publishedAt'] != null
          ? DateTime.parse(json['publishedAt'])
          : DateTime.now(),
    );
  }
}
