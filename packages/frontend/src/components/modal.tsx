// Modal React component

import { FC, ReactNode } from "react"
import { createPortal } from "react-dom"

interface ModalProps {
    id: string
    children: ReactNode
}

export function showModal(id: string) {
    ;(document.getElementById(id) as HTMLDialogElement)?.showModal()
}

export const Modal: FC<ModalProps> = (props) => {
    return createPortal(
        <dialog id={props.id} className="modal">
            <div className="modal-box">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
                </form>
                {props.children}
            </div>
            {/* close modal when clicking outside */}
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>,
        document.body
    )
}
