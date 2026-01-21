'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface Event {
    id: number;
    name: string;
    event_type: string;
    start_date: string;
    created_at: string;
}

export default function AdminEventsPage() {
    const router = useRouter();
    const supabase = createClient();
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('events')
                .select('id, name, event_type, start_date, created_at')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setEvents(data as Event[]);
            }
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (eventId: number) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            const { error } = await supabase.from('events').delete().eq('id', eventId);
            if (!error) {
                await loadEvents();
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-text">Events Management</h1>
                <Button variant="primary" onClick={() => router.push('/events/new')}>
                    + Create Event
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left p-4 text-sm font-semibold text-text">Name</th>
                                    <th className="text-left p-4 text-sm font-semibold text-text">Type</th>
                                    <th className="text-left p-4 text-sm font-semibold text-text">Start Date</th>
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
                                                className="text-primary hover:underline font-medium"
                                            >
                                                {event.name}
                                            </button>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">{event.event_type}</td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {new Date(event.start_date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {new Date(event.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.push(`/events/${event.id}/edit`)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(event.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {events.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No events found</div>
                    )}
                </Card>
            )}
        </div>
    );
}
