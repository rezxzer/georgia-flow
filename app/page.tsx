'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import PlaceCard from '@/components/feed/PlaceCard';
import EventCard from '@/components/feed/EventCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SponsoredCard from '@/components/ads/SponsoredCard';
import { getActiveAds, trackImpression, Ad } from '@/lib/utils/ads';

interface Place {
    id: number;
    name: string;
    description?: string;
    category: string;
    region: string;
    average_rating: number;
    rating_count: number;
    first_image?: string;
}

interface Event {
    id: number;
    name: string;
    description?: string;
    event_type: string;
    location: string;
    start_date: string;
    end_date?: string;
}

export default function Home() {
    const supabase = createClient();
    const [places, setPlaces] = useState<Place[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [ads, setAds] = useState<Ad[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedRegion, setSelectedRegion] = useState<string>('');

    useEffect(() => {
        loadFeed();
    }, [selectedCategory, selectedRegion]);

    const loadFeed = async () => {
        setIsLoading(true);
        try {
            // Load places
            let placesQuery = supabase
                .from('places')
                .select(`
          *,
          place_media!inner(media_url, media_type)
        `)
                .order('created_at', { ascending: false })
                .limit(20);

            if (selectedCategory) {
                placesQuery = placesQuery.eq('category', selectedCategory);
            }
            if (selectedRegion) {
                placesQuery = placesQuery.eq('region', selectedRegion);
            }

            const { data: placesData, error: placesError } = await placesQuery;

            if (!placesError && placesData) {
                // Get first image for each place
                const placesWithImages = await Promise.all(
                    placesData.map(async (place: any) => {
                        const firstMedia = place.place_media?.[0];
                        return {
                            ...place,
                            first_image: firstMedia?.media_url || null,
                        };
                    })
                );
                setPlaces(placesWithImages);
            }

            // Load events
            let eventsQuery = supabase
                .from('events')
                .select('*')
                .order('start_date', { ascending: true })
                .limit(10);

            if (selectedCategory) {
                eventsQuery = eventsQuery.eq('event_type', selectedCategory);
            }

            const { data: eventsData, error: eventsError } = await eventsQuery;

            if (!eventsError && eventsData) {
                setEvents(eventsData);
            }

            // Load ads
            const homeFeedAds = await getActiveAds('home_feed', 'sponsored_card');
            setAds(homeFeedAds);

            // Track impressions
            homeFeedAds.forEach((ad) => {
                trackImpression(ad.id);
            });
        } catch (error) {
            console.error('Error loading feed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        // Search functionality will be enhanced in future
        console.log('Search:', searchQuery);
    };

    const filteredPlaces = places.filter((place) => {
        if (!searchQuery) return true;
        return (
            place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            place.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const filteredEvents = events.filter((event) => {
        if (!searchQuery) return true;
        return (
            event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
                    Georgia Flow
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    აღმოაჩინე საქართველოს საუკეთესო ადგილები და ივენთები
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-6">
                    <div className="flex gap-2">
                        <Input
                            placeholder="ძებნა ადგილებისა და ივენთების..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                        />
                        <Button variant="primary" onClick={handleSearch}>
                            🔍 ძებნა
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">ყველა კატეგორია</option>
                        <option value="restaurant">რესტორანი</option>
                        <option value="park">პარკი</option>
                        <option value="museum">მუზეუმი</option>
                        <option value="nature">ბუნება</option>
                        <option value="winery">ღვინის ქარხანა</option>
                    </select>

                    <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">ყველა რეგიონი</option>
                        <option value="tbilisi">თბილისი</option>
                        <option value="batumi">ბათუმი</option>
                        <option value="kutaisi">ქუთაისი</option>
                        <option value="svaneti">სვანეთი</option>
                        <option value="kakheti">კახეთი</option>
                    </select>

                    {(selectedCategory || selectedRegion) && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSelectedCategory('');
                                setSelectedRegion('');
                            }}
                        >
                            ✕ გასუფთავება
                        </Button>
                    )}
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            )}

            {/* Feed */}
            {!isLoading && (
                <div className="space-y-12">
                    {/* Places Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-text">ადგილები</h2>
                            <Button variant="primary" onClick={() => window.location.href = '/places/new'}>
                                + ახალი ადგილი
                            </Button>
                        </div>
                        {filteredPlaces.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(() => {
                                    const items: React.ReactNode[] = [];
                                    filteredPlaces.forEach((place, index) => {
                                        items.push(<PlaceCard key={place.id} place={place} />);

                                        // Inject ad every 4th place
                                        if (ads.length > 0 && index > 0 && index % 4 === 0) {
                                            const adIndex = Math.floor(index / 4) % ads.length;
                                            const ad = ads[adIndex];
                                            items.push(<SponsoredCard key={`ad-${ad.id}-${index}`} ad={ad} />);
                                        }
                                    });
                                    return items;
                                })()}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">ადგილები არ მოიძებნა</p>
                            </div>
                        )}
                    </section>

                    {/* Events Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-text">ივენთები</h2>
                            <Button variant="primary" onClick={() => window.location.href = '/events/new'}>
                                + ახალი ივენთი
                            </Button>
                        </div>
                        {filteredEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">ივენთები არ მოიძებნა</p>
                            </div>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}
