import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/savings_account.dart';
import '../models/stock.dart';
import '../models/time_deposit.dart';
import '../models/crypto.dart';
import '../models/forex.dart';

final dataProvider = NotifierProvider<DataNotifier, AsyncValue<bool>>(() {
  return DataNotifier();
});

class DataNotifier extends Notifier<AsyncValue<bool>> {
  @override
  AsyncValue<bool> build() {
    return const AsyncValue.data(false);
  }

  List<SavingsAccount> savings = [];
  List<Stock> stocks = [];
  List<TimeDeposit> deposits = [];
  List<Crypto> cryptos = [];
  List<Forex> forexes = [];

  Future<void> fetchData() async {
    state = const AsyncValue.loading();
    try {
      final supabase = Supabase.instance.client;
      final user = supabase.auth.currentUser;
      if (user == null) {
        throw Exception('Not authenticated');
      }
      
      final responses = await Promise.all([
        supabase.from('savings_accounts').select().eq('user_id', user.id).order('created_at'),
        supabase.from('stocks').select().eq('user_id', user.id).order('created_at'),
        supabase.from('time_deposits').select().eq('user_id', user.id).order('created_at'),
        supabase.from('crypto').select().eq('user_id', user.id).order('created_at'),
        supabase.from('forex').select().eq('user_id', user.id).order('created_at'),
      ]);

      savings = (responses[0] as List).map((e) => SavingsAccount.fromJson(e)).toList();
      stocks = (responses[1] as List).map((e) => Stock.fromJson(e)).toList();
      deposits = (responses[2] as List).map((e) => TimeDeposit.fromJson(e)).toList();
      cryptos = (responses[3] as List).map((e) => Crypto.fromJson(e)).toList();
      forexes = (responses[4] as List).map((e) => Forex.fromJson(e)).toList();

      state = const AsyncValue.data(true);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

// Helper for combined response (Dart doesn't have Promise.all exactly, I'll fix this)
class Promise {
  static Future<List<dynamic>> all(List<Future<dynamic>> futures) async {
    return Future.wait(futures);
  }
}

final savingsProvider = Provider<List<SavingsAccount>>((ref) {
  ref.watch(dataProvider);
  return ref.read(dataProvider.notifier).savings;
});

final stocksProvider = Provider<List<Stock>>((ref) {
  ref.watch(dataProvider);
  return ref.read(dataProvider.notifier).stocks;
});

final depositsProvider = Provider<List<TimeDeposit>>((ref) {
  ref.watch(dataProvider);
  return ref.read(dataProvider.notifier).deposits;
});

final cryptosProvider = Provider<List<Crypto>>((ref) {
  ref.watch(dataProvider);
  return ref.read(dataProvider.notifier).cryptos;
});

final forexesProvider = Provider<List<Forex>>((ref) {
  ref.watch(dataProvider);
  return ref.read(dataProvider.notifier).forexes;
});
