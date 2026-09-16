import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_constants.dart';
import '../core/localization/app_locale.dart';
import '../models/event_model.dart';
import '../models/notice_model.dart';
import '../models/project_model.dart';
import '../models/village_model.dart';
import '../providers/auth_provider.dart';
import '../providers/locale_provider.dart';
import '../providers/theme_provider.dart';
import '../services/common_service.dart';
import '../services/notice_service.dart';
import '../widgets/quick_service_card.dart';
import '../widgets/village_card.dart';
import 'complaints/complaints_list_screen.dart';
import 'complaints/create_complaint_screen.dart';
import 'documents/documents_screen.dart';
import 'emergency/emergency_screen.dart';
import 'events/events_screen.dart';
import 'notices/notice_detail_screen.dart';
import 'notices/notices_screen.dart';
import 'notifications/notifications_screen.dart';
import 'projects/projects_screen.dart';
import 'requests/create_request_screen.dart';
import 'requests/service_requests_screen.dart';
import 'schemes/schemes_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  NoticeModel? _pinnedNotice;
  EventModel? _upcomingSabha;
  ProjectModel? _featuredProject;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchDashboardData();
  }

  Future<void> _fetchDashboardData() async {
    try {
      final notices = await NoticeService.getNotices();
      final events = await CommonService.getEvents();
      final projects = await CommonService.getProjects();

      if (mounted) {
        setState(() {
          _pinnedNotice = notices.isNotEmpty ? notices.first : null;
          _upcomingSabha = events.isNotEmpty ? events.first : null;
          _featuredProject = projects.isNotEmpty ? projects.first : null;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final locale = Provider.of<LocaleProvider>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? Colors.white : AppConstants.textPrimary;
    final textSecondary = isDark ? Colors.white70 : AppConstants.textSecondary;
    final userName = auth.user?.name ?? 'Citizen';

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.account_balance, size: 18, color: Colors.white70),
                const SizedBox(width: 6),
                Text(
                  AppConstants.appName,
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            Text(
              'Ward ${auth.user?.wardNumber ?? 1} • Yewla, Jalna',
              style: const TextStyle(fontSize: 11, color: Colors.white70),
            ),
          ],
        ),
        actions: [
          // Language Switch
          IconButton(
            tooltip: 'Language',
            icon: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white24,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                locale.isMarathi ? 'EN' : 'मराठी',
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
              ),
            ),
            onPressed: () => locale.toggleLanguage(),
          ),
          // Day / Night Theme Mode Switch Button
          Consumer<ThemeProvider>(
            builder: (context, themeProvider, _) {
              final isDarkMode = themeProvider.isDarkMode;
              return IconButton(
                tooltip: isDarkMode ? 'Day Mode (दिवस मोड)' : 'Night Mode (नाईट मोड)',
                icon: Container(
                  padding: const EdgeInsets.all(5),
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    isDarkMode ? Icons.light_mode : Icons.dark_mode_outlined,
                    size: 19,
                    color: isDarkMode ? Colors.amberAccent : Colors.white,
                  ),
                ),
                onPressed: () => themeProvider.toggleTheme(),
              );
            },
          ),
          // Notifications Bell
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const NotificationsScreen()),
              );
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchDashboardData,
              child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Citizen Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppConstants.primary, AppConstants.primaryLight],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: AppConstants.primary.withOpacity(0.25),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                AppLocale.t('welcome'),
                                style: const TextStyle(color: Colors.white70, fontSize: 13),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                userName,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white.withOpacity(0.8), width: 2),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.15),
                                blurRadius: 6,
                              ),
                            ],
                          ),
                          child: ClipOval(
                            child: (auth.user?.avatar?.isNotEmpty == true)
                                ? Image.network(
                                    AppConstants.getImageUrl(auth.user?.avatar),
                                    key: ValueKey(auth.user?.avatar),
                                    fit: BoxFit.cover,
                                    filterQuality: FilterQuality.high,
                                    errorBuilder: (c, e, s) => Container(
                                      color: Colors.white24,
                                      alignment: Alignment.center,
                                      child: Text(
                                        (userName.isNotEmpty ? userName[0].toUpperCase() : 'C'),
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 18,
                                        ),
                                      ),
                                    ),
                                  )
                                : Container(
                                    color: Colors.white24,
                                    alignment: Alignment.center,
                                    child: Text(
                                      (userName.isNotEmpty ? userName[0].toUpperCase() : 'C'),
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 18,
                                      ),
                                    ),
                                  ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white,
                              foregroundColor: AppConstants.primary,
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const CreateComplaintScreen()),
                              );
                            },
                            icon: const Icon(Icons.add_circle_outline, size: 18),
                            label: Text(
                              AppLocale.t('newComplaint'),
                              style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white.withOpacity(0.2),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                              elevation: 0,
                            ),
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const CreateRequestScreen()),
                              );
                            },
                            icon: const Icon(Icons.edit_document, size: 18),
                            label: const Text(
                              'Apply Service',
                              style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Important Notice Banner (if any)
              if (_pinnedNotice != null) ...[
                InkWell(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => NoticeDetailScreen(notice: _pinnedNotice!),
                      ),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF2E2210) : Colors.amber.shade50,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: isDark ? Colors.amber.shade700 : Colors.amber.shade400,
                        width: 1.2,
                      ),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.campaign, color: AppConstants.accent, size: 26),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: AppConstants.accent,
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: const Text(
                                      'URGENT NOTICE',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 9.5,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    _pinnedNotice!.category,
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: isDark ? Colors.white70 : Colors.grey.shade700,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                locale.isMarathi && _pinnedNotice!.marathiTitle.isNotEmpty
                                    ? _pinnedNotice!.marathiTitle
                                    : _pinnedNotice!.title,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: textPrimary,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.arrow_forward_ios, size: 14, color: AppConstants.accent),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),
              ],

              // Quick Services Grid (8 Services)
              Text(
                AppLocale.t('quickServices'),
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: textPrimary,
                ),
              ),
              const SizedBox(height: 12),
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 4,
                mainAxisSpacing: 10,
                crossAxisSpacing: 8,
                mainAxisExtent: 106,
                children: [
                  QuickServiceCard(
                    icon: Icons.report_problem,
                    title: AppLocale.t('complaints'),
                    color: Colors.orange.shade700,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const ComplaintsListScreen()),
                      );
                    },
                  ),
                  QuickServiceCard(
                    icon: Icons.assignment_turned_in,
                    title: AppLocale.t('requests'),
                    color: Colors.blue.shade700,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const ServiceRequestsScreen()),
                      );
                    },
                  ),
                  QuickServiceCard(
                    icon: Icons.campaign,
                    title: AppLocale.t('notices'),
                    color: Colors.teal.shade700,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const NoticesScreen()),
                      );
                    },
                  ),
                  QuickServiceCard(
                    icon: Icons.auto_graph,
                    title: AppLocale.t('schemes'),
                    color: Colors.purple.shade700,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const SchemesScreen()),
                      );
                    },
                  ),
                  QuickServiceCard(
                    icon: Icons.event,
                    title: AppLocale.t('events'),
                    color: Colors.indigo.shade700,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const EventsScreen()),
                      );
                    },
                  ),
                  QuickServiceCard(
                    icon: Icons.engineering,
                    title: AppLocale.t('projects'),
                    color: Colors.green.shade800,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const ProjectsScreen()),
                      );
                    },
                  ),
                  QuickServiceCard(
                    icon: Icons.folder_open,
                    title: AppLocale.t('documents'),
                    color: Colors.brown.shade700,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const DocumentsScreen()),
                      );
                    },
                  ),
                  QuickServiceCard(
                    icon: Icons.emergency,
                    title: AppLocale.t('emergency'),
                    color: Colors.red.shade700,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const EmergencyScreen()),
                      );
                    },
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // गावाची माहिती (Village Information Cards)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Text('🏡', style: TextStyle(fontSize: 18)),
                      const SizedBox(width: 8),
                      Text(
                        locale.isMarathi ? 'गावाची माहिती' : 'Village Information',
                        style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                          color: textPrimary,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                    decoration: BoxDecoration(
                      color: (isDark ? const Color(0xFF10B981) : AppConstants.primary).withOpacity(0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '${VillageModel.sampleVillages.length} ${locale.isMarathi ? 'गावे/विभाग' : 'Hamlets'}',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: isDark ? const Color(0xFF6EE7B7) : AppConstants.primary,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              SizedBox(
                height: 200,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  itemCount: VillageModel.sampleVillages.length,
                  separatorBuilder: (context, index) => const SizedBox(width: 12),
                  itemBuilder: (context, index) {
                    final village = VillageModel.sampleVillages[index];
                    return VillageCard(
                      village: village,
                      isMarathi: locale.isMarathi,
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),

              // Upcoming Gram Sabha Meeting Card
              if (_upcomingSabha != null) ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      AppLocale.t('upcomingGramSabha'),
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: textPrimary,
                      ),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const EventsScreen()),
                        );
                      },
                      child: Text(AppLocale.t('viewAll')),
                    ),
                  ],
                ),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: (isDark ? const Color(0xFF10B981) : AppConstants.primary).withOpacity(0.15),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Icon(
                                Icons.groups,
                                color: isDark ? const Color(0xFF34D399) : AppConstants.primary,
                                size: 26,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    locale.isMarathi && _upcomingSabha!.marathiTitle.isNotEmpty
                                        ? _upcomingSabha!.marathiTitle
                                        : _upcomingSabha!.title,
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.bold,
                                      color: textPrimary,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Row(
                                    children: [
                                      Icon(Icons.calendar_today, size: 12, color: textSecondary),
                                      const SizedBox(width: 4),
                                      Text(
                                        '${_upcomingSabha!.eventDate.day}/${_upcomingSabha!.eventDate.month}/${_upcomingSabha!.eventDate.year} at ${_upcomingSabha!.time}',
                                        style: TextStyle(fontSize: 12, color: textSecondary),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Icon(Icons.location_on_outlined, size: 14, color: textSecondary),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                _upcomingSabha!.location,
                                style: TextStyle(fontSize: 12, color: textSecondary),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),
              ],

              // Featured Development Project Progress
              if (_featuredProject != null) ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      AppLocale.t('latestDevelopment'),
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: textPrimary,
                      ),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const ProjectsScreen()),
                        );
                      },
                      child: Text(AppLocale.t('viewAll')),
                    ),
                  ],
                ),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                locale.isMarathi && _featuredProject!.marathiName.isNotEmpty
                                    ? _featuredProject!.marathiName
                                    : _featuredProject!.name,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: textPrimary,
                                ),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: isDark ? const Color(0xFF064E3B) : Colors.green.shade50,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: isDark ? const Color(0xFF059669) : Colors.green.shade300,
                                ),
                              ),
                              child: Text(
                                '${_featuredProject!.progressPercentage}% Done',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: isDark ? const Color(0xFF6EE7B7) : Colors.green.shade800,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: LinearProgressIndicator(
                            value: _featuredProject!.progressPercentage / 100.0,
                            minHeight: 8,
                            backgroundColor: isDark ? const Color(0xFF334155) : Colors.grey.shade200,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              isDark ? const Color(0xFF10B981) : AppConstants.primary,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Budget: ₹${(_featuredProject!.budget / 100000).toStringAsFixed(1)} Lakh',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: textSecondary,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  Icon(Icons.location_on_outlined, size: 13, color: textSecondary),
                                  const SizedBox(width: 3),
                                  Flexible(
                                    child: Text(
                                      _featuredProject!.location,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(fontSize: 12, color: textSecondary),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
