let TG;
class TabsGrouper {
	groups = []

	constructor() {
		chrome.storage.local.get(['TabsGrouper']).then(res => {
			if (res !== undefined && res.TabsGrouper !== undefined) {
				for (let key in res.TabsGrouper) {
					this[key] = res.TabsGrouper[key]
				}
			} else {
				chrome.storage.local.set({ 'TabsGrouper': TG })
			}
		})

		delete this.redactGroup

		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (message.indexOf('openGroup-') !== -1) {
				this.openGroup(message.split('-')[1])
				return true
			}
			if (message.indexOf('openSettings-') !== -1) {
				sendResponse(this.openSettings(message.split('-')[1]))
				return true
			}
			if (message.indexOf('deleteGroup-') !== -1) {
				setTimeout(() => {
					this.deleteGroup(message.split('-')[1])
				}, 1)
				return true
			}

			if (message.indexOf('saveRedactGroup') !== -1) {
				this.redactGroup = JSON.parse(message).group
				this.saveRedactGroup()
				sendResponse(this.groups)
				this.save()
				return true
			}

			switch (message) {
				case 'fetchGroups':
					sendResponse(this.groups)
					return true
					break

				case 'createGroup':
					this.createGroup(newGroup => {
						sendResponse(newGroup)
					})
					return true
					break

				case 'closeSetting':
					this.closeSetting()
					return true
					break

				default:
					return false
					break
			}
		})

		// chrome.tabs.onCreated.addListener((data) => {
		// 	this.groups.forEach(group => {
		// 		if (group.active) {
		// 			group.tabs = []
		// 			chrome.tabs.query({ currentWindow: true }, tabs => {
		// 				for (let tab of tabs) {
		// 					group.tabs.push({
		// 						id: tab.id,
		// 						active: tab.active,
		// 						url: tab.url,
		// 						title: tab.title,
		// 						favIconUrl: tab.favIconUrl,
		// 						pinned: tab.pinned,
		// 					})
		// 				}
		// 			})
		// 		}
		// 	})

		// 	this.save()

		// 	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		// 		if (data.id === tabId && changeInfo.status === 'complete') {
		// 			this.groups.forEach(group => {
		// 				group.tabs.forEach(tab => {
		// 					if (tab.id === tabId) {
		// 						tab.favIconUrl = changeInfo.favIconUrl
		// 					}
		// 				})
		// 			})
		// 		}
		// 	})
		// })
	}

	createGroup(callback = undefined) {
		let newGroup = {
			id: makeId(8),
			name: `Group #${this.groups.length + 1}`,
			tabs: [],
			active: true
		}

		chrome.tabs.query({ currentWindow: true }, tabs => {
			for (let tab of tabs) {
				newGroup.tabs.push({
					id: tab.id,
					active: tab.active,
					url: tab.url,
					title: tab.title,
					favIconUrl: tab.favIconUrl,
					pinned: tab.pinned,
				})
			}

			this.groups.push(newGroup)

			if (typeof callback === 'function') {
				callback(newGroup)
			}

			chrome.storage.local.set({ 'TabsGrouper': TG })
		})
	}

	deleteGroup(deleteGroupId) {
		this.groups = this.groups.filter(group => group.id !== deleteGroupId)
		this.closeSetting()
		this.save()
	}

	openGroup(groupId) {
		chrome.tabs.query({ currentWindow: true }, tabs => {
			for (let tab of tabs) {
				if (!tab.pinned) {
					try {
						chrome.tabs.remove(tab.id)
					} catch (error) { }
				}
			}

			this.activeGroup
			this.groups.forEach(group => { group.active = false })
			this.groups.forEach(group => {
				if (group.id === groupId) {
					this.activeGroup = group
					group.active = true
					group.tabs.forEach(tab => {
						try {
							chrome.tabs.create({ url: tab.url })
						} catch (error) { }
					})
					return true
				}
			})

			this.save()
		})
	}

	openSettings(groupId) {
		this.redactGroup = this.groups.filter(group => group.id === groupId)[0]
		return this.redactGroup
	}

	saveRedactGroup() {
		this.groups = this.groups.map(group => group.id === this.redactGroup.id ? this.redactGroup : group)
		this.save()
	}

	closeSetting() {
		delete this.redactGroup
	}

	save() {
		chrome.storage.local.set({ 'TabsGrouper': TG })
	}
}

const makeId = (length) => {
	let result = '';
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

TG = new TabsGrouper()