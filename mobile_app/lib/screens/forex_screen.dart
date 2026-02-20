import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../providers/data_provider.dart';
import '../core/theme.dart';
import '../core/formatters.dart';
import '../widgets/glass_card.dart';
import 'add_forex_screen.dart';

class ForexScreen extends ConsumerWidget {
  const ForexScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final forexes = ref.watch(forexesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Currency Exchange'),
        backgroundColor: Colors.transparent,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: forexes.length,
        itemBuilder: (context, index) {
          final forex = forexes[index];
          final current = forex.quantity * forex.currentPrice;
          final invested = forex.quantity * forex.avgPrice;
          final gain = current - invested;
          final isPositive = gain >= 0;

          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          forex.symbol,
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '${forex.quantity.toStringAsFixed(2)} Units',
                        style: const TextStyle(color: AppTheme.muted, fontSize: 12),
                      ),
                      const SizedBox(width: 8),
                      PopupMenuButton<String>(
                        icon: const Icon(LucideIcons.moreVertical, size: 18),
                        onSelected: (value) async {
                          if (value == 'edit') {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => AddForexScreen(forex: forex)),
                            );
                          }

                          if (value == 'delete') {
                            final ok = await showDialog<bool>(
                              context: context,
                              builder: (_) => AlertDialog(
                                title: const Text('Delete forex?'),
                                content: const Text('This will permanently remove this forex entry.'),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.pop(context, false),
                                    child: const Text('Cancel'),
                                  ),
                                  TextButton(
                                    onPressed: () => Navigator.pop(context, true),
                                    child: const Text('Delete'),
                                  ),
                                ],
                              ),
                            );
                            if (ok == true) {
                              try {
                                await Supabase.instance.client.from('forex').delete().eq('id', forex.id);
                                await ref.read(dataProvider.notifier).fetchData();
                              } catch (e) {
                                if (context.mounted) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text('Error: $e'), backgroundColor: AppTheme.destructive),
                                  );
                                }
                              }
                            }
                          }
                        },
                        itemBuilder: (_) => const [
                          PopupMenuItem(value: 'edit', child: Text('Edit')),
                          PopupMenuItem(value: 'delete', child: Text('Delete')),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'MARKET VALUE',
                    style: TextStyle(color: AppTheme.muted, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                  Row(
                    children: [
                      Text(
                        formatCurrency(current, decimalDigits: 2),
                        style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(width: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: (isPositive ? AppTheme.positive : AppTheme.destructive).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          '${isPositive ? '+' : ''}${invested > 0 ? ((gain / invested) * 100).toStringAsFixed(1) : '0.0'}%',
                          style: TextStyle(
                            color: isPositive ? AppTheme.positive : AppTheme.destructive,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const Divider(height: 32, color: Colors.white10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildInfoColumn('Avg. Rate', formatCurrency(forex.avgPrice, decimalDigits: 4)),
                      _buildInfoColumn('Current', formatCurrency(forex.currentPrice, decimalDigits: 4)),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AddForexScreen()),
          );
        },
        backgroundColor: AppTheme.accent,
        child: const Icon(LucideIcons.plus),
      ),
    );
  }

  Widget _buildInfoColumn(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label.toUpperCase(),
          style: const TextStyle(color: AppTheme.muted, fontSize: 10, fontWeight: FontWeight.bold),
        ),
        Text(
          value,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }
}
