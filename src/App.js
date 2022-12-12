import { Header } from './components/Header'
import { Group } from './components/Group'
import { CircleButton } from './components/CircleButton'

import { groups } from './data/groups'
import { useState } from 'react'

const App = () => {

	const [redactGroup, setRedactGroup] = useState(null)

	const openSettings = (group) => {
		setRedactGroup({
			...group,
			isRedact: true,
		})
	}

	const closeSettings = () => {
		setRedactGroup(null)
	}

	return (
		<div className="app w-96 text-base">
			<Header />
			<main className="flex">

				<section
					className={
						'groups flex-grow flex-shrink-0 basis-full w-full h-96 max-h-96 overflow-y-auto ease-in-out duration-150'
						+ (redactGroup !== null ? ' -ml-96' : '')
					}
				>
					{groups.map(group =>
						<Group
							key={group.id}
							group={group}
							openSettings={() => { openSettings(group) }}
						/>
					)}
				</section>

				{redactGroup !== null
					? <section className="group-settings flex-grow flex-shrink-0 basis-full w-full h-96 max-h-96 overflow-y-auto ease-in-out duration-150">
						<div className="group-settings__header flex justify-between items-center gap-4 px-4 py-2">

							<CircleButton
								onClick={closeSettings}
								className="group-settings__back"
							>
								<svg className="bi bi-arrow-left w-full h-full text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
									<path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
								</svg>
							</CircleButton>

							<input className="group-settings__name flex-auto" type="text" value={redactGroup.name} />

							<div className="group-settings__name-redact-controll flex justify-between items-center gap-2">
								<CircleButton className="group-settings__edit-name">
									<svg class="bi bi-pencil w-full h-full text-green-600" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
										<path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
									</svg>
								</CircleButton>
								<CircleButton className="group-settings__delete">
									<svg class="bi bi-pencil w-full h-full text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
										<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
										<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
									</svg>
								</CircleButton>
							</div>

						</div>
					</section>

					: <section className="group-settings group-settings_empty flex-grow flex-shrink-0 basis-full w-full h-96 max-h-96 overflow-y-auto ease-in-out duration-150">
						<div className="group-settings__header text-center text-2xl mb-2">Группа не выбрана</div>
					</section>
				}

			</main>
		</div>
	)
}

export default App