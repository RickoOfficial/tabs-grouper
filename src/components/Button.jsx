export function Button({ className, children, ...props }) {
	return (
		<button
			className={
				'rounded outline-none font-semibold select-none cursor-pointer ease-in-out duration-150 hover:scale-110 active:scale-75 '
				+ className
			}
			{...props}
		>{children}</button>
	)
}