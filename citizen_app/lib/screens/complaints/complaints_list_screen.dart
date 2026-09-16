import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../core/localization/app_locale.dart';
import '../../models/complaint_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/complaint_provider.dart';
import '../../widgets/status_badge.dart';
import 'complaint_detail_screen.dart';
import 'create_complaint_screen.dart';

class ComplaintsListScreen extends StatefulWidget {
  const ComplaintsListScreen({super.key});

  @override
  State<ComplaintsListScreen> createState() => _ComplaintsListScreenState();
}

class _ComplaintsListScreenState extends State<ComplaintsListScreen> {
  String _selectedStatus = 'All';
  String _currentScope = 'all'; // 'all' (Community) or 'my' (My Complaints)

  final List<String> _statuses = [
    'All',
    'Pending',
    'Under Review',
    'In Progress',
    'Resolved',
    'Rejected',
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ComplaintProvider>(context, listen: false)
          .fetchComplaints(scope: _currentScope);
    });
  }

  IconData _getCategoryIcon(String category) {
    switch (category) {
      case 'Road':
        return Icons.edit_road;
      case 'Water':
        return Icons.water_drop;
      case 'Street Light':
        return Icons.lightbulb_outline;
      case 'Drainage':
        return Icons.water;
      case 'Garbage':
        return Icons.delete_outline;
      case 'Sanitation':
        return Icons.cleaning_services;
      case 'Electricity':
        return Icons.flash_on;
      default:
        return Icons.report_problem_outlined;
    }
  }

  void _showCommentsSheet(BuildContext context, ComplaintModel complaint, String currentUserId) {
    final commentController = TextEditingController();
    bool isPosting = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (modalContext, setModalState) {
            final provider = Provider.of<ComplaintProvider>(context);
            final currentComplaint = provider.complaints.firstWhere(
              (c) => c.id == complaint.id,
              orElse: () => complaint,
            );
            final comments = currentComplaint.comments;
            final isDark = Theme.of(context).brightness == Brightness.dark;
            final bgColor = isDark ? const Color(0xFF0F172A) : Colors.white;
            final cardColor = isDark ? const Color(0xFF1E293B) : const Color(0xFFF8FAFC);
            final textPrimary = isDark ? Colors.white : AppConstants.textPrimary;
            final textSecondary = isDark ? const Color(0xFF94A3B8) : AppConstants.textSecondary;

            return Container(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(modalContext).viewInsets.bottom,
              ),
              decoration: BoxDecoration(
                color: bgColor,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
              ),
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(modalContext).size.height * 0.75,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Handle bar & Header
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      margin: const EdgeInsets.symmetric(vertical: 10),
                      decoration: BoxDecoration(
                        color: isDark ? Colors.white24 : Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'सार्वजनिक प्रतिक्रिया (${comments.length})',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                color: textPrimary,
                              ),
                            ),
                            Text(
                              '${currentComplaint.complaintId} • ${currentComplaint.title}',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 11,
                                color: textSecondary,
                              ),
                            ),
                          ],
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, size: 20),
                          onPressed: () => Navigator.pop(modalContext),
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1),

                  // Comments list
                  Expanded(
                    child: comments.isEmpty
                        ? Center(
                            child: Padding(
                              padding: const EdgeInsets.all(24),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.chat_bubble_outline,
                                    size: 40,
                                    color: isDark ? Colors.white24 : Colors.grey.shade400,
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    'अद्याप कोणतीही प्रतिक्रिया नाही.',
                                    style: TextStyle(color: textSecondary, fontSize: 13),
                                  ),
                                  Text(
                                    'पहिली प्रतिक्रिया किंवा मत नोंदवा!',
                                    style: TextStyle(
                                      color: textSecondary,
                                      fontSize: 11,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          )
                        : ListView.separated(
                            padding: const EdgeInsets.all(16),
                            itemCount: comments.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 10),
                            itemBuilder: (_, index) {
                              final comment = comments[index];
                              final canDelete = comment.userId == currentUserId;

                              return Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: cardColor,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: isDark
                                        ? const Color(0xFF334155)
                                        : const Color(0xFFE2E8F0),
                                  ),
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
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Row(
                                                children: [
                                                  Text(
                                                    comment.userName,
                                                    style: TextStyle(
                                                      fontWeight: FontWeight.bold,
                                                      fontSize: 12,
                                                      color: textPrimary,
                                                    ),
                                                  ),
                                                  if (comment.userRole != 'citizen') ...[
                                                    const SizedBox(width: 6),
                                                    Container(
                                                      padding: const EdgeInsets.symmetric(
                                                          horizontal: 5, vertical: 1),
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
                                                  onTap: () async {
                                                    await provider.deleteComment(
                                                      currentComplaint.id,
                                                      comment.id,
                                                    );
                                                    setModalState(() {});
                                                  },
                                                  child: const Icon(
                                                    Icons.delete_outline,
                                                    size: 16,
                                                    color: Colors.redAccent,
                                                  ),
                                                ),
                                            ],
                                          ),
                                          const SizedBox(height: 3),
                                          Text(
                                            comment.text,
                                            style: TextStyle(
                                              fontSize: 12.5,
                                              color: textPrimary,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            '${comment.createdAt.day}/${comment.createdAt.month}/${comment.createdAt.year}',
                                            style: TextStyle(
                                              fontSize: 10,
                                              color: textSecondary,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                  ),

                  // Comment Input Bar
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: bgColor,
                      border: Border(
                        top: BorderSide(
                          color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                        ),
                      ),
                    ),
                    child: SafeArea(
                      child: Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: commentController,
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
                                fillColor: isDark
                                    ? const Color(0xFF1E293B)
                                    : const Color(0xFFF1F5F9),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(24),
                                  borderSide: BorderSide.none,
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
                            icon: isPosting
                                ? const SizedBox(
                                    width: 16,
                                    height: 16,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      color: Colors.white,
                                    ),
                                  )
                                : const Icon(Icons.send_rounded, size: 18),
                            onPressed: isPosting
                                ? null
                                : () async {
                                    final txt = commentController.text.trim();
                                    if (txt.isEmpty) return;

                                    setModalState(() => isPosting = true);
                                    final ok = await provider.addComment(
                                      currentComplaint.id,
                                      txt,
                                    );
                                    if (ok) {
                                      commentController.clear();
                                    }
                                    setModalState(() => isPosting = false);
                                  },
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final complaintProvider = Provider.of<ComplaintProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final currentUserId = authProvider.user?.id ?? '';
    final complaints = complaintProvider.complaints;

    final filteredComplaints = _selectedStatus == 'All'
        ? complaints
        : complaints.where((c) => c.status == _selectedStatus).toList();

    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? const Color(0xFFF1F5F9) : AppConstants.textPrimary;
    final textSecondary = isDark ? const Color(0xFF94A3B8) : AppConstants.textSecondary;
    final primaryColor = isDark ? const Color(0xFF34D399) : AppConstants.primary;
    final chipBg = isDark ? const Color(0xFF1E293B) : Colors.grey.shade100;
    final barBg = isDark ? const Color(0xFF0F172A) : Colors.white;
    final borderColor = isDark ? const Color(0xFF334155) : AppConstants.border;
    final badgeBg = isDark ? const Color(0xFF1E293B) : Colors.grey.shade100;
    final badgeBorder = isDark ? const Color(0xFF334155) : Colors.grey.shade300;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          _currentScope == 'all'
              ? AppLocale.t('communityComplaints')
              : AppLocale.t('myComplaints'),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const CreateComplaintScreen()),
          );
          if (result == true) {
            complaintProvider.fetchComplaints(scope: _currentScope);
          }
        },
        backgroundColor: AppConstants.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: Text(AppLocale.t('newComplaint')),
      ),
      body: Column(
        children: [
          // Community vs My Complaints Segment Switch
          Container(
            color: barBg,
            padding: const EdgeInsets.fromLTRB(16, 10, 16, 6),
            child: Container(
              height: 42,
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: borderColor),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: () {
                        if (_currentScope != 'all') {
                          setState(() => _currentScope = 'all');
                          complaintProvider.setScope('all');
                        }
                      },
                      borderRadius: BorderRadius.circular(9),
                      child: Container(
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: _currentScope == 'all'
                              ? primaryColor
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(9),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.public,
                              size: 15,
                              color: _currentScope == 'all'
                                  ? Colors.white
                                  : textSecondary,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              AppLocale.t('allComplaints'),
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: _currentScope == 'all'
                                    ? Colors.white
                                    : textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: InkWell(
                      onTap: () {
                        if (_currentScope != 'my') {
                          setState(() => _currentScope = 'my');
                          complaintProvider.setScope('my');
                        }
                      },
                      borderRadius: BorderRadius.circular(9),
                      child: Container(
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: _currentScope == 'my'
                              ? primaryColor
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(9),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.person_outline,
                              size: 15,
                              color: _currentScope == 'my'
                                  ? Colors.white
                                  : textSecondary,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              AppLocale.t('myComplaints'),
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: _currentScope == 'my'
                                    ? Colors.white
                                    : textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Filter Chips Row
          Container(
            height: 48,
            padding: const EdgeInsets.symmetric(vertical: 6),
            color: barBg,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _statuses.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (ctx, i) {
                final status = _statuses[i];
                final isSelected = _selectedStatus == status;
                return ChoiceChip(
                  label: Text(
                    status == 'All' ? AppLocale.t('all') : AppLocale.t(status),
                    style: TextStyle(
                      fontSize: 11.5,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                      color: isSelected ? Colors.white : textPrimary,
                    ),
                  ),
                  selected: isSelected,
                  selectedColor: isDark ? const Color(0xFF10B981) : AppConstants.primary,
                  backgroundColor: chipBg,
                  onSelected: (selected) {
                    if (selected) setState(() => _selectedStatus = status);
                  },
                );
              },
            ),
          ),
          Divider(height: 1, color: borderColor),

          // Complaints List
          Expanded(
            child: complaintProvider.isLoading
                ? const Center(child: CircularProgressIndicator())
                : filteredComplaints.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.assignment_turned_in_outlined,
                              size: 64,
                              color: isDark ? Colors.white38 : Colors.grey.shade400,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              _currentScope == 'my'
                                  ? 'तुम्ही अद्याप कोणतीही तक्रार नोंदवली नाही.'
                                  : 'No complaints found',
                              style: TextStyle(
                                fontSize: 15,
                                color: textSecondary,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            if (_currentScope == 'my') ...[
                              const SizedBox(height: 6),
                              Text(
                                'गाव समस्या पाहण्यासाठी "सर्व तक्रारी" टॅब पहा',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: primaryColor,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: () =>
                            complaintProvider.fetchComplaints(scope: _currentScope),
                        child: ListView.separated(
                          padding: const EdgeInsets.all(16),
                          itemCount: filteredComplaints.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 12),
                          itemBuilder: (ctx, i) {
                            final complaint = filteredComplaints[i];
                            final isLiked = complaint.isLikedBy(currentUserId);

                            return Card(
                              elevation: 1,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                                side: BorderSide(
                                  color: isDark
                                      ? const Color(0xFF334155)
                                      : const Color(0xFFE2E8F0),
                                ),
                              ),
                              child: InkWell(
                                onTap: () async {
                                  await Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => ComplaintDetailScreen(
                                        complaintId: complaint.id,
                                      ),
                                    ),
                                  );
                                  complaintProvider.fetchComplaints(scope: _currentScope);
                                },
                                borderRadius: BorderRadius.circular(16),
                                child: Padding(
                                  padding: const EdgeInsets.all(14),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      // Top Row: Complaint ID & Status
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 8, vertical: 3),
                                            decoration: BoxDecoration(
                                              color: badgeBg,
                                              borderRadius: BorderRadius.circular(6),
                                              border: Border.all(color: badgeBorder),
                                            ),
                                            child: Text(
                                              complaint.complaintId,
                                              style: TextStyle(
                                                fontSize: 11,
                                                fontWeight: FontWeight.bold,
                                                color: textPrimary,
                                              ),
                                            ),
                                          ),
                                          StatusBadge(status: complaint.status),
                                        ],
                                      ),
                                      const SizedBox(height: 10),

                                      // Citizen Complainant Info (Ajay Rathod • Ward 4)
                                      Row(
                                        children: [
                                          CircleAvatar(
                                            radius: 12,
                                            backgroundColor: AppConstants.primary
                                                .withOpacity(isDark ? 0.25 : 0.12),
                                            child: Text(
                                              complaint.citizenName.isNotEmpty
                                                  ? complaint.citizenName[0].toUpperCase()
                                                  : 'C',
                                              style: TextStyle(
                                                fontSize: 11,
                                                fontWeight: FontWeight.bold,
                                                color: primaryColor,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 8),
                                          Expanded(
                                            child: Text(
                                              '${complaint.citizenName} • Ward ${complaint.citizenWard ?? complaint.wardNumber}',
                                              style: TextStyle(
                                                fontSize: 12,
                                                fontWeight: FontWeight.w600,
                                                color: textSecondary,
                                              ),
                                            ),
                                          ),
                                          Text(
                                            '${complaint.createdAt.day}/${complaint.createdAt.month}/${complaint.createdAt.year}',
                                            style: TextStyle(
                                              fontSize: 11,
                                              color: textSecondary,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),

                                      // Category & Subject Title
                                      Row(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.all(7),
                                            decoration: BoxDecoration(
                                              color: primaryColor
                                                  .withOpacity(isDark ? 0.2 : 0.08),
                                              borderRadius: BorderRadius.circular(8),
                                            ),
                                            child: Icon(
                                              _getCategoryIcon(complaint.category),
                                              color: primaryColor,
                                              size: 18,
                                            ),
                                          ),
                                          const SizedBox(width: 10),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  complaint.title,
                                                  style: TextStyle(
                                                    fontSize: 14,
                                                    fontWeight: FontWeight.bold,
                                                    color: textPrimary,
                                                  ),
                                                ),
                                                if (complaint.description.isNotEmpty) ...[
                                                  const SizedBox(height: 3),
                                                  Text(
                                                    complaint.description,
                                                    maxLines: 2,
                                                    overflow: TextOverflow.ellipsis,
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: textSecondary,
                                                    ),
                                                  ),
                                                ],
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),

                                      // Photo thumbnail if present
                                      if (complaint.photo.isNotEmpty) ...[
                                        const SizedBox(height: 8),
                                        ClipRRect(
                                          borderRadius: BorderRadius.circular(8),
                                          child: Image.network(
                                            complaint.photo.startsWith('http')
                                                ? complaint.photo
                                                : '${AppConstants.baseUrl.replaceAll('/api', '')}${complaint.photo}',
                                            height: 110,
                                            width: double.infinity,
                                            fit: BoxFit.cover,
                                            errorBuilder: (_, __, ___) =>
                                                const SizedBox.shrink(),
                                          ),
                                        ),
                                      ],

                                      const SizedBox(height: 8),
                                      Row(
                                        children: [
                                          Icon(
                                            Icons.location_on_outlined,
                                            size: 13,
                                            color: textSecondary,
                                          ),
                                          const SizedBox(width: 4),
                                          Expanded(
                                            child: Text(
                                              'Ward ${complaint.wardNumber} • ${complaint.location}',
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                              style: TextStyle(
                                                fontSize: 11.5,
                                                color: textSecondary,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),

                                      const SizedBox(height: 10),
                                      Divider(height: 1, color: borderColor),
                                      const SizedBox(height: 6),

                                      // Action Bar: Like & Comment buttons
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          // Like Button
                                          InkWell(
                                            onTap: () {
                                              complaintProvider.toggleLike(
                                                complaint.id,
                                                currentUserId,
                                              );
                                            },
                                            borderRadius: BorderRadius.circular(8),
                                            child: Padding(
                                              padding: const EdgeInsets.symmetric(
                                                  horizontal: 8, vertical: 4),
                                              child: Row(
                                                children: [
                                                  Icon(
                                                    isLiked
                                                        ? Icons.favorite
                                                        : Icons.favorite_border,
                                                    size: 17,
                                                    color: isLiked
                                                        ? Colors.redAccent
                                                        : textSecondary,
                                                  ),
                                                  const SizedBox(width: 5),
                                                  Text(
                                                    '${complaint.likesCount}',
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      fontWeight: isLiked
                                                          ? FontWeight.bold
                                                          : FontWeight.normal,
                                                      color: isLiked
                                                          ? Colors.redAccent
                                                          : textSecondary,
                                                    ),
                                                  ),
                                                  const SizedBox(width: 4),
                                                  Text(
                                                    'Like',
                                                    style: TextStyle(
                                                      fontSize: 11.5,
                                                      color: isLiked
                                                          ? Colors.redAccent
                                                          : textSecondary,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),

                                          // Comment Button
                                          InkWell(
                                            onTap: () => _showCommentsSheet(
                                              context,
                                              complaint,
                                              currentUserId,
                                            ),
                                            borderRadius: BorderRadius.circular(8),
                                            child: Padding(
                                              padding: const EdgeInsets.symmetric(
                                                  horizontal: 8, vertical: 4),
                                              child: Row(
                                                children: [
                                                  Icon(
                                                    Icons.chat_bubble_outline,
                                                    size: 16,
                                                    color: textSecondary,
                                                  ),
                                                  const SizedBox(width: 5),
                                                  Text(
                                                    '${complaint.commentsCount}',
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: textSecondary,
                                                    ),
                                                  ),
                                                  const SizedBox(width: 4),
                                                  Text(
                                                    'Comments',
                                                    style: TextStyle(
                                                      fontSize: 11.5,
                                                      color: textSecondary,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),

                                          // View Details link
                                          Row(
                                            children: [
                                              Text(
                                                'तपशील पहा',
                                                style: TextStyle(
                                                  fontSize: 11.5,
                                                  fontWeight: FontWeight.bold,
                                                  color: primaryColor,
                                                ),
                                              ),
                                              Icon(
                                                Icons.chevron_right,
                                                size: 16,
                                                color: primaryColor,
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}
