'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
    const pathname = usePathname();
    const { user, isAdmin, signOut } = useAuth();

    const navItems = [
        { href: '/', label: 'მთავარი', icon: '🏠' },
        { href: '/map', label: 'რუკა', icon: '🗺️' },
        { href: '/events', label: 'ივენთები', icon: '📅' },
    ];

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-primary">Georgia Flow</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === item.href
                                    ? 'text-primary bg-orange-50'
                                    : 'text-text hover:text-primary hover:bg-gray-50'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Language Switcher & Auth */}
                    <div className="flex items-center space-x-4">
                        <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                            <option value="ka">ქართული</option>
                            <option value="en">English</option>
                            <option value="ru">Русский</option>
                        </select>
                        {user ? (
                            <>
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname?.startsWith('/admin')
                                            ? 'text-primary bg-orange-50'
                                            : 'text-text hover:text-primary hover:bg-gray-50'
                                            }`}
                                    >
                                        <span>⚙️</span>
                                        <span>Admin</span>
                                    </Link>
                                )}
                                <Link
                                    href="/profile"
                                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/profile'
                                        ? 'text-primary bg-orange-50'
                                        : 'text-text hover:text-primary hover:bg-gray-50'
                                        }`}
                                >
                                    <span>👤</span>
                                    <span>პროფილი</span>
                                </Link>
                                <button
                                    onClick={signOut}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    გასვლა
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="text-sm text-primary hover:underline">
                                შესვლა
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
