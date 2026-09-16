import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../core/localization/app_locale.dart';
import '../../providers/auth_provider.dart';
import '../main_navigation_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _mobileController = TextEditingController();
  final _emailController = TextEditingController();
  final _addressController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  int _selectedWard = 1;
  bool _obscurePassword = true;

  @override
  void dispose() {
    _nameController.dispose();
    _mobileController.dispose();
    _emailController.dispose();
    _addressController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.register(
      name: _nameController.text.trim(),
      mobile: _mobileController.text.trim(),
      email: _emailController.text.trim().isNotEmpty ? _emailController.text.trim() : null,
      password: _passwordController.text,
      address: _addressController.text.trim(),
      wardNumber: _selectedWard,
    );

    if (!mounted) return;

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Registration successful! Welcome to GramSeva.'),
          backgroundColor: AppConstants.statusResolved,
        ),
      );
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
        (route) => false,
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(auth.errorMessage ?? 'Registration failed. Try again.'),
          backgroundColor: Colors.red.shade700,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? Colors.white : AppConstants.textPrimary;
    final textSecondary = isDark ? const Color(0xFF94A3B8) : AppConstants.textSecondary;

    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocale.t('register')),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  AppLocale.t('registerSubtitle'),
                  style: TextStyle(
                    fontSize: 13,
                    color: textSecondary,
                  ),
                ),
                const SizedBox(height: 24),

                // Name
                Text(AppLocale.t('fullName'), style: TextStyle(fontWeight: FontWeight.w600, color: textPrimary)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _nameController,
                  style: TextStyle(color: textPrimary),
                  decoration: InputDecoration(
                    hintText: 'e.g. Tukaram Shankar Patil',
                    hintStyle: TextStyle(color: textSecondary),
                    prefixIcon: const Icon(Icons.person_outline),
                  ),
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'Enter your full name' : null,
                ),
                const SizedBox(height: 16),

                // Mobile
                Text(AppLocale.t('mobileNumber'), style: TextStyle(fontWeight: FontWeight.w600, color: textPrimary)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _mobileController,
                  keyboardType: TextInputType.phone,
                  maxLength: 10,
                  style: TextStyle(color: textPrimary),
                  decoration: InputDecoration(
                    hintText: 'e.g. 9876543220',
                    hintStyle: TextStyle(color: textSecondary),
                    prefixIcon: const Icon(Icons.phone_android_outlined),
                    counterText: '',
                  ),
                  validator: (v) {
                    if (v == null || v.trim().length != 10) {
                      return 'Enter a valid 10-digit mobile number';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Email (Optional)
                Text(AppLocale.t('emailAddress'), style: TextStyle(fontWeight: FontWeight.w600, color: textPrimary)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  style: TextStyle(color: textPrimary),
                  decoration: InputDecoration(
                    hintText: 'e.g. citizen@yewlagp.in',
                    hintStyle: TextStyle(color: textSecondary),
                    prefixIcon: const Icon(Icons.mail_outline),
                  ),
                ),
                const SizedBox(height: 16),

                // Ward Number
                Text(AppLocale.t('wardNumber'), style: TextStyle(fontWeight: FontWeight.w600, color: textPrimary)),
                const SizedBox(height: 6),
                DropdownButtonFormField<int>(
                  isExpanded: true,
                  value: _selectedWard,
                  dropdownColor: isDark ? const Color(0xFF1E293B) : Colors.white,
                  style: TextStyle(color: textPrimary, fontSize: 13.5),
                  decoration: const InputDecoration(
                    prefixIcon: Icon(Icons.holiday_village_outlined),
                  ),
                  items: AppConstants.wardNumbers.map((w) {
                    return DropdownMenuItem<int>(
                      value: w,
                      child: Text(
                        'Ward No. $w (प्रभाग क्रमांक $w)',
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(color: textPrimary),
                      ),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedWard = val);
                  },
                ),
                const SizedBox(height: 16),

                // Residential Address
                Text(AppLocale.t('residentialAddress'), style: TextStyle(fontWeight: FontWeight.w600, color: textPrimary)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _addressController,
                  maxLines: 2,
                  style: TextStyle(color: textPrimary),
                  decoration: InputDecoration(
                    hintText: 'House no, Street name, Landmark, Yewla',
                    hintStyle: TextStyle(color: textSecondary),
                    prefixIcon: const Icon(Icons.home_outlined),
                  ),
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'Enter residential address' : null,
                ),
                const SizedBox(height: 16),

                // Password
                Text(AppLocale.t('password'), style: TextStyle(fontWeight: FontWeight.w600, color: textPrimary)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  style: TextStyle(color: textPrimary),
                  decoration: InputDecoration(
                    hintText: 'At least 6 characters',
                    hintStyle: TextStyle(color: textSecondary),
                    prefixIcon: const Icon(Icons.lock_outline),
                    suffixIcon: IconButton(
                      icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility, color: textSecondary),
                      onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                    ),
                  ),
                  validator: (v) => (v == null || v.length < 6) ? 'Password must be at least 6 characters' : null,
                ),
                const SizedBox(height: 16),

                // Confirm Password
                Text(AppLocale.t('confirmPassword'), style: TextStyle(fontWeight: FontWeight.w600, color: textPrimary)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _confirmPasswordController,
                  obscureText: _obscurePassword,
                  style: TextStyle(color: textPrimary),
                  decoration: InputDecoration(
                    hintText: 'Re-enter password',
                    hintStyle: TextStyle(color: textSecondary),
                    prefixIcon: const Icon(Icons.lock_outline),
                  ),
                  validator: (v) {
                    if (v != _passwordController.text) {
                      return 'Passwords do not match';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 28),

                // Submit
                ElevatedButton(
                  onPressed: auth.isLoading ? null : _handleRegister,
                  child: auth.isLoading
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.5,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : Text(AppLocale.t('register')),
                ),
                const SizedBox(height: 16),

                Center(
                  child: TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: Text(
                      AppLocale.t('alreadyHaveAccount'),
                      style: const TextStyle(
                        color: AppConstants.primary,
                        fontWeight: FontWeight.w600,
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
