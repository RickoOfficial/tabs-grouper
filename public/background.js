// importScripts("js/Consts.js")
// importScripts("js/Group.js")

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
		if (message.action == 'getGroups') {
			setTimeout(() => {
				console.log(message.action == 'getGroups')
				port.postMessage({ action: 'setGroups', groups: 'массив групп' })
			}, 3000)
		}
		console.log(`bg\n`, message)
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

	/* Конвертация фавиконки сайта в base64 */
	async faviconToBase64(favIconUrl) {
		try {
			let response = await fetch(favIconUrl)
			let blob = await response.blob()
			let reader = new FileReader()
			let base64 = await new Promise((resolve, reject) => {
				reader.onloadend = () => {
					resolve(reader.result)
				}
				reader.readAsDataURL(blob)
			})
			return await base64
		} catch (error) {
			return favIconUrl
		}
	}
	/* /Конвертация фавиконки сайта в base64 */

	/* Генерация рандомного id для групп */
	generateId(length = 12) {
		let result = '';
		let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
	/* /Генерация рандомного id для групп */
}

const TG = new TabsGrouper()