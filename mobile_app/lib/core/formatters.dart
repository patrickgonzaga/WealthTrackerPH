import 'package:intl/intl.dart';

final _currencyNoDecimals = NumberFormat.currency(locale: 'en_US', symbol: '₱ ', decimalDigits: 0);

String formatCurrency(num value, {int decimalDigits = 2}) {
  final formatter = NumberFormat.currency(locale: 'en_US', symbol: '₱ ', decimalDigits: decimalDigits);
  return formatter.format(value);
}

String formatCurrency0(num value) {
  return _currencyNoDecimals.format(value);
}

String formatNumber(num value, {int decimalDigits = 2}) {
  final formatter = NumberFormat('#,##0.${'0' * decimalDigits}', 'en_US');
  return formatter.format(value);
}
