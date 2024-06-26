import { FC, useCallback, useEffect } from "react"

import { useAccount, useWaitForTransactionReceipt } from "wagmi"

import { ZeroAddress } from "src/chain"
import { Modal, showModal } from "src/components/modal"
import { deployment } from "src/deployment"
import {
    useReadGridCatanGameGetAllLandInfo,
    useReadGridCatanGameGetPlayerResourceBalance,
    useWriteGridCatanGameHarvest,
    useWriteGridCatanGamePurchase,
} from "src/generated"
import { LandInfo, LandType } from "src/types"
import { secondsSinceEpoch, shortenAddress } from "src/utils"

interface TileViewProps {
    balances: readonly bigint[]
    tileId: number
    tileInfo: LandInfo
}

export const TileView: FC<TileViewProps> = (props) => {
    const info = props.tileInfo
    const shortOwner = shortenAddress(info.owner)
    let landTypeName = ""
    switch (info.landType) {
        case LandType.SUGAR:
            landTypeName = "Sugar Cane Plantation"
            break
        case LandType.MILK:
            landTypeName = "Pasture"
            break
        case LandType.TAPIOCA:
            landTypeName = "Tapioca Field"
            break
        case LandType.SESAME:
            landTypeName = "Sesame Crop"
            break
        case LandType.WHEAT:
            landTypeName = "Wheat Field"
            break
    }
    if (info.owner === ZeroAddress) {
        landTypeName = "Uncharted Territory"
    }

    const harvestableResources = (BigInt(secondsSinceEpoch()) - info.timeOfLastResourceCollect) / 2n
    const totalSoldiers = Number(info.totalSoldiers)
    const attackingSoldiers = Number(info.attackingSoldiers)
    const defendingSoldiers = totalSoldiers - attackingSoldiers
    const attacking = info.attackingSoldiers > 0
    const distanceToDest =
        Math.abs(info.destination.x - info.location.x) + Math.abs(info.destination.y - info.location.y)
    const timeToArrival = distanceToDest * 10

    const { GridCatanGame } = deployment
    const { address } = useAccount()

    const {
        status: harvestTxStatus,
        data: harvestTxHash,
        error: harvestError,
        writeContract: harvestCall,
    } = useWriteGridCatanGameHarvest()
    const { isSuccess: harvestSucceeded } = useWaitForTransactionReceipt({ hash: harvestTxHash })

    if (harvestError) {
        console.log(harvestError)
    }

    const harvest = useCallback(() => {
        harvestCall({
            address: GridCatanGame,
            args: [BigInt(props.tileId)],
        })
    }, [harvestCall, props.tileId])

    const { refetch: refetchTiles } = useReadGridCatanGameGetAllLandInfo({
        address: GridCatanGame,
    })

    const { refetch: refetchBalances } = useReadGridCatanGameGetPlayerResourceBalance({
        address: GridCatanGame,
        args: [address || "0x0"],
        query: {
            enabled: !!address,
        },
    })

    useEffect(() => {
        if (harvestTxStatus == "success" && harvestSucceeded) {
            refetchTiles()
            refetchBalances()
        }
    }, [harvestTxStatus, harvestSucceeded, refetchTiles, refetchBalances])

    const {
        status: purchaseTxStatus,
        data: purchaseTxHash,
        error: purchaseError,
        writeContract: purchaseCall,
    } = useWriteGridCatanGamePurchase()
    const { isSuccess: purchaseSucceeded } = useWaitForTransactionReceipt({ hash: purchaseTxHash })

    if (purchaseError) {
        console.log(purchaseError)
    }

    const purchaseWorker = useCallback(() => {
        purchaseCall({
            address: GridCatanGame,
            args: [BigInt(props.tileId), BigInt(1), BigInt(0)],
        })
    }, [purchaseCall, props.tileId])

    const purchaseSoldier = useCallback(() => {
        purchaseCall({
            address: GridCatanGame,
            args: [BigInt(props.tileId), BigInt(0), BigInt(1)],
        })
    }, [purchaseCall, props.tileId])

    useEffect(() => {
        if (purchaseTxStatus == "success" && purchaseSucceeded) {
            refetchTiles()
            refetchBalances()
        }
    }, [purchaseTxStatus, purchaseSucceeded, refetchTiles, refetchBalances])

    return (
        <>
            <h2 className="pb-3 text-2xl text-yellow-500">Land #{props.tileId}</h2>
            <p>
                Location: ({info.location.x}, {info.location.y})
            </p>
            <p title={info.owner}>Owned by {shortOwner}</p>
            <p>Type: {landTypeName}</p>
            <p>Harvestable Resources: {harvestableResources.toString()}</p>
            <p></p>
            <p>Workers: {info.workers.toString()}</p>
            <p>Total Soldiers: {info.totalSoldiers.toString()}</p>

            {totalSoldiers > 0 && (
                <>
                    <p className="pl-10">Attacking Soldiers: {attackingSoldiers}</p>
                    <p className="pl-10">Defending Soldiers: {defendingSoldiers}</p>
                </>
            )}

            {attacking && (
                <>
                    <p></p>
                    <p>Attacking: {attacking ? "Yes" : "No"}</p>
                    <p>
                        Destination: ({info.destination.x}, {info.destination.y})
                    </p>
                    <p>Time to Arrival: {timeToArrival}s</p>
                </>
            )}

            <div className="flex flex-col justify-start gap-3 pt-3">
                <button className="button" onClick={harvest}>
                    Harvest
                </button>
                <button className="button">Attack</button>
                <button className="button">Resolve</button>
                <button className="button" onClick={purchaseWorker}>
                    Buy Worker (1 Boba)
                </button>
                <button className="button" onClick={purchaseSoldier}>
                    Buy Soldier (1 Sesame Bun)
                </button>
                <button className="button" onClick={() => showModal("set-picture")}>
                    Set Picture
                </button>
                <Modal id="set-picture">
                    <h3 className="text-lg font-bold">Hello!</h3>
                    <p className="py-4">Press ESC key or click on ✕ button to close</p>
                </Modal>
            </div>
        </>
    )
}
