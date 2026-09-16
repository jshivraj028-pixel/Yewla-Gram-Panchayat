import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../core/localization/app_locale.dart';
import '../../providers/auth_provider.dart';
import '../../providers/complaint_provider.dart';

class CreateComplaintScreen extends StatefulWidget {
  const CreateComplaintScreen({super.key});

  @override
  State<CreateComplaintScreen> createState() => _CreateComplaintScreenState();
}

class _CreateComplaintScreenState extends State<CreateComplaintScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  final _locationController = TextEditingController();

  String _selectedCategory = AppConstants.complaintCategories.first;
  late int _selectedWard;
  final String _selectedPriority = 'Medium';
  bool _isSubmitting = false;

  XFile? _selectedImage;
  Uint8List? _imageBytes;

  @override
  void initState() {
    super.initState();
    final auth = Provider.of<AuthProvider>(context, listen: false);
    _selectedWard = auth.user?.wardNumber ?? 1;
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final picker = ImagePicker();
      final picked = await picker.pickImage(
        source: source,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );
      if (picked != null) {
        final bytes = await picked.readAsBytes();
        setState(() {
          _selectedImage = picked;
          _imageBytes = bytes;
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Could not attach image: $e')),
      );
    }
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);
    final provider = Provider.of<ComplaintProvider>(context, listen: false);

    final success = await provider.submitComplaint(
      category: _selectedCategory,
      title: _titleController.text.trim(),
      description: _descController.text.trim(),
      location: _locationController.text.trim(),
      wardNumber: _selectedWard,
      priority: _selectedPriority,
      photoPath: kIsWeb ? null : _selectedImage?.path,
      photoBytes: _imageBytes,
      photoName: _selectedImage?.name,
    );

    setState(() => _isSubmitting = false);

    if (!mounted) return;

    if (success) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => AlertDialog(
          title: Row(
            children: const [
              Icon(Icons.check_circle, color: AppConstants.statusResolved),
              SizedBox(width: 8),
              Text('Submitted!'),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text(
                'Your complaint has been successfully registered with Yewla Gram Panchayat.',
                style: TextStyle(fontSize: 14),
              ),
              SizedBox(height: 8),
              Text(
                'आपली तक्रार यशस्वीरित्या नोंदवली गेली आहे. आपण प्रगती ट्रॅक करू शकता.',
                style: TextStyle(fontSize: 12.5, color: AppConstants.textSecondary),
              ),
            ],
          ),
          actions: [
            ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx);
                Navigator.pop(context, true);
              },
              child: const Text('OK / ठीक आहे'),
            ),
          ],
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Failed to submit complaint. Please check your network.'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? Colors.white : AppConstants.textPrimary;
    final textSecondary = isDark ? const Color(0xFF94A3B8) : AppConstants.textSecondary;

    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocale.t('newComplaint')),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Category
              Text(
                AppLocale.t('complaintCategory'),
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: textPrimary),
              ),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                isExpanded: true,
                value: _selectedCategory,
                dropdownColor: isDark ? const Color(0xFF1E293B) : Colors.white,
                style: TextStyle(color: textPrimary, fontSize: 13.5),
                decoration: const InputDecoration(
                  prefixIcon: Icon(Icons.category_outlined),
                ),
                items: AppConstants.complaintCategories.map((cat) {
                  return DropdownMenuItem(
                    value: cat,
                    child: Text(
                      '${AppLocale.t(cat)} ($cat)',
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(color: textPrimary),
                    ),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedCategory = val);
                },
              ),
              const SizedBox(height: 18),

              // Title
              Text(
                AppLocale.t('complaintTitle'),
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: textPrimary),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _titleController,
                style: TextStyle(color: textPrimary),
                decoration: InputDecoration(
                  hintText: 'e.g. Broken street light near ZP School',
                  hintStyle: TextStyle(color: textSecondary),
                  prefixIcon: const Icon(Icons.title),
                ),
                validator: (val) => (val == null || val.trim().isEmpty) ? 'Please enter a title' : null,
              ),
              const SizedBox(height: 18),

              // Description
              Text(
                AppLocale.t('complaintDescription'),
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: textPrimary),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _descController,
                maxLines: 4,
                style: TextStyle(color: textPrimary),
                decoration: InputDecoration(
                  hintText: 'Provide detailed information about the issue, affected area, and urgency...',
                  hintStyle: TextStyle(color: textSecondary),
                ),
                validator: (val) => (val == null || val.trim().isEmpty) ? 'Please describe the problem' : null,
              ),
              const SizedBox(height: 18),

              // Ward and Location
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    flex: 2,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(AppLocale.t('wardNumber'), style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: textPrimary)),
                        const SizedBox(height: 8),
                        DropdownButtonFormField<int>(
                          isExpanded: true,
                          value: _selectedWard,
                          dropdownColor: isDark ? const Color(0xFF1E293B) : Colors.white,
                          style: TextStyle(color: textPrimary, fontSize: 13.5),
                          decoration: const InputDecoration(
                            contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 16),
                          ),
                          items: AppConstants.wardNumbers.map((w) {
                            return DropdownMenuItem(
                              value: w,
                              child: Text('Ward $w', style: TextStyle(color: textPrimary)),
                            );
                          }).toList(),
                          onChanged: (val) {
                            if (val != null) setState(() => _selectedWard = val);
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 3,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(AppLocale.t('locationDescription'), style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: textPrimary)),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: _locationController,
                          style: TextStyle(color: textPrimary),
                          decoration: InputDecoration(
                            hintText: 'Landmark / Lane',
                            hintStyle: TextStyle(color: textSecondary),
                            prefixIcon: const Icon(Icons.location_on_outlined),
                          ),
                          validator: (val) => (val == null || val.trim().isEmpty) ? 'Enter location' : null,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),

              // Photo Attachment
              Text(
                AppLocale.t('attachPhoto'),
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: textPrimary),
              ),
              const SizedBox(height: 8),
              if (_imageBytes != null) ...[
                Stack(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.memory(
                        _imageBytes!,
                        height: 160,
                        width: double.infinity,
                        fit: BoxFit.cover,
                      ),
                    ),
                    Positioned(
                      top: 8,
                      right: 8,
                      child: CircleAvatar(
                        backgroundColor: Colors.black54,
                        radius: 16,
                        child: IconButton(
                          padding: EdgeInsets.zero,
                          icon: const Icon(Icons.close, size: 18, color: Colors.white),
                          onPressed: () {
                            setState(() {
                              _selectedImage = null;
                              _imageBytes = null;
                            });
                          },
                        ),
                      ),
                    ),
                  ],
                ),
              ] else ...[
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () => _pickImage(ImageSource.camera),
                        icon: const Icon(Icons.camera_alt_outlined),
                        label: const Text('Camera'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () => _pickImage(ImageSource.gallery),
                        icon: const Icon(Icons.photo_library_outlined),
                        label: const Text('Gallery'),
                      ),
                    ),
                  ],
                ),
              ],
              const SizedBox(height: 32),

              // Submit Button
              ElevatedButton(
                onPressed: _isSubmitting ? null : _handleSubmit,
                child: _isSubmitting
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.5,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : Text(AppLocale.t('submit')),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
