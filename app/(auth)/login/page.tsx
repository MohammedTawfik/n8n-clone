import LoginForm from '@/features/auth/components/login-form'
import { RedirectIfAuthenticated } from '@/lib/auth-utils'
const page = async () => {
    await RedirectIfAuthenticated();
    return (
        <div>
            <LoginForm />
        </div>
    )
}

export default page