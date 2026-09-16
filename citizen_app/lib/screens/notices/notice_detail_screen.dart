import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../models/notice_model.dart';
import '../../providers/locale_provider.dart';

class NoticeDetailScreen extends StatelessWidget {
  final NoticeModel notice;

  const NoticeDetailScreen({super.key, required this.notice});

  @override
  Widget build(BuildContext context) {
    final locale = Provider.of<LocaleProvider>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? const Color(0xFFF1F5F9) : AppConstants.textPrimary;
    final textSecondary = isDark ? const Color(0xFF94A3B8) : AppConstants.textSecondary;
    final primaryColor = isDark ? const Color(0xFF34D399) : AppConstants.primary;
    final boxBg = isDark ? const Color(0xFF1E293B) : Colors.grey.shade50;
    final borderColor = isDark ? const Color(0xFF334155) : AppConstants.border;

    final title = locale.isMarathi && notice.marathiTitle.isNotEmpty
        ? notice.marathiTitle
        : notice.title;
    final desc = locale.isMarathi && notice.marathiDescription.isNotEmpty
        ? notice.marathiDescription
        : notice.description;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Official Notice'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: primaryColor.withOpacity(isDark ? 0.2 : 0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    notice.category,
                    style: TextStyle(
                      color: primaryColor,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const Spacer(),
                Text(
                  'Published: ${notice.publishedAt.day}/${notice.publishedAt.month}/${notice.publishedAt.year}',
                  style: TextStyle(fontSize: 12, color: textSecondary),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              title,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: textPrimary,
                height: 1.3,
              ),
            ),
            const SizedBox(height: 16),
            Divider(height: 1, color: borderColor),
            const SizedBox(height: 16),
            Text(
              desc,
              style: TextStyle(
                fontSize: 15,
                color: textPrimary,
                height: 1.6,
              ),
            ),
            const SizedBox(height: 24),
            if (notice.image.isNotEmpty) ...[
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.network(
                  notice.image.startsWith('http')
                      ? notice.image
                      : '${AppConstants.baseUrl.replaceAll('/api', '')}${notice.image}',
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => const SizedBox(),
                ),
              ),
              const SizedBox(height: 20),
            ],
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: boxBg,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: borderColor),
              ),
              child: Row(
                children: [
                  Icon(Icons.verified, color: primaryColor, size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Issued by Order of Sarpanch & Gram Sevak, Yewla Gram Panchayat',
                      style: TextStyle(fontSize: 12, color: textSecondary),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
