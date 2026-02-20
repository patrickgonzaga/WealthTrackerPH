class Forex {
  final String id;
  final String userId;
  final String symbol;
  final double quantity;
  final double avgPrice;
  final double currentPrice;
  final DateTime createdAt;

  Forex({
    required this.id,
    required this.userId,
    required this.symbol,
    required this.quantity,
    required this.avgPrice,
    required this.currentPrice,
    required this.createdAt,
  });

  factory Forex.fromJson(Map<String, dynamic> json) {
    return Forex(
      id: json['id'],
      userId: json['user_id'],
      symbol: json['symbol'],
      quantity: (json['quantity'] as num).toDouble(),
      avgPrice: (json['avg_price'] as num).toDouble(),
      currentPrice: (json['current_price'] as num).toDouble(),
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}
