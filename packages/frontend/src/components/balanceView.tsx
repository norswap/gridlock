import { FC } from "react"

import { LandInfo, LandType } from "src/types"

interface BalanceViewProps {
    balances: readonly bigint[] | undefined
}

export const BalanceView: FC<BalanceViewProps> = (props) => {
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
                    <button className="button ml-2 !h-10 !min-h-10 !p-2">Make</button>
                </div>
                <div className="flex flex-row items-center gap-1.5">
                    <img className="w-10 rounded-lg" src="/art/bao_bun.png" alt="Sesame Bun" title="Sesame Bun" />
                    <p>{props.balances?.[LandType.SESAME_BUN]?.toString() || "0"}</p>
                    <button className="button ml-2 !h-10 !min-h-10 !p-2">Bake</button>
                </div>
            </div>
        </div>
    )
}
