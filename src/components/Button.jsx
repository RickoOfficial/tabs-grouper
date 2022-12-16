export function Button({ className, children, ...props }) {
	return (
		<button
			className={
				'px-2 rounded outline-none text-sm font-medium select-none cursor-pointer ease-in-out duration-150 hover:scale-110 active:scale-90 '
				+ className
			}
			{...props}
		>{children}</button>
	)
}