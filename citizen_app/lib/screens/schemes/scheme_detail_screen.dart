import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/constants/app_constants.dart';
import '../../models/scheme_model.dart';
import '../../providers/locale_provider.dart';

class SchemeDetailScreen extends StatelessWidget {
  final SchemeModel scheme;

  const SchemeDetailScreen({super.key, required this.scheme});

  Future<void> _launchUrl(BuildContext context, String url) async {
    try {
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Could not open portal link: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final locale = Provider.of<LocaleProvider>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? const Color(0xFFF1F5F9) : AppConstants.textPrimary;
    final textSecondary = isDark ? const Color(0xFF94A3B8) : AppConstants.textSecondary;
    final primaryColor = isDark ? const Color(0xFF34D399) : AppConstants.primary;
    final boxBg = isDark ? const Color(0xFF1E293B) : Colors.grey.shade50;
    final borderColor = isDark ? const Color(0xFF334155) : AppConstants.border;

    final name = locale.isMarathi && scheme.marathiName.isNotEmpty
        ? scheme.marathiName
        : scheme.name;
    final desc = locale.isMarathi && scheme.marathiDescription.isNotEmpty
        ? scheme.marathiDescription
        : scheme.description;
    final elig = locale.isMarathi && scheme.marathiEligibility.isNotEmpty
        ? scheme.marathiEligibility
        : scheme.eligibility;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Scheme Details'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF581C87).withOpacity(0.4) : Colors.purple.shade50,
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                scheme.category,
                style: TextStyle(
                  color: isDark ? const Color(0xFFD8B4FE) : Colors.purple.shade800,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              name,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: textPrimary,
                height: 1.3,
              ),
            ),
            if (scheme.benefitAmount.isNotEmpty) ...[
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF064E3B) : Colors.green.shade50,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: isDark ? const Color(0xFF059669) : Colors.green.shade200),
                ),
                child: Row(
                  children: [
                    Icon(Icons.currency_rupee, color: isDark ? const Color(0xFF6EE7B7) : Colors.green, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Benefit: ${scheme.benefitAmount}',
                        style: TextStyle(
                          color: isDark ? const Color(0xFF6EE7B7) : Colors.green.shade900,
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 20),

            // Description
            Text(
              'Overview / योजनेची माहिती',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textPrimary),
            ),
            const SizedBox(height: 6),
            Text(
              desc,
              style: TextStyle(fontSize: 14, color: textSecondary, height: 1.5),
            ),
            const SizedBox(height: 20),

            // Eligibility
            if (elig.isNotEmpty) ...[
              Text(
                'Eligibility Criteria / पात्रता निकष',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textPrimary),
              ),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: boxBg,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: borderColor),
                ),
                child: Text(
                  elig,
                  style: TextStyle(fontSize: 13.5, color: textPrimary, height: 1.4),
                ),
              ),
              const SizedBox(height: 20),
            ],

            // Required Documents Checklist
            if (scheme.requiredDocuments.isNotEmpty) ...[
              Text(
                'Required Documents / आवश्यक कागदपत्रे',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textPrimary),
              ),
              const SizedBox(height: 10),
              Card(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Column(
                    children: scheme.requiredDocuments.map((doc) {
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        child: Row(
                          children: [
                            Icon(Icons.check_circle, size: 18, color: primaryColor),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                doc,
                                style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w500, color: textPrimary),
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],

            // Application Process
            if (scheme.applicationProcess.isNotEmpty) ...[
              Text(
                'How to Apply / अर्ज कसा करावा',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textPrimary),
              ),
              const SizedBox(height: 6),
              Text(
                scheme.applicationProcess,
                style: TextStyle(fontSize: 13.5, color: textSecondary, height: 1.5),
              ),
              const SizedBox(height: 24),
            ],

            // Official Portal Button
            if (scheme.officialLink.isNotEmpty)
              ElevatedButton.icon(
                onPressed: () => _launchUrl(context, scheme.officialLink),
                icon: const Icon(Icons.open_in_new, size: 18),
                label: const Text('Open Official Portal / अधिकृत पोर्टल'),
              ),
          ],
        ),
      ),
    );
  }
}
