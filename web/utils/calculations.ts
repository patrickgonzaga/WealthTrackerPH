import { SavingsAccount, TimeDeposit } from '@/types';

/**
 * Calculate compound interest for savings accounts
 */
export function calculateCompoundInterest(
    principal: number,
    rate: number,
    compounding: 'monthly' | 'quarterly' | 'annually',
    months: number
): number {
    const periodsPerYear = compounding === 'monthly' ? 12 : compounding === 'quarterly' ? 4 : 1;
    const years = months / 12;
    const amount = principal * Math.pow(1 + rate / 100 / periodsPerYear, periodsPerYear * years);
    return amount - principal;
}

/**
 * Calculate interest with 20% withholding tax
 */
export function calculateNetInterest(grossInterest: number, taxRate: number = 0.2): {
    gross: number;
    tax: number;
    net: number;
} {
    const tax = grossInterest * taxRate;
    const net = grossInterest - tax;
    return { gross: grossInterest, tax, net };
}

/**
 * Calculate monthly interest for savings account
 */
export function calculateMonthlyInterest(account: SavingsAccount): {
    gross: number;
    tax: number;
    net: number;
} {
    const grossInterest = calculateCompoundInterest(
        account.balance,
        account.interest_rate,
        account.compounding,
        1
    );
    return calculateNetInterest(grossInterest);
}

/**
 * Calculate annual projected interest
 */
export function calculateAnnualInterest(account: SavingsAccount): {
    gross: number;
    tax: number;
    net: number;
} {
    const grossInterest = calculateCompoundInterest(
        account.balance,
        account.interest_rate,
        account.compounding,
        12
    );
    return calculateNetInterest(grossInterest);
}

/**
 * Calculate future value projection
 */
export function calculateFutureValue(
    account: SavingsAccount,
    months: number
): {
    futureValue: number;
    totalInterest: {
        gross: number;
        tax: number;
        net: number;
    };
} {
    const grossInterest = calculateCompoundInterest(
        account.balance,
        account.interest_rate,
        account.compounding,
        months
    );
    const futureValue = account.balance + grossInterest;
    const totalInterest = calculateNetInterest(grossInterest);

    return {
        futureValue,
        totalInterest,
    };
}

/**
 * Calculate time deposit maturity
 */
export function calculateTimeDepositMaturity(deposit: TimeDeposit): {
    grossInterest: number;
    tax: number;
    netInterest: number;
    maturityValue: number;
    maturityDate: Date;
} {
    const grossInterest = (deposit.principal * deposit.interest_rate / 100 * deposit.duration_months) / 12;
    const tax = grossInterest * deposit.tax_rate;
    const netInterest = grossInterest - tax;
    const maturityValue = deposit.principal + netInterest;

    const startDate = new Date(deposit.start_date);
    const maturityDate = new Date(startDate);
    maturityDate.setMonth(maturityDate.getMonth() + deposit.duration_months);

    return {
        grossInterest,
        tax,
        netInterest,
        maturityValue,
        maturityDate,
    };
}

/**
 * Format currency in Philippine Peso
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
    return `${value.toFixed(decimals)}%`;
}
