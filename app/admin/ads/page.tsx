'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Ad } from '@/lib/utils/ads';

export default function AdminAdsPage() {
    const supabase = createClient();
    const [ads, setAds] = useState<Ad[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAd, setEditingAd] = useState<Ad | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        link_url: '',
        position: 'home_feed' as Ad['position'],
        type: 'sponsored_card' as Ad['type'],
        start_date: '',
        end_date: '',
        active: true,
    });

    useEffect(() => {
        loadAds();
    }, []);

    const loadAds = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('ads')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setAds(data as Ad[]);
            }
        } catch (error) {
            console.error('Error loading ads:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingAd(null);
        setFormData({
            title: '',
            description: '',
            image_url: '',
            link_url: '',
            position: 'home_feed',
            type: 'sponsored_card',
            start_date: '',
            end_date: '',
            active: true,
        });
        setShowModal(true);
    };

    const handleEdit = (ad: Ad) => {
        setEditingAd(ad);
        setFormData({
            title: ad.title,
            description: ad.description || '',
            image_url: ad.image_url,
            link_url: ad.link_url,
            position: ad.position,
            type: ad.type,
            start_date: ad.start_date || '',
            end_date: ad.end_date || '',
            active: ad.active,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAd) {
                const { error } = await supabase
                    .from('ads')
                    .update(formData)
                    .eq('id', editingAd.id);

                if (error) throw error;
            } else {
                const { data: { user } } = await supabase.auth.getUser();
                const { error } = await supabase
                    .from('ads')
                    .insert([{ ...formData, created_by: user?.id }]);

                if (error) throw error;
            }

            setShowModal(false);
            await loadAds();
        } catch (error) {
            console.error('Error saving ad:', error);
            alert('Error saving ad. Please try again.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this ad?')) return;

        try {
            const { error } = await supabase.from('ads').delete().eq('id', id);
            if (!error) {
                await loadAds();
            }
        } catch (error) {
            console.error('Error deleting ad:', error);
        }
    };

    const calculateCTR = (ad: Ad) => {
        if (ad.impressions === 0) return '0%';
        return ((ad.clicks / ad.impressions) * 100).toFixed(2) + '%';
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-text">Ads Management</h1>
                <Button variant="primary" onClick={handleCreate}>
                    + Create Ad
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left p-4 text-sm font-semibold text-text">Title</th>
                                    <th className="text-left p-4 text-sm font-semibold text-text">Type</th>
                                    <th className="text-left p-4 text-sm font-semibold text-text">Position</th>
                                    <th className="text-left p-4 text-sm font-semibold text-text">Status</th>
                                    <th className="text-left p-4 text-sm font-semibold text-text">Impressions</th>
                                    <th className="text-left p-4 text-sm font-semibold text-text">Clicks</th>
                                    <th className="text-left p-4 text-sm font-semibold text-text">CTR</th>
                                    <th className="text-left p-4 text-sm font-semibold text-text">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ads.map((ad) => (
                                    <tr key={ad.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-4 font-medium text-text">{ad.title}</td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {ad.type === 'sponsored_card' ? 'Sponsored Card' : 'Banner'}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">{ad.position}</td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${ad.active
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {ad.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">{ad.impressions}</td>
                                        <td className="p-4 text-sm text-gray-600">{ad.clicks}</td>
                                        <td className="p-4 text-sm text-gray-600">{calculateCTR(ad)}</td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(ad)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(ad.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {ads.length === 0 && (
                            <div className="text-center py-12 text-gray-500">No ads found</div>
                        )}
                    </div>
                </Card>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-text">
                                {editingAd ? 'Edit Ad' : 'Create Ad'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Title *"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-text mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <Input
                                label="Image URL *"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                required
                            />

                            <Input
                                label="Link URL *"
                                value={formData.link_url}
                                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">
                                        Type *
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) =>
                                            setFormData({ ...formData, type: e.target.value as Ad['type'] })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="sponsored_card">Sponsored Card</option>
                                        <option value="banner">Banner</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">
                                        Position *
                                    </label>
                                    <select
                                        value={formData.position}
                                        onChange={(e) =>
                                            setFormData({ ...formData, position: e.target.value as Ad['position'] })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="home_feed">Home Feed</option>
                                        <option value="place_detail">Place Detail</option>
                                        <option value="event_detail">Event Detail</option>
                                        <option value="profile">Profile</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Start Date"
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                />

                                <Input
                                    label="End Date"
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="mr-2"
                                />
                                <label htmlFor="active" className="text-sm font-medium text-text">
                                    Active
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" variant="primary" className="flex-1">
                                    {editingAd ? 'Update' : 'Create'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
