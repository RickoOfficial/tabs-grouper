importScripts("js/Utils.js")
importScripts("js/Group.js")

class TabsGrouper {
	groups = []
	activeGroupIndex = undefined

	constructor() {
		// this.getLocalStorage()
		// 	.then(() => {
		// 		this.initListeners()
		// 	})
		this.initListeners()
	}

	initListeners() {
		this.onConnectListener()
	}

	onConnectListener() {
		chrome.runtime.onConnect.addListener(port => {
			port.onMessage.addListener(message => {
				this.onMessageListener(message, port)
			})
		})
	}

	async onMessageListener(message, port) {
		switch (message.action) {
			case 'getGroups':
				port.postMessage({ action: message.action, data: this.groups })
				break;
			case 'createGroup':
				let newGroup = await this.createGroup()
				port.postMessage({ action: message.action, data: newGroup })
				break;
			default: break;
		}
	}

	async createGroup() {
		let newGroup = new Group()

		if (this.groups.length === 0) {
			newGroup.active = true
			this.activeGroupIndex = 0

			let tabs = await chrome.tabs.query({ currentWindow: true })
			for (let tab of tabs) {
				await newGroup.addTab(tab)
			}
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
		}

		this.groups.push(newGroup)
		return newGroup
	}

	/* Получение из localStorage */
	async getLocalStorage() {
		let storage = await chrome.storage.local.get(['TabsGrouper'])
		if (storage !== undefined && storage.TabsGrouper !== undefined) {
			this.activeGroupIndex = storage.TabsGrouper.activeGroupIndex
			for (let storageGroup of storage.TabsGrouper.groups) {
				this.groups.push(new Group(storageGroup))
			}
		} else {
			await this.setLocalStorage()
		}
	}
	/* /Получение из localStorage */

	/* Запись в localStorage */
	async setLocalStorage() {
		return await chrome.storage.local.set({ 'TabsGrouper': TG })
	}
	/* /Запись в localStorage */
}

const TG = new TabsGrouper()