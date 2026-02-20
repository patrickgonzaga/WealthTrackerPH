class Stock {
  final String id;
  final String userId;
  final String symbol;
  final double quantity;
  final double avgPrice;
  final double currentPrice;
  final DateTime createdAt;

  Stock({
    required this.id,
    required this.userId,
    required this.symbol,
    required this.quantity,
    required this.avgPrice,
    required this.currentPrice,
    required this.createdAt,
  });

  factory Stock.fromJson(Map<String, dynamic> json) {
    return Stock(
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
