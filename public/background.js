importScripts("js/Utils.js")
importScripts("js/Group.js")

class TabsGrouper {
	groups = []
	activeGroupIndex = undefined
	groupIsOpenNow = undefined

	constructor() {
		utils.getLocalStorage()
			.then(() => {
				this.initListeners()
			})
	}

	initListeners() {
		this.onConnectListener()

		chrome.tabs.onCreated.addListener(this.onCreatedListener)
		chrome.tabs.onUpdated.addListener(this.onUpdatedListener)
	}

	onConnectListener() {
		chrome.runtime.onConnect.addListener(port => {
			port.onMessage.addListener(message => {
				this.onMessageListener(message, port)
			})
		})
	}

	onCreatedListener(tab) {
		if (TG.groupIsOpenNow) return

		if (TG.activeGroupIndex !== undefined) {
			TG.groups[TG.activeGroupIndex].addTab(tab)
		}
	}

	onUpdatedListener(tabId, changeInfo, tabData) {
		if (TG.groupIsOpenNow) return

		if (changeInfo.status === 'complete') {
			console.log(tabData)
			
			for (let i in TG.groups) {
				for (let j in TG.groups[i].tabs) {
					if (TG.groups[i].tabs[j].id === tabId) {
						TG.groups[i].tabs[j].title = tabData.title
						TG.groups[i].tabs[j].favIconUrl = tabData.favIconUrl
						TG.groups[i].tabs[j].url = tabData.url
						TG.groups[i].tabs[j].index = tabData.index
						TG.groups[i].tabs[j].active = tabData.active

						setTimeout(() => {
							utils.setLocalStorage()
						}, 1)

						return true
					}
				}
			}
		}
	}

	async onMessageListener(message, port) {
		switch (message.action) {
			case 'getGroups':
				port.postMessage({ action: message.action, data: this.groups })
				break;
			case 'openGroup':
				this.openGroup(message.groupId)
				break;
			case 'createGroup':
				let newGroup = await this.createGroup()
				port.postMessage({ action: message.action, data: newGroup })
				break;
			case 'updateGroup':
				this.updateGroup(message.redactGroup)
				break;
			case 'deleteGroup':
				this.deleteGroup(message.deleteGroupId)
				break;
			default: break;
		}
	}

	async openGroup(groupId) {
		this.groupIsOpenNow = true

		let tabs = await chrome.tabs.query({ currentWindow: true })

		for (let i in this.groups) {
			if (this.groups[i].id === groupId) {
				this.groups[this.activeGroupIndex].active = false

				this.activeGroupIndex = Number(i)
				this.groups[i].active = true
				break
			}
		}

		if (tabs.length > this.groups[this.activeGroupIndex].tabs.length) {
			for (let i in tabs) {
				if (!this.groups[this.activeGroupIndex].tabs[i]) {
					await chrome.tabs.remove(tabs[i].id)
				} else {
					let tab = await chrome.tabs.create({
						url: this.groups[this.activeGroupIndex].tabs[i].url,
						index: this.groups[this.activeGroupIndex].tabs[i].index,
						active: this.groups[this.activeGroupIndex].tabs[i].active,
					})

					this.groups[this.activeGroupIndex].tabs[i].id = tab.id

					await chrome.tabs.remove(tabs[i].id)
				}
			}
		} else {
			for (let i in this.groups[this.activeGroupIndex].tabs) {
				if (!tabs[i]) {
					let tabData = await chrome.tabs.create({
						url: this.groups[this.activeGroupIndex].tabs[i].url,
						index: this.groups[this.activeGroupIndex].tabs[i].index,
						active: this.groups[this.activeGroupIndex].tabs[i].active,
					})

					this.groups[this.activeGroupIndex].tabs[i].id = tabData.id
				} else {
					let tab = await chrome.tabs.create({
						url: this.groups[this.activeGroupIndex].tabs[i].url,
						index: this.groups[this.activeGroupIndex].tabs[i].index,
						active: this.groups[this.activeGroupIndex].tabs[i].active,
					})

					this.groups[this.activeGroupIndex].tabs[i].id = tab.id

					await chrome.tabs.remove(tabs[i].id)
				}
			}
		}

		this.groupIsOpenNow = false

		setTimeout(() => {
			utils.setLocalStorage()
		}, 1)
	}

	async createGroup() {
		let newGroup = new Group()

		if (this.groups.length === 0) {
			newGroup.active = true
			this.activeGroupIndex = 0

			let tabs = await chrome.tabs.query({ currentWindow: true })
			for (let tab of await tabs) {
				newGroup.addTab(tab)
			}

			this.groups.push(newGroup)

			setTimeout(() => {
				utils.setLocalStorage()
			}, 1)

			return newGroup
		} else {
			newGroup.active = false
			newGroup.addTab({
				id: '',
				url: 'chrome://newtab',
				title: 'New Tab',
				active: true,
				index: 0,
				favIconUrl: ''
			})

			this.groups.push(newGroup)

			setTimeout(() => {
				utils.setLocalStorage()
			}, 1)

			return newGroup
		}
	}

	updateGroup(redactGroup) {
		for (let i in this.groups) {
			if (this.groups[i].id === redactGroup.id) {
				this.groups[i].update(redactGroup)

				setTimeout(() => {
					utils.setLocalStorage()
				}, 1)
			}
		}
	}

	deleteGroup(deleteGroupId) {
		for (let i in this.groups) {
			if (this.groups[i].id === deleteGroupId) {
				this.groups.splice(i, 1)
				if (this.groups.length === 0) {
					this.activeGroupIndex = undefined
				}

				setTimeout(() => {
					utils.setLocalStorage()
				}, 1)
			}
		}
	}
}

const TG = new TabsGrouper()