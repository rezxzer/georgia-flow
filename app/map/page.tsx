'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import MapComponent from '@/components/map/MapComponent';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Place {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    category: string;
}

interface Event {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    event_type: string;
    start_date: string;
}

export default function MapPage() {
    const router = useRouter();
    const supabase = createClient();
    const [places, setPlaces] = useState<Place[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedType, setSelectedType] = useState<'all' | 'places' | 'events'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadMapData();
    }, [selectedCategory]);

    const loadMapData = async () => {
        setIsLoading(true);
        try {
            // Load places
            let placesQuery = supabase
                .from('places')
                .select('id, name, latitude, longitude, category')
                .not('latitude', 'is', null)
                .not('longitude', 'is', null);

            if (selectedCategory) {
                placesQuery = placesQuery.eq('category', selectedCategory);
            }

            const { data: placesData, error: placesError } = await placesQuery;

            if (!placesError && placesData) {
                setPlaces(placesData as Place[]);
            }

            // Load events
            let eventsQuery = supabase
                .from('events')
                .select('id, name, latitude, longitude, event_type, start_date')
                .not('latitude', 'is', null)
                .not('longitude', 'is', null);

            if (selectedCategory) {
                eventsQuery = eventsQuery.eq('event_type', selectedCategory);
            }

            const { data: eventsData, error: eventsError } = await eventsQuery;

            if (!eventsError && eventsData) {
                setEvents(eventsData as Event[]);
            }
        } catch (error) {
            console.error('Error loading map data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const markers = [
        ...(selectedType === 'all' || selectedType === 'places'
            ? places
                .filter((place) => {
                    if (searchQuery) {
                        return place.name.toLowerCase().includes(searchQuery.toLowerCase());
                    }
                    return true;
                })
                .map((place) => ({
                    id: `place-${place.id}`,
                    lat: place.latitude,
                    lng: place.longitude,
                    title: place.name,
                    type: 'place' as const,
                    onClick: () => router.push(`/places/${place.id}`),
                }))
            : []),
        ...(selectedType === 'all' || selectedType === 'events'
            ? events
                .filter((event) => {
                    if (searchQuery) {
                        return event.name.toLowerCase().includes(searchQuery.toLowerCase());
                    }
                    return true;
                })
                .map((event) => ({
                    id: `event-${event.id}`,
                    lat: event.latitude,
                    lng: event.longitude,
                    title: event.name,
                    type: 'event' as const,
                    onClick: () => router.push(`/events/${event.id}`),
                }))
            : []),
    ];

    const defaultCenter = { lat: 41.7151, lng: 44.8271 }; // Tbilisi, Georgia

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-text mb-2">რუკა</h1>
                <p className="text-gray-600">აღმოაჩინე ადგილები და ივენთები რუკაზე</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                    <Card>
                        <div className="space-y-4">
                            {/* Search */}
                            <div>
                                <Input
                                    placeholder="ძებნა..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Type Filter */}
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">
                                    ტიპი
                                </label>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSelectedType('all')}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedType === 'all'
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 text-text hover:bg-gray-200'
                                            }`}
                                    >
                                        ყველა
                                    </button>
                                    <button
                                        onClick={() => setSelectedType('places')}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedType === 'places'
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 text-text hover:bg-gray-200'
                                            }`}
                                    >
                                        ადგილები ({places.length})
                                    </button>
                                    <button
                                        onClick={() => setSelectedType('events')}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedType === 'events'
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 text-text hover:bg-gray-200'
                                            }`}
                                    >
                                        ივენთები ({events.length})
                                    </button>
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">
                                    კატეგორია
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                >
                                    <option value="">ყველა კატეგორია</option>
                                    <option value="restaurant">რესტორანი</option>
                                    <option value="park">პარკი</option>
                                    <option value="museum">მუზეუმი</option>
                                    <option value="nature">ბუნება</option>
                                    <option value="winery">ღვინის ქარხანა</option>
                                    <option value="concert">კონცერტი</option>
                                    <option value="festival">ფესტივალი</option>
                                    <option value="tour">ტური</option>
                                </select>
                            </div>

                            {/* Stats */}
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    <strong>{markers.length}</strong> ლოკაცია რუკაზე
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Map */}
                <div className="lg:col-span-3">
                    <Card className="p-0 overflow-hidden">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-96">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <MapComponent
                                center={defaultCenter}
                                zoom={8}
                                markers={markers}
                                height="600px"
                            />
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
