import { FC, useCallback, useEffect } from "react"

import { LandType } from "src/types"
import {
    useReadGridCatanGameGetPlayerResourceBalance,
    useWriteGridCatanGameCraftBoba,
    useWriteGridCatanGameCraftBun
} from "src/generated"
import { useAccount, useWaitForTransactionReceipt } from "wagmi"
import { deployment } from "src/deployment"

interface BalanceViewProps {
    balances: readonly bigint[] | undefined
}

export const BalanceView: FC<BalanceViewProps> = (props) => {

    const { data: craftBobaTxHash, error: craftBobaError, status: craftBobaStatus, writeContract: craftBobalCall } = useWriteGridCatanGameCraftBoba()
    const { data: craftBunTxHash, status: craftBunStatus, writeContract: craftBunCall } = useWriteGridCatanGameCraftBun()

    const { isSuccess: craftBobaConfirmed } = useWaitForTransactionReceipt({ hash: craftBobaTxHash })
    const { isSuccess: craftBunConfirmed } = useWaitForTransactionReceipt({ hash: craftBunTxHash })

    const { GridCatanGame } = deployment
    const { address } = useAccount()

    const { data: balances, refetch: refetchBalances } = useReadGridCatanGameGetPlayerResourceBalance({
        address: GridCatanGame,
        args: [address || "0x0"],
        query: {
            enabled: !!address,
        },
    })

    if (craftBobaError) {
        console.log(craftBobaError)
    }

    useEffect(() => {
        if (craftBobaStatus === "success" && craftBobaConfirmed) {
            console.log("refetching (boba)")
            refetchBalances()
        }
    }, [craftBobaStatus, craftBobaConfirmed, refetchBalances])

    useEffect(() => {
        if (craftBunStatus === "success" && craftBunConfirmed) {
            console.log("refetching (bun)")
            refetchBalances()
        }
    }, [craftBunStatus, craftBunConfirmed, refetchBalances])

    const craftBoba = useCallback(() => {
        console.log("crafting (boba)")
        craftBobalCall({
            address: GridCatanGame,
            args: [BigInt(1)],
        })
    }, [craftBobalCall])

    const craftBun = useCallback(() => {
        console.log("crafting (bun)")
        craftBunCall({
            address: GridCatanGame,
            args: [BigInt(1)],
        })
    }, [craftBunCall])

    return (
        <div className="mb-5 flex w-96 min-w-96 flex-col gap-5 rounded-lg border-2 border-white p-5">
            <div className="flex flex-row justify-around gap-1.5">
                <div className="flex flex-row items-center gap-1.5">
                    <img className="w-10 rounded-full" src="/art/ingredient_sugar.png" alt="Sugar" title="Sugar" />
                    <p>{props.balances?.[LandType.SUGAR]?.toString() || "0"}</p>
                </div>
                <div className="flex flex-row items-center gap-1.5">
                    <img className="w-10 rounded-full" src="/art/ingredient_milk.png" alt="Milk" title="Milk" />
                    <p>{props.balances?.[LandType.MILK]?.toString() || "0"}</p>
                </div>
                <div className="flex flex-row items-center gap-1.5">
                    <img
                        className="w-10 rounded-full"
                        src="/art/ingredient_weirdtapioca.png"
                        alt="Tapioca"
                        title="Tapioca"
                    />
                    <p>{props.balances?.[LandType.TAPIOCA]?.toString() || "0"}</p>
                </div>
                <div className="flex flex-row items-center gap-1.5">
                    <img className="w-10 rounded-full" src="/art/ingredient_sesame.png" alt="Sesame" title="Sesame" />
                    <p>{props.balances?.[LandType.SESAME]?.toString() || "0"}</p>
                </div>
                <div className="flex flex-row items-center gap-1.5">
                    <img className="w-10 rounded-full" src="/art/ingredient_flour.png" alt="Wheat" title="Wheat" />
                    <p>{props.balances?.[LandType.WHEAT]?.toString() || "0"}</p>
                </div>
            </div>
            <div className="flex flex-row justify-center gap-10">
                <div className="flex flex-row items-center gap-1.5">
                    <img className="w-10 rounded-lg" src="/art/boba.png" alt="Boba" title="Boba" />
                    <p>{props.balances?.[LandType.BOBA]?.toString() || "0"}</p>
                    <button className="button ml-2 !h-10 !min-h-10 !p-2" onClick={craftBoba}>Make</button>
                </div>
                <div className="flex flex-row items-center gap-1.5">
                    <img className="w-10 rounded-lg" src="/art/bao_bun.png" alt="Sesame Bun" title="Sesame Bun" />
                    <p>{props.balances?.[LandType.SESAME_BUN]?.toString() || "0"}</p>
                    <button className="button ml-2 !h-10 !min-h-10 !p-2" onClick={craftBun}>Bake</button>
                </div>
            </div>
        </div>
    )
}
