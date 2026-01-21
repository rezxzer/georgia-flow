'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';

interface ChatPreview {
    friend_id: string;
    friend_username: string;
    friend_avatar?: string | null;
    last_message?: string;
    last_message_time?: string;
    unread_count: number;
}

export default function ChatList() {
    const { user } = useAuth();
    const router = useRouter();
    const supabase = createClient();
    const [chats, setChats] = useState<ChatPreview[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadChats();
            subscribeToMessages();
        }
    }, [user]);

    const loadChats = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            // Get all friends
            const { data: friends } = await supabase
                .from('user_friends')
                .select(`
          friend_id,
          user_id,
          friend_profile:friend_id (id, username, avatar_url),
          user_profile:user_id (id, username, avatar_url)
        `)
                .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
                .eq('status', 'accepted');

            if (!friends) return;

            // Get last message for each friend
            const chatPreviews = await Promise.all(
                friends.map(async (friend: any) => {
                    const friendId =
                        friend.user_id === user.id ? friend.friend_id : friend.user_id;
                    const friendProfile =
                        friend.user_id === user.id
                            ? friend.friend_profile
                            : friend.user_profile;

                    // Get last message
                    const { data: messages } = await supabase
                        .from('messages')
                        .select('content, created_at, is_read, sender_id')
                        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                        .or(`sender_id.eq.${friendId},receiver_id.eq.${friendId}`)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .single();

                    // Count unread messages
                    const { count } = await supabase
                        .from('messages')
                        .select('*', { count: 'exact', head: true })
                        .eq('receiver_id', user.id)
                        .eq('sender_id', friendId)
                        .eq('is_read', false);

                    return {
                        friend_id: friendId,
                        friend_username: friendProfile?.username || 'Unknown',
                        friend_avatar: friendProfile?.avatar_url,
                        last_message: messages?.content,
                        last_message_time: messages?.created_at,
                        unread_count: count || 0,
                    };
                })
            );

            // Sort by last message time
            chatPreviews.sort((a, b) => {
                if (!a.last_message_time) return 1;
                if (!b.last_message_time) return -1;
                return (
                    new Date(b.last_message_time).getTime() -
                    new Date(a.last_message_time).getTime()
                );
            });

            setChats(chatPreviews);
        } catch (error) {
            console.error('Error loading chats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const subscribeToMessages = () => {
        if (!user) return;

        const channel = supabase
            .channel('chat-list-updates')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'messages',
                    filter: `sender_id=eq.${user.id}`,
                },
                () => {
                    loadChats();
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'messages',
                    filter: `receiver_id=eq.${user.id}`,
                },
                () => {
                    loadChats();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const formatTime = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'ახლა';
        if (minutes < 60) return `${minutes} წუთის წინ`;
        if (hours < 24) return `${hours} საათის წინ`;
        if (days < 7) return `${days} დღის წინ`;
        return date.toLocaleDateString('ka-GE');
    };

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
        );
    }

    if (chats.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>ჯერ არ გაქვს შეტყობინებები</p>
                <p className="text-sm mt-2">დაამატე მეგობრები და დაიწყე მეგობრობა!</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {chats.map((chat) => (
                <Card
                    key={chat.friend_id}
                    onClick={() => router.push(`/chat/${chat.friend_id}`)}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {chat.friend_avatar ? (
                                    <Image
                                        src={chat.friend_avatar}
                                        alt={chat.friend_username}
                                        width={48}
                                        height={48}
                                        className="rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-500">
                                        {chat.friend_username.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            {chat.unread_count > 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                                    {chat.unread_count > 9 ? '9+' : chat.unread_count}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-text truncate">
                                    {chat.friend_username}
                                </h4>
                                {chat.last_message_time && (
                                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                        {formatTime(chat.last_message_time)}
                                    </span>
                                )}
                            </div>
                            {chat.last_message && (
                                <p className="text-sm text-gray-600 truncate">
                                    {chat.last_message}
                                </p>
                            )}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
