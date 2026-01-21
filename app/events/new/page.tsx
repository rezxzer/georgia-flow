'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import EventForm from '@/components/events/EventForm';
import type { EventInput } from '@/lib/validations/events';
import { useState } from 'react';

export default function NewEventPage() {
    const router = useRouter();
    const { user } = useAuth();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: EventInput) => {
        if (!user) return;

        setIsLoading(true);
        try {
            const { data: event, error } = await supabase
                .from('events')
                .insert({
                    user_id: user.id,
                    name: data.name,
                    description: data.description || null,
                    event_type: data.event_type,
                    start_date: data.start_date,
                    end_date: data.end_date || null,
                    location: data.location,
                    latitude: data.latitude || null,
                    longitude: data.longitude || null,
                })
                .select()
                .single();

            if (error) throw error;

            router.push(`/events/${event.id}`);
        } catch (error: any) {
            console.error('Error creating event:', error);
            alert(error.message || 'An error occurred while creating the event');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <Card>
                    <h1 className="text-2xl font-bold text-text mb-6">ახალი ივენთის დამატება</h1>
                    <EventForm onSubmit={handleSubmit} isLoading={isLoading} />
                </Card>
            </div>
        </ProtectedRoute>
    );
}
