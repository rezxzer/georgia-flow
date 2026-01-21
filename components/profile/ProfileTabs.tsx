'use client';

import React, { useState } from 'react';

interface ProfileTabsProps {
    children: React.ReactNode;
    defaultTab?: string;
}

export default function ProfileTabs({ children, defaultTab = 'places' }: ProfileTabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const tabs = [
        { id: 'places', label: 'ჩემი ადგილები', icon: '📍' },
        { id: 'events', label: 'ივენთები', icon: '📅' },
        { id: 'friends', label: 'მეგობრები', icon: '👥' },
        { id: 'messages', label: 'შეტყობინებები', icon: '💬' },
        { id: 'badges', label: 'საჩუქრები', icon: '🏆' },
    ];

    return (
        <div>
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child) && child.props.tabId === activeTab) {
                        return child;
                    }
                    return null;
                })}
            </div>
        </div>
    );
}

// Tab Panel Component
interface TabPanelProps {
    tabId: string;
    children: React.ReactNode;
}

export function TabPanel({ tabId, children }: TabPanelProps) {
    return <div>{children}</div>;
}
