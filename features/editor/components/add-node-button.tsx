import { memo } from 'react'
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export const AddNodeButton = memo(() => {
    const onClick = () => {
        console.log('Adding node...');
    }
    return (
        <Button variant="outline" size="icon" className="bg-background" onClick={onClick}>
            <PlusIcon className="size-4" />
        </Button>
    )
});

AddNodeButton.displayName = 'AddNodeButton';