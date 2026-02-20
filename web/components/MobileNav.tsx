'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, TrendingUp, Clock } from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Savings', href: '/savings', icon: Wallet },
    { name: 'Stocks', href: '/stocks', icon: TrendingUp },
    { name: 'Time', href: '/time-deposits', icon: Clock },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/5 z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                flex flex-col items-center justify-center flex-1 h-full transition-all duration-300
                                ${isActive ? 'text-primary' : 'text-muted-foreground'}
                            `}
                        >
                            <div className={`
                                relative p-2 rounded-xl transition-all duration-300
                                ${isActive ? 'bg-primary/15' : ''}
                            `}>
                                <item.icon className={`
                                    h-5 w-5 transition-all duration-300
                                    ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]' : ''}
                                `} />
                                {isActive && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                                )}
                            </div>
                            <span className="text-[11px] font-medium mt-0.5">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
