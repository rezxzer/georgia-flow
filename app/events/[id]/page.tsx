'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CommentsSection from '@/components/comments/CommentsSection';
import LikeButton from '@/components/likes/LikeButton';
import MapEmbed from '@/components/map/MapEmbed';
import AdBanner from '@/components/ads/AdBanner';
import { getActiveAds, trackImpression } from '@/lib/utils/ads';

interface Event {
    id: number;
    name: string;
    description?: string;
    event_type: string;
    start_date: string;
    end_date?: string;
    location: string;
    latitude?: number;
    longitude?: number;
    user_id: string;
    created_at: string;
}

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const supabase = createClient();
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [ad, setAd] = useState<any>(null);

    useEffect(() => {
        if (params.id) {
            loadEvent();
            loadAd();
        }
    }, [params.id]);

    const loadAd = async () => {
        const ads = await getActiveAds('event_detail', 'banner');
        if (ads.length > 0) {
            const randomAd = ads[Math.floor(Math.random() * ads.length)];
            setAd(randomAd);
            trackImpression(randomAd.id);
        }
    };

    const loadEvent = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error) throw error;
            setEvent(data);
        } catch (error) {
            console.error('Error loading event:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <p className="text-center text-text">Event not found</p>
                </Card>
            </div>
        );
    }

    const eventTypeLabels: Record<string, string> = {
        concert: 'კონცერტი',
        festival: 'ფესტივალი',
        tour: 'ტური',
        other: 'სხვა',
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ka-GE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-text mb-2">{event.name}</h1>
                                <div className="flex gap-2 text-sm text-gray-600 mb-2">
                                    <span>{eventTypeLabels[event.event_type] || event.event_type}</span>
                                    <span>•</span>
                                    <span>{event.location}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>დაწყება: {formatDate(event.start_date)}</p>
                                    {event.end_date && (
                                        <p>დასრულება: {formatDate(event.end_date)}</p>
                                    )}
                                </div>
                            </div>
                            {user?.id === event.user_id && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push(`/events/${event.id}/edit`)}
                                >
                                    ✏️ რედაქტირება
                                </Button>
                            )}
                        </div>

                        {event.description && (
                            <p className="text-text mb-4 whitespace-pre-line">{event.description}</p>
                        )}

                        {/* Like Button */}
                        <div className="mb-4">
                            <LikeButton eventId={event.id} />
                        </div>
                    </Card>

                    {/* Comments Section */}
                    <Card>
                        <CommentsSection eventId={event.id} />
                    </Card>

                    {/* Ad Banner */}
                    {ad && (
                        <div className="mt-6">
                            <AdBanner ad={ad} />
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Map */}
                    {event.latitude && event.longitude && (
                        <Card>
                            <h2 className="text-lg font-semibold text-text mb-4">ლოკაცია</h2>
                            <MapEmbed
                                lat={event.latitude}
                                lng={event.longitude}
                                title={event.name}
                                height="300px"
                            />
                        </Card>
                    )}

                    {/* Actions */}
                    <Card>
                        <div className="space-y-3">
                            <Button variant="primary" className="w-full">
                                ✅ RSVP
                            </Button>
                            <Button variant="outline" className="w-full">
                                📤 გაზიარება
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
