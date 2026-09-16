import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/constants/app_constants.dart';
import 'auth/login_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<Map<String, dynamic>> _pages = [
    {
      'title': 'Access Official Notices',
      'marathi': 'ग्रामपंचायत अधिकृत सूचना',
      'desc':
        'Stay updated with official Gram Sabha notices, water supply schedules, tax alerts, and tenders directly on your phone.',
      'icon': Icons.campaign_outlined,
    },
    {
      'title': 'Submit & Track Complaints',
      'marathi': 'तक्रार नोंदवा व प्रगती पहा',
      'desc':
        'Report issues with roads, street lights, drinking water, or drainage. Get assigned officer updates and transparent timeline tracking.',
      'icon': Icons.report_problem_outlined,
    },
    {
      'title': 'Citizen Services & Schemes',
      'marathi': 'नागरिक सेवा व शासकीय योजना',
      'desc':
        'Apply for certificate endorsements, view government welfare schemes, track village development projects, and contact emergency helplines.',
      'icon': Icons.verified_user_outlined,
    },
  ];

  Future<void> _completeOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('seen_onboarding', true);
    if (!mounted) return;
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const LoginScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? Colors.white : AppConstants.textPrimary;
    final textSecondary = isDark ? const Color(0xFF94A3B8) : AppConstants.textSecondary;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          TextButton(
            onPressed: _completeOnboarding,
            child: Text(
              'Skip',
              style: TextStyle(
                color: textSecondary,
                fontSize: 15,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: (idx) => setState(() => _currentPage = idx),
                itemCount: _pages.length,
                itemBuilder: (ctx, idx) {
                  final page = _pages[idx];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 28),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 140,
                          height: 140,
                          decoration: BoxDecoration(
                            color: (isDark ? const Color(0xFF10B981) : AppConstants.primary).withOpacity(0.12),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            page['icon'] as IconData,
                            size: 72,
                            color: isDark ? const Color(0xFF34D399) : AppConstants.primary,
                          ),
                        ),
                        const SizedBox(height: 36),
                        Text(
                          page['title'] as String,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: textPrimary,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          page['marathi'] as String,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: isDark ? const Color(0xFF6EE7B7) : AppConstants.primary,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          page['desc'] as String,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 14,
                            height: 1.5,
                            color: textSecondary,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                _pages.length,
                (i) => AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: _currentPage == i ? 24 : 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: _currentPage == i ? AppConstants.primary : AppConstants.border,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24),
              child: ElevatedButton(
                onPressed: () {
                  if (_currentPage == _pages.length - 1) {
                    _completeOnboarding();
                  } else {
                    _pageController.nextPage(
                      duration: const Duration(milliseconds: 350),
                      curve: Curves.easeInOut,
                    );
                  }
                },
                child: Text(
                  _currentPage == _pages.length - 1 ? 'Get Started / सुरू करा' : 'Next / पुढे',
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
