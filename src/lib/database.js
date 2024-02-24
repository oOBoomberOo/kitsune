import { Surreal } from 'surrealdb.js';
import { env } from "$env/dynamic/private";
import { building } from '$app/environment';

export const surreal = new Surreal();

if (!building) {
	await surreal.connect(env.SURREAL_URL);

	await surreal.signin({
		username: env.SURREAL_NAME,
		password: env.SURREAL_PASS,
		database: env.SURREAL_DB,
		namespace: env.SURREAL_NS
	});
}