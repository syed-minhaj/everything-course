import { createStart } from '@tanstack/react-start'
import { createMiddleware } from '@tanstack/react-start'

const authRedirectMiddleware = createMiddleware().server(
    async ({ next, request }) => {
        const url = new URL(request.url)

        if (url.pathname.startsWith('/app/auth/') && !url.searchParams.get('redirectTo')) {
            const referer = request.headers.get('referer')
            if (referer) {
                const refUrl = new URL(referer)
                if (!refUrl.pathname.startsWith('/app/auth')) {
                    url.searchParams.set('redirectTo', refUrl.pathname + refUrl.search)
                    return new Response(null, {
                        status: 302,
                        headers: { Location: url.toString() },
                    })
                }
            }
        }

        return next()
    }
)

export const startInstance = createStart(() => ({
    requestMiddleware: [authRedirectMiddleware],
}))