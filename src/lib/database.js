import { Surreal } from 'surrealdb.js';
import { SURREAL_URL, SURREAL_NAME, SURREAL_PASS, SURREAL_DB, SURREAL_NS } from "$env/static/private";

export const surreal = new Surreal();

await surreal.connect(SURREAL_URL);

await surreal.signin({
	username: SURREAL_NAME,
	password: SURREAL_PASS,
	database: SURREAL_DB,
	namespace: SURREAL_NS
});
