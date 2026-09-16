import 'package:flutter/material.dart';
import '../core/constants/app_constants.dart';
import '../models/village_model.dart';
import '../screens/village/village_detail_sheet.dart';

class VillageCard extends StatelessWidget {
  final VillageModel village;
  final bool isMarathi;

  const VillageCard({
    super.key,
    required this.village,
    required this.isMarathi,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xFF1E293B) : Colors.white;
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFCBD5E1);
    final textPrimary = isDark ? Colors.white : AppConstants.textPrimary;
    final textSecondary = isDark ? const Color(0xFF94A3B8) : AppConstants.textSecondary;
    final buttonBg = isDark ? const Color(0xFF064E3B) : const Color(0xFFE6F4EA);
    final buttonText = isDark ? const Color(0xFF6EE7B7) : AppConstants.primary;

    final title = isMarathi ? village.cardTitleMr : village.cardTitleEn;
    final subtitle = isMarathi ? village.cardSubtitleMr : village.cardSubtitleEn;

    return Container(
      width: 170,
      height: 195,
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor, width: 1.4),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.25 : 0.05),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () => VillageDetailSheet.show(context, village, isMarathi),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Top: 🏡 Icon and Village Name
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text('🏡', style: TextStyle(fontSize: 20)),
                        const SizedBox(width: 6),
                        Flexible(
                          child: Text(
                            title,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: textPrimary,
                              letterSpacing: 0.2,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    SizedBox(
                      height: 18,
                      child: Text(
                        subtitle.isNotEmpty ? subtitle : '• • •',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: subtitle.isNotEmpty ? textSecondary : Colors.transparent,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ],
                ),

                // Middle: गावाची माहिती label
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                    ),
                  ),
                  child: Text(
                    isMarathi ? 'गावाची माहिती' : 'Village Info',
                    style: TextStyle(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w600,
                      color: isDark ? const Color(0xFFCBD5E1) : AppConstants.textPrimary,
                    ),
                  ),
                ),

                // Bottom: [Read More] button
                SizedBox(
                  width: double.infinity,
                  height: 36,
                  child: ElevatedButton(
                    onPressed: () => VillageDetailSheet.show(context, village, isMarathi),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: buttonBg,
                      foregroundColor: buttonText,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(horizontal: 6),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                        side: BorderSide(
                          color: (isDark ? const Color(0xFF10B981) : AppConstants.primary).withOpacity(0.35),
                          width: 1,
                        ),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          isMarathi ? '[ Read More ]' : '[ Read More ]',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: buttonText,
                            letterSpacing: 0.3,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
