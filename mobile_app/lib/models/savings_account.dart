class SavingsAccount {
  final String id;
  final String userId;
  final String bankName;
  final String accountType;
  final double balance;
  final double interestRate;
  final String compounding;
  final DateTime createdAt;

  SavingsAccount({
    required this.id,
    required this.userId,
    required this.bankName,
    required this.accountType,
    required this.balance,
    required this.interestRate,
    required this.compounding,
    required this.createdAt,
  });

  factory SavingsAccount.fromJson(Map<String, dynamic> json) {
    return SavingsAccount(
      id: json['id'],
      userId: json['user_id'],
      bankName: json['bank_name'],
      accountType: json['account_type'],
      balance: (json['balance'] as num).toDouble(),
      interestRate: (json['interest_rate'] as num).toDouble(),
      compounding: json['compounding'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}
