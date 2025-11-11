'use client';

import ErrorState from '@/components/Error-state';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({
    error,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reset: _reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to Sentry
        Sentry.captureException(error);
    }, [error]);

    return (
        <ErrorState
            title="Error Loading Workflow"
            description={error.message || 'An error occurred while loading the workflow'}
        />
    );
}

