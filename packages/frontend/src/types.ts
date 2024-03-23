import { Address } from "viem"

export enum LandType {
    SUGAR,
    MILK,
    TAPIOCA,
    SESAME,
    WHEAT,
    BOBA,
    SESAME_BUN,
}

export type LandInfo = {
    owner: Address
    landType: LandType
    workers: bigint
    totalSoldiers: bigint
}
