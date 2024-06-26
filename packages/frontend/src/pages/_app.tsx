// =================================================================================================

// Must come first, so that can we can hook global members before they're used by imports.
import { ComponentType, useEffect } from "react"
import { NextPage } from "next"
import type { AppProps } from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider } from "connectkit"
import { useAccount, WagmiProvider } from "wagmi"

import { wagmiConfig } from "src/chain"
import { useIsHydrated } from "src/hooks/useIsHydrated"

// import jotaiDebug from "src/components/lib/jotaiDebug"
// import { GlobalErrorModal } from "src/components/modals/globalErrorModal"
// import { useIsHydrated } from "src/hooks/useIsHydrated"
// import { useErrorConfig } from "src/store/hooks"
import "src/styles/globals.css"

import "src/setup"
import "src/store/setup"
// import { Toaster } from "src/components/ui/sonner"

// =================================================================================================

/**
 * Make pages in the app conform to this type.
 * See [@link useIsHydrated] for more info on the meaning of the `isHydrated` prop.
 */
export type GridlockPage = NextPage<{ isHydrated: boolean }>

// =================================================================================================

const MyApp = ({ Component, pageProps }: AppProps) => {
    const queryClient = new QueryClient()
    const isHydrated = useIsHydrated()

    return (
        <>
            <Head>
                <title>Gridlock</title>
                <link rel="shortcut icon" href="/favicon.png" />

                {/* Custom Font
                    <link
                        href="/font/BluuNext-Bold.otf"
                        as="font"
                        type="font/otf"
                        crossOrigin="anonymous"
                    />
                */}
            </Head>

            {isHydrated && (
                <WagmiProvider config={wagmiConfig}>
                    <QueryClientProvider client={queryClient}>
                        <ConnectKitProvider>
                            {/*{jotaiDebug()}*/}
                            <ComponentWrapper Component={Component} pageProps={pageProps} isHydrated={isHydrated} />
                            {/*<Toaster expand={true} />*/}
                        </ConnectKitProvider>
                    </QueryClientProvider>
                </WagmiProvider>
            )}
        </>
    )
}

export default MyApp

// =================================================================================================

/**
 * Wrapper for the main app component. This is necessary because we want to use the Wagmi account
 * and the `useAccount` hook can only be used within a WagmiConfig.
 */
const ComponentWrapper = ({
    Component,
    pageProps,
    isHydrated,
}: {
    Component: ComponentType
    pageProps: any
    isHydrated: boolean
}) => {
    const { address } = useAccount()
    // const errorConfig = useErrorConfig()

    if (process.env.NODE_ENV === "development") {
        // constant
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const router = useRouter()
        const accountIndex = parseInt(router.query.index as string)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (accountIndex === undefined || isNaN(accountIndex)) return
            if (accountIndex < 0 || 9 < accountIndex) return
            // void ensureLocalAccountIndex(accountIndex)
        }, [accountIndex, address])

        // It's necessary to update this on address, as Web3Modal (and possibly other wallet frameworks)
        // will ignore our existence and try to override us with their own account (depending on how
        // async code scheduling ends up working out).

        // To carry the `index` query parameter to other parts of the app, be sure to either use:
        // - the `navigate` function from `utils/navigate.ts` instead of `router.push`.
        // - the `link` component from `components/link.tsx` instead of `next/link`
    }

    return (
        <>
            <Component {...pageProps} isHydrated={isHydrated} />
            {/* Global error modal for errors that don't have obvious in-flow resolutions. */}
            {/*{isHydrated && errorConfig && <GlobalErrorModal config={errorConfig} />}*/}
        </>
    )
}

// =================================================================================================
