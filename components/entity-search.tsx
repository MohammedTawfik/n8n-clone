import { SearchIcon } from 'lucide-react';
import { Input } from './ui/input';

interface EntitySearchProps {
    placeholder: string;
    onChange: (value: string) => void;
    value: string;
}

const EntitySearch = ({
    placeholder = 'search',
    onChange,
    value,
}: EntitySearchProps) => {
    return (
        <div className="relative ml-auto">
            <SearchIcon className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
                type="text"
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                value={value}
                className="max-w-[200px] bg-background shadow-none border-border pl-8"
            />
        </div>
    );
};

export default EntitySearch;
