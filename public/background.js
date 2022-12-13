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
			if (message.indexOf('openSettings-') !== -1) {
				sendResponse(this.openSettings(message.split('-')[1]))
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

	openSettings(groupId) {
		this.redactGroup = this.groups.filter(group => group.id === groupId)[0]
		return this.redactGroup
	}

	saveRedactGroup() {
		for (let i in this.groups) {
			if (this.groups[i].id === this.redactGroup.id) {
				for (let key in this.redactGroup) {
					this.groups[i][key] = this.redactGroup[key]
				}
			}
		}
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