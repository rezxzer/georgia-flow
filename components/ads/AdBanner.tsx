'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Image from 'next/image';

interface Ad {
    id: number;
    title: string;
    description?: string;
    image_url: string;
    link_url: string;
    type: 'sponsored_card' | 'banner';
}

interface AdBannerProps {
    ad: Ad;
}

export default function AdBanner({ ad }: AdBannerProps) {
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    const handleClick = async () => {
        setIsLoading(true);

        // Track click
        try {
            const { data } = await supabase
                .from('ads')
                .select('clicks')
                .eq('id', ad.id)
                .single();

            if (data) {
                await supabase
                    .from('ads')
                    .update({ clicks: (data.clicks || 0) + 1 })
                    .eq('id', ad.id);
            }
        } catch (error) {
            console.error('Error tracking ad click:', error);
        }

        // Open link
        if (ad.link_url) {
            if (ad.link_url.startsWith('http')) {
                window.open(ad.link_url, '_blank', 'noopener,noreferrer');
            } else {
                window.location.href = ad.link_url;
            }
        }

        setIsLoading(false);
    };

    return (
        <div className="relative w-full rounded-lg overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-6 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Image */}
                {ad.image_url && (
                    <div className="relative w-full md:w-32 h-32 flex-shrink-0">
                        <Image
                            src={ad.image_url}
                            alt={ad.title}
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold mb-2">{ad.title}</h3>
                    {ad.description && (
                        <p className="text-blue-100 mb-4">{ad.description}</p>
                    )}
                    <Button
                        variant="outline"
                        onClick={handleClick}
                        isLoading={isLoading}
                        className="bg-white text-blue-900 hover:bg-blue-50 border-white"
                    >
                        შეიტყვეთ მეტი
                    </Button>
                </div>
            </div>
        </div>
    );
}
