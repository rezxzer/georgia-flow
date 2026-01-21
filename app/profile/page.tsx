'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs, { TabPanel } from '@/components/profile/ProfileTabs';
import FriendSearch from '@/components/friends/FriendSearch';
import FriendsList from '@/components/friends/FriendsList';
import ChatList from '@/components/messages/ChatList';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Profile {
    id: string;
    username: string;
    avatar_url?: string | null;
    bio?: string | null;
    role?: string;
}

export default function ProfilePage() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const supabase = createClient();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [stats, setStats] = useState({
        places: 0,
        events: 0,
        friends: 0,
        badges: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (user) {
            loadProfile();
            loadStats();
        }
    }, [user]);

    const loadProfile = async () => {
        if (!user) return;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error loading profile:', error);
        } else {
            setProfile(data);
        }
        setIsLoading(false);
    };

    const loadStats = async () => {
        if (!user) return;

        // Load places count
        const { count: placesCount } = await supabase
            .from('places')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        // Load events count
        const { count: eventsCount } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        // Load friends count
        const { count: friendsCount } = await supabase
            .from('user_friends')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'accepted');

        setStats({
            places: placesCount || 0,
            events: eventsCount || 0,
            friends: friendsCount || 0,
            badges: 0, // Will be implemented in Phase 2.1
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

    if (!profile) {
        return (
            <ProtectedRoute>
                <div className="container mx-auto px-4 py-8">
                    <Card>
                        <p className="text-center text-text">Profile not found</p>
                    </Card>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <Card className="p-0 overflow-hidden">
                    <ProfileHeader
                        profile={profile}
                        stats={stats}
                        isOwnProfile={true}
                        onEditClick={() => setShowEditModal(true)}
                    />

                    <div className="p-6">
                        <ProfileTabs defaultTab="places">
                            <TabPanel tabId="places">
                                <div className="text-center py-12">
                                    <p className="text-gray-500 mb-4">ჯერ არ გაქვს დამატებული ადგილები</p>
                                    <Button variant="primary" onClick={() => router.push('/places/new')}>
                                        + ახალი ადგილის დამატება
                                    </Button>
                                </div>
                            </TabPanel>

                            <TabPanel tabId="events">
                                <div className="text-center py-12">
                                    <p className="text-gray-500 mb-4">ჯერ არ გაქვს დამატებული ივენთები</p>
                                    <Button variant="primary" onClick={() => router.push('/events/new')}>
                                        + ახალი ივენთის დამატება
                                    </Button>
                                </div>
                            </TabPanel>

                            <TabPanel tabId="friends">
                                <div className="space-y-6">
                                    <FriendSearch onFriendAdded={() => window.location.reload()} />
                                    <FriendsList />
                                </div>
                            </TabPanel>

                            <TabPanel tabId="messages">
                                <ChatList />
                            </TabPanel>

                            <TabPanel tabId="badges">
                                <div className="text-center py-12">
                                    <p className="text-gray-500 mb-4">ჯერ არ გაქვს badges</p>
                                    <p className="text-sm text-gray-400">Badges სისტემა დაემატება Phase 2.1-ში</p>
                                </div>
                            </TabPanel>
                        </ProfileTabs>
                    </div>
                </Card>

                {/* Edit Profile Modal - Placeholder */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <Card className="w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">პროფილის რედაქტირება</h2>
                            <p className="text-gray-600 mb-4">Edit profile functionality will be implemented here</p>
                            <Button variant="outline" onClick={() => setShowEditModal(false)}>
                                დახურვა
                            </Button>
                        </Card>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
