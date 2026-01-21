'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpInput } from '@/lib/validations/auth';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { calculatePasswordStrength } from '@/lib/utils/password-strength';

export default function SignUpPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema),
        mode: 'onChange', // Validate on change for better UX
        defaultValues: {
            preferredLanguage: 'ka',
            acceptTerms: false,
        },
    });

    const password = watch('password');
    const passwordStrength = password ? calculatePasswordStrength(password) : null;

    // Real-time username availability check
    const username = watch('username');
    useEffect(() => {
        const checkUsername = async () => {
            if (!username || username.length < 3) {
                setUsernameAvailable(null);
                return;
            }

            setIsCheckingUsername(true);
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('username', username)
                    .maybeSingle();

                if (error && error.code !== 'PGRST116') {
                    // PGRST116 is "not found" which is expected
                    console.error('Username check error:', error);
                }

                setUsernameAvailable(!data);
            } catch (error) {
                console.error('Username check error:', error);
                setUsernameAvailable(null);
            } finally {
                setIsCheckingUsername(false);
            }
        };

        const timeoutId = setTimeout(checkUsername, 500);
        return () => clearTimeout(timeoutId);
    }, [username, supabase]);

    const onSubmit = async (data: SignUpInput) => {
        console.log('onSubmit called with data:', data);
        setIsLoading(true);
        try {
            // Check username availability one more time before submitting
            if (usernameAvailable === false) {
                alert('Username is already taken. Please choose another one.');
                setIsLoading(false);
                return;
            }

            console.log('Attempting to sign up with Supabase...');
            // Sign up with Supabase
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        username: data.username,
                        preferred_language: data.preferredLanguage,
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            console.log('Sign up response:', { authData, authError });

            if (authError) {
                console.error('Sign up error:', authError);
                alert(`შეცდომა: ${authError.message || 'An error occurred during sign up'}`);
                setIsLoading(false);
                return;
            }

            // Check if email confirmation is required
            if (authData.user && !authData.session) {
                // Email confirmation required
                alert('გთხოვთ შეამოწმოთ თქვენი email და დაადასტუროთ რეგისტრაცია. ლინკი გამოგიგზავნათ email-ში.');
                router.push('/login?message=check-email');
                setIsLoading(false);
                return;
            }

            if (!authData.user) {
                alert('რეგისტრაცია ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან.');
                setIsLoading(false);
                return;
            }

            // Profile will be auto-created by trigger, but update username if needed
            if (authData.user) {
                // Wait a bit for trigger to create profile
                await new Promise(resolve => setTimeout(resolve, 500));

                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        username: data.username,
                        preferred_language: data.preferredLanguage,
                    })
                    .eq('id', authData.user.id);

                if (profileError) {
                    console.error('Profile update error:', profileError);
                    // Try to insert if update fails (profile might not exist yet)
                    const { error: insertError } = await supabase
                        .from('profiles')
                        .insert({
                            id: authData.user.id,
                            username: data.username,
                            preferred_language: data.preferredLanguage,
                        });

                    if (insertError) {
                        console.error('Profile insert error:', insertError);
                    }
                }
            }

            // If we have a session, redirect to home
            if (authData.session) {
                router.push('/');
            } else {
                router.push('/login');
            }
        } catch (error: any) {
            console.error('Sign up error:', error);
            alert(error.message || 'An error occurred during sign up');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                console.error('Google sign up error:', error);
                if (error.message.includes('provider is not enabled')) {
                    alert('Google OAuth არ არის ჩართული Supabase-ში. გთხოვთ ჩართოთ Authentication → Providers → Google Supabase Dashboard-ში.');
                } else {
                    alert(`შეცდომა: ${error.message}`);
                }
            }
        } catch (error: any) {
            console.error('Google sign up error:', error);
            alert('Google OAuth-ით რეგისტრაცია ვერ მოხერხდა. გთხოვთ სცადოთ email/password რეგისტრაცია.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
            <Card className="w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-text mb-6">
                    რეგისტრაცია
                </h1>

                <form
                    onSubmit={handleSubmit(
                        (data) => {
                            console.log('Form submitted with data:', data);
                            onSubmit(data);
                        },
                        (errors) => {
                            console.log('Form validation errors:', errors);
                            // Show first error
                            const firstError = Object.values(errors)[0];
                            if (firstError?.message) {
                                alert(firstError.message);
                            }
                        }
                    )}
                    className="space-y-4"
                    noValidate // Disable browser native validation
                >
                    {/* Username */}
                    <div>
                        <Input
                            label="Username"
                            placeholder="შენი სახელი ან nickname"
                            {...register('username')}
                            error={errors.username?.message}
                        />
                        {username && username.length >= 3 && (
                            <div className="mt-1 text-sm">
                                {isCheckingUsername ? (
                                    <span className="text-gray-500">შემოწმება...</span>
                                ) : usernameAvailable === false ? (
                                    <span className="text-red-500">ეს username უკვე დაკავებულია</span>
                                ) : usernameAvailable === true ? (
                                    <span className="text-green-500">✓ Username ხელმისაწვდომია</span>
                                ) : null}
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <Input
                        label="Email"
                        type="email"
                        placeholder="email@example.com"
                        {...register('email')}
                        error={errors.email?.message}
                    />

                    {/* Password */}
                    <div>
                        <Input
                            label="Password"
                            type="password"
                            placeholder="მინიმუმ 8 სიმბოლო"
                            {...register('password')}
                            error={errors.password?.message}
                        />
                        {password && passwordStrength && (
                            <div className="mt-2">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-600">Password strength:</span>
                                    <span className={`text-xs font-medium ${passwordStrength.strength === 'weak' ? 'text-red-500' :
                                        passwordStrength.strength === 'medium' ? 'text-yellow-500' :
                                            'text-green-500'
                                        }`}>
                                        {passwordStrength.strength.toUpperCase()}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all ${passwordStrength.strength === 'weak' ? 'bg-red-500 w-1/3' :
                                            passwordStrength.strength === 'medium' ? 'bg-yellow-500 w-2/3' :
                                                'bg-green-500 w-full'
                                            }`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="დაადასტურე პაროლი"
                        {...register('confirmPassword')}
                        error={errors.confirmPassword?.message}
                    />

                    {/* Language Preference */}
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">
                            Language Preference
                        </label>
                        <select
                            {...register('preferredLanguage')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="ka">ქართული</option>
                            <option value="en">English</option>
                            <option value="ru">Русский</option>
                        </select>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start">
                        <input
                            type="checkbox"
                            {...register('acceptTerms')}
                            className="mt-1 mr-2"
                        />
                        <label className="text-sm text-text">
                            ვეთანხმები{' '}
                            <a href="/terms" className="text-primary hover:underline">
                                წესებსა და პირობებს
                            </a>
                        </label>
                    </div>
                    {errors.acceptTerms && (
                        <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isLoading}
                        className="w-full"
                        disabled={usernameAvailable === false || isCheckingUsername || isLoading}
                    >
                        რეგისტრაცია
                    </Button>

                    {/* Debug: Show why button might be disabled */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="text-xs text-gray-400 mt-1">
                            Button disabled: {usernameAvailable === false || isCheckingUsername || isLoading ? 'yes' : 'no'}
                            {usernameAvailable === false && ' (username taken)'}
                            {isCheckingUsername && ' (checking username)'}
                            {isLoading && ' (submitting)'}
                        </div>
                    )}

                    {/* Debug info */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="text-xs text-gray-400 mt-2">
                            Username available: {usernameAvailable === null ? 'checking...' : usernameAvailable ? 'yes' : 'no'}
                        </div>
                    )}

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
                        onClick={handleGoogleSignUp}
                        className="w-full"
                        title="Google OAuth უნდა იყოს ჩართული Supabase Dashboard-ში"
                    >
                        <span className="mr-2">🔵</span>
                        გაგრძელება Google-ით
                    </Button>
                    <p className="text-xs text-gray-400 text-center mt-2">
                        (Google OAuth უნდა იყოს ჩართული Supabase-ში)
                    </p>

                    {/* Login Link */}
                    <p className="text-center text-sm text-text">
                        უკვე გაქვს ანგარიში?{' '}
                        <a href="/login" className="text-primary hover:underline">
                            შესვლა
                        </a>
                    </p>
                </form>
            </Card>
        </div>
    );
}
