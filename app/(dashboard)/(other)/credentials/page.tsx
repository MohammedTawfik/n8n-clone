import React from 'react'
import { RequireAuth } from '@/lib/auth-utils';

const page = async () => {
    await RequireAuth();
    return (
        <div>Credentials</div>
    )
}

export default page