import 'dart:typed_data';
import 'package:flutter/material.dart';
import '../models/complaint_model.dart';
import '../services/complaint_service.dart';

class ComplaintProvider extends ChangeNotifier {
  List<ComplaintModel> _complaints = [];
  bool _isLoading = false;
  String? _selectedCategory;
  String? _selectedStatus;
  String _scope = 'all'; // 'all' or 'my'

  List<ComplaintModel> get complaints => _complaints;
  bool get isLoading => _isLoading;
  String? get selectedCategory => _selectedCategory;
  String? get selectedStatus => _selectedStatus;
  String get scope => _scope;

  Future<void> fetchComplaints({
    String? status,
    String? category,
    String? scope,
  }) async {
    _isLoading = true;
    _selectedStatus = status;
    _selectedCategory = category;
    if (scope != null) _scope = scope;
    notifyListeners();

    try {
      _complaints = await ComplaintService.getComplaints(
        status: status,
        category: category,
        scope: _scope,
      );
    } catch (e) {
      _complaints = [];
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void setScope(String newScope) {
    if (_scope != newScope) {
      _scope = newScope;
      fetchComplaints(
        status: _selectedStatus,
        category: _selectedCategory,
        scope: newScope,
      );
    }
  }

  Future<void> toggleLike(String complaintId, String currentUserId) async {
    // Optimistic UI update
    final index = _complaints.indexWhere((c) => c.id == complaintId);
    if (index != -1) {
      final old = _complaints[index];
      final newLikes = List<String>.from(old.likes);
      if (newLikes.contains(currentUserId)) {
        newLikes.remove(currentUserId);
      } else {
        newLikes.add(currentUserId);
      }
      _complaints[index] = old.copyWith(likes: newLikes);
      notifyListeners();
    }

    try {
      final serverLikes = await ComplaintService.toggleLike(complaintId);
      if (serverLikes != null && index != -1) {
        _complaints[index] = _complaints[index].copyWith(likes: serverLikes);
        notifyListeners();
      }
    } catch (e) {
      // Revert if error
      fetchComplaints(status: _selectedStatus, category: _selectedCategory);
    }
  }

  Future<bool> addComment(String complaintId, String text) async {
    try {
      final updatedComments = await ComplaintService.addComment(complaintId, text);
      if (updatedComments != null) {
        final index = _complaints.indexWhere((c) => c.id == complaintId);
        if (index != -1) {
          _complaints[index] = _complaints[index].copyWith(comments: updatedComments);
          notifyListeners();
        }
        return true;
      }
    } catch (e) {
      debugPrint('Error adding comment: $e');
    }
    return false;
  }

  Future<bool> deleteComment(String complaintId, String commentId) async {
    try {
      final updatedComments = await ComplaintService.deleteComment(complaintId, commentId);
      if (updatedComments != null) {
        final index = _complaints.indexWhere((c) => c.id == complaintId);
        if (index != -1) {
          _complaints[index] = _complaints[index].copyWith(comments: updatedComments);
          notifyListeners();
        }
        return true;
      }
    } catch (e) {
      debugPrint('Error deleting comment: $e');
    }
    return false;
  }

  Future<bool> submitComplaint({
    required String category,
    required String title,
    required String description,
    required String location,
    required int wardNumber,
    String priority = 'Medium',
    String? photoPath,
    Uint8List? photoBytes,
    String? photoName,
  }) async {
    final res = await ComplaintService.createComplaint(
      category: category,
      title: title,
      description: description,
      location: location,
      wardNumber: wardNumber,
      priority: priority,
      photoPath: photoPath,
      photoBytes: photoBytes,
      photoName: photoName,
    );

    if (res.success) {
      await fetchComplaints();
      return true;
    }
    return false;
  }
}
