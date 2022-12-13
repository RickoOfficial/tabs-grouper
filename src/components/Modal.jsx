import { useState } from "react"
import { CircleButton } from "./CircleButton"

export function Modal({ children, title, show, setShow, ...props }) {
	return (
		<div
			className={
				'modal absolute top-0 left-0 w-full h-full ease-in-out duration-150 '
				+ (show ? 'opacity-100 z-10' : 'opacity-0 -z-10')
			}
		>
			<div
				onClick={() => setShow(false)}
				className="modal__blackout absolute top-0 left-0 w-full h-full bg-gray-600 bg-opacity-50"
			></div>
			<div className="modal__content relative top-1/2 left-1/2 w-11/12 bg-white px-4 py-2 rounded -translate-x-1/2 -translate-y-1/2">
				<CircleButton
					onClick={() => setShow(false)}
					className="group absolute right-2"
				>
					<svg className="bi bi-x-circle w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
						<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
						<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
					</svg>
					<span className="absolute -bottom-3 text-gray-600 text-xs opacity-0 ease-in-out duration-150 group-hover:opacity-100">Close</span>
				</CircleButton>
				<div className="modal__title mb-4 w-11/12 font-bold text-lg">{title}</div>
				<div className="modal__body text-sm">{children}</div>
			</div>
		</div>
	)
}