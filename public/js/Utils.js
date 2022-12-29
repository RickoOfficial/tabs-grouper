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
}

const utils = new Utils()