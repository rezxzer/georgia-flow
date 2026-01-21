'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, type EventInput } from '@/lib/validations/events';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import MapPicker from '@/components/map/MapPicker';

interface EventFormProps {
    onSubmit: (data: EventInput) => Promise<void>;
    isLoading?: boolean;
}

export default function EventForm({ onSubmit, isLoading = false }: EventFormProps) {
    const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<EventInput>({
        resolver: zodResolver(eventSchema),
    });

    const onFormSubmit = async (data: EventInput) => {
        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <Input
                label="სახელი *"
                placeholder="მაგ: ღვინის ფესტივალი"
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
                    placeholder="დეტალური აღწერა ივენთის შესახებ..."
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-text mb-1">
                    ივენთის ტიპი *
                </label>
                <select
                    {...register('event_type')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">აირჩიე ტიპი</option>
                    <option value="concert">კონცერტი</option>
                    <option value="festival">ფესტივალი</option>
                    <option value="tour">ტური</option>
                    <option value="other">სხვა</option>
                </select>
                {errors.event_type && (
                    <p className="mt-1 text-sm text-red-500">{errors.event_type.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-text mb-1">
                        დაწყების თარიღი და დრო *
                    </label>
                    <input
                        type="datetime-local"
                        {...register('start_date')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.start_date && (
                        <p className="mt-1 text-sm text-red-500">{errors.start_date.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-text mb-1">
                        დასრულების თარიღი და დრო
                    </label>
                    <input
                        type="datetime-local"
                        {...register('end_date')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            <Input
                label="ლოკაცია *"
                placeholder="მაგ: თბილისი, ვაკის პარკი"
                {...register('location')}
                error={errors.location?.message}
            />

            {/* Google Maps Picker */}
            <div>
                <label className="block text-sm font-medium text-text mb-1">
                    ლოკაცია რუკაზე (ოფციონალური)
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
