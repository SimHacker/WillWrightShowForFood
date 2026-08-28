/**
 * Production entry: adapter-node's request handler plus Socket.IO on one HTTP
 * server.
 *
 * `node build` (adapter-node's own entry) creates its server internally, so
 * there is no way to attach a WebSocket upgrade handler to it. Creating the
 * server here and delegating to the exported handler leaves both sharing a
 * port, which is what Caddy proxies.
 */
import { createServer } from 'node:http';
import { handler } from './build/handler.js';
import { attachSocketServer } from './socket-server.js';

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? '0.0.0.0';

const server = createServer((req, res) => {
	handler(req, res, () => {
		res.statusCode = 404;
		res.end('Not found');
	});
});

attachSocketServer(server);

server.listen(port, host, () => {
	console.log(`viewer listening on http://${host}:${port} (with Socket.IO)`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
	process.on(signal, () => {
		server.close(() => process.exit(0));
	});
}
