'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface Message {
    id: number;
    content?: string;
    media_url?: string;
    sender_id: string;
    receiver_id: string;
    is_read: boolean;
    created_at: string;
    sender_profile?: {
        username: string;
        avatar_url?: string;
    };
}

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const supabase = createClient();
    const [messages, setMessages] = useState<Message[]>([]);
    const [friendProfile, setFriendProfile] = useState<{
        id: string;
        username: string;
        avatar_url?: string;
    } | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const friendId = params.friend_id as string;

    useEffect(() => {
        if (user && friendId) {
            loadFriendProfile();
            loadMessages();
            subscribeToMessages();
        }
    }, [user, friendId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadFriendProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, avatar_url')
                .eq('id', friendId)
                .single();

            if (error) throw error;
            setFriendProfile(data);
        } catch (error) {
            console.error('Error loading friend profile:', error);
        }
    };

    const loadMessages = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('messages')
                .select(`
          *,
          sender_profile:sender_id (username, avatar_url)
        `)
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                .or(`sender_id.eq.${friendId},receiver_id.eq.${friendId}`)
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (data) {
                setMessages(
                    data
                        .filter(
                            (msg: Message) =>
                                (msg.sender_id === user.id && msg.receiver_id === friendId) ||
                                (msg.sender_id === friendId && msg.receiver_id === user.id)
                        )
                        .map((msg: any) => ({
                            ...msg,
                            sender_profile: msg.sender_profile,
                        }))
                );

                // Mark messages as read
                markAsRead();
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async () => {
        if (!user) return;

        try {
            await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('receiver_id', user.id)
                .eq('sender_id', friendId)
                .eq('is_read', false);
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const subscribeToMessages = () => {
        if (!user) return;

        const channel = supabase
            .channel(`chat:${user.id}-${friendId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `sender_id=eq.${friendId}`,
                },
                (payload) => {
                    loadMessages();
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `sender_id=eq.${user.id}`,
                },
                (payload) => {
                    loadMessages();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newMessage.trim()) return;

        setIsSending(true);
        try {
            const { error } = await supabase.from('messages').insert({
                sender_id: user.id,
                receiver_id: friendId,
                content: newMessage.trim(),
            });

            if (error) throw error;

            setNewMessage('');
            loadMessages();
        } catch (error: any) {
            console.error('Error sending message:', error);
            alert(error.message || 'An error occurred while sending message');
        } finally {
            setIsSending(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ka-GE', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <ProtectedRoute>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!friendProfile) {
        return (
            <ProtectedRoute>
                <div className="container mx-auto px-4 py-8">
                    <Card>
                        <p className="text-center text-text">Friend not found</p>
                    </Card>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="flex flex-col h-screen max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.back()}>
                        ←
                    </Button>
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {friendProfile.avatar_url ? (
                            <img
                                src={friendProfile.avatar_url}
                                alt={friendProfile.username}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-gray-500">
                                {friendProfile.username.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <h1 className="text-lg font-semibold text-text">
                        {friendProfile.username}
                    </h1>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((message) => {
                        const isOwn = message.sender_id === user?.id;
                        return (
                            <div
                                key={message.id}
                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwn
                                            ? 'bg-primary text-white'
                                            : 'bg-white text-text border border-gray-200'
                                        }`}
                                >
                                    {message.content && (
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                    )}
                                    {message.media_url && (
                                        <img
                                            src={message.media_url}
                                            alt="Media"
                                            className="mt-2 rounded-lg max-w-full"
                                        />
                                    )}
                                    <div
                                        className={`text-xs mt-1 ${isOwn ? 'text-white opacity-70' : 'text-gray-500'
                                            }`}
                                    >
                                        {formatTime(message.created_at)}
                                        {isOwn && message.is_read && (
                                            <span className="ml-1">✓✓</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form
                    onSubmit={handleSendMessage}
                    className="bg-white border-t border-gray-200 p-4"
                >
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="დაწერე შეტყობინება..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSending}
                            disabled={!newMessage.trim()}
                        >
                            გაგზავნა
                        </Button>
                    </div>
                </form>
            </div>
        </ProtectedRoute>
    );
}
