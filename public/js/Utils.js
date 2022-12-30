class Utils {
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

	/* Генерация рандомного id */
	generateId(length = 12) {
		let result = '';
		let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
	/* /Генерация рандомного id */

	/* Получение из localStorage */
	async getLocalStorage() {
		let storage = await chrome.storage.local.get(['TabsGrouper'])
		if (storage !== undefined && storage.TabsGrouper !== undefined) {
			TG.activeGroupIndex = storage.TabsGrouper.activeGroupIndex
			for (let storageGroup of storage.TabsGrouper.groups) {
				TG.groups.push(new Group(storageGroup))
			}
		} else {
			await this.setLocalStorage()
		}
	}
	/* /Получение из localStorage */

	/* Запись в localStorage */
	async setLocalStorage() {
		for (let group of TG.groups) {
			for (let tab of group.tabs) {
				tab.favIconUrl = await utils.faviconToBase64(tab.favIconUrl)
				console.log(tab)
			}
		}

		return await chrome.storage.local.set({ 'TabsGrouper': TG })
	}
	/* /Запись в localStorage */
}

const utils = new Utils()