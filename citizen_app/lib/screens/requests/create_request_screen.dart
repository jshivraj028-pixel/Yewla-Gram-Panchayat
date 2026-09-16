import 'package:flutter/material.dart';
import '../../core/constants/app_constants.dart';
import '../../services/request_service.dart';

class CreateRequestScreen extends StatefulWidget {
  const CreateRequestScreen({super.key});

  @override
  State<CreateRequestScreen> createState() => _CreateRequestScreenState();
}

class _CreateRequestScreenState extends State<CreateRequestScreen> {
  final _formKey = GlobalKey<FormState>();
  final _subjectController = TextEditingController();
  final _detailsController = TextEditingController();

  String _selectedType = AppConstants.requestTypes.first;
  bool _isSubmitting = false;

  @override
  void dispose() {
    _subjectController.dispose();
    _detailsController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    final res = await RequestService.createRequest(
      requestType: _selectedType,
      subject: _subjectController.text.trim(),
      details: _detailsController.text.trim(),
    );

    setState(() => _isSubmitting = false);

    if (!mounted) return;

    if (res.success) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => AlertDialog(
          title: Row(
            children: const [
              Icon(Icons.check_circle, color: AppConstants.statusResolved),
              SizedBox(width: 8),
              Text('Application Submitted'),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Application ID: ${res.data != null ? res.data['requestId'] : 'Generated'}',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppConstants.primary),
              ),
              const SizedBox(height: 8),
              const Text(
                'Your request has been forwarded to the Gram Panchayat verification desk. You will receive notifications on status updates.',
                style: TextStyle(fontSize: 13),
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
        SnackBar(
          content: Text(res.message.isNotEmpty ? res.message : 'Submission failed. Try again.'),
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
        title: const Text('Apply for Service / अर्ज करा'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Service Request Type / सेवेचा प्रकार',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: textPrimary),
              ),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                isExpanded: true,
                value: _selectedType,
                dropdownColor: isDark ? const Color(0xFF1E293B) : Colors.white,
                style: TextStyle(color: textPrimary, fontSize: 13.5),
                decoration: const InputDecoration(
                  prefixIcon: Icon(Icons.assignment_outlined),
                ),
                items: AppConstants.requestTypes.map((t) {
                  return DropdownMenuItem(
                    value: t,
                    child: Text(
                      t,
                      style: TextStyle(fontSize: 13.5, color: textPrimary),
                      overflow: TextOverflow.ellipsis,
                    ),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedType = val);
                },
              ),
              const SizedBox(height: 18),

              Text(
                'Application Subject / विषय',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: textPrimary),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _subjectController,
                style: TextStyle(color: textPrimary),
                decoration: InputDecoration(
                  hintText: 'e.g. Verification of birth record for child',
                  hintStyle: TextStyle(color: textSecondary),
                  prefixIcon: const Icon(Icons.subject),
                ),
                validator: (val) => (val == null || val.trim().isEmpty) ? 'Please enter subject' : null,
              ),
              const SizedBox(height: 18),

              Text(
                'Applicant Details & Remarks / तपशील',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: textPrimary),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _detailsController,
                maxLines: 4,
                style: TextStyle(color: textPrimary),
                decoration: InputDecoration(
                  hintText: 'Mention certificate numbers, family names, property numbers or relevant verification details...',
                  hintStyle: TextStyle(color: textSecondary),
                ),
                validator: (val) => (val == null || val.trim().isEmpty) ? 'Please provide details' : null,
              ),
              const SizedBox(height: 18),

              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E3A8A).withOpacity(0.3) : Colors.blue.shade50,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: isDark ? const Color(0xFF3B82F6).withOpacity(0.5) : Colors.blue.shade200),
                ),
                child: Row(
                  children: [
                    Icon(Icons.info_outline, color: isDark ? const Color(0xFF93C5FD) : Colors.blue, size: 20),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Note: Official verification will be processed by Gram Sevak within 3-5 working days.',
                        style: TextStyle(fontSize: 12, color: isDark ? const Color(0xFF93C5FD) : Colors.blue.shade900),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

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
                    : const Text('Submit Application / अर्ज सादर करा'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
