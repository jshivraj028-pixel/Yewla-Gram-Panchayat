class EventModel {
  final String id;
  final String title;
  final String marathiTitle;
  final String eventType;
  final DateTime eventDate;
  final String time;
  final String location;
  final String description;
  final String marathiDescription;
  final List<String> agenda;

  EventModel({
    required this.id,
    required this.title,
    this.marathiTitle = '',
    required this.eventType,
    required this.eventDate,
    required this.time,
    required this.location,
    this.description = '',
    this.marathiDescription = '',
    this.agenda = const [],
  });

  factory EventModel.fromJson(Map<String, dynamic> json) {
    return EventModel(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      marathiTitle: json['marathiTitle'] ?? '',
      eventType: json['eventType'] ?? 'Gram Sabha',
      eventDate: json['eventDate'] != null
          ? DateTime.parse(json['eventDate'])
          : DateTime.now(),
      time: json['time'] ?? '11:00 AM',
      location: json['location'] ?? 'Gram Panchayat Office, Yewla',
      description: json['description'] ?? '',
      marathiDescription: json['marathiDescription'] ?? '',
      agenda: json['agenda'] != null ? List<String>.from(json['agenda']) : [],
    );
  }
}
