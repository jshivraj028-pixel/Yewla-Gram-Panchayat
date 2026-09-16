import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../core/localization/app_locale.dart';
import '../../models/event_model.dart';
import '../../providers/locale_provider.dart';
import '../../services/common_service.dart';

class EventsScreen extends StatefulWidget {
  const EventsScreen({super.key});

  @override
  State<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends State<EventsScreen> {
  List<EventModel> _events = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchEvents();
  }

  Future<void> _fetchEvents() async {
    setState(() => _isLoading = true);
    final data = await CommonService.getEvents();
    if (mounted) {
      setState(() {
        _events = data;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final locale = Provider.of<LocaleProvider>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? const Color(0xFFF1F5F9) : AppConstants.textPrimary;
    final textSecondary = isDark ? const Color(0xFF94A3B8) : AppConstants.textSecondary;
    final primaryColor = isDark ? const Color(0xFF34D399) : AppConstants.primary;
    final borderColor = isDark ? const Color(0xFF334155) : AppConstants.border;

    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocale.t('events')),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _events.isEmpty
              ? Center(child: Text('No upcoming events or sabhas.', style: TextStyle(color: textSecondary)))
              : RefreshIndicator(
                  onRefresh: _fetchEvents,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _events.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 14),
                    itemBuilder: (ctx, i) {
                      final event = _events[i];
                      final title = locale.isMarathi && event.marathiTitle.isNotEmpty
                          ? event.marathiTitle
                          : event.title;
                      final desc = locale.isMarathi && event.marathiDescription.isNotEmpty
                          ? event.marathiDescription
                          : event.description;

                      return Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: primaryColor.withOpacity(isDark ? 0.2 : 0.1),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      event.eventType,
                                      style: TextStyle(
                                        color: primaryColor,
                                        fontSize: 11.5,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                  const Spacer(),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: isDark ? const Color(0xFF1E3A8A).withOpacity(0.4) : Colors.blue.shade50,
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Row(
                                      children: [
                                        Icon(Icons.calendar_today, size: 11, color: isDark ? const Color(0xFF93C5FD) : Colors.blue.shade800),
                                        const SizedBox(width: 4),
                                        Text(
                                          '${event.eventDate.day}/${event.eventDate.month}/${event.eventDate.year}',
                                          style: TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                            color: isDark ? const Color(0xFF93C5FD) : Colors.blue.shade800,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Text(
                                title,
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: textPrimary,
                                ),
                              ),
                              if (desc.isNotEmpty) ...[
                                const SizedBox(height: 6),
                                Text(
                                  desc,
                                  style: TextStyle(fontSize: 13, color: textSecondary),
                                ),
                              ],
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  Icon(Icons.access_time, size: 14, color: textSecondary),
                                  const SizedBox(width: 4),
                                  Text(
                                    event.time,
                                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: textPrimary),
                                  ),
                                  const SizedBox(width: 16),
                                  Icon(Icons.location_on_outlined, size: 14, color: textSecondary),
                                  const SizedBox(width: 4),
                                  Expanded(
                                    child: Text(
                                      event.location,
                                      style: TextStyle(fontSize: 12, color: textSecondary),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                              if (event.agenda.isNotEmpty) ...[
                                const SizedBox(height: 14),
                                Divider(height: 1, color: borderColor),
                                const SizedBox(height: 10),
                                Text(
                                  'Meeting Agenda / विषयपत्रिका:',
                                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: textPrimary),
                                ),
                                const SizedBox(height: 6),
                                ...event.agenda.map((ag) {
                                  return Padding(
                                    padding: const EdgeInsets.symmetric(vertical: 2),
                                    child: Row(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('• ', style: TextStyle(color: primaryColor, fontWeight: FontWeight.bold)),
                                        Expanded(
                                          child: Text(
                                            ag,
                                            style: TextStyle(fontSize: 12, color: textSecondary),
                                          ),
                                        ),
                                      ],
                                    ),
                                  );
                                }),
                              ],
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}
