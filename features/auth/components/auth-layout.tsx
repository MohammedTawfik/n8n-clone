import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-svh items-center flex-col justify-center p-6 gap-6 bg-muted md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6 text-center">
                <Link href="/" className="flex items-center self-center font-medium gap-2">
                    <Image src="/logos/logo.svg" alt="Logo" width={50} height={50} />
                    <span className="text-2xl font-bold">AI Companion</span>
                </Link>
                {children}
            </div>
        </div>
    )
}

export default AuthLayout