import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:fl_chart/fl_chart.dart';
import '../providers/auth_provider.dart';
import '../providers/data_provider.dart';
import '../core/theme.dart';
import '../core/formatters.dart';
import '../widgets/glass_card.dart';
import 'savings_screen.dart';
import 'stocks_screen.dart';
import 'time_deposits_screen.dart';
import 'crypto_screen.dart';
import 'forex_screen.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      final currentUser = ref.read(authProvider).value;
      if (currentUser != null) {
        ref.read(dataProvider.notifier).fetchData();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final dataState = ref.watch(dataProvider);
    final user = ref.watch(authProvider).value;

    ref.listen(authProvider, (prev, next) {
      final prevUserId = prev?.value?.id;
      final nextUserId = next.value?.id;
      if (nextUserId != null && nextUserId != prevUserId) {
        ref.read(dataProvider.notifier).fetchData();
      }
    });
    
    final savings = ref.watch(savingsProvider);
    final stocks = ref.watch(stocksProvider);
    final deposits = ref.watch(depositsProvider);
    final cryptos = ref.watch(cryptosProvider);
    final forexes = ref.watch(forexesProvider);

    double totalSavings = savings.fold(0, (sum, item) => sum + item.balance);
    double totalStocks = stocks.fold(0, (sum, item) => sum + (item.quantity * item.currentPrice));
    double totalDeposits = deposits.fold(0, (sum, item) => sum + item.principal);
    double totalCrypto = cryptos.fold(0, (sum, item) => sum + (item.quantity * item.currentPrice));
    double totalForex = forexes.fold(0, (sum, item) => sum + (item.quantity * item.currentPrice));
    double totalNetWorth = totalSavings + totalStocks + totalDeposits + totalCrypto + totalForex;

    // Calculate month-over-month change
    Map<String, dynamic> calculateMonthlyChange() {
      final now = DateTime.now();
      final oneMonthAgo = DateTime(now.year, now.month - 1, now.day);
      
      final allAssets = [...savings, ...stocks, ...deposits, ...cryptos, ...forexes];
      
      // If no assets, return 0
      if (allAssets.isEmpty) {
        return {'percentage': '0', 'isPositive': true, 'isNew': true};
      }
      
      final currentTotal = allAssets.fold(0.0, (sum, asset) {
        double value = 0;
        if (asset.runtimeType.toString().contains('Savings')) {
          value = (asset as dynamic).balance;
        } else if (asset.runtimeType.toString().contains('TimeDeposit')) {
          value = (asset as dynamic).principal;
        } else if (asset.runtimeType.toString().contains('Stock') || 
                   asset.runtimeType.toString().contains('Crypto') || 
                   asset.runtimeType.toString().contains('Forex')) {
          value = (asset as dynamic).quantity * (asset as dynamic).currentPrice;
        }
        return sum + value;
      });

      // Check if we have assets older than 1 month
      final oldAssets = allAssets.where((asset) => 
        DateTime.parse((asset as dynamic).createdAt).isBefore(oneMonthAgo)
      ).toList();
      
      if (oldAssets.isEmpty) {
        // All assets are new (created within last month)
        return {'percentage': '0', 'isPositive': true, 'isNew': true};
      }

      // Calculate past value using old assets only
      final pastTotal = oldAssets.fold(0.0, (sum, asset) {
        double value = 0;
        if (asset.runtimeType.toString().contains('Savings')) {
          value = (asset as dynamic).balance;
        } else if (asset.runtimeType.toString().contains('TimeDeposit')) {
          value = (asset as dynamic).principal;
        } else if (asset.runtimeType.toString().contains('Stock') || 
                   asset.runtimeType.toString().contains('Crypto') || 
                   asset.runtimeType.toString().contains('Forex')) {
          value = (asset as dynamic).quantity * (asset as dynamic).avgPrice;
        }
        return sum + value;
      });

      if (pastTotal == 0) return {'percentage': '0', 'isPositive': true, 'isNew': true};
      
      final netChange = currentTotal - pastTotal;
      final changePercentage = (netChange / pastTotal) * 100;
      
      return {
        'percentage': changePercentage.abs().toStringAsFixed(1),
        'isPositive': netChange >= 0,
        'isNew': false
      };
    }

    final monthlyChange = calculateMonthlyChange();

    return Scaffold(
      body: Stack(
        children: [
          // Background Glows
          Positioned(
            top: -50,
            right: -50,
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                color: AppTheme.primary.withOpacity(0.05),
                shape: BoxShape.circle,
              ),
            ),
          ),
          RefreshIndicator(
            onRefresh: () => ref.read(dataProvider.notifier).fetchData(),
            child: CustomScrollView(
              slivers: [
                SliverAppBar(
                  floating: true,
                  backgroundColor: Colors.transparent,
                  title: Text(
                    'Command Center',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  actions: [
                    IconButton(
                      icon: const Icon(LucideIcons.logOut, size: 20),
                      onPressed: () => ref.read(authProvider.notifier).signOut(),
                    ),
                  ],
                ),
                dataState.when(
                  data: (_) => SliverPadding(
                    padding: const EdgeInsets.all(20.0),
                    sliver: SliverList(
                      delegate: SliverChildListDelegate([
                        _buildUserHeader(user?.email ?? 'Agent'),
                        const SizedBox(height: 20),
                        _buildNetWorthCard(totalNetWorth),
                        const SizedBox(height: 20),
                        _buildAssetGrid(totalSavings, totalStocks, totalDeposits, totalCrypto, totalForex, totalNetWorth),
                        const SizedBox(height: 20),
                        _buildRiskDistribution(totalSavings, totalStocks, totalDeposits, totalCrypto, totalForex, totalNetWorth),
                        const SizedBox(height: 20),
                        _buildAssetRegistryPreview(savings, stocks),
                        const SizedBox(height: 100),
                      ]),
                    ),
                  ),
                  loading: () => const SliverFillRemaining(
                    child: Center(child: CircularProgressIndicator()),
                  ),
                  error: (e, st) => SliverFillRemaining(
                    child: Center(child: Text('Error: $e')),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUserHeader(String email) {
    final name = email.split('@')[0];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 8,
              height: 8,
              decoration: const BoxDecoration(
                color: AppTheme.primary,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(color: AppTheme.primary, blurRadius: 10),
                ],
              ),
            ),
            const SizedBox(width: 8),
            const Text(
              'PERFORMANCE OVERVIEW',
              style: TextStyle(
                color: AppTheme.primary,
                fontSize: 10,
                fontWeight: FontWeight.bold,
                letterSpacing: 2,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        const Text(
          'Command Center',
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            fontFamily: 'Outfit',
            height: 1.05,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          'Welcome back, $name',
          style: const TextStyle(
            color: AppTheme.muted,
            fontSize: 16,
          ),
        ),
      ],
    );
  }

  Widget _buildNetWorthCard(double total) {
    return GlassCard(
      height: 180,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            'CONSOLIDATED NET WORTH',
            style: TextStyle(
              color: AppTheme.muted,
              fontSize: 10,
              fontWeight: FontWeight.bold,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            formatCurrency0(total),
            style: const TextStyle(
              fontSize: 40,
              fontWeight: FontWeight.bold,
              fontFamily: 'Outfit',
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppTheme.positive.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.positive.withOpacity(0.2)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  monthlyChange['isPositive'] ? LucideIcons.arrowUpRight : LucideIcons.arrowDownRight,
                  color: monthlyChange['isPositive'] ? AppTheme.positive : AppTheme.negative,
                  size: 14,
                ),
                SizedBox(width: 4),
                Text(
                  monthlyChange['isNew'] 
                    ? 'New portfolio'
                    : '${monthlyChange['isPositive'] ? '+' : '-'}${monthlyChange['percentage']}% this month',
                  style: TextStyle(
                    color: monthlyChange['isPositive'] ? AppTheme.positive : AppTheme.negative,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAssetGrid(double savings, double stocks, double deposits, double crypto, double forex, double totalNetWorth) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      childAspectRatio: 1.4,
      children: [
        _buildAssetCard(
          'Liquidity', 
          formatCurrency0(savings),
          LucideIcons.wallet, 
          AppTheme.primary,
          totalNetWorth > 0 ? savings / totalNetWorth : 0,
          () => Navigator.push(context, MaterialPageRoute(builder: (_) => const SavingsScreen())),
        ),
        _buildAssetCard(
          'Equity', 
          formatCurrency0(stocks),
          LucideIcons.trendingUp, 
          AppTheme.accent,
          totalNetWorth > 0 ? stocks / totalNetWorth : 0,
          () => Navigator.push(context, MaterialPageRoute(builder: (_) => const StocksScreen())),
        ),
        _buildAssetCard(
          'Digital', 
          formatCurrency0(crypto),
          LucideIcons.coins, 
          Colors.orange,
          totalNetWorth > 0 ? crypto / totalNetWorth : 0,
          () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CryptoScreen())),
        ),
        _buildAssetCard(
          'Forex', 
          formatCurrency0(forex),
          LucideIcons.globe, 
          Colors.blue,
          totalNetWorth > 0 ? forex / totalNetWorth : 0,
          () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ForexScreen())),
        ),
        _buildAssetCard(
          'Fixed', 
          formatCurrency0(deposits),
          LucideIcons.clock, 
          AppTheme.positive,
          totalNetWorth > 0 ? deposits / totalNetWorth : 0,
          () => Navigator.push(context, MaterialPageRoute(builder: (_) => const TimeDepositsScreen())),
        ),
      ],
    );
  }

  Widget _buildAssetCard(String title, String val, IconData icon, Color color, double allocation, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: GlassCard(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(icon, color: color, size: 20),
                Text(
                  '${(allocation * 100).clamp(0, 100).toStringAsFixed(1)}%',
                  style: const TextStyle(color: AppTheme.muted, fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title.toUpperCase(),
                  style: const TextStyle(color: AppTheme.muted, fontSize: 9, fontWeight: FontWeight.bold),
                ),
                Text(
                  val,
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(999),
                  child: Container(
                    height: 6,
                    color: Colors.white.withOpacity(0.06),
                    child: FractionallySizedBox(
                      alignment: Alignment.centerLeft,
                      widthFactor: allocation.isFinite ? allocation.clamp(0, 1) : 0,
                      child: Container(color: color.withOpacity(0.6)),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAssetRegistryPreview(dynamic savings, dynamic stocks) {
    final List<dynamic> savingsList = savings as List<dynamic>;
    final List<dynamic> stocksList = stocks as List<dynamic>;

    final recentSavings = savingsList.take(2).toList();
    final recentStocks = stocksList.take(2).toList();

    return GlassCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'ASSET REGISTRY',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: AppTheme.primary.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.primary.withOpacity(0.16)),
                ),
                child: const Text(
                  'LIVE',
                  style: TextStyle(color: AppTheme.primary, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (recentSavings.isEmpty && recentStocks.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 24),
              child: Center(
                child: Text(
                  'No assets yet. Add a savings account or a stock to get started.',
                  style: TextStyle(color: AppTheme.muted, fontSize: 12),
                  textAlign: TextAlign.center,
                ),
              ),
            )
          else ...[
            for (final acc in recentSavings)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.04),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: Colors.white.withOpacity(0.06)),
                      ),
                      child: const Icon(LucideIcons.wallet, size: 16, color: AppTheme.muted),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            (acc.bankName ?? '').toString(),
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            (acc.accountType ?? '').toString(),
                            style: const TextStyle(color: AppTheme.muted, fontSize: 10),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      formatCurrency0((acc.balance as num).toDouble()),
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            for (final st in recentStocks)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.04),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: Colors.white.withOpacity(0.06)),
                      ),
                      child: const Icon(LucideIcons.trendingUp, size: 16, color: AppTheme.muted),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            (st.symbol ?? '').toString(),
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                            overflow: TextOverflow.ellipsis,
                          ),
                          const Text(
                            'Equity Asset',
                            style: TextStyle(color: AppTheme.muted, fontSize: 10),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      formatCurrency0(((st.quantity as num).toDouble() * (st.currentPrice as num).toDouble())),
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
          ],
        ],
      ),
    );
  }

  Widget _buildRiskDistribution(double savings, double stocks, double deposits, double crypto, double forex, double total) {
    if (total == 0) return const SizedBox();

    return GlassCard(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'RISK DISTRIBUTION',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.03),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.white.withOpacity(0.06)),
                ),
                child: const Text(
                  'LIVE',
                  style: TextStyle(color: AppTheme.muted, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 240,
            child: Stack(
              alignment: Alignment.center,
              children: [
                PieChart(
                  PieChartData(
                    startDegreeOffset: -90,
                    sectionsSpace: 5,
                    centerSpaceRadius: 62,
                    sections: [
                      if (savings > 0)
                        PieChartSectionData(
                          color: AppTheme.primary,
                          value: savings,
                          radius: 26,
                          showTitle: false,
                        ),
                      if (stocks > 0)
                        PieChartSectionData(
                          color: AppTheme.accent,
                          value: stocks,
                          radius: 26,
                          showTitle: false,
                        ),
                      if (crypto > 0)
                        PieChartSectionData(
                          color: Colors.orange,
                          value: crypto,
                          radius: 26,
                          showTitle: false,
                        ),
                      if (forex > 0)
                        PieChartSectionData(
                          color: Colors.blue,
                          value: forex,
                          radius: 26,
                          showTitle: false,
                        ),
                      if (deposits > 0)
                        PieChartSectionData(
                          color: AppTheme.positive,
                          value: deposits,
                          radius: 26,
                          showTitle: false,
                        ),
                    ],
                  ),
                ),
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      'GLOBAL',
                      style: TextStyle(color: AppTheme.muted, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 2),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      formatCurrency0(total),
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, fontFamily: 'Outfit'),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          if (savings > 0)
            _buildRiskLegendRow('Savings', AppTheme.primary, savings, total),
          if (stocks > 0)
            _buildRiskLegendRow('Stocks', AppTheme.accent, stocks, total),
          if (crypto > 0)
            _buildRiskLegendRow('Crypto', Colors.orange, crypto, total),
          if (forex > 0)
            _buildRiskLegendRow('Forex', Colors.blue, forex, total),
          if (deposits > 0)
            _buildRiskLegendRow('Time Deposits', AppTheme.positive, deposits, total),
        ],
      ),
    );
  }

  Widget _buildRiskLegendRow(String label, Color color, double value, double total) {
    final pct = total > 0 ? (value / total) * 100 : 0;
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.02),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.white.withOpacity(0.05)),
        ),
        child: Row(
          children: [
            Container(
              width: 12,
              height: 12,
              decoration: BoxDecoration(color: color, shape: BoxShape.circle),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                label,
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  formatCurrency0(value),
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                ),
                Text(
                  '${pct.toStringAsFixed(1)}%',
                  style: const TextStyle(color: AppTheme.muted, fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
