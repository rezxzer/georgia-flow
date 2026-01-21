import { createClient } from '@/lib/supabase/client';

export interface Ad {
    id: number;
    title: string;
    description?: string;
    image_url: string;
    link_url: string;
    position: 'home_feed' | 'place_detail' | 'event_detail' | 'profile';
    type: 'sponsored_card' | 'banner';
    start_date?: string;
    end_date?: string;
    active: boolean;
    clicks: number;
    impressions: number;
}

export async function getActiveAds(position: Ad['position'], type?: Ad['type']): Promise<Ad[]> {
    const supabase = createClient();

    let query = supabase
        .from('ads')
        .select('*')
        .eq('active', true)
        .eq('position', position);

    if (type) {
        query = query.eq('type', type);
    }

    // Check date range
    const today = new Date().toISOString().split('T')[0];
    query = query.or(`start_date.is.null,start_date.lte.${today}`);
    query = query.or(`end_date.is.null,end_date.gte.${today}`);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching ads:', error);
        return [];
    }

    return (data as Ad[]) || [];
}

export async function trackImpression(adId: number): Promise<void> {
    const supabase = createClient();

    try {
        // Get current impressions
        const { data } = await supabase
            .from('ads')
            .select('impressions')
            .eq('id', adId)
            .single();

        if (data) {
            await supabase
                .from('ads')
                .update({ impressions: (data.impressions || 0) + 1 })
                .eq('id', adId);
        }
    } catch (error) {
        console.error('Error tracking impression:', error);
    }
}
