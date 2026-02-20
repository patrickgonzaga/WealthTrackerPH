'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, TrendingUp, Clock, LogOut, Shield, Coins, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Savings', href: '/savings', icon: Wallet },
    { name: 'Stocks', href: '/stocks', icon: TrendingUp },
    { name: 'Crypto', href: '/crypto', icon: Coins },
    { name: 'Forex', href: '/forex', icon: Globe },
    { name: 'Time Deposits', href: '/time-deposits', icon: Clock },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { signOut, user } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    return (
        <div className="hidden md:flex md:flex-col md:w-72 md:fixed md:inset-y-0 bg-slate-950/20 backdrop-blur-3xl border-r border-white/5 z-50">
            <div className="flex flex-col flex-1 min-h-0">
                {/* Logo Section */}
                <div className="flex items-center h-24 flex-shrink-0 px-8">
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                            <div className="relative w-11 h-11 rounded-xl bg-slate-950 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                                <Shield className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                            </div>
                        </div>
                        <div className="font-outfit">
                            <h1 className="text-xl font-bold tracking-tight text-white">
                                WealthTrack
                            </h1>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                                Pro Edition
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Navigation Section */}
                <div className="flex-1 flex flex-col py-8 px-6 overflow-y-auto">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.25em] mb-6 px-4">
                        Management
                    </p>
                    <nav className="space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        group flex items-center px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-500
                                        ${isActive
                                            ? 'bg-primary/10 text-white border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.1)]'
                                            : 'text-muted-foreground hover:text-white hover:bg-white/[0.03] border border-transparent'
                                        }
                                    `}
                                >
                                    <div className={`
                                        p-2 rounded-lg mr-3 transition-all duration-500
                                        ${isActive ? 'bg-primary/20 text-primary' : 'bg-transparent text-muted-foreground group-hover:text-white'}
                                    `}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-outfit tracking-wide">{item.name}</span>
                                    {isActive && (
                                        <div className="ml-auto w-1 h-4 rounded-full bg-primary shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Section */}
                <div className="p-6">
                    <div className="rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 p-5 relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700" />

                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center font-outfit font-bold text-primary">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate font-outfit">
                                    {user?.email?.split('@')[0] || 'User'}
                                </p>
                                <p className="text-[10px] text-muted-foreground truncate font-medium">
                                    Premium Plan
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleSignOut}
                            className="flex items-center justify-center w-full px-4 py-3 text-xs font-bold text-white bg-white/5 hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all duration-300 border border-white/5 relative z-10"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            End Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
