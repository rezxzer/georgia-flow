'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/content', label: 'Content', icon: '📝' },
    { href: '/admin/events', label: 'Events', icon: '📅' },
    { href: '/admin/ads', label: 'Ads', icon: '📢' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const { isAdmin, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-text mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-4">You don&apos;t have permission to access this page.</p>
                    <Link href="/" className="text-primary hover:underline">
                        Go to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-20'
                    } bg-white shadow-lg transition-all duration-300 flex flex-col`}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && (
                            <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            {sidebarOpen ? '◀' : '▶'}
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-2">
                        {adminNavItems.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                                ? 'bg-primary text-white'
                                                : 'text-text hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        {sidebarOpen && <span className="font-medium">{item.label}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                    <Link
                        href="/"
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-text hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-xl">🏠</span>
                        {sidebarOpen && <span>Back to Home</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
