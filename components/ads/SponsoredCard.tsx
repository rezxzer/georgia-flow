'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';
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

interface SponsoredCardProps {
    ad: Ad;
}

export default function SponsoredCard({ ad }: SponsoredCardProps) {
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
        <Card className="relative border-2 border-orange-500 overflow-hidden">
            {/* Sponsored Label */}
            <div className="absolute top-2 right-2 z-10">
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    რეკლამა
                </span>
            </div>

            {/* Image */}
            {ad.image_url && (
                <div className="relative w-full h-48 bg-gray-200">
                    <Image
                        src={ad.image_url}
                        alt={ad.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-text mb-2">{ad.title}</h3>
                {ad.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ad.description}</p>
                )}
                <Button
                    variant="primary"
                    onClick={handleClick}
                    isLoading={isLoading}
                    className="w-full"
                >
                    ნახე
                </Button>
            </div>
        </Card>
    );
}
