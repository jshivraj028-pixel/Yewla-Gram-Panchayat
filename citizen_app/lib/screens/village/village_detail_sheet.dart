import 'package:flutter/material.dart';
import '../../core/constants/app_constants.dart';
import '../../models/village_model.dart';

class VillageDetailSheet extends StatelessWidget {
  final VillageModel village;
  final bool isMarathi;

  const VillageDetailSheet({
    super.key,
    required this.village,
    required this.isMarathi,
  });

  static void show(BuildContext context, VillageModel village, bool isMarathi) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => VillageDetailSheet(village: village, isMarathi: isMarathi),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textPrimary = isDark ? Colors.white : AppConstants.textPrimary;
    final textSecondary = isDark ? const Color(0xFFCBD5E1) : AppConstants.textSecondary;
    final cardBg = isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final borderColor = isDark ? const Color(0xFF334155) : AppConstants.border;

    final name = isMarathi ? village.nameMr : village.nameEn;
    final taluka = isMarathi ? village.talukaMr : village.talukaEn;
    final district = isMarathi ? village.districtMr : village.districtEn;
    final occupation = isMarathi ? village.occupationMr : village.occupationEn;
    final description = isMarathi ? village.descriptionMr : village.descriptionEn;
    final facilities = isMarathi ? village.facilitiesMr : village.facilitiesEn;
    final highlights = isMarathi ? village.highlightsMr : village.highlightsEn;

    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.88,
      ),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Drag handle
          Center(
            child: Container(
              margin: const EdgeInsets.only(top: 12, bottom: 8),
              width: 44,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.withOpacity(0.4),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppConstants.primary.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Text('🏡', style: TextStyle(fontSize: 28)),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: textPrimary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        isMarathi
                            ? 'ता. $taluka, जि. $district • ${village.wards}'
                            : 'Tq. $taluka, Dist. $district • ${village.wards}',
                        style: TextStyle(
                          fontSize: 12.5,
                          color: textSecondary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.close, color: textSecondary),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),

          const Divider(height: 1),

          // Scrollable Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Quick Stats Row
                  Row(
                    children: [
                      Expanded(
                        child: _buildStatBox(
                          icon: Icons.people_outline,
                          title: isMarathi ? 'लोकसंख्या' : 'Population',
                          value: '${village.population}',
                          color: Colors.blue,
                          cardBg: cardBg,
                          borderColor: borderColor,
                          textPrimary: textPrimary,
                          textSecondary: textSecondary,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _buildStatBox(
                          icon: Icons.home_work_outlined,
                          title: isMarathi ? 'कुटुंबे' : 'Households',
                          value: '${village.households}',
                          color: Colors.amber.shade700,
                          cardBg: cardBg,
                          borderColor: borderColor,
                          textPrimary: textPrimary,
                          textSecondary: textSecondary,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _buildStatBox(
                          icon: Icons.menu_book_outlined,
                          title: isMarathi ? 'साक्षरता' : 'Literacy',
                          value: village.literacyRate,
                          color: const Color(0xFF10B981),
                          cardBg: cardBg,
                          borderColor: borderColor,
                          textPrimary: textPrimary,
                          textSecondary: textSecondary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),

                  // Description
                  Text(
                    isMarathi ? 'गावाची माहिती व पार्श्वभूमी' : 'Village Overview & Background',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: textPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: cardBg,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: borderColor),
                    ),
                    child: Text(
                      description,
                      style: TextStyle(
                        fontSize: 13,
                        color: textSecondary,
                        height: 1.5,
                      ),
                    ),
                  ),
                  const SizedBox(height: 18),

                  // Occupation
                  Text(
                    isMarathi ? 'प्रमुख व्यवसाय' : 'Primary Occupations',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: textPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: (isDark ? const Color(0xFF064E3B) : Colors.green.shade50).withOpacity(0.6),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: (isDark ? const Color(0xFF059669) : Colors.green.shade200)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.agriculture, color: AppConstants.primary, size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            occupation,
                            style: TextStyle(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w600,
                              color: isDark ? const Color(0xFF6EE7B7) : AppConstants.primaryDark,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),

                  // Facilities
                  Text(
                    isMarathi ? 'गावातील सार्वजनिक सुविधा' : 'Public Infrastructure & Facilities',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: textPrimary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    decoration: BoxDecoration(
                      color: cardBg,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: borderColor),
                    ),
                    child: Column(
                      children: facilities.map((facility) {
                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(Icons.check_circle, size: 17, color: Color(0xFF10B981)),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  facility,
                                  style: TextStyle(fontSize: 12.5, color: textPrimary),
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  const SizedBox(height: 18),

                  // Key Highlights / Mandir / Traditions
                  Text(
                    isMarathi ? 'वैशिष्ट्ये व सांस्कृतिक वारसा' : 'Key Highlights & Heritage',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: textPrimary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    decoration: BoxDecoration(
                      color: cardBg,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: borderColor),
                    ),
                    child: Column(
                      children: highlights.map((hl) {
                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(Icons.star_rounded, size: 18, color: Colors.amber),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  hl,
                                  style: TextStyle(fontSize: 12.5, color: textPrimary),
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Close Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(context),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppConstants.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        isMarathi ? 'समजले / मागे जा' : 'Close',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatBox({
    required IconData icon,
    required String title,
    required String value,
    required Color color,
    required Color cardBg,
    required Color borderColor,
    required Color textPrimary,
    required Color textSecondary,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        children: [
          Icon(icon, size: 20, color: color),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: textPrimary,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            title,
            style: TextStyle(
              fontSize: 10,
              color: textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
