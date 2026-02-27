import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
import Navigation from '@/components/Navigation';
import { Toaster } from 'sonner';

export const metadata = {
    title: 'Farsi - Consumer DeFi',
    description: 'Premium finance for everyone on Flow EVM',
    manifest: '/manifest.json',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </head>
            <body className="bg-[#F8F9FA] text-[#1A1A1A] antialiased">
                <Providers>
                    <Toaster position="top-center" richColors />
                    <div className="flex flex-col min-h-screen max-w-[480px] mx-auto bg-white shadow-xl relative overflow-hidden">
                        <main className="flex-1 overflow-y-auto pb-24">
                            {children}
                        </main>
                        <Navigation />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
