'use client';

import { useMemo } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface GoogleMapEmbedProps {
    lat: number;
    lng: number;
    title?: string;
    height?: string;
    showDirections?: boolean;
}

export default function GoogleMapEmbed({
    lat,
    lng,
    title,
    height = '300px',
    showDirections = true,
}: GoogleMapEmbedProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
    const center = useMemo(() => ({ lat, lng }), [lat, lng]);

    const mapContainerStyle = useMemo(
        () => ({
            width: '100%',
            height: height,
        }),
        [height]
    );

    const mapOptions = useMemo(
        () => ({
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: true,
            rotateControl: false,
            fullscreenControl: true,
        }),
        []
    );

    return (
        <div className="w-full">
            {/* @ts-ignore - @react-google-maps/api types issue */}
            <LoadScript googleMapsApiKey={apiKey}>
                {/* @ts-ignore - @react-google-maps/api types issue */}
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={15}
                    options={mapOptions}
                >
                    {/* @ts-ignore - @react-google-maps/api types issue */}
                    <Marker position={center} title={title} />
                </GoogleMap>
            </LoadScript>
            {showDirections && (
                <div className="mt-2">
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm flex items-center gap-1"
                    >
                        🗺️ მიმართულებები Google Maps-ში
                    </a>
                </div>
            )}
        </div>
    );
}
