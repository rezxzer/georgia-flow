'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface RatingSectionProps {
    placeId?: number;
    eventId?: number;
    currentRating?: number;
    ratingCount?: number;
}

export default function RatingSection({
    placeId,
    eventId,
    currentRating = 0,
    ratingCount = 0,
}: RatingSectionProps) {
    const { user } = useAuth();
    const supabase = createClient();
    const [userRating, setUserRating] = useState<number | null>(null);
    const [selectedRating, setSelectedRating] = useState(0);
    const [selectedEmoji, setSelectedEmoji] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const emojis = ['👍', '❤️', '🔥', '😍', '⭐'];

    useEffect(() => {
        if (user) {
            loadUserRating();
        }
    }, [user, placeId, eventId]);

    const loadUserRating = async () => {
        if (!user) return;

        try {
            let query = supabase
                .from('ratings')
                .select('rating, emoji_reaction')
                .eq('user_id', user.id);

            if (placeId) {
                query = query.eq('place_id', placeId);
            } else if (eventId) {
                query = query.eq('event_id', eventId);
            }

            const { data, error } = await query.single();

            if (data && !error) {
                setUserRating(data.rating);
                setSelectedRating(data.rating);
                setSelectedEmoji(data.emoji_reaction || '');
            }
        } catch (error) {
            // User hasn't rated yet
            setUserRating(null);
        }
    };

    const handleRatingSubmit = async () => {
        if (!user || selectedRating === 0) return;

        setIsSubmitting(true);
        try {
            const ratingData: any = {
                user_id: user.id,
                rating: selectedRating,
                emoji_reaction: selectedEmoji || null,
            };

            if (placeId) {
                ratingData.place_id = placeId;
            } else if (eventId) {
                ratingData.event_id = eventId;
            }

            const { error } = await supabase.from('ratings').upsert(ratingData, {
                onConflict: 'user_id,place_id,user_id,event_id',
            });

            if (error) throw error;

            setUserRating(selectedRating);
            // Reload page to update average rating
            window.location.reload();
        } catch (error: any) {
            console.error('Error submitting rating:', error);
            alert(error.message || 'An error occurred while submitting rating');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-text mb-2">შეფასება</h3>
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setSelectedRating(star)}
                                className={`text-3xl ${star <= selectedRating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                    } hover:text-yellow-400 transition-colors`}
                                disabled={!user}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <span className="text-text font-medium">
                        {currentRating.toFixed(1)} ({ratingCount} შეფასება)
                    </span>
                </div>

                {/* Emoji Reactions */}
                {user && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">რეაქცია:</p>
                        <div className="flex gap-2">
                            {emojis.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => setSelectedEmoji(selectedEmoji === emoji ? '' : emoji)}
                                    className={`text-2xl p-2 rounded-lg transition-colors ${selectedEmoji === emoji
                                        ? 'bg-primary bg-opacity-20'
                                        : 'hover:bg-gray-100'
                                        }`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                {user && (
                    <Button
                        variant="primary"
                        onClick={handleRatingSubmit}
                        isLoading={isSubmitting}
                        disabled={selectedRating === 0 || selectedRating === userRating}
                    >
                        {userRating ? 'შეფასების განახლება' : 'შეფასების დამატება'}
                    </Button>
                )}

                {!user && (
                    <p className="text-sm text-gray-500">
                        <a href="/login" className="text-primary hover:underline">
                            შედი
                        </a>{' '}
                        შეფასების დასამატებლად
                    </p>
                )}
            </div>
        </Card>
    );
}
