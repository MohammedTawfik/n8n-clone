import Link from 'next/link';
import { Card, CardContent, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { EditIcon, MoreHorizontalIcon, TrashIcon } from 'lucide-react';

interface EntityItemProps {
    href: string;
    title: string;
    subTitle?: React.ReactNode;
    image?: React.ReactNode;
    actions?: React.ReactNode;
    onRemove?: () => void | Promise<void>;
    className?: string;
    isRemoving?: boolean;
}

const EntityItem = ({
    href,
    title,
    subTitle,
    image,
    actions,
    onRemove,
    className,
    isRemoving,
}: EntityItemProps) => {
    const handleRemove = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (isRemoving) {
            return;
        }
        if (onRemove) {
            await onRemove();
        }
    }
    return (
        <Link
            href={href}
            prefetch
        >
            <Card
                className={cn(
                    'p-4 shadow-none cursor-pointer hover:shadow',
                    isRemoving && 'opacity-50 cursor-not-allowed',
                    className
                )}
            >

                <CardContent className="flex flex-row items-center justify-between p-0">
                    <div className="flex items-center gap-3">
                        {image && (
                            <div className="size-8 rounded-md overflow-hidden">{image}</div>
                        )}
                        <div className="flex flex-col gap-y-1 mb-2">
                            <CardTitle>{title}</CardTitle>

                            {!!subTitle && <div className=" text-sm text-muted-foreground">{subTitle}</div>}
                        </div>
                    </div>
                    {(actions || onRemove) && (
                        <div className="flex items-center gap-x-4">
                            {actions}
                            {onRemove && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreHorizontalIcon className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenuItem>
                                            <EditIcon className="size-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleRemove} variant="destructive">
                                            <TrashIcon className="size-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
};

export default EntityItem;
