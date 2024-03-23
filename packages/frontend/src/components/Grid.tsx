import { FC, useCallback, useEffect, useState } from "react"

import { ZeroAddress } from "src/chain"
import { type LandInfo, LandType } from "src/types"
import { useReadGridCatanGameGetAllLandInfo, useWriteGridLand721Mint } from "src/generated"
import { deployment } from "src/deployment"
import { useAccount, useWaitForTransactionReceipt } from "wagmi"

interface GridProps {
    tiles: readonly LandInfo[]
}

interface TileProps {
    index: number
    info: LandInfo
    mintLand: (index: number) => void
}

const Tile: FC<TileProps> = (props) => {
    const x = ~~(props.index / 5)
    const y = props.index % 5

    const mintLand = useCallback(() => {
        props.mintLand(props.index)
    }, [props.mintLand, props.index])

    let landImage = "terrain_wheat_fields"
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

    return (
        <div
            key={props.index}
            className="relative h-64 w-64 bg-gray-200 bg-cover"
            // style={{ backgroundImage: `url('${pinataURL(cid)}')` }}
            style={{ backgroundImage: landImageURL }}
        >
            {isOwned && (
                <div className="absolute bottom-0 flex h-16 w-full flex-row justify-between bg-indigo-500 bg-opacity-75 p-1">
                    <img
                        className="w-14 rounded-full border-2 border-black"
                        src={resourceImageURL}
                        alt={resourceName}
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
                        />
                        <p className="px-1 py-3 text-2xl">{props.info.totalSoldiers.toString()}</p>
                    </div>
                </div>
            )}
            {!isOwned && (
              <div
                className="absolute bottom-0 flex h-16 w-full flex-row justify-center bg-indigo-500 bg-opacity-75 p-1">
                  <button className="button m-1 w-52 !justify-center" onClick={mintLand}>Mint</button>
              </div>
            )}
        </div>
    )
}

export const Grid: FC<GridProps> = (props) => {
    const { GridLand721, GridCatanGame } = deployment
    const { address } = useAccount()
    const [ tiles, setTiles ] = useState<readonly LandInfo[]>(props.tiles)

    const { status, data: mintTxHash, writeContract: mintCall } = useWriteGridLand721Mint()
    const mintLand = useCallback((id: number) => {
        if (!address) return
        mintCall({
            address: GridLand721,
            args: [address, BigInt(id)],
        })
    }, [address, mintCall])

    const { isSuccess: mintTxConfirmed } = useWaitForTransactionReceipt({ hash: mintTxHash })

    const { data: fetchedTiles, refetch } = useReadGridCatanGameGetAllLandInfo({
        address: GridCatanGame,
    })

    useEffect(() => {
        if (status === "success" && mintTxConfirmed) {
            refetch()
        }
    }, [status, mintTxConfirmed, refetch])

    return (
        <div className="max-w-fit overflow-scroll">
            <div className="inline-grid min-w-max grid-cols-5 gap-5">
                {props.tiles &&
                    Array.from({ length: 25 }).map((_, index) => (
                        <Tile key={index} index={index} info={props.tiles[index]} mintLand={mintLand} />
                    ))}
            </div>
        </div>
    )
}
