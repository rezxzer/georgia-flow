'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface Profile {
    id: string;
    username: string;
    avatar_url?: string | null;
    bio?: string | null;
}

interface FriendSearchProps {
    onFriendAdded?: () => void;
}

export default function FriendSearch({ onFriendAdded }: FriendSearchProps) {
    const { user } = useAuth();
    const supabase = createClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Profile[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

    const handleSearch = async () => {
        if (!searchQuery.trim() || !user) return;

        setIsSearching(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, avatar_url, bio')
                .ilike('username', `%${searchQuery}%`)
                .neq('id', user.id)
                .limit(10);

            if (error) throw error;

            // Filter out already friends
            const { data: friends } = await supabase
                .from('user_friends')
                .select('friend_id, user_id')
                .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
                .eq('status', 'accepted');

            const friendIds = new Set(
                friends?.flatMap((f) => [f.user_id, f.friend_id]) || []
            );

            const filteredResults = (data || []).filter(
                (profile) => !friendIds.has(profile.id)
            );

            setResults(filteredResults);

            // Load pending requests
            const { data: requests } = await supabase
                .from('user_friends')
                .select('friend_id')
                .eq('user_id', user.id)
                .eq('status', 'pending');

            setSentRequests(
                new Set(requests?.map((r) => r.friend_id) || [])
            );
        } catch (error) {
            console.error('Error searching friends:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSendRequest = async (friendId: string) => {
        if (!user) return;

        try {
            const { error } = await supabase.from('user_friends').insert({
                user_id: user.id,
                friend_id: friendId,
                requested_by: user.id,
                status: 'pending',
            });

            if (error) throw error;

            setSentRequests((prev) => new Set([...prev, friendId]));
            if (onFriendAdded) onFriendAdded();
        } catch (error: any) {
            console.error('Error sending friend request:', error);
            alert(error.message || 'An error occurred');
        }
    };

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold text-text mb-4">მეგობრის ძებნა</h3>
            <div className="flex gap-2 mb-4">
                <Input
                    placeholder="შეიყვანე username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1"
                />
                <Button
                    variant="primary"
                    onClick={handleSearch}
                    isLoading={isSearching}
                >
                    🔍 ძებნა
                </Button>
            </div>

            {results.length > 0 && (
                <div className="space-y-2">
                    {results.map((profile) => (
                        <div
                            key={profile.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    {profile.avatar_url ? (
                                        <img
                                            src={profile.avatar_url}
                                            alt={profile.username}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-500">
                                            {profile.username.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-text">{profile.username}</p>
                                    {profile.bio && (
                                        <p className="text-sm text-gray-600 line-clamp-1">
                                            {profile.bio}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {sentRequests.has(profile.id) ? (
                                <span className="text-sm text-gray-500">მოთხოვნა გაგზავნილია</span>
                            ) : (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleSendRequest(profile.id)}
                                >
                                    + დამატება
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {searchQuery && results.length === 0 && !isSearching && (
                <p className="text-center text-gray-500 py-4">
                    მეგობარი არ მოიძებნა
                </p>
            )}
        </Card>
    );
}
