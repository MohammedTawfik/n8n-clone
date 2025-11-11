import { RequireAuth } from '@/lib/auth-utils';
import { prefetchWorkflows } from '@/features/workflows/server/prefetch';
import { HydrateClient } from '@/trpc/server';
import {
    WorkflowsList,
    WorkflowsListContainer,
} from '@/features/workflows/components/workflows-list';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { SearchParams } from 'nuqs/server';
import { workflowsParamsLoader } from '@/features/workflows/server/params-loader';
import LoadingState from '@/components/loading-state';
import ErrorState from '@/components/Error-state';

type pageProps = {
    searchParams: Promise<SearchParams>;
};

const page = async ({ searchParams }: pageProps) => {
    const params = await workflowsParamsLoader(searchParams);
    await RequireAuth();
    prefetchWorkflows(params);
    return (
        <WorkflowsListContainer>
            <HydrateClient>
                <ErrorBoundary
                    fallback={
                        <ErrorState
                            title="Error Loading Workflows"
                            description="Error loading workflows"
                        />
                    }
                >
                    <Suspense
                        fallback={
                            <LoadingState
                                title="Loading Workflows"
                                description="Loading workflows"
                                content="Loading workflows"
                            />
                        }
                    >
                        <WorkflowsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </WorkflowsListContainer>
    );
};

export default page;
