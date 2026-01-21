'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user_id: string;
    profile?: {
        username: string;
        avatar_url?: string;
    };
}

interface CommentsSectionProps {
    placeId?: number;
    eventId?: number;
}

export default function CommentsSection({ placeId, eventId }: CommentsSectionProps) {
    const { user } = useAuth();
    const supabase = createClient();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadComments();
        subscribeToComments();
    }, [placeId, eventId]);

    const loadComments = async () => {
        setIsLoading(true);
        try {
            let query = supabase
                .from('comments')
                .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
                .order('created_at', { ascending: false });

            if (placeId) {
                query = query.eq('place_id', placeId);
            } else if (eventId) {
                query = query.eq('event_id', eventId);
            }

            const { data, error } = await query;

            if (error) throw error;

            if (data) {
                setComments(
                    data.map((comment: any) => ({
                        ...comment,
                        profile: comment.profiles,
                    }))
                );
            }
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const subscribeToComments = () => {
        const channel = supabase
            .channel(`comments:${placeId || eventId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'comments',
                    filter: placeId ? `place_id=eq.${placeId}` : `event_id=eq.${eventId}`,
                },
                (payload) => {
                    // Reload comments when new one is added
                    loadComments();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase.from('comments').insert({
                user_id: user.id,
                place_id: placeId || null,
                event_id: eventId || null,
                content: newComment.trim(),
            });

            if (error) throw error;

            setNewComment('');
            loadComments();
        } catch (error: any) {
            console.error('Error adding comment:', error);
            alert(error.message || 'An error occurred while adding comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
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

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-text">კომენტარები ({comments.length})</h3>

            {/* Add Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="space-y-2">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="დაწერე კომენტარი..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            isLoading={isSubmitting}
                            disabled={!newComment.trim()}
                        >
                            კომენტარის დამატება
                        </Button>
                    </div>
                </form>
            ) : (
                <p className="text-sm text-gray-500">
                    <a href="/login" className="text-primary hover:underline">
                        შედი
                    </a>{' '}
                    კომენტარის დასამატებლად
                </p>
            )}

            {/* Comments List */}
            {isLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <Card key={comment.id} className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                    {comment.profile?.avatar_url ? (
                                        <img
                                            src={comment.profile.avatar_url}
                                            alt={comment.profile.username}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-500">
                                            {comment.profile?.username?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-text">
                                            {comment.profile?.username || 'Unknown User'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatDate(comment.created_at)}
                                        </span>
                                    </div>
                                    <p className="text-text whitespace-pre-line">{comment.content}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <p>ჯერ არ არის კომენტარები</p>
                    <p className="text-sm mt-2">იყავი პირველი!</p>
                </div>
            )}
        </div>
    );
}
