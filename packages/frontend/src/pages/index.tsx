import { ConnectKitButton, useModal } from "connectkit"
import { useAccount } from "wagmi"

import { chains } from "src/chain"
import { GridlockPage } from "src/pages/_app.js"
import { useEffect } from "react"

const Home: GridlockPage = ({ isHydrated }) => {
    const { address, chain: accountChain } = useAccount()
    const { setOpen: setConnectKitModalOpen } = useModal()

    const chainSupported = chains.some((chain) => chain.id === accountChain?.id)

    // These three states are mutually exclusive. One of them is always true.
    const notConnected = !isHydrated || !address
    const isRightNetwork = !notConnected && chainSupported
    const isWrongNetwork = !notConnected && !chainSupported

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

    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                <h1 className="font-serif text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                    <span className="font-mono font-light text-red-400">Grid</span>lock
                </h1>

                {notConnected && (
                    <div>
                        <button className="btn" onClick={async () => setConnectKitModalOpen(true)}>
                            ConnectWallet
                        </button>
                    </div>
                )}

                {isWrongNetwork && <ConnectKitButton />}

                {isRightNetwork && (
                    <>
                        <p>Right Network</p>
                        <ConnectKitButton />
                    </>
                )}
            </div>
        </main>
    )
}

export default Home
