importScripts("js/Utils.js")
importScripts("js/Group.js")

class TabsGrouper {
	groups = []
	activeGroupIndex = undefined

	constructor() {
		this.initListeners()
	}

	initListeners() {
		chrome.runtime.onMessage.addListener(this.onMessageListener)
	}

	async onMessageListener(message, sender, callback) {
		switch (message.action) {
			case 'getGroups':
				callback({
					status: 'complete',
					groups: TG.groups
				})
				return true
				break
			case 'createGroup':
				setTimeout(() => {
					callback({status: 'complete'})
				}, 3000)
				// let newGroup = await TG.createGroup()
				// callback({
				// 	status: 'complete',
				// 	group: newGroup
				// })
				return true
			default:
				callback({
					status: 'error',
					message: 'action not specified',
					request: message
				})
				return false
				break
		}
	}

	async createGroup() {
		let newGroup = await new Promise((resolve, reject) => {
			resolve(new Group())
		})
		return newGroup
	}

	/* Запись в localStorage */
	async setLocalStorage() {
		return await chrome.storage.local.set({ 'TabsGrouper': this })
	}
	/* /Запись в localStorage */
}

const TG = new TabsGrouper()