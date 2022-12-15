// import { useState } from 'react'
import { Button } from './Button'

export function Group({ group, openGroupSettings, openGroup }) {

	return (
		<div className="flex overflow-hidden">
			<div className="flex-auto relative pl-4 py-2 overflow-hidden whitespace-nowrap">
				{group.name}
				<div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-r from-white/0 via-white/90 to-white"></div>
			</div>
			<div className="pr-4 py-2">
				<Button
					onClick={() => { openGroupSettings() }}
					className="px-1 text-white bg-sky-500"
				>Settings</Button>
			</div>
		</div>
	)
	/*
	return (
		<div
			className='flex items-center px-2 py-1 text-sm ease-in-out duration-150 hover:bg-sky-100 cursor-pointer select-none'
		>
			<div
				onClick={() => { openGroup() }}
				className="group__name w-full whitespace-nowrap"
			>{group.name}</div>
			<CircleButton
				onClick={() => { openGroupSettings() }}
				className="group__settings"
			>
				<svg className="bi bi-gear-fill w-full h-full text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
					<path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
				</svg>
			</CircleButton>
		</div>
	)
	*/
}