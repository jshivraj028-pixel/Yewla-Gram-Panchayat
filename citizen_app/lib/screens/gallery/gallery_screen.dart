import 'package:flutter/material.dart';
import '../../core/constants/app_constants.dart';
import '../../core/network/api_client.dart';

class GalleryScreen extends StatefulWidget {
  const GalleryScreen({super.key});

  @override
  State<GalleryScreen> createState() => _GalleryScreenState();
}

class _GalleryScreenState extends State<GalleryScreen> {
  List<dynamic> _images = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchGallery();
  }

  Future<void> _fetchGallery() async {
    setState(() => _isLoading = true);
    final res = await ApiClient.get('/gallery');
    if (mounted) {
      setState(() {
        _images = res.data is List ? res.data : [];
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Village Gallery / गाव छायाचित्रे'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _images.isEmpty
              ? const Center(child: Text('No gallery images uploaded yet.'))
              : RefreshIndicator(
                  onRefresh: _fetchGallery,
                  child: GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 0.82,
                    ),
                    itemCount: _images.length,
                    itemBuilder: (ctx, i) {
                      final item = _images[i];
                      return Card(
                        clipBehavior: Clip.antiAlias,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              child: Image.network(
                                item['imageUrl'] ?? '',
                                width: double.infinity,
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => Container(
                                  color: Colors.grey.shade200,
                                  child: const Center(child: Icon(Icons.image_not_supported)),
                                ),
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.all(10),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item['title'] ?? '',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    item['category'] ?? 'Event',
                                    style: const TextStyle(fontSize: 11, color: AppConstants.textSecondary),
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
    );
  }
}
