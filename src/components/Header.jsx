import { CircleButton } from "./CircleButton"

export function Header({ createGroup }) {
	return (
		<header
			className="flex justify-between items-center w-full bg-violet-600 text-white py-2 px-4 select-none"
		>
			<div className="text-xl uppercase">TABS GROUPER</div>
			<CircleButton
				onClick={createGroup}
				className="rounded-full bg-white text-violet-600 px-0.5 py-0.5"
			>
				<svg className="bi bi-plus w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"> <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" /> </svg>
			</CircleButton>
		</header>
	)
}