import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../providers/data_provider.dart';
import '../core/theme.dart';
import '../core/calculations.dart';
import '../core/formatters.dart';
import '../widgets/glass_card.dart';
import 'add_time_deposit_screen.dart';

class TimeDepositsScreen extends ConsumerWidget {
  const TimeDepositsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final deposits = ref.watch(depositsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Fixed Assets'),
        backgroundColor: Colors.transparent,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: deposits.length,
        itemBuilder: (context, index) {
          final deposit = deposits[index];
          final maturity = Calculations.calculateTimeDepositMaturity(deposit);
          final daysLeft = (maturity['maturityDate'] as DateTime).difference(DateTime.now()).inDays;
          final isMatured = daysLeft <= 0;

          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Row(
                        children: [
                          Icon(LucideIcons.clock, color: isMatured ? AppTheme.positive : AppTheme.primary, size: 16),
                          const SizedBox(width: 8),
                          Text(
                            isMatured ? 'MATURED' : '$daysLeft DAYS LEFT',
                            style: TextStyle(
                              color: isMatured ? AppTheme.positive : AppTheme.primary,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const Spacer(),
                      Text(
                        '${deposit.durationMonths} Months',
                        style: const TextStyle(color: AppTheme.muted, fontSize: 12),
                      ),
                      const SizedBox(width: 8),
                      PopupMenuButton<String>(
                        icon: const Icon(LucideIcons.moreVertical, size: 18),
                        onSelected: (value) async {
                          if (value == 'edit') {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => AddTimeDepositScreen(deposit: deposit)),
                            );
                          }

                          if (value == 'delete') {
                            final ok = await showDialog<bool>(
                              context: context,
                              builder: (_) => AlertDialog(
                                title: const Text('Delete time deposit?'),
                                content: const Text('This will permanently remove this time deposit.'),
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
                                await Supabase.instance.client.from('time_deposits').delete().eq('id', deposit.id);
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
                    'PRINCIPAL AMOUNT',
                    style: TextStyle(color: AppTheme.muted, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    formatCurrency(deposit.principal, decimalDigits: 2),
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 24),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.03),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        _buildRow('Interest Rate', '${deposit.interestRate}%'),
                        const SizedBox(height: 8),
                        _buildRow('Net Interest (20% tax)', formatCurrency((maturity['netInterest'] as double), decimalDigits: 2)),
                        const Divider(height: 24, color: Colors.white10),
                        _buildRow('Maturity Value', formatCurrency((maturity['maturityValue'] as double), decimalDigits: 2), isBold: true),
                      ],
                    ),
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
            MaterialPageRoute(builder: (_) => const AddTimeDepositScreen()),
          );
        },
        backgroundColor: AppTheme.positive,
        child: const Icon(LucideIcons.plus),
      ),
    );
  }

  Widget _buildRow(String label, String val, {bool isBold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(color: AppTheme.muted, fontSize: 12),
        ),
        Text(
          val,
          style: TextStyle(
            color: Colors.white,
            fontSize: 12,
            fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ],
    );
  }
}
