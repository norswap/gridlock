import { FC, useCallback, useEffect } from "react"

import { useAccount, useWaitForTransactionReceipt } from "wagmi"

import { ZeroAddress } from "src/chain"
import { deployment } from "src/deployment"
import { useReadGridCatanGameGetAllLandInfo, useWriteGridLand721Mint } from "src/generated"
import { type LandInfo, LandType } from "src/types"

interface GridProps {
    tiles: readonly LandInfo[]
    setSelectedTile: (index: number) => void
}

interface TileProps {
    index: number
    info: LandInfo
    mintLand: (index: number) => void
    setSelectedTile: (index: number) => void
}

const Tile: FC<TileProps> = (props) => {
    const index = props.index
    const mintLandCall = props.mintLand

    const mintLand = useCallback(() => {
        mintLandCall(index)
    }, [mintLandCall, index])

    let landImage = ""
    switch (props.info.landType) {
        case LandType.SUGAR:
            landImage = "terrain_sugar_sugarcane"
            break
        case LandType.MILK:
            landImage = "terrain_milk_pasture"
            break
        case LandType.TAPIOCA:
            landImage = "terrain_tapioca_mountains"
            break
        case LandType.SESAME:
            landImage = "terrain_sesame_farm"
            break
        case LandType.WHEAT:
            landImage = "terrain_wheat_fields"
            break
    }
    if (props.info.owner == ZeroAddress) {
        landImage = "uncharted_territory"
    }
    const landImageURL = `url('/art/${landImage}.png')`

    let resourceImage = ""
    let resourceName = ""
    switch (props.info.landType) {
        case LandType.SUGAR:
            resourceImage = "ingredient_sugar"
            resourceName = "Sugar"
            break
        case LandType.MILK:
            resourceImage = "ingredient_milk"
            resourceName = "Milk"
            break
        case LandType.TAPIOCA:
            resourceImage = "ingredient_weirdtapioca"
            resourceName = "Tapioca"
            break
        case LandType.SESAME:
            resourceImage = "ingredient_sesame"
            resourceName = "Sesame"
            break
        case LandType.WHEAT:
            resourceImage = "ingredient_flour"
            resourceName = "Wheat"
            break
    }
    const resourceImageURL = `/art/${resourceImage}.png`

    const isOwned = props.info.owner != ZeroAddress

    const setSelectedTile = props.setSelectedTile
    const selectTile = useCallback(() => {
        setSelectedTile(index)
    }, [setSelectedTile, index])

    return (
        <div
            key={props.index}
            className="relative h-64 w-64 bg-gray-200 bg-cover"
            // style={{ backgroundImage: `url('${pinataURL(cid)}')` }}
            style={{ backgroundImage: landImageURL }}
        >
            {isOwned && (
                <>
                    <div className="absolute top-0 h-48 w-full" onClick={selectTile}></div>
                    <div className="absolute bottom-0 flex h-16 w-full flex-row justify-between bg-indigo-500 bg-opacity-75 p-1">
                        <img
                            className="w-14 rounded-full border-2 border-black"
                            src={resourceImageURL}
                            alt={resourceName}
                            width={56}
                            height={56}
                        />

                        <div className="flex flex-row">
                            <img
                                className="w-14 rounded-full border-2 border-black"
                                src="/art/frog_farmer.jpg"
                                alt="Workers"
                                title="Workers"
                            />
                            <p className="px-1 py-3 text-2xl">{props.info.workers.toString()}</p>
                        </div>

                        <div className="flex flex-row">
                            <img
                                className="w-14 rounded-full border-2 border-black"
                                src="/art/frog_fighter.jpg"
                                alt="Soldiers"
                                title="Soldiers"
                                width={56}
                                height={56}
                            />
                            <p className="px-1 py-3 text-2xl">{props.info.totalSoldiers.toString()}</p>
                        </div>
                    </div>
                </>
            )}
            {!isOwned && (
                <div className="absolute bottom-0 flex h-16 w-full flex-row justify-center bg-indigo-500 bg-opacity-75 p-1">
                    <button className="button m-1 w-52 !justify-center" onClick={mintLand}>
                        Mint
                    </button>
                </div>
            )}
        </div>
    )
}

export const Grid: FC<GridProps> = (props) => {
    const { GridLand721, GridCatanGame } = deployment

    const { address } = useAccount()

    const { status, data: mintTxHash, writeContract: mintCall } = useWriteGridLand721Mint()
    const mintLand = useCallback(
        (id: number) => {
            if (!address) return
            mintCall({
                address: GridLand721,
                args: [address, BigInt(id)],
            })
        },
        [address, mintCall]
    )

    const { isSuccess: mintTxConfirmed } = useWaitForTransactionReceipt({ hash: mintTxHash })

    const { refetch: refetchTiles } = useReadGridCatanGameGetAllLandInfo({
        address: GridCatanGame,
    })

    useEffect(() => {
        if (status === "success" && mintTxConfirmed) {
            refetchTiles()
        }
    }, [status, mintTxConfirmed, refetchTiles])

    return (
        <div className="max-w-fit overflow-scroll">
            <div className="inline-grid min-w-max grid-cols-5 gap-5">
                {props.tiles &&
                    Array.from({ length: 25 }).map((_, index) => (
                        <Tile
                            key={index}
                            index={index}
                            info={props.tiles[index]}
                            mintLand={mintLand}
                            setSelectedTile={props.setSelectedTile}
                        />
                    ))}
            </div>
        </div>
    )
}
