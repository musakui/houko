import type { DatabaseSync, SupportedValueType } from 'node:sqlite'
import type { TableSchema } from '@musakui/mon'

export type ConnectionOpts = {
	/** connection name */
	name: string

	/** path to db (default: `:memory:`) */
	path?: string

	/** statement(s) to run on init */
	init?: string
}

export type Connection = ConnectionOpts & {
	/** raw db */
	db: DatabaseSync

	schema: Map<string, TableSchema>

	exec: (query: string) => void

	runAll: <T>(query: string, params?: SupportedValueType[]) => T[]
}
