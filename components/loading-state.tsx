import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Loader2Icon } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
    content: string;
}

const EmptyState = ({ title, description, content }: EmptyStateProps) => {
    return (
        <Empty className="border border-dashed">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                </EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <span>{content}</span>
            </EmptyContent>
        </Empty>
    );
};

export default EmptyState;
