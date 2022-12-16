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

	const getGroups = () => {
		chrome.runtime.sendMessage({ function: 'getGroups' }, (response) => {
			setGroups(response)
			if (response.length === 0) {
				setTimeout(() => {
					getGroups()
				}, 300)
			}
		})

		pingBackground()
	}

	const pingBackground = () => {
		setInterval(() => {
			chrome.runtime.sendMessage({ function: 'pingBackground' })
		}, 1000)
	}

	useEffect(() => {
		getGroups()
	}, [])

	const openGroup = (group) => {
		chrome.runtime.sendMessage({ function: 'openGroup', openGroupId: group.id })
	}

	const createGroup = () => {
		chrome.runtime.sendMessage({ function: 'createGroup' }, (response) => {
			if (groups.length > 0) {
				setGroups([...groups, response])
			} else {
				setGroups([response])
			}
		})
	}

	const openGroupSettings = (group) => {
		setRedactGroup(group)
		setNewName(group.name)
	}

	const closeGroupSettings = () => {
		setRedactGroup(null)
		setNewName(null)
	}

	const saveRedactGroup = () => {
		redactGroup.name = newName
		chrome.runtime.sendMessage({ function: 'saveRedactGroup', redactGroup: redactGroup })
		setGroups(groups.map(group => group.id === redactGroup.id ? redactGroup : group))
	}

	const deleteGroup = () => {
		setShowDeleteModal(false)
		setGroups(groups.filter(group => group.id !== redactGroup.id))
		closeGroupSettings()
		chrome.runtime.sendMessage({ function: 'deleteGroup', deleteGroupId: redactGroup.id })
	}

	return (
		<div className="flex w-80 max-h-128 h-128 text-slate-700 text-sm font-medium">
			<div className="flex flex-col min-w-full bg-slate-50">

				{/* Поиск группы */}
				<div className="px-4 py-2 border-b border-b-slate-300">search</div>
				{/* Поиск группы */}

				{/* Список групп */}
				<div className="flex-auto border-b border-b-slate-300 overflow-y-auto" >
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
						<div className="text-center">No Groups</div>
					}
				</div>
				{/* Список групп */}

				{/* Создать группу */}
				<div
					onClick={createGroup}
					className="px-4 py-2 cursor-pointer select-none hover:bg-slate-100 ease-in-out duration-150"
				>Create group</div>
				{/* Создать группу */}

			</div>

			{/* Настройки */}
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
						onClick={() => setShowRenameModal(true)}
						className="bg-sky-500 text-white"
					>Rename</Button>
					<Button
						onClick={() => setShowDeleteModal(true)}
						className="bg-pink-500 text-white"
					>Delete</Button>
				</div>
			</div>
			{/* Настройки */}

			{/* Модалки */}
			{/* Удаление группы */}
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
			{/* Удаление группы */}

			{/* Переименование группы */}
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
							saveRedactGroup()
							setShowRenameModal(false)
						}}
						className="bg-green-500 text-white"
					>Save</Button>
				</div>
			</Modal>
			{/* Переименование группы */}
			{/* Модалки */}
		</div>
	)

	/*
	return (
		<div className="app relative flex flex-col w-80 h-96 text-base border-b-black">
			<Header createGroup={createGroup} />

			<main className="flex flex-auto w-full h-full">

				{groups.length
					? <section
						className={
							'groups flex-grow flex-shrink-0 basis-full w-full h-full overflow-x-hidden overflow-y-auto ease-in-out duration-150'
							+ (redactGroup !== null ? ' -ml-80' : '')
						}
					>
						{groups.map(group =>
							<Group
								key={group.id}
								group={group}
								openGroup={() => { openGroup(group) }}
								openGroupSettings={() => { openGroupSettings(group) }}
							/>
						)}
					</section>

					: <section
						className="groups flex-grow flex-shrink-0 basis-full w-full h-full overflow-x-hidden overflow-y-auto ease-in-out duration-150"
					>
						<div className="groups-undefined text-center text-2xl mx-4">No groups</div>
					</section>
				}


				{redactGroup !== null
					? <section className="group-settings flex-grow flex-shrink-0 basis-full w-full h-full overflow-x-hidden overflow-y-auto ease-in-out duration-150">
						<div className="group-settings__header flex justify-between items-center px-4 py-2">

							<CircleButton
								onClick={closeGroupSettings}
								className="group-settings__back relative group"
							>
								<svg className="bi bi-arrow-left w-full h-full text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
									<path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
								</svg>
								<span className="absolute -bottom-3 text-gray-600 text-xs opacity-0 ease-in-out duration-150 group-hover:opacity-100">Back</span>
							</CircleButton>

							<input
								onInput={e => { setRedactGroup({ ...redactGroup, name: e.target.value }) }}
								value={redactGroup.name}
								className="group-settings__name block px-2 py-1 bg-transparent outline-none border-b-gray-300 ease-in-out duration-150 focus:border-b-gray-300"
								type="text"
							/>

							<div className="group-settings__name-redact-controll flex justify-between items-center gap-2">
								<CircleButton
									onClick={saveRedactGroup}
									className="group-settings__edit-name relative group"
								>
									<svg className="bi bi-pencil w-full h-full text-green-600" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
										<path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
									</svg>
									<span className="absolute -bottom-3 text-green-600 text-xs opacity-0 ease-in-out duration-150 group-hover:opacity-100">Save</span>
								</CircleButton>
								<CircleButton
									onClick={() => setShowDeleteModal(true)}
									className="group-settings__delete relative group"
								>
									<svg className="bi bi-pencil w-full h-full text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
										<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
										<path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
									</svg>
									<span className="absolute -bottom-3 text-pink-600 text-xs opacity-0 ease-in-out duration-150 group-hover:opacity-100">Delete</span>
								</CircleButton>
							</div>

						</div>

						<div className="group-settings__body">
							{redactGroup.tabs.length > 0
								? redactGroup.tabs.map(tab => <Tab tab={tab} />)
								: <div className="no-tabs text-center text-2xl mx-4">No tabs</div>
							}
						</div>
					</section>

					: <section className="group-settings group-settings_empty flex-grow flex-shrink-0 basis-full w-full h-full overflow-x-hidden overflow-y-auto ease-in-out duration-150">
						<div className="group-settings__header text-center text-2xl mx-4">Group not selected</div>
					</section>
				}

			</main>

			<Modal show={showDeleteModal} setShow={setShowDeleteModal} title="Are you sure?">
				<div className="mb-3">
					Are you sure you want to delete the group <span className="font-semibold">{redactGroup ? redactGroup.name : ''}</span> ?
				</div>
				<div className="flex justify-between items-center">
					<Button
						onClick={() => setShowDeleteModal(false)}
						className="bg-green-600 text-white"
					>Cancel</Button>
					<Button
						onClick={deleteGroup}
						className="bg-pink-600 text-white"
					>Delete</Button>
				</div>
			</Modal>
		</div>
	)
	*/
}

export default App