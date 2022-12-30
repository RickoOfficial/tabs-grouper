importScripts("js/Utils.js")
importScripts("js/Group.js")

class TabsGrouper {
	groups = []
	activeGroupIndex = undefined

	constructor() {
		utils.getLocalStorage()
			.then(() => {
				this.initListeners()
			})
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
			case 'updateGroup':
				this.updateGroup(message.redactGroup)
				break;
			case 'deleteGroup':
				this.deleteGroup(message.deleteGroupId)
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