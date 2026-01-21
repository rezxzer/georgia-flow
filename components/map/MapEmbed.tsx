'use client';

import dynamic from 'next/dynamic';

// Dynamic import for the embed map component
const GoogleMapEmbed = dynamic(
    () => import('./GoogleMapEmbed'),
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

interface MapEmbedProps {
    lat: number;
    lng: number;
    title?: string;
    height?: string;
    showDirections?: boolean;
}

export default function MapEmbed(props: MapEmbedProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return (
            <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center" style={{ height: props.height || '300px' }}>
                <div className="text-center text-gray-500 p-4">
                    <p className="text-sm">Google Maps API Key არ არის კონფიგურირებული</p>
                    <a
                        href={`https://www.google.com/maps?q=${props.lat},${props.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline mt-2 inline-block"
                    >
                        გახსენი Google Maps-ში
                    </a>
                </div>
            </div>
        );
    }

    return <GoogleMapEmbed {...props} />;
}
