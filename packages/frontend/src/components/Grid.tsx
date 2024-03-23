import { FC } from "react"

import { ZeroAddress } from "src/chain"
import { type LandInfo, LandType } from "src/types"

interface GridProps {
    tiles: readonly LandInfo[]
}

interface TileProps {
    index: number
    info: LandInfo
}

const Tile: FC<TileProps> = (props) => {
    const x = ~~(props.index / 5)
    const y = props.index % 5

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

    return (
        <div
            key={props.index}
            className="relative h-64 w-64 bg-gray-200 bg-cover"
            // style={{ backgroundImage: `url('${pinataURL(cid)}')` }}
            style={{ backgroundImage: landImageURL }}
        >
            {props.info.owner != ZeroAddress && (
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
        </div>
    )
}

export const Grid: FC<GridProps> = (props) => {
    return (
        <div className="max-w-fit overflow-scroll">
            <div className="inline-grid min-w-max grid-cols-5 gap-5">
                {props.tiles &&
                    Array.from({ length: 25 }).map((_, index) => (
                        <Tile key={index} index={index} info={props.tiles[index]} />
                    ))}
            </div>
        </div>
    )
}
