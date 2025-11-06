'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form,
} from '@/components/ui/form';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';

const formSchema = z
    .object({
        email: z.email('Email is required'),
        password: z.string().min(8, 'Password is minimum 8 characters'),
        confirmPassword: z
            .string()
            .min(8, 'Confirm password is minimum 8 characters'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });

const SignupForm = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        await authClient.signUp.email(
            {
                email: data.email,
                password: data.password,
                name: data.email,
                callbackURL: '/',
            },
            {
                onSuccess: () => {
                    toast.success('Account created successfully');
                    router.push('/');
                },
                onError: (error) => {
                    toast.error(error.error.message);
                },
            }
        );
    };
    const isPending = form.formState.isSubmitting;
    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>Create an account to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    <Button
                                        variant="outline"
                                        disabled={isPending}
                                        type="button"
                                    >
                                        <Image src="/logos/github.svg" alt="Github" width={20} height={20} />
                                        {isPending ? 'Signing up...' : 'Continue with Github'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        disabled={isPending}
                                        type="button"
                                    >
                                        <Image src="/logos/google.svg" alt="Google" width={20} height={20} />
                                        {isPending ? 'Signing up...' : 'Continue with Google'}
                                    </Button>
                                </div>
                                <div className="grid gap-6">
                                    <FormField
                                        name="email"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="john@example.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="password"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="********"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="confirmPassword"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="********"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        disabled={isPending}
                                        type="submit"
                                    >
                                        {isPending ? 'Signing up...' : 'Sign up'}
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    <p>
                                        Already have an account?{' '}
                                        <Link
                                            href="/login"
                                            className="underline underline-offset-4"
                                        >
                                            Login
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};
export default SignupForm;
