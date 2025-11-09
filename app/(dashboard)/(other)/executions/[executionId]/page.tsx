import { RequireAuth } from '@/lib/auth-utils';
interface pageProps {

    params: Promise<{
        executionId: string
    }>
}
const page = async ({ params }: pageProps) => {
    await RequireAuth();
    const { executionId } = await params;
    return (
        <div>
            <h1>Execution {executionId}</h1>
        </div>
    )
}

export default page