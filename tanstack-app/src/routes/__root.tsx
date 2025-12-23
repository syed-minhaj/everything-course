import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Providers } from '../components/providers'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
         <meta
            name="viewport"
            content="initial-scale=1, viewport-fit=cover, width=device-width"
        />
        <meta
            name="theme-color"
            media="(prefers-color-scheme: light)"
            content="oklch(1 0 0)"
        />
        <meta
            name="theme-color"
            media="(prefers-color-scheme: dark)"
            content="oklch(0.145 0 0)"
        />
        <HeadContent />
      </head>
      <body>
        <Providers>
            {children}
        </Providers>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}


