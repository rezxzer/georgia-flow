import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export async function checkAdminRole(user: User | null): Promise<boolean> {
    if (!user) return false;

    const supabase = createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (error || !data) return false;

    return data.role === 'admin' || data.role === 'moderator';
}

export async function getUserProfile(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return data;
}
