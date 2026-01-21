'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CommentsSection from '@/components/comments/CommentsSection';
import RatingSection from '@/components/ratings/RatingSection';
import LikeButton from '@/components/likes/LikeButton';
import MapEmbed from '@/components/map/MapEmbed';
import AdBanner from '@/components/ads/AdBanner';
import { getActiveAds, trackImpression } from '@/lib/utils/ads';

interface Place {
    id: number;
    name: string;
    description?: string;
    category: string;
    region: string;
    latitude?: number;
    longitude?: number;
    average_rating: number;
    rating_count: number;
    user_id: string;
    created_at: string;
}

interface PlaceMedia {
    id: number;
    media_url: string;
    media_type: 'image' | 'video';
    display_order: number;
}

export default function PlaceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const supabase = createClient();
    const [place, setPlace] = useState<Place | null>(null);
    const [media, setMedia] = useState<PlaceMedia[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [ad, setAd] = useState<any>(null);

    useEffect(() => {
        if (params.id) {
            loadPlace();
            loadAd();
        }
    }, [params.id]);

    const loadAd = async () => {
        const ads = await getActiveAds('place_detail', 'banner');
        if (ads.length > 0) {
            const randomAd = ads[Math.floor(Math.random() * ads.length)];
            setAd(randomAd);
            trackImpression(randomAd.id);
        }
    };

    const loadPlace = async () => {
        try {
            const { data: placeData, error: placeError } = await supabase
                .from('places')
                .select('*')
                .eq('id', params.id)
                .single();

            if (placeError) throw placeError;
            setPlace(placeData);

            // Load media
            const { data: mediaData, error: mediaError } = await supabase
                .from('place_media')
                .select('*')
                .eq('place_id', params.id)
                .order('display_order');

            if (!mediaError && mediaData) {
                setMedia(mediaData);
            }
        } catch (error) {
            console.error('Error loading place:', error);
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

    if (!place) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <p className="text-center text-text">Place not found</p>
                </Card>
            </div>
        );
    }

    const categoryLabels: Record<string, string> = {
        restaurant: 'რესტორანი',
        park: 'პარკი',
        museum: 'მუზეუმი',
        nature: 'ბუნება',
        winery: 'ღვინის ქარხანა',
        other: 'სხვა',
    };

    const regionLabels: Record<string, string> = {
        tbilisi: 'თბილისი',
        batumi: 'ბათუმი',
        kutaisi: 'ქუთაისი',
        svaneti: 'სვანეთი',
        kakheti: 'კახეთი',
        adjara: 'აჭარა',
        imereti: 'იმერეთი',
        samegrelo: 'სამეგრელო',
        other: 'სხვა',
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Media Gallery */}
            {media.length > 0 && (
                <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {media.slice(0, 6).map((item) => (
                            <div key={item.id} className="relative h-64 rounded-lg overflow-hidden">
                                {item.media_type === 'image' ? (
                                    <Image
                                        src={item.media_url}
                                        alt={place.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <video
                                        src={item.media_url}
                                        className="w-full h-full object-cover"
                                        controls
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-text mb-2">{place.name}</h1>
                                <div className="flex gap-2 text-sm text-gray-600">
                                    <span>{categoryLabels[place.category] || place.category}</span>
                                    <span>•</span>
                                    <span>{regionLabels[place.region] || place.region}</span>
                                </div>
                            </div>
                            {user?.id === place.user_id && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push(`/places/${place.id}/edit`)}
                                >
                                    ✏️ რედაქტირება
                                </Button>
                            )}
                        </div>

                        {place.description && (
                            <p className="text-text mb-4 whitespace-pre-line">{place.description}</p>
                        )}

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`text-2xl ${star <= Math.round(place.average_rating)
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className="text-text font-medium">
                                {place.average_rating.toFixed(1)} ({place.rating_count} შეფასება)
                            </span>
                        </div>

                        {/* Like Button */}
                        <div className="mb-4">
                            <LikeButton placeId={place.id} />
                        </div>
                    </Card>

                    {/* Rating Section */}
                    <RatingSection
                        placeId={place.id}
                        currentRating={place.average_rating}
                        ratingCount={place.rating_count}
                    />

                    {/* Comments Section */}
                    <Card>
                        <CommentsSection placeId={place.id} />
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
                    <Card>
                        <h2 className="text-lg font-semibold text-text mb-4">ლოკაცია</h2>
                        {place.latitude && place.longitude ? (
                            <MapEmbed
                                lat={place.latitude}
                                lng={place.longitude}
                                title={place.name}
                                height="300px"
                            />
                        ) : (
                            <p className="text-gray-500 text-sm">ლოკაცია არ არის მითითებული</p>
                        )}
                    </Card>

                    {/* Actions */}
                    <Card>
                        <div className="space-y-3">
                            <Button variant="primary" className="w-full">
                                ⭐ რჩეულებში დამატება
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
