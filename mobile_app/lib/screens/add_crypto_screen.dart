import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../providers/data_provider.dart';
import '../core/theme.dart';
import '../models/crypto.dart';

class AddCryptoScreen extends ConsumerStatefulWidget {
  const AddCryptoScreen({super.key, this.crypto});

  final Crypto? crypto;

  @override
  ConsumerState<AddCryptoScreen> createState() => _AddCryptoScreenState();
}

class _AddCryptoScreenState extends ConsumerState<AddCryptoScreen> {
  final _symbolController = TextEditingController();
  final _quantityController = TextEditingController();
  final _avgPriceController = TextEditingController();
  final _currentPriceController = TextEditingController();

  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    final crypto = widget.crypto;
    if (crypto != null) {
      _symbolController.text = crypto.symbol;
      _quantityController.text = crypto.quantity.toString();
      _avgPriceController.text = crypto.avgPrice.toString();
      _currentPriceController.text = crypto.currentPrice.toString();
    }
  }

  @override
  void dispose() {
    _symbolController.dispose();
    _quantityController.dispose();
    _avgPriceController.dispose();
    _currentPriceController.dispose();
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
        'symbol': _symbolController.text.trim().toUpperCase(),
        'quantity': double.parse(_quantityController.text),
        'avg_price': double.parse(_avgPriceController.text),
        'current_price': double.parse(_currentPriceController.text),
      };

      if (widget.crypto != null) {
        await Supabase.instance.client.from('crypto').update(payload).eq('id', widget.crypto!.id);
      } else {
        await Supabase.instance.client.from('crypto').insert(payload);
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
      appBar: AppBar(title: Text(widget.crypto != null ? 'Edit Crypto' : 'Add Crypto')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            TextField(
              controller: _symbolController,
              decoration: const InputDecoration(labelText: 'Symbol (e.g. BTC)'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _quantityController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Quantity'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _avgPriceController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Average Buy Price'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _currentPriceController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Current Price'),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading ? null : _submit,
              style: ElevatedButton.styleFrom(
                minimumSize: const Size.fromHeight(50),
                backgroundColor: AppTheme.accent,
              ),
              child: _isLoading
                  ? const CircularProgressIndicator()
                  : Text(widget.crypto != null ? 'UPDATE CRYPTO' : 'SAVE CRYPTO'),
            ),
          ],
        ),
      ),
    );
  }
}
