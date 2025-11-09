'use client';
import { ClockIcon, CreditCardIcon, FolderOpenIcon, KeyIcon, LogOutIcon, StarIcon } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
} from './ui/sidebar';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

const sidebarItems = [
    {
        title: 'Main',
        items: [
            {
                icon: FolderOpenIcon,
                label: 'Workflows',
                href: '/workflows',
            },
            {
                icon: KeyIcon,
                label: 'Credentials',
                href: '/credentials',
            },
            {
                icon: ClockIcon,
                label: 'Executions',
                href: '/executions',
            },
        ],
    },
];

const AppSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    return (
        <Sidebar variant="inset" collapsible="icon">
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className='gap-x-4 h-10'>
                        <Link href="/workflows" prefetch>
                            <Image src="/logos/logo.svg" alt="logo" width={30} height={30} />
                            <span className='text-sm font-semibold'>
                                AI Companion
                            </span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>
            <SidebarContent>
                {sidebarItems.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((subItem) => (
                                    <SidebarMenuItem key={subItem.label}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={
                                                subItem.href === "/" ?
                                                    pathname === "/" :
                                                    pathname.startsWith(subItem.href)
                                            }
                                            tooltip={subItem.label}
                                            className='gap-x-4 h-10'
                                        >
                                            <Link href={subItem.href} prefetch>
                                                <subItem.icon className="size-4" />
                                                <span>{subItem.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="upgrade" className='gap-x-4 h-10' onClick={() => { }}>
                            <StarIcon className="size-4" />
                            <span>Upgrade</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Billing Portal" className='gap-x-4 h-10'>
                            <CreditCardIcon className="size-4" />
                            <span>Billing Portal</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Billing Portal" className='gap-x-4 h-10' onClick={() => {
                            authClient.signOut({
                                fetchOptions: {
                                    onSuccess: () => {
                                        router.push('/login');
                                    },
                                    onError: (error) => {
                                        toast.error(error.error.message);
                                    },
                                },
                            });
                            toast.success('Logged out successfully');
                        }}>
                            <LogOutIcon className="size-4" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter >
        </Sidebar >
    );
};

export default AppSidebar;
