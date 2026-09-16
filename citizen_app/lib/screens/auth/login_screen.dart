import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../core/localization/app_locale.dart';
import '../../providers/auth_provider.dart';
import '../../providers/locale_provider.dart';
import '../main_navigation_screen.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _identifierController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _identifierController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.login(
      _identifierController.text.trim(),
      _passwordController.text,
    );

    if (!mounted) return;

    if (success) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(auth.errorMessage ?? 'Login failed. Please check credentials.'),
          backgroundColor: Colors.red.shade700,
        ),
      );
    }
  }

  void _fillDemoCredentials() {
    setState(() {
      _identifierController.text = 'citizen@yewlagp.in';
      _passwordController.text = 'CitizenPassword123!';
    });
  }

  @override
  Widget build(BuildContext context) {
    final locale = Provider.of<LocaleProvider>(context);
    final auth = Provider.of<AuthProvider>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? Colors.white : AppConstants.textPrimary;
    final textSecondary = isDark ? const Color(0xFF94A3B8) : AppConstants.textSecondary;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          TextButton.icon(
            onPressed: () => locale.toggleLanguage(),
            icon: Icon(Icons.language, size: 18, color: isDark ? const Color(0xFF34D399) : AppConstants.primary),
            label: Text(
              locale.isMarathi ? 'English' : 'मराठी',
              style: TextStyle(
                color: isDark ? const Color(0xFF34D399) : AppConstants.primary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: (isDark ? const Color(0xFF10B981) : AppConstants.primary).withOpacity(0.15),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.account_balance,
                      size: 40,
                      color: isDark ? const Color(0xFF34D399) : AppConstants.primary,
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                Center(
                  child: Text(
                    AppLocale.t('login'),
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: textPrimary,
                    ),
                  ),
                ),
                const SizedBox(height: 6),
                Center(
                  child: Text(
                    AppLocale.t('loginSubtitle'),
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 13,
                      color: textSecondary,
                    ),
                  ),
                ),
                const SizedBox(height: 32),

                // Identifier Field
                Text(
                  AppLocale.t('mobileOrEmail'),
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: textPrimary,
                  ),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _identifierController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    hintText: 'e.g. 9876543220 or citizen@yewlagp.in',
                    prefixIcon: Icon(Icons.person_outline),
                  ),
                  validator: (val) {
                    if (val == null || val.trim().isEmpty) {
                      return 'Please enter mobile number or email';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 18),

                // Password Field
                Text(
                  AppLocale.t('password'),
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: textPrimary,
                  ),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  style: TextStyle(color: textPrimary),
                  decoration: InputDecoration(
                    hintText: 'Enter your password',
                    hintStyle: TextStyle(color: textSecondary),
                    prefixIcon: const Icon(Icons.lock_outline),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword ? Icons.visibility_off : Icons.visibility,
                        color: textSecondary,
                      ),
                      onPressed: () {
                        setState(() => _obscurePassword = !_obscurePassword);
                      },
                    ),
                  ),
                  validator: (val) {
                    if (val == null || val.isEmpty) {
                      return 'Please enter password';
                    }
                    if (val.length < 6) {
                      return 'Password must be at least 6 characters';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 24),

                // Login Button
                ElevatedButton(
                  onPressed: auth.isLoading ? null : _handleLogin,
                  child: auth.isLoading
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.5,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : Text(AppLocale.t('login')),
                ),
                const SizedBox(height: 16),

                // Quick Demo Auto-fill Helper Card
                InkWell(
                  onTap: _fillDemoCredentials,
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF451A03).withOpacity(0.4) : Colors.amber.shade50,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: isDark ? Colors.amber.shade700 : Colors.amber.shade300),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.touch_app, size: 16, color: AppConstants.accent),
                        const SizedBox(width: 8),
                        Text(
                          'Fill Demo Citizen Credentials (Auto-fill)',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: isDark ? const Color(0xFFFDE68A) : AppConstants.accent,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 28),

                // Register Link
                Center(
                  child: TextButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const RegisterScreen()),
                      );
                    },
                    child: Text(
                      AppLocale.t('dontHaveAccount'),
                      style: const TextStyle(
                        color: AppConstants.primary,
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
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
