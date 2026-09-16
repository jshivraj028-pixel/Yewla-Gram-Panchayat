import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_constants.dart';
import '../providers/auth_provider.dart';
import 'auth/login_screen.dart';
import 'main_navigation_screen.dart';
import 'onboarding_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _fadeAnim;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    _fadeAnim = CurvedAnimation(parent: _animController, curve: Curves.easeIn);
    _animController.forward();

    _timer = Timer(const Duration(milliseconds: 1800), () {
      if (mounted) _navigateNext();
    });
  }

  Future<void> _navigateNext() async {
    final prefs = await SharedPreferences.getInstance();
    final bool seenOnboarding = prefs.getBool('seen_onboarding') ?? false;
    if (!mounted) return;
    final auth = Provider.of<AuthProvider>(context, listen: false);

    if (auth.isAuthenticated) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
      );
    } else if (!seenOnboarding) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const OnboardingScreen()),
      );
    } else {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const LoginScreen()),
      );
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConstants.primary,
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnim,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.15),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: const Center(
                  child: Icon(
                    Icons.account_balance,
                    size: 52,
                    color: AppConstants.primary,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                AppConstants.appName,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'ग्रामपंचायत नागरिक सेवा पोर्टल',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.9),
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Yewla Gram Panchayat Citizen Services',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.75),
                  fontSize: 13,
                ),
              ),
              const SizedBox(height: 40),
              const SizedBox(
                width: 28,
                height: 28,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white70),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
