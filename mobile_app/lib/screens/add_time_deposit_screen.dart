import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../providers/data_provider.dart';
import '../core/theme.dart';
import '../models/time_deposit.dart';

class AddTimeDepositScreen extends ConsumerStatefulWidget {
  const AddTimeDepositScreen({super.key, this.deposit});

  final TimeDeposit? deposit;

  @override
  ConsumerState<AddTimeDepositScreen> createState() => _AddTimeDepositScreenState();
}

class _AddTimeDepositScreenState extends ConsumerState<AddTimeDepositScreen> {
  final _principalController = TextEditingController();
  final _rateController = TextEditingController();
  final _durationController = TextEditingController();
  DateTime _startDate = DateTime.now();

  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    final deposit = widget.deposit;
    if (deposit != null) {
      _principalController.text = deposit.principal.toString();
      _rateController.text = deposit.interestRate.toString();
      _durationController.text = deposit.durationMonths.toString();
      _startDate = deposit.startDate;
    }
  }

  @override
  void dispose() {
    _principalController.dispose();
    _rateController.dispose();
    _durationController.dispose();
    super.dispose();
  }

  Future<void> _pickStartDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _startDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );

    if (picked != null) {
      setState(() => _startDate = picked);
    }
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
        'principal': double.parse(_principalController.text),
        'interest_rate': double.parse(_rateController.text),
        'duration_months': int.parse(_durationController.text),
        'start_date': _startDate.toIso8601String().split('T')[0],
        'tax_rate': 0.2,
      };

      if (widget.deposit != null) {
        await Supabase.instance.client
            .from('time_deposits')
            .update(payload)
            .eq('id', widget.deposit!.id);
      } else {
        await Supabase.instance.client.from('time_deposits').insert(payload);
      }

      await ref.read(dataProvider.notifier).fetchData();
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
      appBar: AppBar(title: Text(widget.deposit != null ? 'Edit Time Deposit' : 'Add Time Deposit')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            TextField(
              controller: _principalController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Principal Amount'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _rateController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Interest Rate (%)'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _durationController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Duration (months)'),
            ),
            const SizedBox(height: 16),
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Start Date'),
              subtitle: Text(_startDate.toIso8601String().split('T')[0]),
              trailing: const Icon(Icons.calendar_today),
              onTap: _pickStartDate,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading ? null : _submit,
              style: ElevatedButton.styleFrom(
                minimumSize: const Size.fromHeight(50),
                backgroundColor: AppTheme.positive,
              ),
              child: _isLoading
                  ? const CircularProgressIndicator()
                  : Text(widget.deposit != null ? 'UPDATE DEPOSIT' : 'SAVE DEPOSIT'),
            ),
          ],
        ),
      ),
    );
  }
}
