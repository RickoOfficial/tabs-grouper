class Group {
	constructor() {
		this.id = utils.generateId(12)
		this.name = `Group ${TG.groups.length + 1}`
		this.index = TG.groups.length
		this.tabs = []
	}
}