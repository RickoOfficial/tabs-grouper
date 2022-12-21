class Group {
	constructor(options = undefined) {
		if (typeof options === 'undefined') {
			this.id = TG.generateId(12)
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

	update(groupData) {
		this.name = groupData.name
	}

	async addTab(tabData) {
		if (!tabData || typeof tabData !== 'object' || tabData.pinned) return false

		let newTab = {
			id: tabData.id,
			url: tabData.url || 'chrome://newtab',
			title: tabData.title,
			active: tabData.active,
			index: tabData.index,
			favIconUrl: tabData.favIconUrl
		}

		this.tabs[newTab.index] = newTab

		await TG.faviconToBase64(newTab.favIconUrl, base64 => {
			this.tabs[newTab.index].favIconUrl = base64
		})
	}

	async updateTab(index, tabData) {
		this.tabs[index].url = tabData.url
		this.tabs[index].title = tabData.title
		this.tabs[index].favIconUrl = tabData.favIconUrl

		await TG.faviconToBase64(this.tabs[index].favIconUrl, base64 => {
			this.tabs[index].favIconUrl = base64
		})
	}
}