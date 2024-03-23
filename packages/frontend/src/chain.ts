/**
 * This module exports values & logic related to chain interop.
 *
 * @module chain
 */

import { getDefaultConfig, getDefaultConnectors } from "connectkit"
import { createConfig } from "wagmi"
import { type Chain, http } from "viem"
import { localhost } from "wagmi/chains"
import { getAccount, getPublicClient } from "wagmi/actions"


import { BurnerConnector } from "src/wagmi/BurnerConnector.js"

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


const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains,
    walletConnectProjectId,
    appName: APP_NAME,

    transports: {
      // RPC URL for each chain
      [localhost.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
      ),
    },

    // In dev, we probably want to use the ?index=X parameters, and autoconnect causes
    // race conditions, leading to connecting via the parameter, disconnecting via autoconnect,
    // then reconnecting via the parameter.
    autoConnect: process.env.NODE_ENV !== "development",

    connectors: [
      ...getDefaultConnectors(connectKitAppConfig),
      ...burnerConnectors],

    // Options below are optional
    appDescription: APP_DESCRIPTION,
    // appUrl: "https://0xFable.org",
    // appIcon: "https://0xFable.org/logo.png", // app icon, no bigger than 1024x1024px & 1MB
  }),
);

// =================================================================================================
// =================================================================================================
// =================================================================================================


// -------------------------------------------------------------------------------------------------

/** Arrays containing the connector for using a local browser private key. */
const burnerConnectors = process.env.NODE_ENV === "development" ? [new BurnerConnector()] : []

// -------------------------------------------------------------------------------------------------

const metadata = {
  name: "0xFable",
  description: "Wizards & shit",
  // url: "https://0xFable.org",
  // icon: "https://0xFable.org/favicon.png",
}

const metaConfig = {
  walletConnectProjectId,
  chains,
  appName: metadata.name,
  appDescription: metadata.description,
  // appUrl: metadata.url,
  // appIcon: metadata.icon,
  app: metadata
}

/** Wagmi's configuration, to be passed to the React WagmiConfig provider. */
export const wagmiConfig = createConfig(
  getDefaultConfig({
    ...metaConfig,
    // In dev, we probably want to use the ?index=X parameters, and autoconnect causes
    // race conditions, leading to connecting via the parameter, disconnecting via autoconnect,
    // then reconnecting via the parameter.
    autoConnect: process.env.NODE_ENV !== "development",
    connectors: [
      ...getDefaultConnectors(metaConfig),
      //...burnerConnectors],
    ]
}))

// =================================================================================================
// TYPES

// -------------------------------------------------------------------------------------------------

/** Type of EVM account addresses. */
export type Address = `0x${string}`

// -------------------------------------------------------------------------------------------------

/** Type of 32-byte hashes. */
export type Hash = `0x${string}`

// -------------------------------------------------------------------------------------------------

/** Hash with value 0x0...0 */
export const ZeroHash: Hash = `0x${"0".repeat(64)}`

// -------------------------------------------------------------------------------------------------

/** `0x{string}` */
export type HexString = `0x${string}`

// -------------------------------------------------------------------------------------------------

/**
 * Simplification of wagmi's unexported GetAccountResult<TProvider>.
 */
export type AccountResult = {
  status: 'disconnected' | 'connecting' | 'connected' | 'reconnecting'
  address?: Address
}

// =================================================================================================

/**
 * Ensures we're connected to the Anvil ("test ... junk" mnemonic) account with the given index,
 * disconnecting from another Wagmi connector if necessary.
 */
export async function ensureLocalAccountIndex(index: number) {
  await burnerConnectors[0].ensureConnectedToIndex(index)
}

// =================================================================================================