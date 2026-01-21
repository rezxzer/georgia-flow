'use client';

import Image from 'next/image';
import Link from 'next/link';
import Card from '@/components/ui/Card';

interface PlaceCardProps {
    place: {
        id: number;
        name: string;
        description?: string;
        category: string;
        region: string;
        average_rating: number;
        rating_count: number;
        first_image?: string;
    };
}

export default function PlaceCard({ place }: PlaceCardProps) {
    const categoryLabels: Record<string, string> = {
        restaurant: '🍽️ რესტორანი',
        park: '🌳 პარკი',
        museum: '🏛️ მუზეუმი',
        nature: '🏔️ ბუნება',
        winery: '🍷 ღვინის ქარხანა',
        other: '📍 სხვა',
    };

    return (
        <Link href={`/places/${place.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                    {place.first_image ? (
                        <Image
                            src={place.first_image}
                            alt={place.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-4xl">📷</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-semibold text-lg text-text mb-1 line-clamp-1">
                        {place.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span>{categoryLabels[place.category] || place.category}</span>
                        <span>•</span>
                        <span>{place.region}</span>
                    </div>
                    {place.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {place.description}
                        </p>
                    )}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm font-medium ml-1">
                                {place.average_rating.toFixed(1)}
                            </span>
                        </div>
                        <span className="text-xs text-gray-500">
                            ({place.rating_count} შეფასება)
                        </span>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
