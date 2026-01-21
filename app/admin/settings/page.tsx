'use client';

import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function AdminSettingsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-text mb-8">Settings</h1>

            <div className="space-y-6">
                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-text mb-4">App Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">App Name</label>
                            <Input placeholder="Georgia Flow" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Default Language</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                <option value="ka">ქართული</option>
                                <option value="en">English</option>
                                <option value="ru">Русский</option>
                            </select>
                        </div>
                        <Button variant="primary">Save Settings</Button>
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-text mb-4">API Keys</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">Google Maps API Key</label>
                            <Input type="password" placeholder="••••••••••••" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">OpenAI API Key</label>
                            <Input type="password" placeholder="••••••••••••" />
                        </div>
                        <Button variant="primary">Save API Keys</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
