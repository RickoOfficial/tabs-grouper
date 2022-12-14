export function Tab({ tab }) {
	return (
		<div
			title={tab.title}
			className="tab relative flex justify-between items-center gap-2 px-2 py-1 text-sm"
		>
			{tab.favIconUrl
				? <img className="w-3 h-3 object-contain" src={tab.favIconUrl} />
				: <div className="w-3 h-3"></div>
			}
			<div className="flex-auto whitespace-nowrap">{tab.title}</div>
			<div className="absolute top-0 right-0 h-full w-7 bg-gradient-to-r from-white/0 via-white/90 to-white"></div>
		</div>
	)
}

export default Tab