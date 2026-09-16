import 'package:flutter/material.dart';
import '../core/constants/app_constants.dart';
import '../core/localization/app_locale.dart';

class StatusBadge extends StatelessWidget {
  final String status;
  final bool isLarge;

  const StatusBadge({
    super.key,
    required this.status,
    this.isLarge = false,
  });

  Color _getStatusColor() {
    switch (status) {
      case 'Pending':
        return AppConstants.statusPending;
      case 'Under Review':
        return AppConstants.statusUnderReview;
      case 'Assigned':
      case 'In Progress':
        return AppConstants.statusInProgress;
      case 'Resolved':
      case 'Approved':
        return AppConstants.statusResolved;
      case 'Rejected':
        return AppConstants.statusRejected;
      default:
        return AppConstants.textSecondary;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _getStatusColor();
    final localizedText = AppLocale.t(status);

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isLarge ? 14 : 10,
        vertical: isLarge ? 6 : 4,
      ),
      decoration: BoxDecoration(
        color: color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.3), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: isLarge ? 8 : 6,
            height: isLarge ? 8 : 6,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 6),
          Text(
            localizedText,
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.w600,
              fontSize: isLarge ? 13 : 11,
            ),
          ),
        ],
      ),
    );
  }
}
