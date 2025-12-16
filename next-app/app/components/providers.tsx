"use client"
import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { authClient } from "@/app/lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()

    return (
        <AuthUIProvider
            basePath="/auth"
            authClient={authClient}
            navigate={router.push}
            replace={router.replace}
            redirectTo="/"
            onSessionChange={() => {
                router.refresh()
            }}
            Link={Link}
            social={{providers : ["google"]}}
            credentials={{
                passwordValidation: {
                    minLength: 8,
                },
                confirmPassword: true,
            }}
        >
            {children}
        </AuthUIProvider>
    )
}