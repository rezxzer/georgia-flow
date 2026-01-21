'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface Place {
    id: number;
    name: string;
    user_id: string;
    created_at: string;
}

interface Event {
    id: number;
    name: string;
    user_id: string;
    created_at: string;
}

interface Comment {
    id: number;
    content: string;
    user_id: string;
    place_id?: number;
    event_id?: number;
    created_at: string;
}

export default function AdminContentPage() {
    const router = useRouter();
    const supabase = createClient();
    const [activeTab, setActiveTab] = useState<'places' | 'events' | 'comments'>('places');
    const [places, setPlaces] = useState<Place[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadContent();
    }, [activeTab]);

    const loadContent = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'places') {
                const { data, error } = await supabase
                    .from('places')
                    .select('id, name, user_id, created_at')
                    .order('created_at', { ascending: false })
                    .limit(50);

                if (!error && data) {
                    setPlaces(data as Place[]);
                }
            } else if (activeTab === 'events') {
                const { data, error } = await supabase
                    .from('events')
                    .select('id, name, user_id, created_at')
                    .order('created_at', { ascending: false })
                    .limit(50);

                if (!error && data) {
                    setEvents(data as Event[]);
                }
            } else if (activeTab === 'comments') {
                const { data, error } = await supabase
                    .from('comments')
                    .select('id, content, user_id, place_id, event_id, created_at')
                    .order('created_at', { ascending: false })
                    .limit(50);

                if (!error && data) {
                    setComments(data as Comment[]);
                }
            }
        } catch (error) {
            console.error('Error loading content:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (type: 'place' | 'event' | 'comment', id: number) => {
        if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

        try {
            const tableName = type === 'place' ? 'places' : type === 'event' ? 'events' : 'comments';
            const { error } = await supabase.from(tableName).delete().eq('id', id);

            if (!error) {
                await loadContent();
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-text mb-8">Content Moderation</h1>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b border-gray-200">
                {(['places', 'events', 'comments'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-medium transition-colors ${activeTab === tab
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-600 hover:text-text'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <Card>
                    <div className="overflow-x-auto">
                        {activeTab === 'places' && (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left p-4 text-sm font-semibold text-text">Name</th>
                                        <th className="text-left p-4 text-sm font-semibold text-text">Created</th>
                                        <th className="text-left p-4 text-sm font-semibold text-text">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {places.map((place) => (
                                        <tr key={place.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4">
                                                <button
                                                    onClick={() => router.push(`/places/${place.id}`)}
                                                    className="text-primary hover:underline"
                                                >
                                                    {place.name}
                                                </button>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {new Date(place.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete('place', place.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'events' && (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left p-4 text-sm font-semibold text-text">Name</th>
                                        <th className="text-left p-4 text-sm font-semibold text-text">Created</th>
                                        <th className="text-left p-4 text-sm font-semibold text-text">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((event) => (
                                        <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4">
                                                <button
                                                    onClick={() => router.push(`/events/${event.id}`)}
                                                    className="text-primary hover:underline"
                                                >
                                                    {event.name}
                                                </button>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {new Date(event.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete('event', event.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'comments' && (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left p-4 text-sm font-semibold text-text">Content</th>
                                        <th className="text-left p-4 text-sm font-semibold text-text">Type</th>
                                        <th className="text-left p-4 text-sm font-semibold text-text">Created</th>
                                        <th className="text-left p-4 text-sm font-semibold text-text">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comments.map((comment) => (
                                        <tr key={comment.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4">
                                                <p className="text-sm text-text line-clamp-2">{comment.content}</p>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {comment.place_id ? 'Place' : 'Event'}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete('comment', comment.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}
