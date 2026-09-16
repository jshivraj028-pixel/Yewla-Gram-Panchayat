import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../core/localization/app_locale.dart';
import '../../models/complaint_model.dart';
import '../../providers/auth_provider.dart';
import '../../services/complaint_service.dart';
import '../../widgets/status_badge.dart';
import '../../core/utils/file_downloader.dart';

class ComplaintDetailScreen extends StatefulWidget {
  final String complaintId;

  const ComplaintDetailScreen({super.key, required this.complaintId});

  @override
  State<ComplaintDetailScreen> createState() => _ComplaintDetailScreenState();
}

class _ComplaintDetailScreenState extends State<ComplaintDetailScreen> {
  ComplaintModel? _complaint;
  bool _isLoading = true;
  bool _isLiking = false;
  bool _isPostingComment = false;
  final TextEditingController _commentController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadDetails();
  }

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  Future<void> _loadDetails() async {
    setState(() => _isLoading = true);
    final comp = await ComplaintService.getComplaintById(widget.complaintId);
    if (mounted) {
      setState(() {
        _complaint = comp;
        _isLoading = false;
      });
    }
  }

  Future<void> _toggleLike() async {
    if (_complaint == null || _isLiking) return;
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final currentUserId = auth.user?.id ?? '';
    if (currentUserId.isEmpty) return;

    setState(() => _isLiking = true);

    // Optimistic local update
    final oldLikes = List<String>.from(_complaint!.likes);
    final isLikedNow = oldLikes.contains(currentUserId);
    if (isLikedNow) {
      oldLikes.remove(currentUserId);
    } else {
      oldLikes.add(currentUserId);
    }

    setState(() {
      _complaint = _complaint!.copyWith(likes: oldLikes);
    });

    try {
      final serverLikes = await ComplaintService.toggleLike(_complaint!.id);
      if (serverLikes != null && mounted) {
        setState(() {
          _complaint = _complaint!.copyWith(likes: serverLikes);
        });
      }
    } catch (_) {} finally {
      if (mounted) setState(() => _isLiking = false);
    }
  }

  Future<void> _addComment() async {
    final text = _commentController.text.trim();
    if (_complaint == null || text.isEmpty || _isPostingComment) return;

    setState(() => _isPostingComment = true);
    try {
      final updatedComments = await ComplaintService.addComment(_complaint!.id, text);
      if (updatedComments != null && mounted) {
        setState(() {
          _complaint = _complaint!.copyWith(comments: updatedComments);
          _commentController.clear();
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to post comment: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isPostingComment = false);
    }
  }

  Future<void> _deleteComment(String commentId) async {
    if (_complaint == null) return;
    try {
      final updatedComments = await ComplaintService.deleteComment(_complaint!.id, commentId);
      if (updatedComments != null && mounted) {
        setState(() {
          _complaint = _complaint!.copyWith(comments: updatedComments);
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to delete comment: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _downloadReceipt() async {
    if (_complaint == null) return;
    try {
      final fileName = 'Receipt_${_complaint!.complaintId}.pdf';
      final downloadUrl = '${AppConstants.baseUrl}/complaints/${_complaint!.id}/receipt';

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Downloading Receipt for ${_complaint!.complaintId}... / पावती डाऊनलोड होत आहे...'),
          backgroundColor: AppConstants.primary,
          duration: const Duration(seconds: 2),
        ),
      );

      await downloadFileUniversal(downloadUrl, fileName);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Download failed: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Complaint Details')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_complaint == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Complaint Details')),
        body: const Center(child: Text('Complaint not found')),
      );
    }

    final c = _complaint!;
    final auth = Provider.of<AuthProvider>(context);
    final currentUserId = auth.user?.id ?? '';
    final isLiked = c.isLikedBy(currentUserId);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? Colors.white : AppConstants.textPrimary;
    final textSecondary = isDark ? const Color(0xFFCBD5E1) : AppConstants.textSecondary;
    final cardBg = isDark ? const Color(0xFF1E293B) : const Color(0xFFF8FAFC);
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);

    return Scaffold(
      appBar: AppBar(
        title: Text(c.complaintId),
        actions: [
          IconButton(
            icon: const Icon(Icons.download_rounded),
            tooltip: 'Download Receipt / पावती डाऊनलोड',
            onPressed: _downloadReceipt,
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadDetails,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Citizen Complainant Header Card
            Card(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
                side: BorderSide(color: borderColor),
              ),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 20,
                      backgroundColor: AppConstants.primary.withOpacity(0.15),
                      child: Text(
                        c.citizenName.isNotEmpty ? c.citizenName[0].toUpperCase() : 'C',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppConstants.primary,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            c.citizenName,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: textPrimary,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Ward ${c.citizenWard ?? c.wardNumber}${c.citizenMobile.isNotEmpty ? ' • ${c.citizenMobile}' : ''}',
                            style: TextStyle(
                              fontSize: 12,
                              color: textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFFECFDF5),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: const Color(0xFFA7F3D0)),
                      ),
                      child: const Text(
                        'तक्रारदार',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF065F46),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Header Complaint Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF1E293B) : Colors.grey.shade100,
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: isDark ? const Color(0xFF334155) : Colors.grey.shade300),
                          ),
                          child: Text(
                            c.complaintId,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                        ),
                        StatusBadge(status: c.status, isLarge: true),
                      ],
                    ),
                    const SizedBox(height: 14),
                    Text(
                      c.title,
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: textPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      c.description,
                      style: TextStyle(
                        fontSize: 14,
                        color: textSecondary,
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 14),
                    Divider(height: 1, color: borderColor),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        const Icon(Icons.category_outlined, size: 16, color: AppConstants.textSecondary),
                        const SizedBox(width: 6),
                        Text(
                          'Category: ${c.category}',
                          style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600),
                        ),
                        const Spacer(),
                        const Icon(Icons.location_on_outlined, size: 16, color: AppConstants.textSecondary),
                        const SizedBox(width: 4),
                        Text(
                          'Ward ${c.wardNumber}',
                          style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(Icons.place_outlined, size: 16, color: AppConstants.textSecondary),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            c.location,
                            style: const TextStyle(fontSize: 12.5, color: AppConstants.textSecondary),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 14),
                    Divider(height: 1, color: borderColor),
                    const SizedBox(height: 8),

                    // Like & Comment Action Buttons Bar
                    Row(
                      children: [
                        ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: isLiked ? const Color(0xFFFFF1F2) : cardBg,
                            foregroundColor: isLiked ? Colors.redAccent : textPrimary,
                            elevation: 0,
                            side: BorderSide(
                              color: isLiked ? Colors.redAccent.shade100 : borderColor,
                            ),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          ),
                          onPressed: _toggleLike,
                          icon: Icon(
                            isLiked ? Icons.favorite : Icons.favorite_border,
                            size: 18,
                            color: isLiked ? Colors.redAccent : textSecondary,
                          ),
                          label: Text(
                            '${c.likesCount} ${c.likesCount == 1 ? "Like" : "Likes"}',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          decoration: BoxDecoration(
                            color: cardBg,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: borderColor),
                          ),
                          child: Row(
                            children: [
                              Icon(Icons.chat_bubble_outline, size: 17, color: textSecondary),
                              const SizedBox(width: 6),
                              Text(
                                '${c.commentsCount} ${c.commentsCount == 1 ? "Comment" : "Comments"}',
                                style: TextStyle(
                                  fontSize: 12.5,
                                  fontWeight: FontWeight.bold,
                                  color: textPrimary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppConstants.primary,
                          side: const BorderSide(color: AppConstants.primary),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          padding: const EdgeInsets.symmetric(vertical: 10),
                        ),
                        onPressed: _downloadReceipt,
                        icon: const Icon(Icons.download_rounded, size: 18),
                        label: const Text(
                          'Download Acknowledgment Receipt / पोचपावती',
                          style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Assigned Officer Card (if assigned)
            if (c.assignedToName != null && c.assignedToName!.isNotEmpty) ...[
              Card(
                color: Colors.indigo.shade50,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                  side: BorderSide(color: Colors.indigo.shade200),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: Colors.indigo.shade600,
                        foregroundColor: Colors.white,
                        child: const Icon(Icons.badge_outlined),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              AppLocale.t('assignedOfficer'),
                              style: TextStyle(
                                fontSize: 11,
                                color: Colors.indigo.shade900,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              c.assignedToName!,
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
            ],

            // Photo preview if available
            if (c.photo.isNotEmpty) ...[
              Card(
                clipBehavior: Clip.antiAlias,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Padding(
                      padding: EdgeInsets.all(12),
                      child: Text(
                        'Attached Photo',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                    ),
                    Image.network(
                      c.photo.startsWith('http')
                          ? c.photo
                          : '${AppConstants.baseUrl.replaceAll('/api', '')}${c.photo}',
                      height: 180,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        height: 120,
                        color: Colors.grey.shade100,
                        child: const Center(child: Text('Photo preview unavailable')),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],

            // Status Timeline
            Text(
              AppLocale.t('statusTimeline'),
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: textPrimary,
              ),
            ),
            const SizedBox(height: 12),

            Card(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
                child: c.history.isEmpty
                    ? const Center(child: Text('No status history available yet.'))
                    : ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: c.history.length,
                        itemBuilder: (ctx, i) {
                          final step = c.history[i];
                          final isLast = i == c.history.length - 1;

                          return Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Column(
                                children: [
                                  Container(
                                    width: 24,
                                    height: 24,
                                    decoration: BoxDecoration(
                                      color: isLast ? AppConstants.primary : Colors.grey.shade300,
                                      shape: BoxShape.circle,
                                    ),
                                    child: Center(
                                      child: Icon(
                                        isLast ? Icons.check : Icons.circle,
                                        size: isLast ? 14 : 8,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                  if (!isLast)
                                    Container(
                                      width: 2,
                                      height: 50,
                                      color: Colors.grey.shade300,
                                    ),
                                ],
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Padding(
                                  padding: const EdgeInsets.only(bottom: 20),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          StatusBadge(status: step.newStatus),
                                          Text(
                                            '${step.createdAt.day}/${step.createdAt.month}/${step.createdAt.year}',
                                            style: const TextStyle(
                                              fontSize: 11,
                                              color: AppConstants.textSecondary,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 6),
                                      if (step.remark.isNotEmpty)
                                        Text(
                                          step.remark,
                                          style: TextStyle(fontSize: 13, color: textPrimary),
                                        ),
                                      const SizedBox(height: 2),
                                      Text(
                                        'By: ${step.changedByName} (${step.changedByRole})',
                                        style: TextStyle(fontSize: 11, color: textSecondary),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          );
                        },
                      ),
              ),
            ),
            const SizedBox(height: 24),

            // Public Comments & Discussion Section
            Row(
              children: [
                Icon(Icons.forum_outlined, size: 20, color: AppConstants.primary),
                const SizedBox(width: 8),
                Text(
                  'सार्वजनिक प्रतिक्रिया व चर्चा (${c.comments.length})',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: textPrimary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            Card(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: borderColor),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Post Comment Input Field
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _commentController,
                            textCapitalization: TextCapitalization.sentences,
                            style: TextStyle(fontSize: 13, color: textPrimary),
                            decoration: InputDecoration(
                              hintText: AppLocale.t('writeComment'),
                              hintStyle: TextStyle(fontSize: 12.5, color: textSecondary),
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 14,
                                vertical: 10,
                              ),
                              filled: true,
                              fillColor: cardBg,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(24),
                                borderSide: BorderSide(color: borderColor),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        IconButton(
                          style: IconButton.styleFrom(
                            backgroundColor: AppConstants.primary,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.all(10),
                          ),
                          icon: _isPostingComment
                              ? const SizedBox(
                                  width: 16,
                                  height: 16,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.white,
                                  ),
                                )
                              : const Icon(Icons.send_rounded, size: 18),
                          onPressed: _isPostingComment ? null : _addComment,
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Divider(height: 1),
                    const SizedBox(height: 12),

                    // Comments List
                    if (c.comments.isEmpty) ...[
                      Center(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 20),
                          child: Text(
                            'अद्याप कोणतीही प्रतिक्रिया नाही. पहिली प्रतिक्रिया द्या!',
                            style: TextStyle(fontSize: 12.5, color: textSecondary),
                          ),
                        ),
                      ),
                    ] else ...[
                      ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: c.comments.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 10),
                        itemBuilder: (ctx, idx) {
                          final comment = c.comments[idx];
                          final canDelete = comment.userId == currentUserId;

                          return Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: cardBg,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: borderColor),
                            ),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                CircleAvatar(
                                  radius: 14,
                                  backgroundColor: AppConstants.primary.withOpacity(0.2),
                                  child: Text(
                                    comment.userName.isNotEmpty
                                        ? comment.userName[0].toUpperCase()
                                        : 'U',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 11,
                                      color: AppConstants.primary,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Row(
                                            children: [
                                              Text(
                                                comment.userName,
                                                style: TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 12.5,
                                                  color: textPrimary,
                                                ),
                                              ),
                                              if (comment.userRole != 'citizen') ...[
                                                const SizedBox(width: 6),
                                                Container(
                                                  padding: const EdgeInsets.symmetric(
                                                    horizontal: 5,
                                                    vertical: 1,
                                                  ),
                                                  decoration: BoxDecoration(
                                                    color: Colors.indigo.shade50,
                                                    borderRadius: BorderRadius.circular(4),
                                                  ),
                                                  child: Text(
                                                    comment.userRole.toUpperCase(),
                                                    style: TextStyle(
                                                      fontSize: 9,
                                                      fontWeight: FontWeight.bold,
                                                      color: Colors.indigo.shade800,
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ],
                                          ),
                                          if (canDelete)
                                            InkWell(
                                              onTap: () => _deleteComment(comment.id),
                                              child: const Icon(
                                                Icons.delete_outline,
                                                size: 16,
                                                color: Colors.redAccent,
                                              ),
                                            ),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        comment.text,
                                        style: TextStyle(fontSize: 13, color: textPrimary),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        '${comment.createdAt.day}/${comment.createdAt.month}/${comment.createdAt.year}',
                                        style: TextStyle(fontSize: 10.5, color: textSecondary),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
