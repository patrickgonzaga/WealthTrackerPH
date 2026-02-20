export interface SavingsAccount {
    id: string;
    user_id: string;
    bank_name: string;
    account_type: 'digital' | 'traditional';
    balance: number;
    interest_rate: number;
    compounding: 'monthly' | 'quarterly' | 'annually';
    created_at: string;
}

export interface Stock {
    id: string;
    user_id: string;
    symbol: string;
    quantity: number;
    avg_price: number;
    current_price: number;
    created_at: string;
}

export interface TimeDeposit {
    id: string;
    user_id: string;
    principal: number;
    interest_rate: number;
    duration_months: number;
    start_date: string;
    tax_rate: number;
    created_at: string;
}

export interface Crypto {
    id: string;
    user_id: string;
    symbol: string;
    quantity: number;
    avg_price: number;
    current_price: number;
    created_at: string;
}

export interface Forex {
    id: string;
    user_id: string;
    symbol: string;
    quantity: number;
    avg_price: number;
    current_price: number;
    created_at: string;
}

export interface User {
    id: string;
    email: string;
    created_at: string;
}

export interface NetWorthGoal {
    id: string;
    user_id: string;
    target_amount: number;
    target_date: string;
    created_at: string;
}
