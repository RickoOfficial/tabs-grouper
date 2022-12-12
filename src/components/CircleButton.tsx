export function CircleButton(props: any) {
	return (
		<button
			className={
				'flex justify-center items-center w-6 h-6 px-1 py-1 hover:scale-110 active:scale-75 ease-in-out duration-150 cursor-pointer '
				+ props.className
			}
		>{props.children}</button>
	)
}