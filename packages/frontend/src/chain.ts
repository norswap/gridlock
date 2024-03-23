/**
 * This module exports values & logic related to chain interop.
 *
 * @module chain
 */

import { getDefaultConfig, getDefaultConnectors } from "connectkit"
import { createConfig } from "wagmi"
import { type Chain, http } from "viem"
import { localhost } from "wagmi/chains"

// =================================================================================================

/** Unexported type for list of chains expected by Wagmi's `createConfig`. */
type Chains = readonly [Chain, ...Chain[]]

/** The list of chains supported by the app. */
export const chains: Chains = [localhost]

// =================================================================================================
// Wagmi + ConnectKit Config

// -------------------------------------------------------------------------------------------------

/** WalletConnect cloud project ID. */
export const walletConnectProjectId = "8934622f70e11b51de893ea309871a4c"

// =================================================================================================
// =================================================================================================
// =================================================================================================

const APP_NAME = "0xFable"
const APP_DESCRIPTION = "Wizards & shit"
// const APP_URL = "https://0xFable.org/"
// const APP_ICON = "https://0xFable.org/logo.png"

const connectKitAppConfig = {
    walletConnectProjectId,
    app: {
        name: APP_NAME,

        // Options below are optional
        description: APP_DESCRIPTION,
        // icon: APP_ICON,
        // url: APP_URL,
    },
}

export const wagmiConfig = createConfig(
    getDefaultConfig({
        // Your dApps chains
        chains,
        walletConnectProjectId,
        appName: APP_NAME,

        transports: {
            // RPC URL for each chain
            [localhost.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
        },

        connectors: [...getDefaultConnectors(connectKitAppConfig)],
        // ...burnerConnectors],

        // Options below are optional
        appDescription: APP_DESCRIPTION,
        // appUrl: "https://0xFable.org",
        // appIcon: "https://0xFable.org/logo.png", // app icon, no bigger than 1024x1024px & 1MB
    })
)

// =================================================================================================
// TYPES

// -------------------------------------------------------------------------------------------------

/** Type of 32-byte hashes. */
export type Hash = `0x${string}`

// -------------------------------------------------------------------------------------------------

/** Hash with value 0x0...0 */
export const ZeroHash: Hash = `0x${"0".repeat(64)}`

// -------------------------------------------------------------------------------------------------

/** `0x{string}` */
export type HexString = `0x${string}`

// =================================================================================================
// BURNER CONNECTOR

// TODO: broken right now, fix later

// -------------------------------------------------------------------------------------------------

/** Arrays containing the connector for using a local browser private key. */
// const burnerConnectors = process.env.NODE_ENV === "development" ? [new BurnerConnector()] : []

// -------------------------------------------------------------------------------------------------

/**
 * Ensures we're connected to the Anvil ("test ... junk" mnemonic) account with the given index,
 * disconnecting from another Wagmi connector if necessary.
 */
// export async function ensureLocalAccountIndex(index: number) {
//   await burnerConnectors[0].ensureConnectedToIndex(index)
// }

// =================================================================================================
