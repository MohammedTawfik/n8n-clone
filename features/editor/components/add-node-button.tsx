import { memo, useState } from 'react'
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { NodeSelector } from './node-selector';

export const AddNodeButton = memo(() => {
    const [isOpen, setIsOpen] = useState(false)
    const onClick = () => {
        console.log('Adding node...');
    }
    return (
        <NodeSelector open={isOpen} onOpenChange={setIsOpen}>
            <Button variant="outline" size="icon" className="bg-background" onClick={onClick}>
                <PlusIcon className="size-4" />
            </Button>
        </NodeSelector>
    )
});

AddNodeButton.displayName = 'AddNodeButton';