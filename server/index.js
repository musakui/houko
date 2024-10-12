import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { createListener } from '@musakui/saaba'

import { col } from './utils.js'
import { handleRequest } from './app.js'
import { closeConnections, initConnection } from './db.js'

const port = parseInt(`${process.env.PORT}`) || 9942

const keyFile = process.env.HTTPS_KEY
const certFile = process.env.HTTPS_CERT
const httpsPort = parseInt(`${process.env.HTTPS_PORT}`) || port + 1

const initOnStart = process.env.HOUKO_INIT

const listener = createListener({
	cors: true,
	emptyFavicon: true,
	handleRequest,
})

const server = createServer(listener)
server.listen(port, () => {
	console.log(`listening on port ${col(port, 36)} (http)`)
})

if (keyFile && certFile) {
	Promise.all([
		readFile(keyFile),
		readFile(certFile),
		import('node:https'),
	]).then(([key, cert, https]) => {
		const httpsServer = https.createServer(listener)
		httpsServer.setSecureContext({ key, cert })
		httpsServer.listen(httpsPort, () => {
			console.log(`listening on port ${col(httpsPort, 36)} (https)`)
		})
		server.on('close', () => httpsServer.close())
	})
}

if (initOnStart) {
	for (const cn of initOnStart.split(',')) {
		const [name, path] = cn.split(':')
		if (!name) continue
		const conn = initConnection({ name, path })
		console.log(`connected to ${col(name, 36)} at ${col(conn.path, 33)}`)
	}
}

const close = () => {
	closeConnections()
	server.close()
	process.exit(0)
}

process.on('SIGTERM', () => close())
process.on('SIGINT', () => {
	console.log('\nshutting down...')
	close()
})
