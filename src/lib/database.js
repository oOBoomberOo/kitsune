import { Surreal } from 'surrealdb.js';
import { env } from "$env/dynamic/private";

export const surreal = new Surreal();

await surreal.connect(env.SURREAL_URL);

await surreal.signin({
	username: env.SURREAL_NAME,
	password: env.SURREAL_PASS,
	database: env.SURREAL_DB,
	namespace: env.SURREAL_NS
});
