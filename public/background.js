class TabsGrouper {
	groups = []
	keysForContinue = ['keysForContinue', 'redactGroup']

	constructor() {
		this.getLocalStorage()
		this.initListeners()
	}

	initListeners() {
		chrome.runtime.onMessage.addListener((message, sender, callback) => {
			switch (message.function) {
				case 'getGroups':
					callback(this.groups)
					return true
				case 'openGroup':
					this.openGroup(message.openGroupId)
					return true
					break
				case 'createGroup':
					this.createGroup(callback)
					return true
					break
				case 'saveRedactGroup':
					this.saveRedactGroup(message.redactGroup)
					return true
					break
				case 'deleteGroup':
					this.deleteGroup(message.deleteGroupId)
					return true
					break
				default:
					return false
					break
			}
		})
	}

	openGroup(openGroupId) {
		chrome.tabs.query({ currentWindow: true }, tabs => {
			for (let tab of tabs) {
				if (!tab.pinned) {
					chrome.tabs.remove(tab.id)
				}
			}

			this.openedGroup = this.groups.filter(group => group.id === openGroupId)[0]
			if (this.openedGroup.tabs.length === 0) {
				chrome.tabs.create({})
			} else {
				this.openedGroup.tabs.forEach(tab => {
					if (!tab.pinned) {
						chrome.tabs.create({ url: tab.url })
					}
				})
			}
		})
	}

	createGroup(callback) {
		let newGroup = {
			id: this.generateId(12),
			name: `Группа #${this.groups.length + 1}`,
			index: this.groups.length,
			tabs: [],
			active: false,
		}

		if (this.groups.length === 0) {
			chrome.tabs.query({ currentWindow: true }, tabs => {
				for (let tab of tabs) {
					newGroup.tabs.push({
						id: tab.id,
						url: tab.url,
						title: tab.title,
						favIconUrl: tab.favIconUrl,
						pinned: tab.pinned,
					})
				}

				callback(newGroup)

				this.groups.push(newGroup)
				this.setLocalStorage()
			})
		} else {
			callback(newGroup)

			this.groups.push(newGroup)
			this.setLocalStorage()
		}
	}

	saveRedactGroup(redactGroup) {
		this.groups = this.groups.map(group => group.id === redactGroup.id ? redactGroup : group)
		this.setLocalStorage()
	}

	deleteGroup(deleteGroupId) {
		this.groups = this.groups.filter(group => group.id !== deleteGroupId)
		this.setLocalStorage()
	}

	getLocalStorage() {
		chrome.storage.local.get(['TabsGrouper']).then(storage => {
			if (storage !== undefined && storage.TabsGrouper !== undefined) {
				for (let key in storage.TabsGrouper) {
					if (this.keysForContinue.indexOf(key) === -1) {
						this[key] = storage.TabsGrouper[key]
					}
				}
			} else {
				this.setLocalStorage()
			}
		})
	}

	setLocalStorage() {
		setTimeout(() => {
			chrome.storage.local.set({ 'TabsGrouper': this })
		}, 1)
	}

	generateId(length) {
		let result = '';
		let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
}

const TG = new TabsGrouper()