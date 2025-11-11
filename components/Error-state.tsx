import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { AlertTriangleIcon } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
}

const EmptyState = ({ title, description }: EmptyStateProps) => {
    return (
        <Empty className="border border-dashed">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <AlertTriangleIcon className="w-4 h-4" />
                </EmptyMedia>
                <EmptyTitle className="text-destructive">{title}</EmptyTitle>
                <EmptyDescription className="text-destructive">{description}</EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
};

export default EmptyState;
