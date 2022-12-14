import { useEffect, useState } from 'react'

import { Group } from './components/Group'
import Tab from './components/Tab'
import { Modal } from './components/Modal'

import { Button } from './components/Button'

const App = () => {
	const [groups, setGroups] = useState([])
	const [redactGroup, setRedactGroup] = useState(null)
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const [newName, setNewName] = useState(null)
	const [showRenameModal, setShowRenameModal] = useState(false)

	const [groupIsCreating, setGroupIsCreating] = useState(false)

	const [port, setPort] = useState(chrome.runtime.connect({ name: 'TabsGrouper' }))

	port.onMessage.addListener(message => {
		switch (message.action) {
			case 'getGroups':
				setGroups(message.data)
				break;
			case 'createGroup':
				setGroupIsCreating(false)

				if (groups.length > 0) {
					setGroups([...groups, message.data])
				} else {
					setGroups([message.data])
				}
				break;
			default: break;
		}
	})

	const getGroups = () => {
		port.postMessage({ action: 'getGroups' })
	}

	useEffect(() => {
		getGroups()
	}, [])

	const openGroup = (group) => {
		if (group.active) return

		port.postMessage({ action: 'openGroup', groupId: group.id })

		let window = chrome.extension.getViews({ type: "popup" })
		window[0].close()
	}

	const createGroup = () => {
		if (groupIsCreating) return
		port.postMessage({ action: 'createGroup' })
		setGroupIsCreating(true)
	}

	const openGroupSettings = (group) => {
		setRedactGroup(group)
		setNewName(group.name)
	}

	const closeGroupSettings = () => {
		setRedactGroup(null)
		setNewName(null)
	}

	const updateGroup = () => {
		redactGroup.name = newName
		setGroups(groups.map(group => group.id === redactGroup.id ? redactGroup : group))

		port.postMessage({ action: 'updateGroup', redactGroup: redactGroup })
	}

	const deleteGroup = () => {
		setShowDeleteModal(false)
		setGroups(groups.filter(group => group.id !== redactGroup.id))
		closeGroupSettings()

		port.postMessage({ action: 'deleteGroup', deleteGroupId: redactGroup.id })
	}

	return (
		<div className={
			'flex w-80 max-h-128 h-128 text-slate-700 text-sm font-medium '
			+ (groupIsCreating ? 'cursor-wait select-none' : '')
		}>
			<div className="flex flex-col min-w-full bg-slate-50">

				{/* ?????????? ???????????? */}
				<div className="px-4 py-2 border-b border-b-slate-300">search</div>
				{/* ?????????? ???????????? */}

				{/* ???????????? ?????????? */}
				<div className="flex-auto border-b border-b-slate-300 overflow-y-auto">
					{groups.length
						?
						groups.map(group =>
							<Group
								key={group.id}
								group={group}
								openGroup={() => { openGroup(group) }}
								openGroupSettings={() => { openGroupSettings(group) }}
							/>
						)

						:
						!groupIsCreating
							?
							<div className="text-center py-1">No Groups</div>

							:
							<></>
					}
					{groupIsCreating
						?
						<div className="relative flex justify-center items-center gap-2 pl-2 py-1 overflow-hidden">
							<div className="w-4 h-4 border-2 border-t-sky-500 border-sky-200 rounded-full animate-spin select-none"></div>
							<div>Group is creating</div>
						</div>

						:
						<></>
					}
				</div>
				{/* ???????????? ?????????? */}

				{/* ?????????????? ???????????? */}
				<div
					onClick={createGroup}
					className={
						'px-4 py-2 cursor-pointer select-none hover:bg-slate-100 ease-in-out duration-150 '
						+ (groupIsCreating ? 'cursor-not-allowed' : '')
					}
					disabled={groupIsCreating}
				>Create group</div>
				{/* ?????????????? ???????????? */}

			</div>

			{/* ?????????????????? */}
			<div
				className={
					'flex flex-col relative min-w-full bg-slate-50 ease-in-out duration-300 '
					+ (redactGroup ? '-ml-80 opacity-100' : 'opacity-0')
				}
			>
				<div className="flex items-center justify-between px-4 py-2 border-b border-b-slate-300">
					<Button
						onClick={closeGroupSettings}
						className="flex items-center px-2 bg-sky-500 text-white"
					>
						<svg className="w-3 h-3 mr-2" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M16 8C16 8.26517 15.8947 8.51948 15.7071 8.70698C15.5196 8.89448 15.2653 8.99982 15.0001 8.99982H3.41541L7.70893 13.291C7.80189 13.384 7.87564 13.4944 7.92595 13.6158C7.97626 13.7373 8.00216 13.8675 8.00216 13.9989C8.00216 14.1304 7.97626 14.2606 7.92595 14.382C7.87564 14.5035 7.80189 14.6138 7.70893 14.7068C7.61596 14.7997 7.5056 14.8735 7.38413 14.9238C7.26266 14.9741 7.13248 15 7.00101 15C6.86953 15 6.73935 14.9741 6.61788 14.9238C6.49642 14.8735 6.38605 14.7997 6.29308 14.7068L0.293755 8.70787C0.200639 8.615 0.126761 8.50467 0.0763536 8.3832C0.0259463 8.26173 0 8.13151 0 8C0 7.86849 0.0259463 7.73827 0.0763536 7.6168C0.126761 7.49533 0.200639 7.385 0.293755 7.29213L6.29308 1.29321C6.48084 1.10547 6.73548 1 7.00101 1C7.26653 1 7.52117 1.10547 7.70893 1.29321C7.89668 1.48095 8.00216 1.73558 8.00216 2.00108C8.00216 2.26659 7.89668 2.52122 7.70893 2.70896L3.41541 7.00018H15.0001C15.2653 7.00018 15.5196 7.10552 15.7071 7.29302C15.8947 7.48052 16 7.73483 16 8Z" fill="currentColor" />
						</svg>
						<span>Back</span>
					</Button>
					<div className="text-lg font-medium">{redactGroup ? redactGroup.name : 'Group not selected'}</div>
				</div>

				<div className="flex-auto border-b border-b-slate-300 overflow-y-auto">
					{redactGroup && redactGroup.tabs.length
						? redactGroup.tabs.map(tab =>
							<Tab tab={tab} />
						)
						: <div className="text-center">No Tabs</div>
					}
				</div>

				<div
					className="flex justify-between items-center px-4 py-2"
				>
					<Button
						onClick={() => setShowDeleteModal(true)}
						className="bg-pink-500 text-white"
					>Delete</Button>
					<Button
						onClick={() => setShowRenameModal(true)}
						className="bg-sky-500 text-white"
					>Rename</Button>
				</div>
			</div>
			{/* ?????????????????? */}

			{/* ?????????????? */}
			{/* ???????????????? ???????????? */}
			<Modal show={showDeleteModal} setShow={setShowDeleteModal} title="Are you sure?">
				<div className="mb-3">
					Are you sure you want to delete the group <span className="font-semibold">{redactGroup ? redactGroup.name : ''}</span> ?
				</div>
				<div className="flex justify-between items-center">
					<Button
						onClick={() => setShowDeleteModal(false)}
						className="bg-green-500 text-white"
					>Cancel</Button>
					<Button
						onClick={deleteGroup}
						className="bg-pink-500 text-white"
					>Delete</Button>
				</div>
			</Modal>
			{/* ???????????????? ???????????? */}

			{/* ???????????????????????????? ???????????? */}
			<Modal show={showRenameModal} setShow={setShowRenameModal} title="Rename this group">
				<div className="mb-2">
					<input
						onInput={e => { setNewName(e.target.value) }}
						value={redactGroup ? newName : ''}
						className="block px-2 py-1 mx-auto w-11/12 border border-slate-300 rounded-md shadow-sm outline-none font-normal"
						type="text"
					/>
				</div>
				<div className="flex justify-between items-center">
					<Button
						onClick={() => setShowRenameModal(false)}
						className="bg-pink-500 text-white"
					>Cancel</Button>
					<Button
						onClick={() => {
							updateGroup()
							setShowRenameModal(false)
						}}
						className="bg-green-500 text-white"
					>Save</Button>
				</div>
			</Modal>
			{/* ???????????????????????????? ???????????? */}
			{/* ?????????????? */}
		</div>
	)
}

export default App