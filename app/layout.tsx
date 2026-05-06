import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
import Navigation from '@/components/Navigation';
import { Toaster } from 'sonner';

export const metadata = {
    title: 'Farsi - Consumer DeFi',
    description: 'Save together in cUSD on Celo',
    manifest: '/manifest.json',
};

import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-[#F8F9FA] dark:bg-[#0F1117] text-[#1A1A1A] dark:text-[#E2E8F0] antialiased">
                <ErrorBoundary>
                    <Providers>
                        <div className="flex flex-col min-h-screen max-w-[480px] mx-auto bg-white dark:bg-[#1A1D2E] shadow-xl relative overflow-hidden">
                            <main className="flex-1 overflow-y-auto pb-24">
                                {children}
                            </main>
                            <Navigation />
                        </div>
                    </Providers>
                </ErrorBoundary>
            </body>
        </html>
    );
}
