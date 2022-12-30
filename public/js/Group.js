class Group {
	constructor(options = undefined) {
		if (typeof options === 'undefined') {
			this.id = utils.generateId(12)
			this.name = `Group ${TG.groups.length + 1}`
			this.index = Number(TG.groups.length)
			this.tabs = []
		} else if (typeof options === 'object') {
			this.id = options.id
			this.name = options.name
			this.index = options.index
			this.tabs = options.tabs
		}
	}

	update(redactGroup) {
		this.name = redactGroup.name
	}

	async addTab(tabData) {
		let newTab = {
			id: tabData.id,
			url: tabData.url || 'chrome://newtab',
			title: tabData.title,
			active: tabData.active,
			index: tabData.index,
			favIconUrl: tabData.favIconUrl
		}

		this.tabs[newTab.index] = newTab
	}
}