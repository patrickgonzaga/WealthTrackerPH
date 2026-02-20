import 'dart:math';
import '../models/time_deposit.dart';

class Calculations {
  /// Calculate compound interest for savings accounts
  static double calculateCompoundInterest(
    double principal,
    double rate,
    String compounding,
    int months,
  ) {
    int periodsPerYear = compounding == 'monthly'
        ? 12
        : compounding == 'quarterly'
            ? 4
            : 1;
    double years = months / 12;
    double amount = principal * pow(1 + rate / 100 / periodsPerYear, periodsPerYear * years);
    return amount - principal;
  }

  /// Calculate interest with 20% withholding tax
  static Map<String, double> calculateNetInterest(double grossInterest, [double taxRate = 0.2]) {
    double tax = grossInterest * taxRate;
    double net = grossInterest - tax;
    return {'gross': grossInterest, 'tax': tax, 'net': net};
  }

  /// Calculate time deposit maturity
  static Map<String, dynamic> calculateTimeDepositMaturity(TimeDeposit deposit) {
    double grossInterest = (deposit.principal * deposit.interestRate / 100 * deposit.durationMonths) / 12;
    double tax = grossInterest * deposit.taxRate;
    double netInterest = grossInterest - tax;
    double maturityValue = deposit.principal + netInterest;

    DateTime maturityDate = DateTime(
      deposit.startDate.year,
      deposit.startDate.month + deposit.durationMonths,
      deposit.startDate.day,
    );

    return {
      'grossInterest': grossInterest,
      'tax': tax,
      'netInterest': netInterest,
      'maturityValue': maturityValue,
      'maturityDate': maturityDate,
    };
  }
}
