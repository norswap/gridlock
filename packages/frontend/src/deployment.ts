/**
 * This module imports the JSON containing the deployed addresses from the `contracts` package, and
 * exports it as a TypeScript type.
 *
 * @module deployment
 */

import * as deployment_ from "contracts/out/deployment.json" assert { type: "json" }
import type { Address } from "viem"

export type Deployment = {
    GridLand721: Address
    GridResource1155: Address
    GridCatanGame: Address
}

// NOTE: This silly `default` affair is required for running the e2e tests which cause
// `deployment_` to have the type `{ default: Deployment }` instead of `Deployment`.
// Maybe Next doesn't process things the same as the vanilla Node/TS config ??

export const deployment =
    (deployment_ as any).default === undefined
        ? (deployment_ as Deployment)
        : ((deployment_ as any).default as Deployment)
