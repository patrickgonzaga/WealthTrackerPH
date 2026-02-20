class TimeDeposit {
  final String id;
  final String userId;
  final double principal;
  final double interestRate;
  final int durationMonths;
  final DateTime startDate;
  final double taxRate;
  final DateTime createdAt;

  TimeDeposit({
    required this.id,
    required this.userId,
    required this.principal,
    required this.interestRate,
    required this.durationMonths,
    required this.startDate,
    required this.taxRate,
    required this.createdAt,
  });

  factory TimeDeposit.fromJson(Map<String, dynamic> json) {
    return TimeDeposit(
      id: json['id'],
      userId: json['user_id'],
      principal: (json['principal'] as num).toDouble(),
      interestRate: (json['interest_rate'] as num).toDouble(),
      durationMonths: json['duration_months'],
      startDate: DateTime.parse(json['start_date']),
      taxRate: (json['tax_rate'] as num).toDouble(),
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}
