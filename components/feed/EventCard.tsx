'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';

interface EventCardProps {
    event: {
        id: number;
        name: string;
        description?: string;
        event_type: string;
        location: string;
        start_date: string;
        end_date?: string;
    };
}

export default function EventCard({ event }: EventCardProps) {
    const eventTypeLabels: Record<string, string> = {
        concert: '🎵 კონცერტი',
        festival: '🎉 ფესტივალი',
        tour: '🚌 ტური',
        other: '📅 სხვა',
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ka-GE', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Link href={`/events/${event.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full border-l-4 border-primary">
                <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-text line-clamp-1 flex-1">
                            {event.name}
                        </h3>
                        <span className="text-sm text-gray-500 ml-2">
                            {eventTypeLabels[event.event_type] || event.event_type}
                        </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                        <p>📅 {formatDate(event.start_date)}</p>
                        <p>📍 {event.location}</p>
                    </div>
                    {event.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {event.description}
                        </p>
                    )}
                </div>
            </Card>
        </Link>
    );
}
