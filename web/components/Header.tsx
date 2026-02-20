'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { LogOut, Shield } from 'lucide-react';

export default function Header() {
    const { signOut, user } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    return (
        <header className="md:hidden sticky top-0 z-40 glass border-b border-white/5">
            <div className="flex items-center justify-between h-16 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <h1 className="text-lg font-bold text-foreground">
                        WealthTrack
                    </h1>
                </div>
                <button
                    onClick={handleSignOut}
                    className="p-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
                    aria-label="Sign out"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
