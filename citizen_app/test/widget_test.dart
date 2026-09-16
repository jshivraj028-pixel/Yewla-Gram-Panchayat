import 'package:flutter_test/flutter_test.dart';
import 'package:citizen_app/main.dart';

void main() {
  testWidgets('GramSevaApp smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const GramSevaApp());
    await tester.pump(const Duration(milliseconds: 500));
    expect(find.byType(GramSevaApp), findsOneWidget);
  });
}
