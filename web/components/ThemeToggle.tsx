'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const isDark = document.documentElement.classList.contains('dark') ||
            (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setDarkMode(isDark);
    }, []);

    const toggleTheme = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);

        if (newDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className={`
                relative p-2.5 rounded-xl transition-all duration-300
                ${darkMode 
                    ? 'bg-white/5 hover:bg-white/10 text-yellow-400' 
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
                }
            `}
            aria-label="Toggle theme"
        >
            {darkMode ? (
                <Sun className="w-5 h-5" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
        </button>
    );
}
