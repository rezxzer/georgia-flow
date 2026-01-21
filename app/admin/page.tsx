'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';

interface Stats {
    users: number;
    places: number;
    events: number;
    ads: number;
    comments: number;
    ratings: number;
}

export default function AdminDashboard() {
    const supabase = createClient();
    const [stats, setStats] = useState<Stats>({
        users: 0,
        places: 0,
        events: 0,
        ads: 0,
        comments: 0,
        ratings: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [usersResult, placesResult, eventsResult, adsResult, commentsResult, ratingsResult] =
                await Promise.all([
                    supabase.from('profiles').select('id', { count: 'exact', head: true }),
                    supabase.from('places').select('id', { count: 'exact', head: true }),
                    supabase.from('events').select('id', { count: 'exact', head: true }),
                    supabase.from('ads').select('id', { count: 'exact', head: true }),
                    supabase.from('comments').select('id', { count: 'exact', head: true }),
                    supabase.from('ratings').select('id', { count: 'exact', head: true }),
                ]);

            setStats({
                users: usersResult.count || 0,
                places: placesResult.count || 0,
                events: eventsResult.count || 0,
                ads: adsResult.count || 0,
                comments: commentsResult.count || 0,
                ratings: ratingsResult.count || 0,
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const statCards = [
        { label: 'Users', value: stats.users, icon: '👥', color: 'bg-blue-500' },
        { label: 'Places', value: stats.places, icon: '📍', color: 'bg-green-500' },
        { label: 'Events', value: stats.events, icon: '📅', color: 'bg-purple-500' },
        { label: 'Ads', value: stats.ads, icon: '📢', color: 'bg-yellow-500' },
        { label: 'Comments', value: stats.comments, icon: '💬', color: 'bg-pink-500' },
        { label: 'Ratings', value: stats.ratings, icon: '⭐', color: 'bg-orange-500' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-text mb-8">Admin Dashboard</h1>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((stat) => (
                        <Card key={stat.label} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-text">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} p-4 rounded-full text-white text-3xl`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Recent Activity Section */}
            <div className="mt-8">
                <Card className="p-6">
                    <h2 className="text-xl font-bold text-text mb-4">Recent Activity</h2>
                    <p className="text-gray-500">Activity feed will be implemented here...</p>
                </Card>
            </div>
        </div>
    );
}
