'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for the entire map component
const GoogleMapComponent = dynamic(
    () => import('./GoogleMapComponent'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm">Loading map...</p>
                </div>
            </div>
        ),
    }
);

interface MapComponentProps {
    center: { lat: number; lng: number };
    zoom?: number;
    markers?: Array<{
        id: number | string;
        lat: number;
        lng: number;
        title: string;
        type: 'place' | 'event';
        onClick?: () => void;
    }>;
    onMapClick?: (lat: number, lng: number) => void;
    height?: string;
    isPicker?: boolean;
}

export default function MapComponent(props: MapComponentProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return (
            <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center" style={{ height: props.height || '400px' }}>
                <div className="text-center text-gray-500 p-4">
                    <p className="font-semibold mb-2">Google Maps API Key არ არის კონფიგურირებული</p>
                    <p className="text-sm">
                        დაამატე NEXT_PUBLIC_GOOGLE_MAPS_API_KEY .env.local ფაილში
                    </p>
                </div>
            </div>
        );
    }

    return <GoogleMapComponent {...props} />;
}
