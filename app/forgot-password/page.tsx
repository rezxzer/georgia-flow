'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function ForgotPasswordPage() {
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordInput) => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setIsSuccess(true);
        } catch (error: any) {
            console.error('Forgot password error:', error);
            alert(error.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
                <Card className="w-full max-w-md text-center">
                    <div className="mb-4">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-3xl">✓</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-text mb-4">
                        Email გაგზავნილია
                    </h1>
                    <p className="text-text mb-6">
                        შეამოწმე შენი email-ი პაროლის აღსადგენად. ლინკი 24 საათის განმავლობაში მოქმედია.
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => window.location.href = '/login'}
                        className="w-full"
                    >
                        დაბრუნება შესვლაზე
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
            <Card className="w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-text mb-2">
                    პაროლის აღდგენა
                </h1>
                <p className="text-center text-sm text-gray-600 mb-6">
                    შეიყვანე შენი email და გამოგიგზავნებ პაროლის აღსადგენ ლინკს
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="email@example.com"
                        {...register('email')}
                        error={errors.email?.message}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isLoading}
                        className="w-full"
                    >
                        გაგზავნა
                    </Button>

                    <p className="text-center text-sm text-text">
                        <a href="/login" className="text-primary hover:underline">
                            დაბრუნება შესვლაზე
                        </a>
                    </p>
                </form>
            </Card>
        </div>
    );
}
