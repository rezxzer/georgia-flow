'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Friend {
    id: string;
    username: string;
    avatar_url?: string | null;
    friend_id: string;
    status: string;
}

interface FriendsListProps {
    userId?: string;
}

export default function FriendsList({ userId }: FriendsListProps) {
    const { user } = useAuth();
    const supabase = createClient();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const targetUserId = userId || user?.id;

    useEffect(() => {
        if (targetUserId) {
            loadFriends();
            if (user?.id === targetUserId) {
                loadPendingRequests();
            }
        }
    }, [targetUserId, user]);

    const loadFriends = async () => {
        if (!targetUserId) return;

        setIsLoading(true);
        try {
            // Get friends where user is either user_id or friend_id
            const { data, error } = await supabase
                .from('user_friends')
                .select(`
          *,
          friend_profile:friend_id (id, username, avatar_url),
          user_profile:user_id (id, username, avatar_url)
        `)
                .or(`user_id.eq.${targetUserId},friend_id.eq.${targetUserId}`)
                .eq('status', 'accepted');

            if (error) throw error;

            if (data) {
                const friendsList = data.map((item: any) => {
                    const friendProfile =
                        item.user_id === targetUserId
                            ? item.friend_profile
                            : item.user_profile;
                    return {
                        id: friendProfile.id,
                        username: friendProfile.username,
                        avatar_url: friendProfile.avatar_url,
                        friend_id: item.id,
                        status: item.status,
                    };
                });
                setFriends(friendsList);
            }
        } catch (error) {
            console.error('Error loading friends:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadPendingRequests = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('user_friends')
                .select(`
          *,
          user_profile:user_id (id, username, avatar_url)
        `)
                .eq('friend_id', user.id)
                .eq('status', 'pending');

            if (error) throw error;

            if (data) {
                setPendingRequests(
                    data.map((item: any) => ({
                        id: item.user_profile.id,
                        username: item.user_profile.username,
                        avatar_url: item.user_profile.avatar_url,
                        friend_id: item.id,
                        status: item.status,
                    }))
                );
            }
        } catch (error) {
            console.error('Error loading pending requests:', error);
        }
    };

    const handleAcceptRequest = async (requestId: string) => {
        try {
            const { error } = await supabase
                .from('user_friends')
                .update({ status: 'accepted' })
                .eq('id', requestId);

            if (error) throw error;

            loadFriends();
            loadPendingRequests();
        } catch (error: any) {
            console.error('Error accepting request:', error);
            alert(error.message || 'An error occurred');
        }
    };

    const handleRejectRequest = async (requestId: string) => {
        try {
            const { error } = await supabase
                .from('user_friends')
                .delete()
                .eq('id', requestId);

            if (error) throw error;

            loadPendingRequests();
        } catch (error: any) {
            console.error('Error rejecting request:', error);
            alert(error.message || 'An error occurred');
        }
    };

    const handleRemoveFriend = async (friendId: string) => {
        if (!confirm('დარწმუნებული ხარ რომ გსურს მეგობრის წაშლა?')) return;

        try {
            const { error } = await supabase
                .from('user_friends')
                .delete()
                .or(`user_id.eq.${user?.id},friend_id.eq.${user?.id}`)
                .or(`user_id.eq.${friendId},friend_id.eq.${friendId}`);

            if (error) throw error;

            loadFriends();
        } catch (error: any) {
            console.error('Error removing friend:', error);
            alert(error.message || 'An error occurred');
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Pending Requests */}
            {pendingRequests.length > 0 && user?.id === targetUserId && (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-text mb-4">
                        მოთხოვნები ({pendingRequests.length})
                    </h3>
                    <div className="space-y-3">
                        {pendingRequests.map((request) => (
                            <div
                                key={request.friend_id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        {request.avatar_url ? (
                                            <img
                                                src={request.avatar_url}
                                                alt={request.username}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-gray-500">
                                                {request.username.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <Link
                                        href={`/profile/${request.id}`}
                                        className="font-semibold text-text hover:text-primary"
                                    >
                                        {request.username}
                                    </Link>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleAcceptRequest(request.friend_id)}
                                    >
                                        ✓ მიღება
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRejectRequest(request.friend_id)}
                                    >
                                        ✕ უარყოფა
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Friends List */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-text mb-4">
                    მეგობრები ({friends.length})
                </h3>
                {friends.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {friends.map((friend) => (
                            <div
                                key={friend.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                        {friend.avatar_url ? (
                                            <img
                                                src={friend.avatar_url}
                                                alt={friend.username}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-gray-500">
                                                {friend.username.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <Link
                                        href={`/profile/${friend.id}`}
                                        className="font-semibold text-text hover:text-primary"
                                    >
                                        {friend.username}
                                    </Link>
                                </div>
                                {user?.id === targetUserId && (
                                    <div className="flex gap-2">
                                        <Link href={`/chat/${friend.id}`}>
                                            <Button variant="outline" size="sm">
                                                💬
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRemoveFriend(friend.id)}
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>ჯერ არ გაქვს მეგობრები</p>
                        {user?.id === targetUserId && (
                            <p className="text-sm mt-2">დაამატე მეგობრები ძებნით</p>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
}
