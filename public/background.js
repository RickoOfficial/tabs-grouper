class TabsGrouper {
	groups = []
	activeGroupIndex = null
	keysForContinue = ['keysForContinue', 'redactGroup']
	openedNewTabs = []

	constructor() {
		this.getLocalStorage()
		this.initListeners()
	}

	initListeners() {
		/* Общение фронта и бэка */
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
		/* /Общение фронта и бэка */

		/* Открытие вкладки */
		chrome.tabs.onCreated.addListener(tab => {
			if (this.activeGroupIndex) {
				let newTab = {
					id: tab.id,
					active: tab.active,
					url: tab.url,
					title: tab.title,
					favIconUrl: tab.favIconUrl,
					pinned: tab.pinned,
					groupId: this.groups[this.activeGroupIndex].id
				}

				this.groups[this.activeGroupIndex].tabs.push(newTab)
			}
		})
		/* /Открытие вкладки */
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
				this.activeGroupIndex = this.openedGroup.index

				chrome.tabs.create({})
			} else {
				this.activeGroupIndex = this.openedGroup.index

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
			name: `Group #${this.groups.length + 1}`,
			index: this.groups.length,
			tabs: [],
		}

		if (this.groups.length === 0) {
			newGroup.active = true
			this.activeGroupIndex = 0

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

				this.groups.push(newGroup)
				setTimeout(() => {
					this.setLocalStorage()
				}, 1)
				callback(newGroup)
			})
		} else {
			this.groups.push(newGroup)
			setTimeout(() => {
				this.setLocalStorage()
			}, 1)
			callback(newGroup)
		}
	}

	saveRedactGroup(redactGroup) {
		this.groups = this.groups.map(group => group.id === redactGroup.id ? redactGroup : group)
		setTimeout(() => {
			this.setLocalStorage()
		}, 1)
	}

	deleteGroup(deleteGroupId) {
		this.groups = this.groups.filter(group => group.id !== deleteGroupId)
		setTimeout(() => {
			this.setLocalStorage()
		}, 1)
	}

	faviconToBase64(favIconUrl, callback) {
		fetch(favIconUrl)
			.then(response => response.blob())
			.then(blob => {
				let reader = new FileReader()
				reader.onloadend = () => {
					callback(reader.result)
				}
				reader.readAsDataURL(blob)
			})
			.catch(error => { callback(favIconUrl) })
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
				setTimeout(() => {
					this.setLocalStorage()
				}, 1)
			}
		})
	}

	setLocalStorage() {
		for (let i in this.groups) {
			for (let j in this.groups[i].tabs) {
				if (this.groups[i].tabs[j].favIconUrl && this.groups[i].tabs[j].favIconUrl.indexOf('data:') === -1) {
					try {
						this.faviconToBase64(this.groups[i].tabs[j].favIconUrl, base64 => {
							this.groups[i].tabs[j].favIconUrl = base64
						})
					} catch (error) { }
				}
			}
		}

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