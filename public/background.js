class TabsGrouper {
	groups = []
	keysForContinue = ['keysForContinue', 'redactGroup']

	constructor() {
		this.getLocalStorage()
		this.initListeners()
	}

	initListeners() {
		chrome.runtime.onMessage.addListener((message, sender, callback) => {
			switch (message) {
				case 'getGroups':
					callback(this.groups)
					return true
				default:
					return false
					break
			}
		})
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
}

const TG = new TabsGrouper()