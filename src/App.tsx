import { Header } from './components/Header'
import { Group } from './components/Group'

import { groups } from './data/groups'

function App() {
	return (
		<>
			<Header />
			<main className="flex">
				<section className="groups w-full h-96 max-h-96 overflow-y-auto">
					{groups.map(group => <Group group={group} />)}
				</section>
				<section className="group-settings w-full h-96 max-h-96 overflow-y-auto">
					{groups.map(group => <Group group={group} />)}
				</section>
			</main>
		</>
	)
}

export default App