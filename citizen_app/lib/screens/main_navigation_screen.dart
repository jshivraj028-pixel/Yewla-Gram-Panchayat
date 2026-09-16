import 'package:flutter/material.dart';
import '../core/constants/app_constants.dart';
import '../core/localization/app_locale.dart';
import 'complaints/complaints_list_screen.dart';
import 'home_screen.dart';
import 'notices/notices_screen.dart';
import 'profile/profile_screen.dart';
import 'requests/service_requests_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  final int initialIndex;
  const MainNavigationScreen({super.key, this.initialIndex = 0});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  late int _currentIndex;

  final List<Widget> _screens = const [
    HomeScreen(),
    ComplaintsListScreen(),
    ServiceRequestsScreen(),
    NoticesScreen(),
    ProfileScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final activeColor = isDark ? const Color(0xFF10B981) : AppConstants.primary;
    final inactiveColor = isDark ? const Color(0xFF94A3B8) : AppConstants.textSecondary;

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBarTheme(
        data: NavigationBarThemeData(
          height: 64,
          indicatorColor: activeColor.withOpacity(0.18),
          backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.white,
          labelTextStyle: WidgetStateProperty.resolveWith<TextStyle>((states) {
            final isSelected = states.contains(WidgetState.selected);
            return TextStyle(
              fontSize: 11,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              color: isSelected ? activeColor : inactiveColor,
              letterSpacing: -0.3,
            );
          }),
        ),
        child: NavigationBar(
          selectedIndex: _currentIndex,
          onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
          elevation: 8,
          destinations: [
            NavigationDestination(
              icon: Icon(Icons.home_outlined, color: inactiveColor),
              selectedIcon: Icon(Icons.home, color: activeColor),
              label: AppLocale.t('home'),
            ),
            NavigationDestination(
              icon: Icon(Icons.report_problem_outlined, color: inactiveColor),
              selectedIcon: Icon(Icons.report_problem, color: activeColor),
              label: AppLocale.t('complaints'),
            ),
            NavigationDestination(
              icon: Icon(Icons.assignment_outlined, color: inactiveColor),
              selectedIcon: Icon(Icons.assignment, color: activeColor),
              label: AppLocale.t('requests'),
            ),
            NavigationDestination(
              icon: Icon(Icons.campaign_outlined, color: inactiveColor),
              selectedIcon: Icon(Icons.campaign, color: activeColor),
              label: AppLocale.t('notices'),
            ),
            NavigationDestination(
              icon: Icon(Icons.person_outline, color: inactiveColor),
              selectedIcon: Icon(Icons.person, color: activeColor),
              label: AppLocale.t('profile'),
            ),
          ],
        ),
      ),
    );
  }
}
