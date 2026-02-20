'use client';

import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    glow?: boolean;
}

export default function Card({ children, className = '', hover = true, glow = false }: CardProps) {
    return (
        <div
            className={`
                group glass-card
                p-6
                transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${hover ? 'hover:translate-y-[-4px] hover:border-white/20' : ''}
                ${glow ? 'neo-glow' : ''}
                ${className}
            `}
        >
            {/* Ambient background glow */}
            <div className={`
                absolute -inset-24 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 
                blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none
            `} />

            {/* Content */}
            <div className="relative z-10 font-inter">
                {children}
            </div>
        </div>
    );
}
