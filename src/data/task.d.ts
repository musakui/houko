export type Task = {
	id: string
	title: string
	cover?: string
	status: 'in progress' | 'backlog' | 'todo' | 'canceled' | 'done'
	priority: number
	added: string
	updated: Date
}
