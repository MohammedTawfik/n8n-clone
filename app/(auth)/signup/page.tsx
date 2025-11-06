
import SignupForm from '@/features/auth/components/signup-form'
import { RedirectIfAuthenticated } from '@/lib/auth-utils'
const page = async () => {
    await RedirectIfAuthenticated();
    return (
        <div>
            <SignupForm />
        </div>
    )
}

export default page