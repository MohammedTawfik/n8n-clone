import { RequireAuth } from '@/lib/auth-utils';
interface pageProps {
    params: Promise<{
        workflowId: string
    }>
}

const page = async ({ params }: pageProps) => {
    await RequireAuth();
    const { workflowId } = await params;
    return (
        <div>
            <h1>Workflow {workflowId}</h1>
        </div>
    )
}

export default page