import { RequireAuth } from '@/lib/auth-utils';
const page = async () => {
    await RequireAuth();
    return (
        <div>Workflows</div>
    )
}

export default page