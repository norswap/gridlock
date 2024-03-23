import { FC } from "react"

import { Modal, showModal } from "src/components/modal"
import { LandInfo, LandType } from "src/types"
import { shortenAddress } from "src/utils"
import { ZeroAddress } from "src/chain"

interface TileViewProps {
    balances: readonly bigint[] | undefined
    tileInfo: LandInfo
}

export const TileView: FC<TileViewProps> = (props) => {

  const owner = props.tileInfo?.owner
  const shortOwner = owner ? shortenAddress(owner) : ZeroAddress

    return (
        <>
            <h2 className="pb-3 text-2xl text-yellow-500">Land #1</h2>
            {/*{~~(index / 5)}, {index % 5}*/}
            <p>Location: (0, 0)</p>
            <p title={owner}>Owned by {shortOwner}</p>
            <p>Type: Pasture</p>
            <p>Collection Resources: 3</p>
            <p></p>
            <p>Workers: 2</p>
            <p>Total Soldiers: 5</p>
            <p className="pl-10">Attacking Soldiers: 2</p>
            <p className="pl-10">Defending Soldiers: 2</p>
            <p></p>
            <p>Destination: (1, 1)</p>
            <p>Time to Arrival: 12s</p>
            <div className="flex flex-col justify-start gap-3 pt-3">
                <button className="button">Harvest</button>
                <button className="button">Attack</button>
                <button className="button">Resolve</button>
                <button className="button">Buy Worker (1 Boba)</button>
                <button className="button">Buy Soldier (1 Sesame Bun)</button>
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
