import { db } from '$lib/database';
import { Tracker, type Parser, Stats } from '$lib/model';
import { report } from '$lib/model/helper';
import { either } from 'fp-ts';
import type { Predicate } from 'fp-ts/lib/Predicate';
import { pipe } from 'fp-ts/lib/function';
import { readable, type Readable } from 'svelte/store';

export const trackers = await live_table(Tracker, 'trackers');
export const stats = await live_table(Stats, 'stats');

export default { trackers, stats, single, collection };

type Event<T> = { action: 'CREATE' | 'UPDATE' | 'DELETE'; data: T };

type Listener<T> = {
	subscribe: (callback: (event: Event<T>) => void) => void;
};

async function live_table<T>(parser: Parser<T>, table: string): Promise<Listener<T>> {
	const callbacks = new Set<(event: Event<T>) => void>();

	function execute(event: Event<T>) {
		for (const callback of callbacks) {
			callback(event);
		}
	}

	await db.live(table, (response) => {
		if (response.action === 'CLOSE') {
			return;
		}

		const event = pipe(response.result, parser.decode, either.mapLeft(report));

		if (either.isLeft(event)) {
			console.error('Failed to parse event', event.left);
			return;
		}

		execute({ action: response.action, data: event.right });
	});

	return {
		subscribe: (callback) => {
			callbacks.add(callback);
		}
	};
}

export function collection<T>(
	listener: Listener<T>,
	initial: T[],
	pred: Predicate<T>,
	key: (item: T) => string
): Readable<Collection<T>> {
	return readable(new Collection(initial, key), (set, update) => {
		listener.subscribe((event) => {
			if (!pred(event.data)) {
				return;
			}

			update((items) => {
				switch (event.action) {
					case 'CREATE':
						return items.add(event.data);
					case 'UPDATE':
						return items.update(event.data);
					case 'DELETE':
						return items.remove(event.data);
				}
			});
		});
	});
}

export function single<T>(listener: Listener<T>, initial: T, pred: Predicate<T>): Readable<T> {
	return readable(initial, (set) => {
		listener.subscribe((event) => {
			if (pred(event.data)) {
				set(event.data);
			}
		});
	});
}

export class Collection<T> implements Iterable<T> {
	toArray(): T[] {
		return [...this];
	}

	constructor(
		private buffer: T[],
		public readonly key: (item: T) => string
	) {}

	[Symbol.iterator](): Iterator<T> {
		return this.buffer[Symbol.iterator]();
	}

	add(item: T): Collection<T> {
		this.buffer.push(item);
		return this;
	}

	remove(item: T): Collection<T> {
		this.buffer = this.buffer.filter((current) => this.key(current) != this.key(item));
		return this;
	}

	update(item: T): Collection<T> {
		this.buffer = this.buffer.map((current) =>
			this.key(current) == this.key(item) ? item : current
		);
		return this;
	}

	get length() {
		return this.buffer.length;
	}

	get iter() {
		return this.buffer;
	}
}
