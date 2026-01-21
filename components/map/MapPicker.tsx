'use client';

import { useState, useCallback } from 'react';
import MapComponent from './MapComponent';
import Button from '@/components/ui/Button';

interface MapPickerProps {
    initialLat?: number;
    initialLng?: number;
    onLocationSelect: (lat: number, lng: number) => void;
    height?: string;
}

export default function MapPicker({
    initialLat,
    initialLng,
    onLocationSelect,
    height = '400px',
}: MapPickerProps) {
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
        initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
    );

    const defaultCenter = { lat: 41.7151, lng: 44.8271 }; // Tbilisi, Georgia
    const center = selectedLocation || defaultCenter;

    const handleMapClick = useCallback((lat: number, lng: number) => {
        const location = { lat, lng };
        setSelectedLocation(location);
    }, []);

    const handleConfirm = () => {
        if (selectedLocation) {
            onLocationSelect(selectedLocation.lat, selectedLocation.lng);
        }
    };

    const handleClear = () => {
        setSelectedLocation(null);
    };

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                <MapComponent
                    center={center}
                    zoom={selectedLocation ? 15 : 8}
                    markers={
                        selectedLocation
                            ? [
                                {
                                    id: 'selected',
                                    lat: selectedLocation.lat,
                                    lng: selectedLocation.lng,
                                    title: 'არჩეული ლოკაცია',
                                    type: 'place',
                                },
                            ]
                            : []
                    }
                    onMapClick={handleMapClick}
                    height={height}
                    isPicker={true}
                />
            </div>

            {selectedLocation && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm">
                        <p className="font-medium text-text">არჩეული ლოკაცია:</p>
                        <p className="text-gray-600">
                            {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleClear}>
                            გასუფთავება
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleConfirm}>
                            დადასტურება
                        </Button>
                    </div>
                </div>
            )}

            {!selectedLocation && (
                <p className="text-sm text-gray-500 text-center">
                    დააჭირე რუკაზე ლოკაციის მოსანიშნად
                </p>
            )}
        </div>
    );
}
