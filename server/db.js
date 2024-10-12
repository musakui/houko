import { DatabaseSync } from 'node:sqlite'

import {
	GET_TABLES,
	TABLE_INFO,
	FOREIGN_KEYS,
	processColInfo,
	processFkInfo,
} from '@musakui/mon'

import { abort } from './utils.js'

/** @import { ConnectionOpts, Connection } from './types' */

/** @type {Map<string, Connection>} */
const connections = new Map()

export function getConnections() {
	return [...connections.values()]
}

/**
 * @param {ConnectionOpts} opts
 */
export function initConnection(opts) {
	const { name, init } = opts
	const path = opts.path ?? ':memory:'
	const db = new DatabaseSync(path)
	if (init) db.exec(init)

	connections.set(name, {
		db,
		name,
		path,
		schema: new Map(),
		exec: (q) => db.exec(q),
		runAll: (q, p) => db.prepare(q).all(...(p ?? [])),
	})
	return connections.get(name) ?? abort()
}

/** @param {string} name */
export function getConnection(name) {
	return connections.get(name)
}

/** @param {Connection} conn */
export function removeConnection(conn) {
	conn.db.close()
	connections.delete(conn.name)
}

export function closeConnections() {
	for (const { db } of connections.values()) {
		db.close()
	}
	connections.clear()
}

/** @param {Connection} conn */
export function updateSchema(conn) {
	/** @type {{ name: string }[]} */
	const tables = conn.runAll(GET_TABLES)

	for (const { name: tn } of tables) {
		const rawCol = conn.runAll(TABLE_INFO(tn))
		const cols = rawCol.map((col) => processColInfo(col))

		const rawFk = conn.runAll(FOREIGN_KEYS(tn))
		const fk = rawFk.map((fk) => processFkInfo(fk))

		conn.schema.set(tn, { name: tn, cols, fk })
	}

	return conn.schema
}

/**
 * @param {unknown[]} vals
 * @return {import('node:sqlite').SupportedValueType[]}
 */
export function processValues(vals) {
	return vals.map((v) => {
		if (
			v === null ||
			typeof v === 'string' ||
			typeof v === 'number' ||
			typeof v === 'bigint'
		)
			return v
		if (v instanceof Date) return v.toISOString()
		if (v instanceof Uint8Array) return v
		return JSON.stringify(v)
	})
}
