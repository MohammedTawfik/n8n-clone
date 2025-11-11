'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import EditorSaveButton from './editor-save-button';
import EditorBreadcrumb from './editor-breadcrumb';

interface EditorHeaderProps {
    workflowId: string;
}
const EditorHeader = ({ workflowId }: EditorHeaderProps) => {
    return (
        <header className='flex ml-2 h-14 shrink-0 items-center gap-2 border-b px-4 bg-background rounded-lg'>
            <SidebarTrigger />
            <div className='flex flex-row items-center justify-between gap-x-4 w-full'>
                <EditorBreadcrumb workflowId={workflowId} />
                <EditorSaveButton workflowId={workflowId} />
            </div>
        </header>
    )
}

export default EditorHeader