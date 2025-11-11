import LoadingState from '@/components/loading-state';
import WorkflowEditor from '@/features/editor/components/editor';
import EditorHeader from '@/features/editor/components/editor-header';
import { prefetchWorkflowById } from '@/features/workflows/server/prefetch';
import { RequireAuth } from '@/lib/auth-utils';
import { HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';
interface pageProps {
    params: Promise<{
        workflowId: string;
    }>;
}

const page = async ({ params }: pageProps) => {
    await RequireAuth();
    const { workflowId } = await params;
    prefetchWorkflowById(workflowId);
    return (
        <HydrateClient>
            <Suspense
                fallback={
                    <LoadingState
                        title="Loading Workflow Editor"
                        description="Loading workflow editor"
                        content="Loading workflow editor"
                    />
                }
            >
                <EditorHeader workflowId={workflowId} />
                <main className="flex-1 p-4">
                    <WorkflowEditor workflowId={workflowId} />
                </main>
            </Suspense>
        </HydrateClient>
    );
};

export default page;
