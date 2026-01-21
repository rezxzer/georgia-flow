'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { placeSchema, type PlaceInput } from '@/lib/validations/places';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import MapPicker from '@/components/map/MapPicker';

interface PlaceFormProps {
    onSubmit: (data: PlaceInput, mediaFiles: File[]) => Promise<void>;
    isLoading?: boolean;
}

export default function PlaceForm({ onSubmit, isLoading = false }: PlaceFormProps) {
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<PlaceInput>({
        resolver: zodResolver(placeSchema),
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            // Limit to 10 files
            const limitedFiles = files.slice(0, 10);
            setMediaFiles(limitedFiles);
        }
    };

    const handleMapClick = (lat: number, lng: number) => {
        setMapLocation({ lat, lng });
        setValue('latitude', lat);
        setValue('longitude', lng);
    };

    const onFormSubmit = async (data: PlaceInput) => {
        await onSubmit(data, mediaFiles);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <Input
                label="სახელი *"
                placeholder="მაგ: ძველი თბილისი"
                {...register('name')}
                error={errors.name?.message}
            />

            <div>
                <label className="block text-sm font-medium text-text mb-1">
                    აღწერა
                </label>
                <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="დეტალური აღწერა ადგილის შესახებ..."
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-text mb-1">
                    კატეგორია *
                </label>
                <select
                    {...register('category')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">აირჩიე კატეგორია</option>
                    <option value="restaurant">რესტორანი</option>
                    <option value="park">პარკი</option>
                    <option value="museum">მუზეუმი</option>
                    <option value="nature">ბუნება</option>
                    <option value="winery">ღვინის ქარხანა</option>
                    <option value="other">სხვა</option>
                </select>
                {errors.category && (
                    <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-text mb-1">
                    რეგიონი *
                </label>
                <select
                    {...register('region')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">აირჩიე რეგიონი</option>
                    <option value="tbilisi">თბილისი</option>
                    <option value="batumi">ბათუმი</option>
                    <option value="kutaisi">ქუთაისი</option>
                    <option value="svaneti">სვანეთი</option>
                    <option value="kakheti">კახეთი</option>
                    <option value="adjara">აჭარა</option>
                    <option value="imereti">იმერეთი</option>
                    <option value="samegrelo">სამეგრელო</option>
                    <option value="other">სხვა</option>
                </select>
                {errors.region && (
                    <p className="mt-1 text-sm text-red-500">{errors.region.message}</p>
                )}
            </div>

            {/* Google Maps Picker */}
            <div>
                <label className="block text-sm font-medium text-text mb-1">
                    ლოკაცია (რუკაზე მონიშვნა) *
                </label>
                <MapPicker
                    initialLat={mapLocation?.lat}
                    initialLng={mapLocation?.lng}
                    onLocationSelect={(lat, lng) => {
                        setMapLocation({ lat, lng });
                        setValue('latitude', lat);
                        setValue('longitude', lng);
                    }}
                    height="400px"
                />
                {errors.latitude && (
                    <p className="mt-1 text-sm text-red-500">{errors.latitude.message}</p>
                )}
                {errors.longitude && (
                    <p className="mt-1 text-sm text-red-500">{errors.longitude.message}</p>
                )}
            </div>

            {/* Media Upload */}
            <div>
                <label className="block text-sm font-medium text-text mb-1">
                    ფოტო/ვიდეო (მაქს. 10 ფაილი)
                </label>
                <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {mediaFiles.length > 0 && (
                    <p className="mt-2 text-sm text-gray-600">
                        არჩეულია {mediaFiles.length} ფაილი
                    </p>
                )}
            </div>

            <div className="flex gap-4">
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                    className="flex-1"
                >
                    დამატება
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                >
                    გაუქმება
                </Button>
            </div>
        </form>
    );
}
