import { Surreal } from 'surrealdb.js';
import * as model from './model';
import type { TaskEither } from 'fp-ts/lib/TaskEither';
import { either, option, taskEither } from 'fp-ts';
import type { Option } from 'fp-ts/lib/Option';
import { decoder, report } from './model/helper';
import type { Parser } from './model';
import { writable, type Writable } from 'svelte/store';
import { pipe } from 'fp-ts/lib/function';

export const db = new Surreal();

await db.connect(import.meta.env.VITE_DATABASE_URL, {
	namespace: import.meta.env.VITE_DATABASE_NAMESPACE,
	database: import.meta.env.VITE_DATABASE_NAME,

	auth: {
		namespace: import.meta.env.VITE_DATABASE_NAMESPACE,
		database: import.meta.env.VITE_DATABASE_NAME,
		username: import.meta.env.VITE_DATABASE_USERNAME,
		password: import.meta.env.VITE_DATABASE_PASSWORD
	}
});

// can't access Surreal's types directly, so we have to use this workaround
export type RawQueryResult =
	ReturnType<typeof db.query> extends Promise<infer T>
		? T extends Array<infer U>
			? U
			: never
		: never;

export type LiveQueryResponse = typeof db.listenLive extends (
	id: string,
	callback: (response: infer T) => void
) => void
	? T
	: never;

export async function sql(
	fragments: TemplateStringsArray,
	...params: unknown[]
): Promise<RawQueryResult> {
	let index = 0;

	function param_name() {
		return `param_${index}`;
	}

	let query = '';
	const bindings: Record<string, unknown> = {};

	for (const fragment of fragments) {
		query += fragment;

		if (index < params.length) {
			const name = param_name();
			query += `$${name}`;
			bindings[name] = params[index];
		}

		index++;
	}

	console.info(`executing query: ${query}`, bindings);
	const result = await db.query(query, bindings);
	return result[0];
}

type ParseResult<T> = TaskEither<decoder.DecodeError, T>;

export type QueryBuilder = {
	many: <T>(parser: Parser<T>) => ParseResult<T[]>;
	one: <T>(parser: Parser<T>) => ParseResult<T>;
	maybe: <T>(parser: Parser<T>) => ParseResult<Option<T>>;

	tryMany: <T>(parser: Parser<T>) => Promise<T[]>;
	tryOne: <T>(parser: Parser<T>) => Promise<T>;
	tryMaybe: <T>(parser: Parser<T>) => Promise<Option<T>>;
};

export function query(fragments: TemplateStringsArray, ...params: unknown[]): QueryBuilder {
	const query: ParseResult<RawQueryResult> = taskEither.tryCatch(
		() => sql(fragments, ...params),
		(error) => decoder.error(error, `${error}`)
	);

	const many = <T>(parser: Parser<T>) => taskEither.chainEitherK(model.many(parser).decode)(query);

	const maybe = <T>(parser: Parser<T>) =>
		taskEither.chainEitherK(model.optional(parser).decode)(query);

	const one = <T>(parser: Parser<T>) =>
		taskEither.chainEitherK(model.exactly(parser).decode)(query);

	return {
		many,
		maybe,
		one,
		tryMany: async (parser) => executeTask(many(parser)),
		tryMaybe: async (parser) => executeTask(maybe(parser)),
		tryOne: async (parser) => executeTask(one(parser))
	};
}

export async function executeTask<T>(task: ParseResult<T>): Promise<T> {
	const result = await task();

	if (either.isLeft(result)) {
		throw new Error(report(result.left));
	}

	return result.right;
}

export function localStore(key: string, initial: boolean): Writable<boolean> {
	if (typeof window === 'undefined') {
		return writable(initial);
	}

	const item = window.localStorage.getItem(key);
	const data = pipe(
		item,
		option.fromNullable,
		option.map(JSON.parse),
		option.getOrElse(() => initial)
	);

	const store = writable(data);

	store.subscribe((value) => {
		window.localStorage.setItem(key, JSON.stringify(value));
	});

	return store;
}
