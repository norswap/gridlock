import { useCallback, useEffect } from "react"

import { clsx } from "clsx"
import { ConnectKitButton, useModal } from "connectkit"
import { useAccount } from "wagmi"

import { chains } from "src/chain"
import { deployment } from "src/deployment"
import { useReadGridLand721GetAllLandUrIs, useWriteGridLand721SetTokenUri } from "src/generated"
import { GridlockPage } from "src/pages/_app"
import { Modal, showModal } from "src/components/modal"

const Home: GridlockPage = ({ isHydrated }) => {
    const { GridLand721, GridResource1155 } = deployment

    const { address, chain: accountChain } = useAccount()
    const { setOpen: setConnectKitModalOpen } = useModal()

    const chainSupported = chains.some((chain) => chain.id === accountChain?.id)

    // These three states are mutually exclusive. One of them is always true.
    const notConnected = !isHydrated || !address
    const isRightNetwork = !notConnected && chainSupported
    // const isWrongNetwork = !notConnected && !chainSupported

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

    function displaySetPictureModal() {
        console.log("set picture modalS")
    }

    return (
        <main className="flex h-screen flex-col gap-y-10 px-10 py-10">
            <div className="flew-row flex justify-between">
                <h1 className="font-serif text-7xl font-extrabold tracking-tight text-white">
                    <span className="font-mono font-light text-red-400">Grid</span>lock
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
                    <div className="max-w-fit overflow-scroll">
                        <div className="inline-grid min-w-max grid-cols-5 gap-5">
                            {Array.from({ length: 25 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={clsx(
                                        "flex h-64 w-64 items-center justify-center bg-gray-200 bg-cover",
                                        "bg-[url('../../public/art/terrain_wheat_fields.png')]"
                                    )}
                                >
                                    {~~(index / 5)}, {index % 5}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="h-full w-96 min-w-96 overflow-auto rounded-lg border-2 border-white p-5">
                        <h2 className="pb-3 text-2xl text-yellow-500">Land #1</h2>
                        <p>Location: (0, 0)</p>
                        <p>Owned by 0x1234567890</p>
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
                    </div>
                </div>
            )}
        </main>
    )
}

export default Home
