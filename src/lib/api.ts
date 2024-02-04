import { type Readable } from 'svelte/store';
import { Tracker, Stats } from './model';
import { query } from './database';
import live from './database/live';

export function liveTracker(tracker: Tracker): Readable<Tracker> {
	return live.single(live.trackers, tracker, (item: Tracker) => item.id === tracker.id);
}

export function liveTrackers(initial: Tracker[] = []) {
	return live.collection(
		live.trackers,
		initial,
		() => true,
		(item) => item.id
	);
}

export function liveStatsByTrackerId(tracker_id: string, initial: Stats[] = []) {
	return live.collection(
		live.stats,
		initial,
		(item) => item.tracker_id === tracker_id,
		(item) => item.id
	);
}

export async function trackers(): Promise<Tracker[]> {
	return query`SELECT * FROM trackers ORDER BY updated_at`.tryMany(Tracker);
}

export async function tracker(id: string): Promise<Tracker> {
	return query`SELECT * FROM trackers WHERE id = ${id}`.tryOne(Tracker);
}

export async function stats(id: string): Promise<Stats[]> {
	return query`SELECT * FROM stats WHERE tracker_id = ${id} ORDER BY created_at DESC`.tryMany(
		Stats
	);
}
