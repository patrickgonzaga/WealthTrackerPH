import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    title: "WealthTrack PH - Personal Wealth Dashboard",
    description: "Track your savings, stocks, and time deposits in one place",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
            <body className="font-inter">
                <div className="fixed inset-0 bg-noise opacity-[0.03] pointer-events-none z-[100]" />
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
