import React from 'react'
import { cn } from '@/lib/utils';

interface EntityListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    getKey: (item: T, index: number) => string | number;
    emptyState: React.ReactNode;
    className?: string;
}

const EntityList = <T,>({ items, renderItem, getKey, emptyState, className }: EntityListProps<T>) => {
    if (items.length === 0 && emptyState) {
        return (
            <div className='flex flex-1 items-center justify-center'>
                <div className='max-w-sm mx-auto'>
                    {emptyState}
                </div>
            </div>
        )
    }
    return (

        <div className={cn('flex flex-col gap-y-4', className)}>
            {items.map((item, index) => (
                <div key={getKey ? getKey(item, index) : index}>
                    {renderItem(item, index)}
                </div>
            ))}
        </div>
    )
}

export default EntityList