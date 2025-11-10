import { RequireAuth } from '@/lib/auth-utils';
import { prefetchWorkflows } from '@/features/workflows/server/prefetch';
import { HydrateClient } from '@/trpc/server';
import { WorkflowsList, WorkflowsListContainer } from '@/features/workflows/components/workflows-list';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
const page = async () => {
    await RequireAuth();
    prefetchWorkflows();
    return (
        <WorkflowsListContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<div>Error</div>}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <WorkflowsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </WorkflowsListContainer>
    )
}

export default page