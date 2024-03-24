import { useCallback, useEffect, useState } from "react"

import { ConnectKitButton, useModal } from "connectkit"
import { useAccount } from "wagmi"

import { chains } from "src/chain"
import { BalanceView } from "src/components/balanceView"
import { Grid } from "src/components/grid"
import { TileView } from "src/components/tileView"
import { deployment } from "src/deployment"
import {
    useReadGridCatanGameGetAllLandInfo,
    useReadGridCatanGameGetPlayerResourceBalance,
    useReadGridLand721GetAllLandUrIs,
    useWriteGridLand721SetTokenUri,
} from "src/generated"
import { GridlockPage } from "src/pages/_app"
import { LandInfo, LandType } from "src/types"

const Home: GridlockPage = ({ isHydrated }) => {
    const { GridLand721, GridCatanGame } = deployment

    const { address, chain: accountChain } = useAccount()
    const { setOpen: setConnectKitModalOpen } = useModal()

    const chainSupported = chains.some((chain) => chain.id === accountChain?.id)

    // These three states are mutually exclusive. One of them is always true.
    const notConnected = !isHydrated || !address
    const isRightNetwork = !notConnected && chainSupported
    // const isWrongNetwork = !notConnected && !chainSupported

    const [selectedTile, setSelectedTile] = useState<number | undefined>(undefined)

    // const cid = "QmQHnT7k3XtWaMdn9FP7ZSMnh4FAu44hxDtpxLa6XjUKc5"

    useEffect(() => {
        // Close ConnectKit modal when the network is right
        if (isRightNetwork) {
            setConnectKitModalOpen(false)
        }
        // setConnectKitModalOpen is always different, because ConnectKit people are bad at React,
        // therefore it can't be a dependency there or it will close the modal when we attempt to
        // open it.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRightNetwork])

    const { data: pictures } = useReadGridLand721GetAllLandUrIs({
        address: GridLand721,
    })

    const { data: tiles } = useReadGridCatanGameGetAllLandInfo({
        address: GridCatanGame,
    })

    const selectedTileInfo = selectedTile ? tiles?.[selectedTile] : undefined

    const { data: balances } = useReadGridCatanGameGetPlayerResourceBalance({
        address: GridCatanGame,
        args: [address || "0x0"],
        query: {
            enabled: !!address,
        },
    })

    const { writeContract: setTokenURI } = useWriteGridLand721SetTokenUri()

    const setPicture = useCallback(
        (tokenId: number, url: string) => {
            setTokenURI({
                address: GridLand721,
                args: [BigInt(tokenId), url],
            })
        },
        [setTokenURI]
    )

    return (
        <main className="flex h-screen flex-col gap-y-10 px-10 py-10">
            <div className="flew-row flex justify-between">
                <h1 className="font-serif text-7xl font-extrabold tracking-tight text-white">
                    <span className="text-red-400">Grid</span>lock
                </h1>


                <div className="pt-5">
                    {notConnected && (
                        <button
                            className="btn w-64 border-yellow-500 hover:border-orange-500 hover:text-orange-500"
                            onClick={async () => setConnectKitModalOpen(true)}
                        >
                            ConnectWallet
                        </button>
                    )}
                    {!notConnected && <ConnectKitButton />}
                </div>
            </div>

            {isRightNetwork && (
                <div className="h- flex flex-row gap-5 overflow-auto">
                    <Grid tiles={tiles as readonly LandInfo[]} setSelectedTile={setSelectedTile} />

                    {/* Side Panel */}
                    <div className="flex h-full w-96 min-w-96 flex-col">
                        <BalanceView balances={balances} />
                        {/* TODO: right-side corners are not rounded in the presence of a scrollbar */}
                        {/* TODO: avoid x axis overflow when content is too large */}
                        <div className="overflow-auto rounded-lg border-2 border-white p-5">
                            {selectedTile && selectedTileInfo && (
                                <TileView tileId={selectedTile} balances={balances as readonly bigint[]} tileInfo={selectedTileInfo} />
                            )}
                            {!selectedTileInfo && <p>Click a tile to view details!</p>}
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Home
