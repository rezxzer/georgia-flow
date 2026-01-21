'use client';

import Card from '@/components/ui/Card';

export default function AdminAnalyticsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-text mb-8">Analytics</h1>

            <Card className="p-6">
                <p className="text-gray-500">Analytics charts and export functionality will be implemented here...</p>
                <p className="text-sm text-gray-400 mt-2">
                    (Chart.js integration for users growth, popular categories, etc.)
                </p>
            </Card>
        </div>
    );
}
