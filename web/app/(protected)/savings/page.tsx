'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, TrendingUp, Wallet, Download, Building2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { SavingsAccount } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/Card';
import Modal from '@/components/Modal';
import { formatCurrency, calculateMonthlyInterest, calculateAnnualInterest } from '@/utils/calculations';
import { exportToCSV } from '@/utils/export';

export default function SavingsPage() {
    const { user } = useAuth();
    const [accounts, setAccounts] = useState<SavingsAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<SavingsAccount | null>(null);
    const [formData, setFormData] = useState({
        bank_name: '',
        account_type: 'digital' as 'digital' | 'traditional',
        balance: '',
        interest_rate: '',
        compounding: 'monthly' as 'monthly' | 'quarterly' | 'annually',
    });

    useEffect(() => {
        if (user) {
            fetchAccounts();
        }
    }, [user]);

    const fetchAccounts = async () => {
        try {
            const { data, error } = await supabase
                .from('savings_accounts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAccounts(data || []);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const accountData = {
            user_id: user?.id,
            bank_name: formData.bank_name,
            account_type: formData.account_type,
            balance: parseFloat(formData.balance),
            interest_rate: parseFloat(formData.interest_rate),
            compounding: formData.compounding,
        };

        try {
            if (editingAccount) {
                const { error } = await supabase
                    .from('savings_accounts')
                    .update(accountData)
                    .eq('id', editingAccount.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('savings_accounts')
                    .insert([accountData]);
                if (error) throw error;
            }

            fetchAccounts();
            closeModal();
        } catch (error) {
            console.error('Error saving account:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this account?')) return;

        try {
            const { error } = await supabase
                .from('savings_accounts')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchAccounts();
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const openModal = (account?: SavingsAccount) => {
        if (account) {
            setEditingAccount(account);
            setFormData({
                bank_name: account.bank_name,
                account_type: account.account_type,
                balance: account.balance.toString(),
                interest_rate: account.interest_rate.toString(),
                compounding: account.compounding,
            });
        } else {
            setEditingAccount(null);
            setFormData({
                bank_name: '',
                account_type: 'digital',
                balance: '',
                interest_rate: '',
                compounding: 'monthly',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAccount(null);
    };

    const totalSavings = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10">
            {/* Header */}
            <div className="mb-8">
                <p className="text-sm font-medium text-primary mb-2">Liquid Assets</p>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                            Savings Accounts
                        </h1>
                        <p className="text-muted-foreground">
                            Total Balance: <span className="text-foreground font-semibold">{formatCurrency(totalSavings)}</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => exportToCSV(accounts, 'savings_accounts')}
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
                            Add Account
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
            ) : accounts.length === 0 ? (
                <Card className="py-20">
                    <div className="text-center">
                        <Building2 className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground mb-2">No accounts added yet</p>
                        <p className="text-sm text-muted-foreground">Start tracking your bank accounts and savings</p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {accounts.map((account) => {
                        const monthlyInterest = calculateMonthlyInterest(account);
                        const annualInterest = calculateAnnualInterest(account);

                        return (
                            <Card key={account.id} className="group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">
                                            {account.bank_name}
                                        </h3>
                                        <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-xs font-medium capitalize">
                                            {account.account_type}
                                        </span>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openModal(account)}
                                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(account.id)}
                                            className="p-2 rounded-lg text-destructive/50 hover:text-destructive hover:bg-destructive/10 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Current Balance</p>
                                        <p className="text-2xl font-bold text-foreground">
                                            {formatCurrency(account.balance)}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-white/[0.03]">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
                                            <p className="font-medium text-foreground">{account.interest_rate}% p.a.</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Compounding</p>
                                            <p className="font-medium text-foreground capitalize">{account.compounding}</p>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <div className="flex items-center gap-2 mb-3">
                                            <TrendingUp className="w-4 h-4 text-positive" />
                                            <span className="text-xs text-muted-foreground">Interest Projections (after 20% tax)</span>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Monthly</span>
                                                <span className="font-medium text-foreground">{formatCurrency(monthlyInterest.net)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Annual</span>
                                                <span className="font-medium text-positive">{formatCurrency(annualInterest.net)}</span>
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
                title={editingAccount ? 'Edit Account' : 'Add Savings Account'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Bank Name
                        </label>
                        <input
                            type="text"
                            value={formData.bank_name}
                            onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-foreground transition-all placeholder:text-muted-foreground/50"
                            placeholder="e.g., BDO, BPI, GCash"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Account Type
                        </label>
                        <select
                            value={formData.account_type}
                            onChange={(e) => setFormData({ ...formData, account_type: e.target.value as 'digital' | 'traditional' })}
                            className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-foreground transition-all"
                        >
                            <option value="digital">Digital Bank (e.g., GCash, Maya)</option>
                            <option value="traditional">Traditional Bank (e.g., BDO, BPI)</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                Balance (₱)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.balance}
                                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-foreground transition-all"
                                placeholder="0.00"
                            />
                        </div>

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
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Compounding Frequency
                        </label>
                        <select
                            value={formData.compounding}
                            onChange={(e) => setFormData({ ...formData, compounding: e.target.value as 'monthly' | 'quarterly' | 'annually' })}
                            className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-foreground transition-all"
                        >
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="annually">Annually</option>
                        </select>
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
                            {editingAccount ? 'Update Account' : 'Add Account'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
