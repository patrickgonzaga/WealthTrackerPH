'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock, Calendar, Download, Hourglass } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { TimeDeposit } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/Card';
import Modal from '@/components/Modal';
import { formatCurrency, calculateTimeDepositMaturity } from '@/utils/calculations';
import { exportToCSV } from '@/utils/export';

export default function TimeDepositsPage() {
    const { user } = useAuth();
    const [deposits, setDeposits] = useState<TimeDeposit[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDeposit, setEditingDeposit] = useState<TimeDeposit | null>(null);
    const [formData, setFormData] = useState({
        principal: '',
        interest_rate: '',
        duration_months: '',
        start_date: '',
    });

    useEffect(() => {
        if (user) {
            fetchDeposits();
        }
    }, [user]);

    const fetchDeposits = async () => {
        try {
            const { data, error } = await supabase
                .from('time_deposits')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDeposits(data || []);
        } catch (error) {
            console.error('Error fetching deposits:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const depositData = {
            user_id: user?.id,
            principal: parseFloat(formData.principal),
            interest_rate: parseFloat(formData.interest_rate),
            duration_months: parseInt(formData.duration_months),
            start_date: formData.start_date,
            tax_rate: 0.2,
        };

        try {
            if (editingDeposit) {
                const { error } = await supabase
                    .from('time_deposits')
                    .update(depositData)
                    .eq('id', editingDeposit.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('time_deposits')
                    .insert([depositData]);
                if (error) throw error;
            }

            fetchDeposits();
            closeModal();
        } catch (error) {
            console.error('Error saving deposit:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this time deposit?')) return;

        try {
            const { error } = await supabase
                .from('time_deposits')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchDeposits();
        } catch (error) {
            console.error('Error deleting deposit:', error);
        }
    };

    const openModal = (deposit?: TimeDeposit) => {
        if (deposit) {
            setEditingDeposit(deposit);
            setFormData({
                principal: deposit.principal.toString(),
                interest_rate: deposit.interest_rate.toString(),
                duration_months: deposit.duration_months.toString(),
                start_date: deposit.start_date,
            });
        } else {
            setEditingDeposit(null);
            setFormData({
                principal: '',
                interest_rate: '',
                duration_months: '',
                start_date: new Date().toISOString().split('T')[0],
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingDeposit(null);
    };

    const totalPrincipal = deposits.reduce((sum: number, dep: TimeDeposit) => sum + dep.principal, 0);
    const totalMaturityValue = deposits.reduce((sum: number, dep: TimeDeposit) => {
        const { maturityValue } = calculateTimeDepositMaturity(dep);
        return sum + maturityValue;
    }, 0);

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10">
            {/* Header */}
            <div className="mb-8">
                <p className="text-sm font-medium text-positive mb-2">Fixed-Term Savings</p>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                            Time Deposits
                        </h1>
                        <div className="flex items-center gap-4">
                            <p className="text-muted-foreground">
                                Total Principal: <span className="text-foreground font-semibold">{formatCurrency(totalPrincipal)}</span>
                            </p>
                            <p className="text-sm text-positive font-medium">
                                Maturity Value: {formatCurrency(totalMaturityValue)}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => exportToCSV(deposits, 'time_deposits')}
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
                            Add Deposit
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
            ) : deposits.length === 0 ? (
                <Card className="py-20">
                    <div className="text-center">
                        <Hourglass className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground mb-2">No time deposits yet</p>
                        <p className="text-sm text-muted-foreground">Start tracking your fixed-term investments</p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {deposits.map((deposit) => {
                        const maturity = calculateTimeDepositMaturity(deposit);
                        const daysUntilMaturity = Math.ceil(
                            (maturity.maturityDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                        );
                        const isMatured = daysUntilMaturity <= 0;

                        return (
                            <Card key={deposit.id} className="group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-positive" />
                                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${isMatured
                                            ? 'bg-positive/15 text-positive'
                                            : 'bg-primary/15 text-primary'
                                            }`}>
                                            {isMatured ? 'Matured' : `${daysUntilMaturity} days left`}
                                        </span>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openModal(deposit)}
                                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(deposit.id)}
                                            className="p-2 rounded-lg text-destructive/50 hover:text-destructive hover:bg-destructive/10 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Principal Amount</p>
                                        <p className="text-2xl font-bold text-foreground">
                                            {formatCurrency(deposit.principal)}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-white/[0.03]">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
                                            <p className="font-medium text-foreground">{deposit.interest_rate}% p.a.</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Term</p>
                                            <p className="font-medium text-foreground">{deposit.duration_months} months</p>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Timeline</span>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Start Date</span>
                                                <span className="text-foreground">{new Date(deposit.start_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Maturity Date</span>
                                                <span className="font-medium text-foreground">{maturity.maturityDate.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <div className="pt-2 border-t border-white/5">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Net Interest (after 20% tax)</span>
                                                    <span className="text-positive font-medium">{formatCurrency(maturity.netInterest)}</span>
                                                </div>
                                                <div className="flex justify-between text-base font-bold mt-2">
                                                    <span className="text-foreground">Maturity Value</span>
                                                    <span className="text-foreground">{formatCurrency(maturity.maturityValue)}</span>
                                                </div>
                                            </div>
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
                title={editingDeposit ? 'Edit Time Deposit' : 'Add Time Deposit'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Principal Amount (₱)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.principal}
                            onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-foreground transition-all"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                Interest Rate (% p.a.)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.interest_rate}
                                onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-foreground transition-all"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                Term (Months)
                            </label>
                            <input
                                type="number"
                                value={formData.duration_months}
                                onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                                required
                                min="1"
                                className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-foreground transition-all"
                                placeholder="12"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={formData.start_date}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-foreground transition-all"
                        />
                    </div>

                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                        <p className="text-xs text-primary font-medium mb-1">Tax Notice</p>
                        <p className="text-xs text-muted-foreground">
                            20% withholding tax will be applied to interest earnings as per Philippine tax regulations.
                        </p>
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
                            {editingDeposit ? 'Update Deposit' : 'Add Deposit'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
