import 'dart:html' as html;

Future<void> downloadFileUniversal(String url, String fileName) async {
  final anchor = html.AnchorElement(href: url)
    ..setAttribute('download', fileName)
    ..target = '_blank';
  html.document.body?.append(anchor);
  anchor.click();
  anchor.remove();
}
