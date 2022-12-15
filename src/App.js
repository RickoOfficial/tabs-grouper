import { useEffect, useState } from 'react'

import { Header } from './components/Header'
import { Group } from './components/Group'
import Tab from './components/Tab'
import { Modal } from './components/Modal'

import { CircleButton } from './components/CircleButton'
import { Button } from './components/Button'

const App = () => {
	const [groups, setGroups] = useState([])
	const [redactGroup, setRedactGroup] = useState(null)
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const getGroups = () => {
		chrome.runtime.sendMessage({ function: 'getGroups' }, (response) => {
			setGroups(response)
			if (response.length === 0) {
				setTimeout(() => {
					getGroups()
				}, 300)
			}
		})
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
	}

	const closeGroupSettings = () => {
		setRedactGroup(null)
	}

	const saveRedactGroup = () => {
		setGroups(groups.map(group => group.id === redactGroup.id ? redactGroup : group))
		chrome.runtime.sendMessage({ function: 'saveRedactGroup', redactGroup: redactGroup })
	}

	const deleteGroup = () => {
		setShowDeleteModal(false)
		setGroups(groups.filter(group => group.id !== redactGroup.id))
		closeGroupSettings()
		chrome.runtime.sendMessage({ function: 'deleteGroup', deleteGroupId: redactGroup.id })
	}

	return (
		<div className="flex w-80 max-h-128 h-128 text-base">
			<div
				className={
					'flex flex-col min-w-full ease-in-out duration-150 '
					+ (redactGroup !== null ? '-ml-80' : '')
				}
			>

				{/* Поиск группы */}
				<div className="px-4 py-2 border-b border-b-sky-500">search</div>
				{/* Поиск группы */}

				{/* Список групп */}
				<div className="flex-auto border-b border-b-sky-500 overflow-y-auto" >
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
					className="px-4 py-2 cursor-pointer hover:bg-sky-100 ease-in-out duration-150"
				>Create group</div>
				{/* Создать группу */}

			</div>

			{/* Настройки */}
			{redactGroup !== null &&
				<div className="flex flex-col min-w-full">
					<div
						onClick={closeGroupSettings}
						className="px-4 py-2 border-b border-b-sky-500 cursor-pointer hover:bg-sky-100 ease-in-out duration-150"
					>Close settings</div>

					<div className="flex-auto border-b border-b-sky-500 overflow-y-auto">tabs</div>

					<div className="px-4 py-2 cursor-pointer hover:bg-sky-100 ease-in-out duration-150">Open this group</div>
				</div>
			}
			{/* Настройки */}
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