import React from 'react';
import { Button } from './ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';

interface EntityPaginationProps {
    page: number;
    pageSize: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    isDisabled: boolean;
}

const EntityPagination = ({
    page,
    pageSize,
    totalPages,
    onPageChange,
    onPageSizeChange,
    isDisabled,
}: EntityPaginationProps) => {
    return (
        <div className="flex flex-row items-center justify-between gap-x-4 w-full px-4 py-3 border border-border rounded-lg bg-background shadow-sm">
            <div className="flex-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Page {page}</span> of {totalPages}
            </div>
            <div className="flex flex-row items-center gap-x-2">
                <label htmlFor="page-size-select" className="text-sm text-muted-foreground whitespace-nowrap">
                    Per page:
                </label>
                <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => onPageSizeChange(parseInt(value))}
                >
                    <SelectTrigger
                        id="page-size-select"
                        className="bg-background border-border hover:bg-accent hover:text-accent-foreground min-w-[70px] text-foreground font-medium shadow-sm hover:border-ring focus-visible:border-ring"
                        disabled={isDisabled}
                    >
                        <SelectValue placeholder="Select page size" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-row items-center gap-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={isDisabled || page === 1 || totalPages === 0}
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    aria-label="Previous page"
                    title="Previous page"
                >
                    <ChevronLeftIcon className="size-4" />
                    <span className="sr-only">Previous page</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={isDisabled || page === totalPages || totalPages === 0}
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    aria-label="Next page"
                    title="Next page"
                >
                    <ChevronRightIcon className="size-4" />
                    <span className="sr-only">Next page</span>
                </Button>
            </div>
        </div>
    );
};

export default EntityPagination;
