import {
	getJSON,
	BadRequestError,
	NotFoundError,
	NotAllowedError,
} from '@musakui/saaba'

import {
	generateSelect,
	generateInsert,
	generateUpdate,
	generateDelete,
	getInsertValues,
	parseSelectOptions,
} from '@musakui/mon'

import {
	getConnections,
	getConnection,
	initConnection,
	updateSchema,
	removeConnection,
	processValues,
} from './db.js'

/** @import { SupportedValueType } from 'node:sqlite' */
/** @import { ConnectionOpts } from './types' */

const PATH_REG =
	/^\/c(?:\/(?<conn>[\w-]+)(?:\/(?<obj>[\w-]+)(?:\/(?<name>[\w-]+))?)?)?$/

/**
 * @param {import('@musakui/saaba').RequestContext} ctx
 */
export async function handleRequest(ctx) {
	const { method } = ctx
	const isGET = method === 'GET'
	const isPOST = method === 'POST'

	if (ctx.path === '/') {
		if (isGET) return { status: 'ok' }
		throw new NotAllowedError()
	}

	const match = PATH_REG.exec(ctx.path)
	if (!match) throw new NotFoundError()

	const { conn, obj, name } = match.groups ?? {}

	if (!conn) {
		if (isGET) {
			// list connections
			return {
				status: 'ok',
				conns: getConnections().map(({ db, schema, ...c }) => c),
			}
		} else if (isPOST) {
			// create connection
			/** @type {ConnectionOpts | null} */
			const opts = await getJSON(ctx)
			if (!opts?.name) throw new BadRequestError(`connection name is required`)
			const { name, path } = initConnection(opts)
			return {
				status: 'ok',
				conn: { name, path },
			}
		}
		throw new NotAllowedError()
	}

	const cn = getConnection(conn)
	if (!cn) throw new NotFoundError(`no connection '${conn}'`)

	if (!obj) {
		if (method === 'DELETE') return removeConnection(cn)

		if (isGET) {
			// get connection info
			const tables = [...updateSchema(cn).keys()]
			return {
				status: 'ok',
				conn: { tables },
			}
		}

		if (isPOST) {
			/** @type {{ query: string, params?: SupportedValueType[] } | null} */
			const data = await getJSON(ctx)
			if (!data?.query) throw new BadRequestError(`query is required`)
			const results = cn.runAll(data.query, data.params)
			return {
				status: 'ok',
				results,
			}
		}

		throw new NotAllowedError()
	}

	if (obj === 't') {
		// table related operations
		if (name) {
			if (!cn.schema.size) updateSchema(cn)

			const tb = cn.schema.get(name)
			if (!tb) throw new NotFoundError(`no table "${name}"`)

			if (isGET) {
				const parsed = parseSelectOptions(ctx.query)
				const sql = generateSelect(name, parsed)
				const results = cn.runAll(sql.sql, processValues(sql.values))
				return {
					status: 'ok',
					parsed,
					sql,
					results,
				}
			}

			if (isPOST) {
				/** @type {{ items: Record<string, unknown>[] } | null} */
				const body = await getJSON(ctx)
				if (!Array.isArray(body?.items)) {
					throw new BadRequestError(`items must be an array`)
				}
				const { items, ...opts } = body
				const inserts = getInsertValues(items)
				cn.exec('BEGIN TRANSACTION')
				for (const { cols, values } of inserts) {
					const sql = generateInsert(name, values, { cols, ...opts })
					cn.runAll(sql.sql, processValues(sql.values))
				}
				cn.exec('COMMIT')
				return {
					status: 'ok',
					inserted: items.length,
				}
			}

			if (method === 'PATCH') {
				/** @type {Record<string, unknown> | null} */
				const body = await getJSON(ctx)
				if (!body?.updates) throw new BadRequestError(`updates is required`)
				const parsed = parseSelectOptions(ctx.query)
				const sql = generateUpdate(name, { where: parsed.where, ...body })
				const result = cn.runAll(sql.sql, processValues(sql.values))
				return {
					status: 'ok',
					updated: result[0],
				}
			}

			if (method === 'DELETE') {
				const parsed = parseSelectOptions(ctx.query)
				const sql = generateDelete(name, { where: parsed.where })
				cn.runAll(sql.sql, processValues(sql.values))
				return null
			}

			throw new NotAllowedError()
		} else if (isGET) {
			// conn table schema
			return {
				status: 'ok',
				schema: [...updateSchema(cn).values()],
			}
		}
		throw new NotAllowedError()
	}

	throw new NotFoundError()
}
