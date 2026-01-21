'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProfileHeaderProps {
    profile: {
        username: string;
        avatar_url?: string | null;
        bio?: string | null;
        role?: string;
    };
    stats: {
        places: number;
        events: number;
        friends: number;
        badges: number;
    };
    isOwnProfile: boolean;
    onEditClick: () => void;
}

export default function ProfileHeader({
    profile,
    stats,
    isOwnProfile,
    onEditClick,
}: ProfileHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-t-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-white border-4 border-primary overflow-hidden">
                        {profile.avatar_url ? (
                            <Image
                                src={profile.avatar_url}
                                alt={profile.username}
                                width={128}
                                height={128}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-4xl text-gray-500">
                                {profile.username.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    {profile.role === 'admin' && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            ADMIN
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-text mb-2">{profile.username}</h1>
                    {profile.bio && (
                        <p className="text-text mb-4 max-w-md">{profile.bio}</p>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{stats.places}</div>
                            <div className="text-sm text-gray-600">ადგილები</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{stats.events}</div>
                            <div className="text-sm text-gray-600">ივენთები</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{stats.friends}</div>
                            <div className="text-sm text-gray-600">მეგობრები</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{stats.badges}</div>
                            <div className="text-sm text-gray-600">Badges</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isOwnProfile ? (
                        <div className="flex gap-3 justify-center md:justify-start">
                            <button
                                onClick={onEditClick}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                პროფილის რედაქტირება
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                ⚙️ პარამეტრები
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3 justify-center md:justify-start">
                            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors">
                                მეგობრად დამატება
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                💬 შეტყობინება
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
