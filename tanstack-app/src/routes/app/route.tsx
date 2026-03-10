import { createFileRoute, Outlet, redirect, useMatches } from '@tanstack/react-router'
import { getThemeServerFn } from '@/lib/theme'
import { Link } from '@tanstack/react-router'
import { Providers } from '../../components/providers'
import { Toaster } from '@/components/ui/sonner'
import Navbar from '@/components/navbar'
import { useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'

export const Route = createFileRoute('/app')({
    component: RouteComponent,
    loader: () => getThemeServerFn(),
    ssr : true,
    notFoundComponent: () => {
        return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link to="/" className="underline mt-4">Go Home</Link>
        </div>
        )
    },
})

function AuthNavigationPatcher() {
    const location = useLocation()

    useEffect(() => {
        const original = window.history.pushState.bind(window.history)

        window.history.pushState = (state, title, url) => {
            if (typeof url === 'string' && url.startsWith('/app/auth/') && !url.includes('redirectTo')) {
                const redirectTo = encodeURIComponent(location.pathname + window.location.search)
                url = `${url}?redirectTo=${redirectTo}`
            }
            return original(state, title, url)
        }

        return () => {
            window.history.pushState = original
        }
    }, [location])

    return null
}

function RouteComponent() {
    const theme = Route.useLoaderData()
    const showNavbar = useMatches({
        select: (matches) => 
        !matches.some((match) => (match.staticData as { hideNavbar?: boolean })?.hideNavbar === true),
    })
    return (
        <Providers theme={theme}>
            <div className=" h-screen  flex flex-col w-dvw overflow-x-hidden" >
                {showNavbar && <Navbar />}
                <AuthNavigationPatcher/>
                <Outlet  />
                <Toaster position='top-center'/>
            </div>
        </Providers>
    )
}
