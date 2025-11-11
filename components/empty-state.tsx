import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

interface EmptyStateProps {
    title: string;
    description: string;
    content: string;
    icon: React.ReactNode;
}

const EmptyState = ({ title, description, content, icon }: EmptyStateProps) => {
    return (
        <Empty className="border border-dashed">
            <EmptyHeader>
                <EmptyMedia variant="icon">{icon}</EmptyMedia>
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
