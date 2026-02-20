'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, TrendingUp, Clock, DollarSign, PieChart as PieChartIcon, Sparkles, ArrowUpRight, ArrowDownRight, Coins, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { SavingsAccount, Stock, TimeDeposit, Crypto, Forex } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/Card';
import { formatCurrency } from '@/utils/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function DashboardPage() {
    const { user, session } = useAuth();
    const [savings, setSavings] = useState<SavingsAccount[]>([]);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [deposits, setDeposits] = useState<TimeDeposit[]>([]);
    const [crypto, setCrypto] = useState<Crypto[]>([]);
    const [forex, setForex] = useState<Forex[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (user && session) {
            fetchAllData();
        }
    }, [user, session]);

    const fetchAllData = async () => {
        try {
            const [savingsData, stocksData, depositsData, cryptoData, forexData] = await Promise.all([
                supabase.from('savings_accounts').select('*'),
                supabase.from('stocks').select('*'),
                supabase.from('time_deposits').select('*'),
                supabase.from('crypto').select('*'),
                supabase.from('forex').select('*'),
            ]);

            setSavings(savingsData.data || []);
            setStocks(stocksData.data || []);
            setDeposits(depositsData.data || []);
            setCrypto(cryptoData.data || []);
            setForex(forexData.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setDataLoading(false);
        }
    };

    const totalSavings = savings.reduce((sum, acc) => sum + acc.balance, 0);
    const totalStocks = stocks.reduce((sum, stock) => sum + (stock.quantity * stock.current_price), 0);
    const totalDeposits = deposits.reduce((sum, dep) => sum + dep.principal, 0);
    const totalCrypto = crypto.reduce((sum, c) => sum + (c.quantity * c.current_price), 0);
    const totalForex = forex.reduce((sum, f) => sum + (f.quantity * f.current_price), 0);
    const totalNetWorth = totalSavings + totalStocks + totalDeposits + totalCrypto + totalForex;

    const chartData = [
        { name: 'Savings', value: totalSavings, color: '#a855f7' },
        { name: 'Stocks', value: totalStocks, color: '#06b6d4' },
        { name: 'Crypto', value: totalCrypto, color: '#f59e0b' },
        { name: 'Forex', value: totalForex, color: '#3b82f6' },
        { name: 'Time Deposits', value: totalDeposits, color: '#22c55e' },
    ].filter(item => item.value > 0);

    const hasData = chartData.length > 0;

    return (
        <div className="relative min-h-screen p-6 md:p-12 max-w-[1600px] mx-auto pb-32 overflow-hidden">
            {/* Ambient Background Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header Section */}
            <div className="relative z-10 mb-12 animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-primary neo-glow" />
                            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold font-outfit">
                                Performance Overview
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 font-outfit tracking-tight">
                            Command <span className="text-gradient-primary">Center</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-xl font-medium">
                            Welcome back, {user?.email?.split('@')[0] || 'Agent'}. Your financial ecosystem is performing at optimal levels.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-2 rounded-2xl backdrop-blur-md">
                        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold mb-0.5">Session Status</p>
                            <p className="text-sm font-bold text-positive flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
                                Encrypted
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Stats Section */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <Card className="lg:col-span-2 !p-0 overflow-hidden group border-white/10" glow={true}>
                    <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between h-full bg-gradient-to-br from-primary/10 via-transparent to-accent/5">
                        <div className="flex flex-col justify-center">
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 font-outfit">Consolidated Net Worth</p>
                            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 font-outfit tracking-tighter">
                                {formatCurrency(totalNetWorth)}
                            </h2>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-positive/10 border border-positive/20 text-positive text-sm font-bold">
                                    <ArrowUpRight className="w-4 h-4" />
                                    <span>+12.4% this month</span>
                                </div>
                                <span className="text-muted-foreground text-sm font-medium italic">Peak performance detected</span>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center justify-center p-4">
                            <div className="w-48 h-48 rounded-full border border-white/5 flex items-center justify-center relative">
                                <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin [animation-duration:8s]" />
                                <div className="absolute inset-4 border-b-2 border-accent rounded-full animate-spin [animation-direction:reverse] [animation-duration:12s]" />
                                <PieChartIcon className="w-16 h-16 text-primary/50" />
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="flex flex-col justify-between border-white/10 bg-slate-900/40">
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-white font-outfit italic tracking-wide">AI Insights</h3>
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 border-l-primary border-l-2">
                                <p className="text-xs text-white font-bold mb-1 font-outfit uppercase tracking-wider">Stock Opportunity</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">Tech sector exposure is below 15%. Consider adding more high-growth assets.</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 border-l-accent border-l-2">
                                <p className="text-xs text-white font-bold mb-1 font-outfit uppercase tracking-wider">Savings Optimization</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">Emergency fund at 120% capacity. Ready for next investment cycle.</p>
                            </div>
                        </div>
                    </div>
                    <button className="mt-8 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest text-white transition-all">
                        Generate Full Report
                    </button>
                </Card>
            </div>

            {dataLoading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-muted-foreground font-outfit tracking-[0.2em] font-bold text-[10px] uppercase">Decrypting Assets...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
                        {[
                            { name: 'Liquidity', value: totalSavings, icon: Wallet, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/20' },
                            { name: 'Equity', value: totalStocks, icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/5', border: 'border-accent/20' },
                            { name: 'Digital', value: totalCrypto, icon: Coins, color: 'text-warning', bg: 'bg-warning/5', border: 'border-warning/20' },
                            { name: 'Currency', value: totalForex, icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
                            { name: 'Fixed Assets', value: totalDeposits, icon: Clock, color: 'text-positive', bg: 'bg-positive/5', border: 'border-positive/20' },
                        ].map((asset, i) => (
                            <Card key={asset.name} className={`bg-slate-900/20 border-white/5 hover:border-white/10 stagger-${i + 1} animate-fade-in-up`}>
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`p-4 rounded-2xl ${asset.bg} border ${asset.border}`}>
                                        <asset.icon className={`w-6 h-6 ${asset.color}`} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{asset.name}</p>
                                        <p className="text-2xl font-bold text-white font-outfit tracking-tight">{formatCurrency(asset.value)}</p>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                                        style={{ width: totalNetWorth > 0 ? `${(asset.value / totalNetWorth) * 100}%` : '0%' }}
                                    />
                                </div>
                                <div className="flex justify-between mt-3">
                                    <span className="text-[10px] font-bold text-muted-foreground">ALLOCATION</span>
                                    <span className="text-[10px] font-bold text-white">
                                        {totalNetWorth > 0 ? ((asset.value / totalNetWorth) * 100).toFixed(1) : '0'}%
                                    </span>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Chart & Distribution Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
                        <Card className="lg:col-span-2 bg-slate-900/40 border-white/5">
                            <h3 className="text-xl font-bold text-white mb-8 font-outfit uppercase tracking-wider flex items-center gap-2">
                                <PieChartIcon className="w-5 h-5 text-primary" />
                                Risk Distribution
                            </h3>

                            {hasData ? (
                                <div className="flex flex-col items-center">
                                    <div className="h-64 w-full relative mb-8">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={75}
                                                    outerRadius={100}
                                                    paddingAngle={8}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.color}
                                                            className="hover:opacity-80 transition-opacity"
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    content={({ active, payload }) => {
                                                        if (active && payload && payload.length) {
                                                            return (
                                                                <div className="bg-slate-950 border border-white/10 p-3 rounded-2xl shadow-2xl backdrop-blur-xl">
                                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">{payload[0].name}</p>
                                                                    <p className="text-lg font-bold text-white">{formatCurrency(payload[0].value as number)}</p>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global</p>
                                            <p className="text-2xl font-bold text-white font-outfit">₱{(totalNetWorth / 1000).toFixed(0)}k</p>
                                        </div>
                                    </div>

                                    <div className="w-full space-y-4">
                                        {chartData.map((item) => (
                                            <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                                    <span className="text-sm font-bold font-outfit text-white tracking-wide">{item.name}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-white">{formatCurrency(item.value)}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{((item.value / totalNetWorth) * 100).toFixed(1)}%</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-80 flex flex-col items-center justify-center text-center opacity-50 grayscale">
                                    <div className="w-20 h-20 rounded-full border border-dashed border-muted-foreground flex items-center justify-center mb-6">
                                        <PieChartIcon className="w-10 h-10 text-muted-foreground" />
                                    </div>
                                    <p className="text-muted-foreground font-bold tracking-widest text-[10px] uppercase font-outfit">Waiting for Data Inflow...</p>
                                </div>
                            )}
                        </Card>

                        <Card className="lg:col-span-3 bg-slate-900/40 border-white/5 overflow-hidden ring-offset-slate-950">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-white font-outfit uppercase tracking-wider">Asset Registry</h3>
                                <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                                    LIVE FEED
                                </div>
                            </div>

                            <div className="space-y-6">
                                {savings.slice(0, 2).map((acc) => (
                                    <div key={acc.id} className="group relative">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:border-primary/40 transition-colors">
                                                    <Wallet className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white font-outfit uppercase tracking-wide">{acc.bank_name}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{acc.account_type}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-white font-outfit">{formatCurrency(acc.balance)}</p>
                                                <p className="text-[10px] text-positive font-bold flex items-center justify-end gap-1 uppercase">
                                                    Active <span className="w-1 h-1 rounded-full bg-positive" />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {stocks.slice(0, 2).map((stock) => {
                                    const current = stock.quantity * stock.current_price;
                                    const invested = stock.quantity * stock.avg_price;
                                    const gain = current - invested;
                                    const isPositive = gain >= 0;

                                    return (
                                        <div key={stock.id} className="group relative">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:border-accent/40 transition-colors">
                                                        <TrendingUp className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white font-outfit uppercase tracking-wide">{stock.symbol}</p>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Equity Asset</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-white font-outfit">{formatCurrency(current)}</p>
                                                    <div className={`text-[10px] font-bold flex items-center justify-end gap-1 uppercase ${isPositive ? 'text-positive' : 'text-destructive'}`}>
                                                        {isPositive ? '+' : ''}{((gain / invested) * 100).toFixed(1)}% Yield
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {savings.length === 0 && stocks.length === 0 && (
                                    <div className="py-20 text-center flex flex-col items-center">
                                        <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center mb-6">
                                            <DollarSign className="w-8 h-8 text-muted-foreground/30" />
                                        </div>
                                        <p className="text-white font-bold font-outfit uppercase tracking-[0.2em] mb-2">Registry Empty</p>
                                        <p className="text-sm text-muted-foreground max-w-xs px-8">Initiate your portfolio by connecting bank accounts or adding asset holdings.</p>
                                    </div>
                                )}
                            </div>

                            <button className="mt-12 w-full py-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-white transition-all">
                                View Full Registry Data
                            </button>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
