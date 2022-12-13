// import { useState } from 'react'
import { CircleButton } from './CircleButton'

export function Group({ group, openSettings }) {

	return (
		<div className="relative" >
			<div className="group__name w-full px-4 py-2 ease-in-out duration-150 hover:bg-gray-200 cursor-pointer select-none">{group.name}</div>
			<CircleButton
				onClick={() => { openSettings() }}
				className="group__settings absolute top-1/2 right-4 -translate-y-1/2 group"
			>
				<svg className="bi bi-gear-fill w-full h-full text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
					<path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
				</svg>
				<span className="absolute -bottom-3 text-gray-600 text-xs opacity-0 ease-in-out duration-150 group-hover:opacity-100">Settings</span>
			</CircleButton>
		</div>
	)
}