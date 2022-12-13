import { useState } from 'react'

import { Header } from './components/Header'
import { Group } from './components/Group'
import { Modal } from './components/Modal'

import { CircleButton } from './components/CircleButton'
import { Button } from './components/Button'

// import { groups } from './data/groups'

const App = () => {
	const [groups, setGroups] = useState([])
	const [redactGroup, setRedactGroup] = useState(null)
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	chrome.runtime.sendMessage('fetchGroups', (response) => {
		setGroups(response)
	})

	const createGroup = () => {
		chrome.runtime.sendMessage('createGroup', (response) => {
			setGroups([...groups, response])
		})
	}

	const deleteGroup = () => {
		chrome.runtime.sendMessage(`deleteGroup-${redactGroup.id}`)

		setGroups(groups.filter(group => group.id !== redactGroup.id))
		setRedactGroup(null)
		setShowDeleteModal(false)
	}

	const saveRedactGroup = () => {
		setGroups(groups.map(group => group.id === redactGroup.id ? redactGroup : group))

		chrome.runtime.sendMessage(JSON.stringify({ function: 'saveRedactGroup', group: { ...redactGroup } }))

		setRedactGroup(null)
	}

	const openGroup = (groupId) => {
		chrome.runtime.sendMessage(`openGroup-${groupId}`)
		setGroups(groups.map(group => group.id === groupId ? { ...group, active: true } : { ...group, active: false }))
	}

	const openSettings = (group) => {
		chrome.runtime.sendMessage(`openSettings-${group.id}`, (response) => {
			setRedactGroup(response)
		})
	}

	const closeSettings = () => {
		chrome.runtime.sendMessage('closeSetting')

		setRedactGroup(null)
	}

	// const fetchTabs = () => {
	// 	chrome.runtime.sendMessage('Hello, background', (response) => {
	// 		return JSON.parse(response)
	// 	})
	// }

	return (
		<div className="app relative w-96 text-base overflow-hidden">
			<Header createGroup={createGroup} />

			<main className="flex">

				{groups.length
					? <section
						className={
							'groups flex-grow flex-shrink-0 basis-full w-full h-96 max-h-96 overflow-y-auto ease-in-out duration-150'
							+ (redactGroup !== null ? ' -ml-96' : '')
						}
					>
						{groups.map(group =>
							<Group
								key={group.id}
								group={group}
								openGroup={openGroup}
								openSettings={() => { openSettings(group) }}
							/>
						)}
					</section>

					: <section
						className="groups flex-grow flex-shrink-0 basis-full w-full h-96 max-h-96 overflow-y-auto ease-in-out duration-150"
					>
						<div className="groups-undefined text-center text-2xl">Нет созданных групп</div>
					</section>
				}


				{redactGroup !== null
					? <section className="group-settings flex-grow flex-shrink-0 basis-full w-full h-96 max-h-96 overflow-y-auto ease-in-out duration-150">
						<div className="group-settings__header flex justify-between items-center px-4 py-2">

							<CircleButton
								onClick={closeSettings}
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
								className="group-settings__name block px-2 py-1 outline-none border border-x-0 border-t-0 border-gray-300 ease-in-out duration-150 focus:border-gray-600"
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

						<div className="group-settings__body">123</div>
					</section>

					: <section className="group-settings group-settings_empty flex-grow flex-shrink-0 basis-full w-full h-96 max-h-96 overflow-y-auto ease-in-out duration-150">
						<div className="group-settings__header text-center text-2xl mb-2">Группа не выбрана</div>
					</section>
				}

			</main>

			{/* <Header />
			<main className="flex">
				<section className={'groups flex-grow flex-shrink-0 basis-full w-full h-96 max-h-96 overflow-y-auto ease-in-out duration-150'} >
					<button onClick={() => setShowDeleteModal(true)} className='px-4 py-2 font-semibold text-sm bg-sky-500 text-white rounded-md shadow-sm opacity-100'>Button A</button>
				</section>
			</main> */}

			<Modal show={showDeleteModal} setShow={setShowDeleteModal} title="Are you sure?">
				<div className="mb-2">Are you sure you want to delete the group «{redactGroup ? redactGroup.name : ''}»</div>
				<div className="flex justify-between items-center">
					<Button
						onClick={() => setShowDeleteModal(false)}
						className="bg-green-600 text-white"
					>Отмена</Button>
					<Button
						onClick={deleteGroup}
						className="bg-pink-600 text-white"
					>Удалить</Button>
				</div>
			</Modal>
		</div>
	)
}

export default App