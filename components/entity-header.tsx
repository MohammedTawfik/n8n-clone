
import { Button } from './ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

type EntityHeaderProps = {
    title: string;
    description?: string;
    createButtonLabel: string;
    isDisabled: boolean;
    isCreating: boolean;
} & (
        | { onNew: () => void; newButtonHref?: never }
        | { newButtonHref: string; onNew?: never }
        | { onNew: never; newButtonHref?: never }
    );

const EntityHeader = ({
    title,
    description,
    createButtonLabel,
    isDisabled,
    isCreating,
    onNew,
    newButtonHref,
}: EntityHeaderProps) => {
    return (
        <div className="flex flex-row items-center justify-between gap-x-4">
            <div className="flex flex-col">
                <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
                {description && (
                    <p className="text-xs md:text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {onNew && !newButtonHref && (
                <Button
                    size="sm"
                    onClick={onNew}
                    disabled={isDisabled || isCreating}
                >
                    <PlusIcon className="size-4" />
                    {createButtonLabel}
                </Button>
            )}
            {newButtonHref && !onNew && (
                <Button
                    size="sm"
                    asChild
                >
                    <Link href={newButtonHref} prefetch>
                        <PlusIcon className="size-4" />
                        {createButtonLabel}
                    </Link>
                </Button>
            )}
        </div>
    );
};

export default EntityHeader;
