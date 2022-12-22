importScripts("js/Consts.js")
importScripts("js/Group.js")

class TabsGrouper {
	groups = []
	activeGroupIndex = undefined

	/* Запись в localStorage */
	async setLocalStorage() {
		return await chrome.storage.local.set({ 'TabsGrouper': this })
	}
	/* /Запись в localStorage */
}