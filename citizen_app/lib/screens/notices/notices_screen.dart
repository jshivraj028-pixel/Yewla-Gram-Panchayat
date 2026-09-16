import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../core/localization/app_locale.dart';
import '../../models/notice_model.dart';
import '../../providers/locale_provider.dart';
import '../../services/notice_service.dart';
import 'notice_detail_screen.dart';

class NoticesScreen extends StatefulWidget {
  const NoticesScreen({super.key});

  @override
  State<NoticesScreen> createState() => _NoticesScreenState();
}

class _NoticesScreenState extends State<NoticesScreen> {
  List<NoticeModel> _notices = [];
  bool _isLoading = true;
  String _selectedCategory = 'All';

  final List<String> _categories = [
    'All',
    'Gram Sabha',
    'Health',
    'Agriculture',
    'General',
    'Tax Notice',
  ];

  @override
  void initState() {
    super.initState();
    _fetchNotices();
  }

  Future<void> _fetchNotices() async {
    setState(() => _isLoading = true);
    final data = await NoticeService.getNotices(
      category: _selectedCategory,
    );
    if (mounted) {
      setState(() {
        _notices = data;
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
    final chipBg = isDark ? const Color(0xFF1E293B) : Colors.grey.shade100;
    final barBg = isDark ? const Color(0xFF0F172A) : Colors.white;
    final dividerColor = isDark ? const Color(0xFF334155) : AppConstants.border;

    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocale.t('notices')),
      ),
      body: Column(
        children: [
          // Category filter bar
          Container(
            height: 52,
            padding: const EdgeInsets.symmetric(vertical: 8),
            color: barBg,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (ctx, i) {
                final cat = _categories[i];
                final isSelected = _selectedCategory == cat;
                return ChoiceChip(
                  label: Text(
                    cat,
                    style: TextStyle(
                      fontSize: 12,
                      color: isSelected ? Colors.white : textPrimary,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    ),
                  ),
                  selected: isSelected,
                  selectedColor: isDark ? const Color(0xFF10B981) : AppConstants.primary,
                  backgroundColor: chipBg,
                  onSelected: (selected) {
                    if (selected) {
                      setState(() => _selectedCategory = cat);
                      _fetchNotices();
                    }
                  },
                );
              },
            ),
          ),
          Divider(height: 1, color: dividerColor),

          // Notices List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _notices.isEmpty
                    ? Center(child: Text('No notices published at this moment.', style: TextStyle(color: textSecondary)))
                    : RefreshIndicator(
                        onRefresh: _fetchNotices,
                        child: ListView.separated(
                          padding: const EdgeInsets.all(16),
                          itemCount: _notices.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 12),
                          itemBuilder: (ctx, i) {
                            final notice = _notices[i];
                            final title = locale.isMarathi && notice.marathiTitle.isNotEmpty
                                ? notice.marathiTitle
                                : notice.title;
                            final desc = locale.isMarathi && notice.marathiDescription.isNotEmpty
                                ? notice.marathiDescription
                                : notice.description;

                            return Card(
                              child: InkWell(
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => NoticeDetailScreen(notice: notice),
                                    ),
                                  );
                                },
                                borderRadius: BorderRadius.circular(16),
                                child: Padding(
                                  padding: const EdgeInsets.all(16),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                            decoration: BoxDecoration(
                                              color: primaryColor.withOpacity(isDark ? 0.2 : 0.1),
                                              borderRadius: BorderRadius.circular(6),
                                            ),
                                            child: Text(
                                              notice.category,
                                              style: TextStyle(
                                                color: primaryColor,
                                                fontSize: 11,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                          if (notice.isPinned)
                                            Row(
                                              children: const [
                                                Icon(Icons.push_pin, size: 14, color: AppConstants.accent),
                                                SizedBox(width: 4),
                                                Text(
                                                  'PINNED',
                                                  style: TextStyle(
                                                    fontSize: 10,
                                                    fontWeight: FontWeight.bold,
                                                    color: AppConstants.accent,
                                                  ),
                                                ),
                                              ],
                                            ),
                                        ],
                                      ),
                                      const SizedBox(height: 10),
                                      Text(
                                        title,
                                        style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold,
                                          color: textPrimary,
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      Text(
                                        desc,
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                        style: TextStyle(
                                          fontSize: 13,
                                          color: textSecondary,
                                        ),
                                      ),
                                      const SizedBox(height: 12),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            'Date: ${notice.publishedAt.day}/${notice.publishedAt.month}/${notice.publishedAt.year}',
                                            style: TextStyle(fontSize: 11.5, color: textSecondary),
                                          ),
                                          Text(
                                            'Read More →',
                                            style: TextStyle(
                                              fontSize: 12,
                                              color: primaryColor,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}
