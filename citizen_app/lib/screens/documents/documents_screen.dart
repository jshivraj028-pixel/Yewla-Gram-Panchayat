import 'package:flutter/material.dart';
import '../../core/constants/app_constants.dart';
import '../../core/localization/app_locale.dart';
import '../../core/network/api_client.dart';
import '../../core/utils/file_downloader.dart';

class DocumentsScreen extends StatefulWidget {
  const DocumentsScreen({super.key});

  @override
  State<DocumentsScreen> createState() => _DocumentsScreenState();
}

class _DocumentsScreenState extends State<DocumentsScreen> {
  List<dynamic> _documents = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchDocuments();
  }

  Future<void> _fetchDocuments() async {
    setState(() => _isLoading = true);
    final res = await ApiClient.get('/documents');
    if (mounted) {
      setState(() {
        _documents = res.data is List ? res.data : [];
        _isLoading = false;
      });
    }
  }

  Future<void> _downloadDoc(Map<String, dynamic> doc) async {
    try {
      final docId = doc['_id']?.toString() ?? '';
      final title = doc['title']?.toString() ?? 'Document';
      String fileName = (doc['fileUrl']?.toString() ?? '').split('/').last;
      if (fileName.isEmpty || !fileName.endsWith('.pdf')) {
        fileName = '${title.replaceAll(RegExp(r'[^a-zA-Z0-9_-]'), '_')}.pdf';
      }

      String downloadUrl;
      final fileUrl = doc['fileUrl']?.toString() ?? '';
      if (fileUrl.startsWith('http')) {
        downloadUrl = fileUrl;
      } else if (fileUrl.startsWith('/uploads')) {
        final host = AppConstants.baseUrl.replaceAll('/api', '');
        downloadUrl = '$host$fileUrl';
      } else if (docId.isNotEmpty) {
        downloadUrl = '${AppConstants.baseUrl}/documents/$docId/download';
      } else {
        final host = AppConstants.baseUrl.replaceAll('/api', '');
        downloadUrl = '$host/uploads/$fileName';
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const SizedBox(
                width: 16,
                height: 16,
                child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
              ),
              const SizedBox(width: 12),
              Expanded(child: Text('Downloading $fileName... / डाऊनलोड होत आहे...')),
            ],
          ),
          backgroundColor: AppConstants.primary,
          duration: const Duration(seconds: 2),
        ),
      );

      await downloadFileUniversal(downloadUrl, fileName);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Download failed: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primaryColor = isDark ? const Color(0xFF34D399) : AppConstants.primary;
    final textSecondary = isDark ? const Color(0xFF94A3B8) : AppConstants.textSecondary;

    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocale.t('documents')),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _documents.isEmpty
              ? Center(child: Text('No documents available', style: TextStyle(color: textSecondary)))
              : RefreshIndicator(
                  onRefresh: _fetchDocuments,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _documents.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (ctx, i) {
                      final doc = Map<String, dynamic>.from(_documents[i]);
                      return Card(
                        child: InkWell(
                          borderRadius: BorderRadius.circular(12),
                          onTap: () => _downloadDoc(doc),
                          child: ListTile(
                            contentPadding: const EdgeInsets.all(14),
                            leading: Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: isDark ? const Color(0xFF7F1D1D).withOpacity(0.4) : Colors.red.shade50,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Icon(Icons.picture_as_pdf, color: isDark ? const Color(0xFFFCA5A5) : Colors.red, size: 28),
                            ),
                            title: Text(
                              doc['title'] ?? 'Document',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                if (doc['marathiTitle'] != null && doc['marathiTitle'].toString().isNotEmpty) ...[
                                  const SizedBox(height: 2),
                                  Text(
                                    doc['marathiTitle'],
                                    style: TextStyle(fontSize: 12, color: isDark ? Colors.white70 : Colors.grey.shade700),
                                  ),
                                ],
                                const SizedBox(height: 4),
                                Text(
                                  '${doc['category']} • ${doc['fileSize'] ?? '1.5 MB'}',
                                  style: TextStyle(fontSize: 11.5, color: textSecondary),
                                ),
                              ],
                            ),
                            trailing: IconButton(
                              icon: Icon(Icons.download_rounded, color: primaryColor, size: 26),
                              tooltip: 'Download PDF',
                              onPressed: () => _downloadDoc(doc),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}
