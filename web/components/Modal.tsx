'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-fade-in-up"
                    onClick={onClose}
                />

                {/* Modal */}
                <div 
                    className={`
                        relative 
                        ${sizeClasses[size]}
                        w-full
                        bg-gradient-to-br from-white/[0.1] to-white/[0.03]
                        backdrop-blur-2xl
                        rounded-2xl
                        shadow-2xl shadow-black/20
                        border border-white/10
                        p-8
                        animate-fade-in-up
                    `}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-foreground">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-300"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    {/* Content */}
                    <div className="relative">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
