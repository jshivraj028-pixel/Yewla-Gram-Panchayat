import 'dart:typed_data';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../core/localization/app_locale.dart';
import '../../providers/auth_provider.dart';
import '../../providers/locale_provider.dart';
import '../../services/auth_service.dart';
import '../auth/login_screen.dart';
import '../complaints/complaints_list_screen.dart';
import '../notifications/notifications_screen.dart';
import '../requests/service_requests_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isUploading = false;

  Future<void> _pickAndUploadImage(ImageSource source) async {
    try {
      final picker = ImagePicker();
      final XFile? pickedFile = await picker.pickImage(
        source: source,
        maxWidth: 2048,
        maxHeight: 2048,
        imageQuality: 95, // High quality, crisp resolution
      );

      if (pickedFile == null) return;

      setState(() => _isUploading = true);

      final auth = Provider.of<AuthProvider>(context, listen: false);
      final Uint8List bytes = await pickedFile.readAsBytes();
      String fileName = pickedFile.name.isNotEmpty ? pickedFile.name : 'avatar.jpg';
      if (!fileName.contains('.')) {
        fileName = '$fileName.jpg';
      }

      final success = await auth.updateProfile(
        fileBytes: bytes,
        filePath: kIsWeb ? null : pickedFile.path,
        fileName: fileName,
      );

      if (!mounted) return;

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: const [
                Icon(Icons.check_circle, color: Colors.white),
                SizedBox(width: 8),
                Expanded(
                  child: Text('प्रोफाइल फोटो यशस्वीरित्या अपडेट केला! (Photo updated successfully)'),
                ),
              ],
            ),
            backgroundColor: Colors.green.shade700,
            behavior: SnackBarBehavior.floating,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(auth.errorMessage ?? 'फोटो अपलोड अयशस्वी (Upload failed)'),
            backgroundColor: Colors.red.shade700,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('त्रुटी (Error): $e'),
            backgroundColor: Colors.red.shade700,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isUploading = false);
      }
    }
  }

  Future<void> _removeAvatar() async {
    setState(() => _isUploading = true);
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.updateProfile(avatar: '');
    if (mounted) {
      setState(() => _isUploading = false);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('प्रोफाइल फोटो काढला गेला (Photo removed)'),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  void _showAvatarOptionsSheet(BuildContext context, bool hasAvatar) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textColor = isDark ? Colors.white : AppConstants.textPrimary;

    showModalBottomSheet(
      context: context,
      backgroundColor: bgColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.withOpacity(0.4),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'प्रोफाइल फोटो निवडा / Set Profile Picture',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'उत्कृष्ट गुणवत्तेचा फोटो (HD Quality Photo)',
                style: TextStyle(fontSize: 13, color: isDark ? Colors.white70 : AppConstants.textSecondary),
              ),
              const SizedBox(height: 16),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.purple.withOpacity(0.12),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.photo_library, color: Colors.purple),
                ),
                title: Text(
                  kIsWeb ? 'गॅलरी / कम्प्युटरमधून निवडा (Choose File)' : 'गॅलरी (Choose from Gallery)',
                  style: TextStyle(fontWeight: FontWeight.w600, color: textColor),
                ),
                subtitle: const Text('डिव्हाइस / गॅलरीतून HD फोटो निवडा'),
                onTap: () {
                  Navigator.pop(ctx);
                  _pickAndUploadImage(ImageSource.gallery);
                },
              ),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.blue.withOpacity(0.12),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.camera_alt, color: Colors.blue),
                ),
                title: Text('कॅमेरा (Take Photo)', style: TextStyle(fontWeight: FontWeight.w600, color: textColor)),
                subtitle: const Text('कॅमेऱ्याने त्वरित फोटो काढा'),
                onTap: () {
                  Navigator.pop(ctx);
                  _pickAndUploadImage(ImageSource.camera);
                },
              ),
              if (hasAvatar)
                ListTile(
                  leading: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.red.withOpacity(0.12),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.delete_outline, color: Colors.red),
                  ),
                  title: const Text('फोटो काढून टाका (Remove Photo)',
                      style: TextStyle(fontWeight: FontWeight.w600, color: Colors.red)),
                  onTap: () {
                    Navigator.pop(ctx);
                    _removeAvatar();
                  },
                ),
            ],
          ),
        ),
      ),
    );
  }

  void _showEditProfileDialog(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final user = auth.user;
    final nameController = TextEditingController(text: user?.name ?? '');
    final emailController = TextEditingController(text: user?.email ?? '');
    final addressController = TextEditingController(text: user?.address ?? '');
    int selectedWard = user?.wardNumber ?? 1;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (dialogCtx, setDialogState) => AlertDialog(
          title: const Text('माहिती अपडेट करा / Edit Profile'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(labelText: 'नाव (Full Name)'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(labelText: 'ईमेल (Email)'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: addressController,
                  decoration: const InputDecoration(labelText: 'पत्ता (Address)'),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<int>(
                  value: selectedWard,
                  decoration: const InputDecoration(labelText: 'प्रभाग क्रमांक (Ward No.)'),
                  items: AppConstants.wardNumbers.map((w) {
                    return DropdownMenuItem<int>(
                      value: w,
                      child: Text('Ward No. $w'),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) setDialogState(() => selectedWard = val);
                  },
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: Text(AppLocale.t('cancel')),
            ),
            ElevatedButton(
              onPressed: () async {
                final newName = nameController.text.trim();
                final newEmail = emailController.text.trim();
                final newAddress = addressController.text.trim();

                if (newName.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('नाव आवश्यक आहे')),
                  );
                  return;
                }

                Navigator.pop(ctx);
                setState(() => _isUploading = true);

                final success = await auth.updateProfile(
                  name: newName,
                  email: newEmail,
                  address: newAddress,
                  wardNumber: selectedWard,
                );

                if (mounted) {
                  setState(() => _isUploading = false);
                  if (success) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('माहिती यशस्वीरित्या अपडेट केली!'),
                        backgroundColor: Colors.green,
                      ),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(auth.errorMessage ?? 'अपडेट अयशस्वी'),
                        backgroundColor: Colors.red,
                      ),
                    );
                  }
                }
              },
              child: Text(AppLocale.t('save')),
            ),
          ],
        ),
      ),
    );
  }

  void _showChangePasswordDialog(BuildContext context) {
    final currentPassController = TextEditingController();
    final newPassController = TextEditingController();
    bool isSubmitting = false;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (dialogCtx, setDialogState) => AlertDialog(
          title: Text(AppLocale.t('changePassword')),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: currentPassController,
                obscureText: true,
                decoration: const InputDecoration(labelText: 'Current Password'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: newPassController,
                obscureText: true,
                decoration: const InputDecoration(labelText: 'New Password (min 6 chars)'),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: isSubmitting ? null : () => Navigator.pop(ctx),
              child: Text(AppLocale.t('cancel')),
            ),
            ElevatedButton(
              onPressed: isSubmitting
                  ? null
                  : () async {
                      final currentPass = currentPassController.text.trim();
                      final newPass = newPassController.text.trim();

                      if (currentPass.isEmpty || newPass.length < 6) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('नवीन पासवर्ड किमान ६ अक्षरांचा असावा')),
                        );
                        return;
                      }

                      setDialogState(() => isSubmitting = true);
                      final res = await AuthService.changePassword(currentPass, newPass);
                      setDialogState(() => isSubmitting = false);

                      if (ctx.mounted) Navigator.pop(ctx);

                      if (context.mounted) {
                        if (res.success) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('पासवर्ड यशस्वीरित्या बदलला!'),
                              backgroundColor: Colors.green,
                            ),
                          );
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(res.message),
                              backgroundColor: Colors.red,
                            ),
                          );
                        }
                      }
                    },
              child: isSubmitting
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : Text(AppLocale.t('save')),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFallbackInitial(String? name) {
    final initial = (name != null && name.trim().isNotEmpty) ? name.trim()[0].toUpperCase() : 'C';
    return Container(
      color: AppConstants.primary.withOpacity(0.15),
      alignment: Alignment.center,
      child: Text(
        initial,
        style: const TextStyle(
          fontSize: 36,
          fontWeight: FontWeight.bold,
          color: AppConstants.primary,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final locale = Provider.of<LocaleProvider>(context);
    final user = auth.user;

    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? Colors.white : AppConstants.textPrimary;
    final subTextColor = isDark ? const Color(0xFFCBD5E1) : AppConstants.textSecondary;
    final iconColor = isDark ? const Color(0xFF94A3B8) : AppConstants.textSecondary;
    final dividerColor = isDark ? const Color(0xFF334155) : AppConstants.border;

    final hasAvatar = user?.avatar?.isNotEmpty == true;
    final avatarUrl = hasAvatar ? AppConstants.getImageUrl(user?.avatar) : '';

    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocale.t('profile')),
        actions: [
          IconButton(
            tooltip: 'Edit Profile Details',
            icon: const Icon(Icons.edit_outlined),
            onPressed: () => _showEditProfileDialog(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Citizen Avatar & Info Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    // High Quality Profile Picture with Camera Action Button
                    Center(
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          GestureDetector(
                            onTap: _isUploading ? null : () => _showAvatarOptionsSheet(context, hasAvatar),
                            child: Container(
                              width: 96,
                              height: 96,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: Theme.of(context).primaryColor,
                                  width: 3,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.12),
                                    blurRadius: 10,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: ClipOval(
                                child: hasAvatar
                                    ? Image.network(
                                        avatarUrl,
                                        key: ValueKey(avatarUrl),
                                        fit: BoxFit.cover,
                                        width: 96,
                                        height: 96,
                                        filterQuality: FilterQuality.high,
                                        errorBuilder: (ctx, err, stack) => _buildFallbackInitial(user?.name),
                                        loadingBuilder: (ctx, child, progress) {
                                          if (progress == null) return child;
                                          return Center(
                                            child: CircularProgressIndicator(
                                              value: progress.expectedTotalBytes != null
                                                  ? progress.cumulativeBytesLoaded / progress.expectedTotalBytes!
                                                  : null,
                                              strokeWidth: 2,
                                            ),
                                          );
                                        },
                                      )
                                    : _buildFallbackInitial(user?.name),
                              ),
                            ),
                          ),
                          if (_isUploading)
                            Container(
                              width: 96,
                              height: 96,
                              decoration: const BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.black45,
                              ),
                              child: const Center(
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 3,
                                ),
                              ),
                            ),
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: Material(
                              color: Colors.transparent,
                              child: InkWell(
                                onTap: _isUploading ? null : () => _showAvatarOptionsSheet(context, hasAvatar),
                                borderRadius: BorderRadius.circular(20),
                                child: Container(
                                  padding: const EdgeInsets.all(7),
                                  decoration: BoxDecoration(
                                    color: Theme.of(context).primaryColor,
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: Theme.of(context).scaffoldBackgroundColor,
                                      width: 2.5,
                                    ),
                                    boxShadow: const [
                                      BoxShadow(
                                        color: Colors.black26,
                                        blurRadius: 4,
                                        offset: Offset(0, 2),
                                      ),
                                    ],
                                  ),
                                  child: const Icon(
                                    Icons.camera_alt,
                                    color: Colors.white,
                                    size: 16,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 8),
                    InkWell(
                      onTap: _isUploading ? null : () => _showAvatarOptionsSheet(context, hasAvatar),
                      borderRadius: BorderRadius.circular(12),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              hasAvatar ? Icons.edit_outlined : Icons.add_a_photo_outlined,
                              size: 14,
                              color: Theme.of(context).primaryColor,
                            ),
                            const SizedBox(width: 5),
                            Text(
                              hasAvatar ? 'फोटो बदला (Change Photo)' : 'फोटो सेट करा (Set Photo)',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: Theme.of(context).primaryColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      user?.name ?? 'Citizen',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: textColor,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Ward No. ${user?.wardNumber ?? 1} • Yewla Gram Panchayat',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 13,
                        color: subTextColor,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Divider(height: 1, color: dividerColor),
                    const SizedBox(height: 14),
                    Row(
                      children: [
                        Icon(Icons.phone_android, size: 18, color: iconColor),
                        const SizedBox(width: 10),
                        Text(
                          user?.mobile ?? 'N/A',
                          style: TextStyle(fontSize: 14, color: textColor),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    if (user?.email != null && user!.email.isNotEmpty) ...[
                      Row(
                        children: [
                          Icon(Icons.email_outlined, size: 18, color: iconColor),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              user.email,
                              style: TextStyle(fontSize: 14, color: textColor),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                    ],
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(Icons.home_outlined, size: 18, color: iconColor),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            (user != null && user.address.isNotEmpty) ? user.address : 'Yewla, Dist. Jalna',
                            style: TextStyle(fontSize: 14, color: textColor),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton.icon(
                        style: TextButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          visualDensity: VisualDensity.compact,
                        ),
                        onPressed: () => _showEditProfileDialog(context),
                        icon: const Icon(Icons.edit, size: 14),
                        label: const Text('माहिती संपादित करा (Edit)', style: TextStyle(fontSize: 12)),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 18),

            // Profile Actions
            Card(
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.language, color: AppConstants.primary),
                    title: Text(AppLocale.t('switchLanguage'), style: TextStyle(color: textColor)),
                    subtitle: Text(
                      locale.isMarathi ? 'मराठी निवडलेली आहे' : 'English active',
                      style: TextStyle(color: subTextColor),
                    ),
                    trailing: Switch(
                      value: locale.isMarathi,
                      activeColor: AppConstants.primary,
                      onChanged: (_) => locale.toggleLanguage(),
                    ),
                  ),
                  Divider(height: 1, color: dividerColor),
                  ListTile(
                    leading: const Icon(Icons.report_problem_outlined, color: Colors.orange),
                    title: Text(AppLocale.t('myComplaints'), style: TextStyle(color: textColor)),
                    trailing: Icon(Icons.arrow_forward_ios, size: 14, color: iconColor),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const ComplaintsListScreen()),
                      );
                    },
                  ),
                  Divider(height: 1, color: dividerColor),
                  ListTile(
                    leading: const Icon(Icons.assignment_outlined, color: Colors.blue),
                    title: Text(AppLocale.t('requests'), style: TextStyle(color: textColor)),
                    trailing: Icon(Icons.arrow_forward_ios, size: 14, color: iconColor),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const ServiceRequestsScreen()),
                      );
                    },
                  ),
                  Divider(height: 1, color: dividerColor),
                  ListTile(
                    leading: const Icon(Icons.notifications_outlined, color: Colors.teal),
                    title: Text('Notifications / सूचना', style: TextStyle(color: textColor)),
                    trailing: Icon(Icons.arrow_forward_ios, size: 14, color: iconColor),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const NotificationsScreen()),
                      );
                    },
                  ),
                  Divider(height: 1, color: dividerColor),
                  ListTile(
                    leading: Icon(Icons.lock_reset, color: iconColor),
                    title: Text(AppLocale.t('changePassword'), style: TextStyle(color: textColor)),
                    trailing: Icon(Icons.arrow_forward_ios, size: 14, color: iconColor),
                    onTap: () => _showChangePasswordDialog(context),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Logout Button
            OutlinedButton.icon(
              style: OutlinedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
                foregroundColor: Colors.red.shade600,
                side: BorderSide(color: Colors.red.shade300),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () async {
                final confirm = await showDialog<bool>(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Confirm Logout'),
                    content: const Text('Are you sure you want to logout from GramSeva?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(ctx, false),
                        child: Text(AppLocale.t('cancel')),
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                        onPressed: () => Navigator.pop(ctx, true),
                        child: Text(AppLocale.t('logout')),
                      ),
                    ],
                  ),
                );

                if (confirm == true) {
                  await auth.logout();
                  if (context.mounted) {
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(builder: (_) => const LoginScreen()),
                      (route) => false,
                    );
                  }
                }
              },
              icon: const Icon(Icons.logout),
              label: Text(
                AppLocale.t('logout'),
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'GramSeva v1.0.0 • Yewla Gram Panchayat, Dist. Jalna',
              style: TextStyle(fontSize: 11, color: subTextColor),
            ),
          ],
        ),
      ),
    );
  }
}
