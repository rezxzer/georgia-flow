'use client';

import { useMemo } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface GoogleMapComponentProps {
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

const defaultCenter = { lat: 41.7151, lng: 44.8271 }; // Tbilisi, Georgia
const defaultZoom = 8;

export default function GoogleMapComponent({
    center = defaultCenter,
    zoom = defaultZoom,
    markers = [],
    onMapClick,
    height = '400px',
    isPicker = false,
}: GoogleMapComponentProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

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
            clickableIcons: true,
            scrollwheel: true,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true,
        }),
        []
    );

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (onMapClick && e.latLng) {
            onMapClick(e.latLng.lat(), e.latLng.lng());
        }
    };

    return (
        // @ts-ignore - @react-google-maps/api types issue
        <LoadScript googleMapsApiKey={apiKey}>
            {/* @ts-ignore - @react-google-maps/api types issue */}
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={zoom}
                options={mapOptions}
                onClick={isPicker ? handleMapClick : undefined}
            >
                {markers.map((marker) => (
                    // @ts-ignore - @react-google-maps/api types issue
                    <Marker
                        key={marker.id}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        title={marker.title}
                        onClick={marker.onClick}
                        icon={{
                            url: marker.type === 'place'
                                ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                                : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        }}
                    />
                ))}
            </GoogleMap>
        </LoadScript>
    );
}
