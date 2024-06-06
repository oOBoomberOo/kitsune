// import { surreal } from "$lib/database";

export async function load() {
	// let [logs] = await surreal.query(`select *, array::first(<-wrote<-trackers.id) as tracker from logs order by created_at desc fetch tracker`);
	return { logs: [] };
}