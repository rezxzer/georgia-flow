'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        setIsLoading(true);
        try {
            // Check if input is email or username
            const isEmail = data.emailOrUsername.includes('@');

            let authError;
            if (isEmail) {
                // Direct email login
                const { error } = await supabase.auth.signInWithPassword({
                    email: data.emailOrUsername,
                    password: data.password,
                });
                authError = error;
            } else {
                // Username login - need to get email from profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('username', data.emailOrUsername)
                    .single();

                if (!profile) {
                    throw new Error('Invalid username or password');
                }

                // Get user email from auth.users (we need to use service role or RPC)
                // For now, we'll use a workaround - try to get email from profile metadata
                // This is a limitation - ideally we'd have an RPC function
                const { data: authUser } = await supabase.auth.getUser();
                if (authUser?.user?.id !== profile.id) {
                    // Need to sign in with email, but we don't have it
                    // This is a limitation - we should add an RPC function
                    throw new Error('Username login requires email. Please use email to login.');
                }
            }

            if (authError) throw authError;

            router.push('/');
        } catch (error: any) {
            console.error('Login error:', error);
            alert(error.message || 'Invalid email/username or password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                console.error('Google login error:', error);
                if (error.message.includes('provider is not enabled')) {
                    alert('Google OAuth არ არის ჩართული Supabase-ში. გთხოვთ ჩართოთ Authentication → Providers → Google Supabase Dashboard-ში.');
                } else {
                    alert(`შეცდომა: ${error.message}`);
                }
            }
        } catch (error: any) {
            console.error('Google login error:', error);
            alert('Google OAuth-ით შესვლა ვერ მოხერხდა. გთხოვთ გამოიყენოთ email/password.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
            <Card className="w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-text mb-6">
                    შესვლა
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email or Username */}
                    <Input
                        label="Email ან Username"
                        placeholder="Email ან username"
                        {...register('emailOrUsername')}
                        error={errors.emailOrUsername?.message}
                    />

                    {/* Password */}
                    <div>
                        <Input
                            label="Password"
                            type="password"
                            placeholder="შეიყვანე პაროლი"
                            {...register('password')}
                            error={errors.password?.message}
                        />
                        <a
                            href="/forgot-password"
                            className="text-sm text-primary hover:underline mt-1 block"
                        >
                            პაროლი დაგავიწყდა?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isLoading}
                        className="w-full"
                    >
                        შესვლა
                    </Button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">ან</span>
                        </div>
                    </div>

                    {/* Google OAuth */}
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={handleGoogleLogin}
                        className="w-full"
                    >
                        <span className="mr-2">🔵</span>
                        გაგრძელება Google-ით
                    </Button>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-text">
                        არ გაქვს ანგარიში?{' '}
                        <a href="/signup" className="text-primary hover:underline">
                            რეგისტრაცია
                        </a>
                    </p>
                </form>
            </Card>
        </div>
    );
}
