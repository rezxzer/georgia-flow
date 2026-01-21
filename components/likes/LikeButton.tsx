'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

interface LikeButtonProps {
    placeId?: number;
    eventId?: number;
    commentId?: number;
    initialLikes?: number;
}

export default function LikeButton({
    placeId,
    eventId,
    commentId,
    initialLikes = 0,
}: LikeButtonProps) {
    const { user } = useAuth();
    const supabase = createClient();
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikes);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            checkIfLiked();
            loadLikesCount();
            subscribeToLikes();
        } else {
            loadLikesCount();
        }
    }, [user, placeId, eventId, commentId]);

    const checkIfLiked = async () => {
        if (!user) return;

        try {
            let query = supabase
                .from('likes')
                .select('id')
                .eq('user_id', user.id);

            if (placeId) {
                query = query.eq('place_id', placeId);
            } else if (eventId) {
                query = query.eq('event_id', eventId);
            } else if (commentId) {
                query = query.eq('comment_id', commentId);
            }

            const { data, error } = await query.single();
            setIsLiked(!!data && !error);
        } catch (error) {
            setIsLiked(false);
        }
    };

    const loadLikesCount = async () => {
        try {
            let query = supabase.from('likes').select('id', { count: 'exact', head: true });

            if (placeId) {
                query = query.eq('place_id', placeId);
            } else if (eventId) {
                query = query.eq('event_id', eventId);
            } else if (commentId) {
                query = query.eq('comment_id', commentId);
            }

            const { count, error } = await query;

            if (!error && count !== null) {
                setLikesCount(count);
            }
        } catch (error) {
            console.error('Error loading likes count:', error);
        }
    };

    const subscribeToLikes = () => {
        const channel = supabase
            .channel(`likes:${placeId || eventId || commentId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'likes',
                    filter: placeId
                        ? `place_id=eq.${placeId}`
                        : eventId
                            ? `event_id=eq.${eventId}`
                            : `comment_id=eq.${commentId}`,
                },
                () => {
                    loadLikesCount();
                    if (user) checkIfLiked();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const handleLike = async () => {
        if (!user) {
            window.location.href = '/login';
            return;
        }

        setIsLoading(true);
        try {
            if (isLiked) {
                // Unlike
                let query = supabase.from('likes').delete().eq('user_id', user.id);

                if (placeId) {
                    query = query.eq('place_id', placeId);
                } else if (eventId) {
                    query = query.eq('event_id', eventId);
                } else if (commentId) {
                    query = query.eq('comment_id', commentId);
                }

                const { error } = await query;
                if (error) throw error;

                setIsLiked(false);
                setLikesCount((prev) => Math.max(0, prev - 1));
            } else {
                // Like
                const likeData: any = {
                    user_id: user.id,
                };

                if (placeId) {
                    likeData.place_id = placeId;
                } else if (eventId) {
                    likeData.event_id = eventId;
                } else if (commentId) {
                    likeData.comment_id = commentId;
                }

                const { error } = await supabase.from('likes').insert(likeData);

                if (error) throw error;

                setIsLiked(true);
                setLikesCount((prev) => prev + 1);
            }
        } catch (error: any) {
            console.error('Error toggling like:', error);
            alert(error.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant={isLiked ? 'primary' : 'outline'}
            size="sm"
            onClick={handleLike}
            isLoading={isLoading}
            className="flex items-center gap-2"
        >
            <span>{isLiked ? '❤️' : '🤍'}</span>
            <span>{likesCount}</span>
        </Button>
    );
}
