import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../core/localization/app_locale.dart';
import '../../models/scheme_model.dart';
import '../../providers/locale_provider.dart';
import '../../services/common_service.dart';
import 'scheme_detail_screen.dart';

class SchemesScreen extends StatefulWidget {
  const SchemesScreen({super.key});

  @override
  State<SchemesScreen> createState() => _SchemesScreenState();
}

class _SchemesScreenState extends State<SchemesScreen> {
  List<SchemeModel> _schemes = [];
  bool _isLoading = true;
  String _selectedCategory = 'All';

  final List<String> _categories = [
    'All',
    'Agriculture',
    'Housing',
    'Women & Child',
    'Social Welfare',
    'Health',
  ];

  @override
  void initState() {
    super.initState();
    _fetchSchemes();
  }

  Future<void> _fetchSchemes() async {
    setState(() => _isLoading = true);
    final data = await CommonService.getSchemes(
      category: _selectedCategory,
    );
    if (mounted) {
      setState(() {
        _schemes = data;
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
        title: Text(AppLocale.t('schemes')),
      ),
      body: Column(
        children: [
          // Filter Chips
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
                      _fetchSchemes();
                    }
                  },
                );
              },
            ),
          ),
          Divider(height: 1, color: dividerColor),

          // Schemes List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _schemes.isEmpty
                    ? Center(child: Text('No government schemes found in this category.', style: TextStyle(color: textSecondary)))
                    : RefreshIndicator(
                        onRefresh: _fetchSchemes,
                        child: ListView.separated(
                          padding: const EdgeInsets.all(16),
                          itemCount: _schemes.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 12),
                          itemBuilder: (ctx, i) {
                            final scheme = _schemes[i];
                            final name = locale.isMarathi && scheme.marathiName.isNotEmpty
                                ? scheme.marathiName
                                : scheme.name;
                            final desc = locale.isMarathi && scheme.marathiDescription.isNotEmpty
                                ? scheme.marathiDescription
                                : scheme.description;

                            return Card(
                              child: InkWell(
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => SchemeDetailScreen(scheme: scheme),
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
                                              color: isDark ? const Color(0xFF581C87).withOpacity(0.4) : Colors.purple.shade50,
                                              borderRadius: BorderRadius.circular(6),
                                            ),
                                            child: Text(
                                              scheme.category,
                                              style: TextStyle(
                                                color: isDark ? const Color(0xFFD8B4FE) : Colors.purple.shade800,
                                                fontSize: 11,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                          if (scheme.benefitAmount.isNotEmpty)
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                              decoration: BoxDecoration(
                                                color: isDark ? const Color(0xFF064E3B) : Colors.green.shade50,
                                                borderRadius: BorderRadius.circular(6),
                                              ),
                                              child: Text(
                                                scheme.benefitAmount,
                                                style: TextStyle(
                                                  color: isDark ? const Color(0xFF6EE7B7) : Colors.green.shade800,
                                                  fontSize: 11,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                            ),
                                        ],
                                      ),
                                      const SizedBox(height: 10),
                                      Text(
                                        name,
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
                                            '${scheme.requiredDocuments.length} Documents Required',
                                            style: TextStyle(fontSize: 11.5, color: textSecondary),
                                          ),
                                          Text(
                                            'View Details →',
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
