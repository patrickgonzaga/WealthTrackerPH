import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../providers/data_provider.dart';
import '../core/theme.dart';
import '../models/savings_account.dart';

class AddSavingsScreen extends ConsumerStatefulWidget {
  const AddSavingsScreen({super.key, this.account});

  final SavingsAccount? account;

  @override
  ConsumerState<AddSavingsScreen> createState() => _AddSavingsScreenState();
}

class _AddSavingsScreenState extends ConsumerState<AddSavingsScreen> {
  final _bankController = TextEditingController();
  final _balanceController = TextEditingController();
  final _rateController = TextEditingController();
  String _accountType = 'digital';
  String _compounding = 'monthly';
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    final account = widget.account;
    if (account != null) {
      _bankController.text = account.bankName;
      _balanceController.text = account.balance.toString();
      _rateController.text = account.interestRate.toString();
      _accountType = account.accountType;
      _compounding = account.compounding;
    }
  }

  @override
  void dispose() {
    _bankController.dispose();
    _balanceController.dispose();
    _rateController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() => _isLoading = true);
    try {
      final user = Supabase.instance.client.auth.currentUser;
      if (user == null) {
        throw Exception('Not authenticated');
      }

      final payload = {
        'user_id': user.id,
        'bank_name': _bankController.text,
        'account_type': _accountType,
        'balance': double.parse(_balanceController.text),
        'interest_rate': double.parse(_rateController.text),
        'compounding': _compounding,
      };

      if (widget.account != null) {
        await Supabase.instance.client
            .from('savings_accounts')
            .update(payload)
            .eq('id', widget.account!.id);
      } else {
        await Supabase.instance.client.from('savings_accounts').insert(payload);
      }

      ref.read(dataProvider.notifier).fetchData();
      if (mounted) Navigator.pop(context);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppTheme.destructive),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.account != null ? 'Edit Account' : 'Add Account')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            TextField(
              controller: _bankController,
              decoration: const InputDecoration(labelText: 'Bank Name'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _balanceController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Initial Balance'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _rateController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Interest Rate (%)'),
            ),
            const SizedBox(height: 24),
            DropdownButtonFormField<String>(
              value: _accountType,
              items: const [
                DropdownMenuItem(value: 'digital', child: Text('Digital')),
                DropdownMenuItem(value: 'traditional', child: Text('Traditional')),
              ],
              onChanged: (v) => setState(() => _accountType = v!),
              decoration: const InputDecoration(labelText: 'Account Type'),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading ? null : _submit,
              style: ElevatedButton.styleFrom(
                minimumSize: const Size.fromHeight(50),
                backgroundColor: AppTheme.primary,
              ),
              child: _isLoading
                  ? const CircularProgressIndicator()
                  : Text(widget.account != null ? 'UPDATE ACCOUNT' : 'SAVE ACCOUNT'),
            ),
          ],
        ),
      ),
    );
  }
}
