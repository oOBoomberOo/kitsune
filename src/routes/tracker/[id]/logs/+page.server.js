// import { surreal } from '$lib/database.js';

export async function load({ params }) {
	const trackerId = params.id;

	return { id: trackerId, logs: [] };

	// const [logs] = await surreal.query(`
	// 	select
	// 		*
	// 	from
	// 		logs
	// 	where
	// 		<-wrote<-trackers contains $tracker;
	// `, { tracker: trackerId });

	// return {
	// 	id: trackerId,
	// 	logs,
	// }
}