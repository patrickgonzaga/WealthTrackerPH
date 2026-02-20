'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, Download, Package, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Forex } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/Card';
import Modal from '@/components/Modal';
import { formatCurrency, formatPercentage } from '@/utils/calculations';
import { exportToCSV } from '@/utils/export';

export default function ForexPage() {
    const { user } = useAuth();
    const [forex, setForex] = useState<Forex[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingForex, setEditingForex] = useState<Forex | null>(null);
    const [formData, setFormData] = useState({
        symbol: '',
        quantity: '',
        avg_price: '',
        current_price: '',
    });

    useEffect(() => {
        if (user) {
            fetchForex();
        }
    }, [user]);

    const fetchForex = async () => {
        try {
            const { data, error } = await supabase
                .from('forex')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setForex(data || []);
        } catch (error) {
            console.error('Error fetching forex:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const forexData = {
            user_id: user?.id,
            symbol: formData.symbol.toUpperCase(),
            quantity: parseFloat(formData.quantity),
            avg_price: parseFloat(formData.avg_price),
            current_price: parseFloat(formData.current_price),
        };

        try {
            if (editingForex) {
                const { error } = await supabase
                    .from('forex')
                    .update(forexData)
                    .eq('id', editingForex.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('forex')
                    .insert([forexData]);
                if (error) throw error;
            }

            fetchForex();
            closeModal();
        } catch (error) {
            console.error('Error saving forex:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this forex asset?')) return;

        try {
            const { error } = await supabase
                .from('forex')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchForex();
        } catch (error) {
            console.error('Error deleting forex:', error);
        }
    };

    const openModal = (asset?: Forex) => {
        if (asset) {
            setEditingForex(asset);
            setFormData({
                symbol: asset.symbol,
                quantity: asset.quantity.toString(),
                avg_price: asset.avg_price.toString(),
                current_price: asset.current_price.toString(),
            });
        } else {
            setEditingForex(null);
            setFormData({
                symbol: '',
                quantity: '',
                avg_price: '',
                current_price: '',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingForex(null);
    };

    const calculateMetrics = (asset: Forex) => {
        const totalInvested = asset.quantity * asset.avg_price;
        const currentValue = asset.quantity * asset.current_price;
        const gainLoss = currentValue - totalInvested;
        const gainLossPercent = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;

        return {
            totalInvested,
            currentValue,
            gainLoss,
            gainLossPercent,
        };
    };

    const totalInvested = forex.reduce((sum: number, asset: Forex) => sum + (asset.quantity * asset.avg_price), 0);
    const totalCurrentValue = forex.reduce((sum: number, asset: Forex) => sum + (asset.quantity * asset.current_price), 0);
    const totalGainLoss = totalCurrentValue - totalInvested;
    const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10">
            {/* Header */}
            <div className="mb-8">
                <p className="text-sm font-medium text-accent mb-2">Currency Exchange</p>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                            <Globe className="w-8 h-8 text-primary" />
                            Forex Portfolio
                        </h1>
                        <div className="flex items-center gap-4">
                            <p className="text-muted-foreground">
                                Total Value: <span className="text-foreground font-semibold">{formatCurrency(totalCurrentValue)}</span>
                            </p>
                            <div className={`flex items-center gap-1 text-sm font-medium ${totalGainLoss >= 0 ? 'text-positive' : 'text-destructive'}`}>
                                {totalGainLoss >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                <span>{formatPercentage(totalGainLossPercent)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => exportToCSV(forex, 'forex_portfolio')}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground rounded-xl transition-all duration-300 border border-white/5 text-sm font-medium"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button
                            onClick={() => openModal()}
                            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Add Forex
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
            ) : forex.length === 0 ? (
                <Card className="py-20">
                    <div className="text-center">
                        <Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground mb-2">No forex assets added yet</p>
                        <p className="text-sm text-muted-foreground">Start tracking your foreign exchange positions</p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-4">
                    {forex.map((asset) => {
                        const metrics = calculateMetrics(asset);
                        const isGain = metrics.gainLoss >= 0;

                        return (
                            <Card key={asset.id} className="group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-foreground">
                                                    {asset.symbol}
                                                </h3>
                                                <p className="text-xs text-muted-foreground">{asset.quantity.toLocaleString()} units</p>
                                            </div>
                                            <div className="flex gap-2 md:hidden">
                                                <button
                                                    onClick={() => openModal(asset)}
                                                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(asset.id)}
                                                    className="p-2 rounded-lg text-destructive/50 hover:text-destructive hover:bg-destructive/10 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                                                <p className="font-medium text-foreground">{asset.quantity.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Avg Rate</p>
                                                <p className="font-medium text-foreground">{asset.avg_price.toFixed(4)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Current Rate</p>
                                                <p className="font-medium text-foreground">{asset.current_price.toFixed(4)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Total Cost (₱)</p>
                                                <p className="font-medium text-foreground">{formatCurrency(metrics.totalInvested)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0">
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground mb-1">Current Value (₱)</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {formatCurrency(metrics.currentValue)}
                                            </p>
                                            <div className={`flex items-center justify-end gap-1 text-sm font-medium ${isGain ? 'text-positive' : 'text-destructive'}`}>
                                                {isGain ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                                <span>{formatCurrency(Math.abs(metrics.gainLoss))} ({formatPercentage(metrics.gainLossPercent)})</span>
                                            </div>
                                        </div>

                                        <div className="hidden md:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button
                                                onClick={() => openModal(asset)}
                                                className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(asset.id)}
                                                className="p-2.5 rounded-xl text-destructive/50 hover:text-destructive hover:bg-destructive/10 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingForex ? 'Edit Forex Position' : 'Add New Forex Position'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Currency Pair
                        </label>
                        <input
                            type="text"
                            value={formData.symbol}
                            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-foreground transition-all placeholder:text-muted-foreground/50 uppercase"
                            placeholder="e.g., USD/PHP, EUR/USD"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                Quantity (Units)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-foreground transition-all"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                Avg Rate (₱)
                            </label>
                            <input
                                type="number"
                                step="0.0001"
                                value={formData.avg_price}
                                onChange={(e) => setFormData({ ...formData, avg_price: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-foreground transition-all"
                                placeholder="0.0000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Current Rate (₱)
                        </label>
                        <input
                            type="number"
                            step="0.0001"
                            value={formData.current_price}
                            onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-foreground transition-all"
                            placeholder="Current exchange rate"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 h-11 bg-white/5 hover:bg-white/10 text-muted-foreground font-medium rounded-xl transition-all border border-white/5"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 h-11 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-all shadow-lg shadow-primary/20"
                        >
                            {editingForex ? 'Update Position' : 'Add Position'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
