export async function getAll() {
	const r = await fetch('/tasks.json')
	/** @type {Record<string, unknown>[]} */
	const raw = await r.json()
	return raw.map(({ updated, ...t }) => {
		return /** @type {import('./task').Task} */ ({
			...t,
			cover: `https://picsum.photos/seed/${t.id}/200/300`,
			updated: new Date(/** @type {string} */ (updated)),
		})
	})
}
