import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/constants/app_constants.dart';
import '../../models/emergency_model.dart';
import '../../services/common_service.dart';

class EmergencyScreen extends StatefulWidget {
  const EmergencyScreen({super.key});

  @override
  State<EmergencyScreen> createState() => _EmergencyScreenState();
}

class _EmergencyScreenState extends State<EmergencyScreen> {
  List<EmergencyContactModel> _contacts = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchContacts();
  }

  Future<void> _fetchContacts() async {
    setState(() => _isLoading = true);
    final data = await CommonService.getEmergencyContacts();
    if (mounted) {
      setState(() {
        _contacts = data;
        _isLoading = false;
      });
    }
  }

  Future<void> _makePhoneCall(String phoneNumber) async {
    final cleanNumber = phoneNumber.replaceAll(RegExp(r'[^0-9+]'), '');
    final uri = Uri.parse('tel:$cleanNumber');
    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri);
      } else {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Cannot launch call: $phoneNumber')),
      );
    }
  }

  IconData _getDepartmentIcon(String department) {
    switch (department) {
      case 'Police':
        return Icons.local_police;
      case 'Ambulance':
      case 'Healthcare':
        return Icons.local_hospital;
      case 'Fire Brigade':
        return Icons.fire_truck;
      case 'Electricity':
        return Icons.flash_on;
      case 'Water Department':
        return Icons.water_drop;
      default:
        return Icons.account_balance;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? Colors.white : AppConstants.textPrimary;
    final textSecondary = isDark ? const Color(0xFFCBD5E1) : Colors.grey.shade700;
    final phoneColor = isDark ? const Color(0xFF34D399) : AppConstants.primary;
    final iconBg = isDark ? Colors.red.shade900.withOpacity(0.35) : Colors.red.shade50;
    final iconColor = isDark ? const Color(0xFFF87171) : Colors.red.shade700;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Emergency Directory / आपत्कालीन'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchContacts,
              child: _contacts.isEmpty
                  ? Center(
                      child: Text(
                        'No contacts found / संपर्क उपलब्ध नाहीत',
                        style: TextStyle(color: textSecondary),
                      ),
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.all(16),
                      itemCount: _contacts.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (ctx, i) {
                        final contact = _contacts[i];
                        return Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: iconBg,
                                    shape: BoxShape.circle,
                                  ),
                                  child: Icon(
                                    _getDepartmentIcon(contact.department),
                                    color: iconColor,
                                    size: 26,
                                  ),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        contact.name,
                                        style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold,
                                          color: textPrimary,
                                        ),
                                      ),
                                      if (contact.marathiName.isNotEmpty) ...[
                                        const SizedBox(height: 2),
                                        Text(
                                          contact.marathiName,
                                          style: TextStyle(
                                            fontSize: 12.5,
                                            fontWeight: FontWeight.w500,
                                            color: textSecondary,
                                          ),
                                        ),
                                      ],
                                      const SizedBox(height: 4),
                                      Text(
                                        contact.phoneNumber,
                                        style: TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w600,
                                          color: phoneColor,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                ElevatedButton(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: isDark ? const Color(0xFFDC2626) : Colors.red.shade700,
                                    foregroundColor: Colors.white,
                                    shape: const CircleBorder(),
                                    padding: const EdgeInsets.all(14),
                                    minimumSize: Size.zero,
                                  ),
                                  onPressed: () => _makePhoneCall(contact.phoneNumber),
                                  child: const Icon(Icons.phone, size: 20),
                                ),
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
