'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';

export default function ProtectedLayout({
    children,
}: {
    children: ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        console.log('ProtectedLayout: useEffect Auth State:', { user: !!user, loading });
        if (!loading && !user) {
            console.log('ProtectedLayout: No user, redirecting to login');
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground text-sm">Verifying access...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent">
            <Sidebar />
            <div className="md:pl-64 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 pb-20 md:pb-8 relative z-10">
                    {children}
                </main>
                <MobileNav />
            </div>
        </div>
    );
}
