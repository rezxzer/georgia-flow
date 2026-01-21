'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Card from '@/components/ui/Card';
import PlaceForm from '@/components/places/PlaceForm';
import type { PlaceInput } from '@/lib/validations/places';
import { useState } from 'react';

export default function NewPlacePage() {
    const router = useRouter();
    const { user } = useAuth();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: PlaceInput, mediaFiles: File[]) => {
        if (!user) return;

        setIsLoading(true);
        try {
            // Create place
            const { data: place, error: placeError } = await supabase
                .from('places')
                .insert({
                    user_id: user.id,
                    name: data.name,
                    description: data.description || null,
                    category: data.category,
                    region: data.region,
                    latitude: data.latitude,
                    longitude: data.longitude,
                })
                .select()
                .single();

            if (placeError) throw placeError;

            // Upload media files
            if (mediaFiles.length > 0 && place) {
                const uploadPromises = mediaFiles.map(async (file, index) => {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${place.id}_${index}_${Date.now()}.${fileExt}`;
                    const filePath = `${place.id}/${fileName}`;

                    // Upload to Supabase Storage
                    const { error: uploadError } = await supabase.storage
                        .from('places-media')
                        .upload(filePath, file);

                    if (uploadError) {
                        console.error('Upload error:', uploadError);
                        return null;
                    }

                    // Get public URL
                    const { data: urlData } = supabase.storage
                        .from('places-media')
                        .getPublicUrl(filePath);

                    // Save to place_media table
                    const { error: mediaError } = await supabase
                        .from('place_media')
                        .insert({
                            place_id: place.id,
                            media_url: urlData.publicUrl,
                            media_type: file.type.startsWith('image/') ? 'image' : 'video',
                            display_order: index,
                        });

                    if (mediaError) {
                        console.error('Media insert error:', mediaError);
                    }

                    return urlData.publicUrl;
                });

                await Promise.all(uploadPromises);
            }

            router.push(`/places/${place.id}`);
        } catch (error: any) {
            console.error('Error creating place:', error);
            alert(error.message || 'An error occurred while creating the place');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <Card>
                    <h1 className="text-2xl font-bold text-text mb-6">ახალი ადგილის დამატება</h1>
                    <PlaceForm onSubmit={handleSubmit} isLoading={isLoading} />
                </Card>
            </div>
        </ProtectedRoute>
    );
}
