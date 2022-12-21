export function Tab({ tab }) {
	return (
		<div
			title={tab.title}
			id={tab.id}
			className="flex items-center gap-2"
		>
			<div className="pl-2 py-1 flex-none">
				{tab.favIconUrl
					? <img className="w-4 h-4 object-contain" src={tab.favIconUrl} alt="" />
					: <div className="w-4 h-4"></div>
				}
			</div>
			<div className="flex-auto relative py-1 overflow-hidden">
				<div className="text-sm whitespace-nowrap">{tab.title}</div>
				<div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-r from-slate-50/0 via-slate-50/90 to-slate-50"></div>
			</div>
		</div>
	)
	
	/*
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
	*/
}

export default Tab