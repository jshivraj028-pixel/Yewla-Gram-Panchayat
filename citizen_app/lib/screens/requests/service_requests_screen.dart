import 'package:flutter/material.dart';
import '../../core/constants/app_constants.dart';
import '../../core/localization/app_locale.dart';
import '../../models/request_model.dart';
import '../../services/request_service.dart';
import '../../widgets/status_badge.dart';
import '../../core/utils/file_downloader.dart';
import 'create_request_screen.dart';

class ServiceRequestsScreen extends StatefulWidget {
  const ServiceRequestsScreen({super.key});

  @override
  State<ServiceRequestsScreen> createState() => _ServiceRequestsScreenState();
}

class _ServiceRequestsScreenState extends State<ServiceRequestsScreen> {
  List<ServiceRequestModel> _requests = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchRequests();
  }

  Future<void> _fetchRequests() async {
    setState(() => _isLoading = true);
    final data = await RequestService.getRequests();
    if (mounted) {
      setState(() {
        _requests = data;
        _isLoading = false;
      });
    }
  }

  Future<void> _downloadReceipt(ServiceRequestModel req) async {
    try {
      final fileName = 'Receipt_${req.requestId}.pdf';
      final downloadUrl = '${AppConstants.baseUrl}/requests/${req.id}/receipt';

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Downloading Receipt for ${req.requestId}... / पावती डाऊनलोड होत आहे...'),
          backgroundColor: AppConstants.primary,
          duration: const Duration(seconds: 2),
        ),
      );

      await downloadFileUniversal(downloadUrl, fileName);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Download failed: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? const Color(0xFFF1F5F9) : AppConstants.textPrimary;
    final textSecondary = isDark ? const Color(0xFF94A3B8) : AppConstants.textSecondary;
    final primaryColor = isDark ? const Color(0xFF34D399) : AppConstants.primary;
    final borderColor = isDark ? const Color(0xFF334155) : AppConstants.border;
    final badgeBg = isDark ? const Color(0xFF1E293B) : Colors.grey.shade100;
    final badgeBorder = isDark ? const Color(0xFF334155) : Colors.grey.shade300;

    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocale.t('requests')),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const CreateRequestScreen()),
          );
          if (result == true) {
            _fetchRequests();
          }
        },
        backgroundColor: isDark ? const Color(0xFF10B981) : AppConstants.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('New Application / नवीन अर्ज'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _requests.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.description_outlined, size: 64, color: isDark ? Colors.white38 : Colors.grey.shade400),
                      const SizedBox(height: 16),
                      Text(
                        'No service applications submitted',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: textSecondary,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Apply for Birth/Death verification, Water connection, or NOC',
                        style: TextStyle(fontSize: 13, color: isDark ? Colors.white38 : Colors.grey.shade500),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _fetchRequests,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _requests.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (ctx, i) {
                      final req = _requests[i];
                      return Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: badgeBg,
                                      borderRadius: BorderRadius.circular(6),
                                      border: Border.all(color: badgeBorder),
                                    ),
                                    child: Text(
                                      req.requestId,
                                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: textPrimary),
                                    ),
                                  ),
                                  StatusBadge(status: req.status),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Text(
                                req.requestType,
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  color: primaryColor,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                req.subject,
                                style: TextStyle(
                                  fontSize: 13.5,
                                  fontWeight: FontWeight.w600,
                                  color: textPrimary,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                req.details,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 12.5,
                                  color: textSecondary,
                                ),
                              ),
                              if (req.remarks.isNotEmpty) ...[
                                const SizedBox(height: 10),
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: isDark ? const Color(0xFF2E2210) : Colors.amber.shade50,
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(color: isDark ? Colors.amber.shade700 : Colors.amber.shade200),
                                  ),
                                  child: Row(
                                    children: [
                                      const Icon(Icons.info_outline, size: 16, color: AppConstants.accent),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          'Remark: ${req.remarks}',
                                          style: const TextStyle(fontSize: 12, color: AppConstants.accent),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                              const SizedBox(height: 12),
                              Divider(height: 1, color: borderColor),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Applied on: ${req.createdAt.day}/${req.createdAt.month}/${req.createdAt.year}',
                                    style: TextStyle(fontSize: 11, color: textSecondary),
                                  ),
                                  TextButton.icon(
                                    style: TextButton.styleFrom(
                                      visualDensity: VisualDensity.compact,
                                      padding: const EdgeInsets.symmetric(horizontal: 8),
                                    ),
                                    onPressed: () => _downloadReceipt(req),
                                    icon: Icon(Icons.download_rounded, size: 16, color: primaryColor),
                                    label: Text('Receipt / पावती', style: TextStyle(fontSize: 11.5, color: primaryColor, fontWeight: FontWeight.bold)),
                                  ),
                                ],
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
