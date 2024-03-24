import { atom } from "jotai"

import { LandInfo } from "src/types"

export const gridAtom = atom<readonly LandInfo[]>([])
export const balancesAtom = atom<readonly bigint[]>([])
