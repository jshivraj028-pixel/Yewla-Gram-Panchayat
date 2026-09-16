import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../core/localization/app_locale.dart';
import '../../models/project_model.dart';
import '../../providers/locale_provider.dart';
import '../../services/common_service.dart';

class ProjectsScreen extends StatefulWidget {
  const ProjectsScreen({super.key});

  @override
  State<ProjectsScreen> createState() => _ProjectsScreenState();
}

class _ProjectsScreenState extends State<ProjectsScreen> {
  List<ProjectModel> _projects = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchProjects();
  }

  Future<void> _fetchProjects() async {
    setState(() => _isLoading = true);
    final data = await CommonService.getProjects();
    if (mounted) {
      setState(() {
        _projects = data;
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
    final borderColor = isDark ? const Color(0xFF334155) : AppConstants.border;

    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocale.t('projects')),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _projects.isEmpty
              ? Center(child: Text('No village development projects found.', style: TextStyle(color: textSecondary)))
              : RefreshIndicator(
                  onRefresh: _fetchProjects,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _projects.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 14),
                    itemBuilder: (ctx, i) {
                      final p = _projects[i];
                      final name = locale.isMarathi && p.marathiName.isNotEmpty
                          ? p.marathiName
                          : p.name;

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
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: primaryColor.withOpacity(isDark ? 0.2 : 0.1),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      p.category,
                                      style: TextStyle(
                                        color: primaryColor,
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: p.status == 'Completed'
                                          ? (isDark ? const Color(0xFF064E3B) : Colors.green.shade50)
                                          : (isDark ? const Color(0xFF1E3A8A).withOpacity(0.4) : Colors.blue.shade50),
                                      borderRadius: BorderRadius.circular(12),
                                      border: Border.all(
                                        color: p.status == 'Completed'
                                            ? (isDark ? const Color(0xFF059669) : Colors.green.shade300)
                                            : (isDark ? const Color(0xFF3B82F6) : Colors.blue.shade300),
                                      ),
                                    ),
                                    child: Text(
                                      p.status,
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                        color: p.status == 'Completed'
                                            ? (isDark ? const Color(0xFF6EE7B7) : Colors.green.shade800)
                                            : (isDark ? const Color(0xFF93C5FD) : Colors.blue.shade800),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Text(
                                name,
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: textPrimary,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                p.description,
                                style: TextStyle(fontSize: 13, color: textSecondary),
                              ),
                              const SizedBox(height: 14),

                              // Progress Bar
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text('Work Completed', style: TextStyle(fontSize: 12, color: textSecondary)),
                                  Text('${p.progressPercentage}%', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: textPrimary)),
                                ],
                              ),
                              const SizedBox(height: 6),
                              ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: LinearProgressIndicator(
                                  value: p.progressPercentage / 100.0,
                                  minHeight: 8,
                                  backgroundColor: isDark ? const Color(0xFF334155) : Colors.grey.shade200,
                                  valueColor: AlwaysStoppedAnimation<Color>(
                                    p.progressPercentage == 100
                                        ? (isDark ? const Color(0xFF34D399) : Colors.green)
                                        : primaryColor,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 14),
                              Divider(height: 1, color: borderColor),
                              const SizedBox(height: 10),

                              // Budget & Location Info
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text('Sanctioned Budget', style: TextStyle(fontSize: 11, color: textSecondary)),
                                      Text(
                                        '₹${(p.budget / 100000).toStringAsFixed(1)} Lakh',
                                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: primaryColor),
                                      ),
                                    ],
                                  ),
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      Text('Location', style: TextStyle(fontSize: 11, color: textSecondary)),
                                      Text(
                                        'Ward ${p.wardNumber}',
                                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textPrimary),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              if (p.contractorName.isNotEmpty) ...[
                                const SizedBox(height: 8),
                                Text(
                                  'Contractor: ${p.contractorName}',
                                  style: TextStyle(fontSize: 11.5, color: textSecondary),
                                ),
                              ],
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
