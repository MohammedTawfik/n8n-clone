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

const formSchema = z.object({
    email: z.email('Email is required'),
    password: z.string().min(8, 'Password is minimum 8 characters'),

});

const LoginForm = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        await authClient.signIn.email(
            {
                email: data.email,
                password: data.password,
                callbackURL: '/',
            },
            {
                onSuccess: () => {
                    toast.success('Logged in successfully');
                    router.push('/');
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
            });
    };
    const isPending = form.formState.isSubmitting;
    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Login to your account to continue</CardDescription>
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
                                        {isPending ? 'Logging in...' : 'Continue with Github'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        disabled={isPending}
                                        type="button"
                                    >
                                        <Image src="/logos/google.svg" alt="Google" width={20} height={20} />
                                        {isPending ? 'Logging in...' : 'Continue with Google'}
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
                                    <Button
                                        disabled={isPending}
                                        type="submit"
                                    >
                                        {isPending ? 'Logging in...' : 'Login'}
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    <p>
                                        Don&apos;t have an account?{' '}
                                        <Link
                                            href="/signup"
                                            className="underline underline-offset-4"
                                        >
                                            Sign up
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
export default LoginForm;
