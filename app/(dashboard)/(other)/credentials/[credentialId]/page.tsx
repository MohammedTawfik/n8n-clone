import { RequireAuth } from '@/lib/auth-utils';
interface pageProps {
    params: Promise<{
        credentialId: string
    }>
}

const page = async ({ params }: pageProps) => {
    await RequireAuth();
    const { credentialId } = await params;
    return (
        <div>
            <h1>Credential {credentialId}</h1>
        </div>
    )
}

export default page