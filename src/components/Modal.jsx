export function Modal({ children, title, show, setShow, ...props }) {
	return (
		<div
			className={
				'absolute top-0 left-0 w-full h-full ease-in-out duration-150 '
				+ (show ? 'opacity-100 z-10' : 'opacity-0 -z-10')
			}
		>
			<div
				onClick={() => setShow(false)}
				className="absolute top-0 left-0 w-full h-full bg-slate-700 bg-opacity-50"
			></div>
			<div className="relative top-1/2 left-1/2 w-11/12 rounded-md border border-slate-300 shadow-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden">
				<div className="px-2 py-1 bg-white border-b border-slate-300 text-lg font-medium">{title}</div>
				<div className="bg-slate-100 px-1 py-1">{children}</div>
			</div>
		</div>
	)
}