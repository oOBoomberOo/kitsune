import { either, array, option } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import * as C from 'io-ts/Codec';
import * as D from 'io-ts/Decoder';

import { Timestamp } from './model/timestamp';
import { Duration } from './model/duration';
import { Lens } from 'monocle-ts';

export const Tracker = C.struct({
	id: C.string,
	title: C.string,
	created_at: Timestamp,
	updated_at: Timestamp,
	video_id: C.string,
	track_at: Timestamp,
	track_duration: Duration,
	track_target: C.nullable(C.number)
});
export type Tracker = C.TypeOf<typeof Tracker>;

const trackerProp = Lens.fromProp<Tracker>();
export const trackerLens = {
	id: trackerProp('id'),
	title: trackerProp('title'),
	created_at: trackerProp('created_at'),
	updated_at: trackerProp('updated_at'),
	video_id: trackerProp('video_id'),
	track_at: trackerProp('track_at'),
	track_duration: trackerProp('track_duration'),
	track_target: trackerProp('track_target')
};

export const Stats = C.struct({
	id: C.string,
	created_at: Timestamp,
	tracker_id: C.string,
	video_id: C.string,
	views: C.number,
	likes: C.number
});

const statsProp = Lens.fromProp<Stats>();
export const statsLens = {
	id: statsProp('id'),
	created_at: statsProp('created_at'),
	tracker_id: statsProp('tracker_id'),
	video_id: statsProp('video_id'),
	views: statsProp('views'),
	likes: statsProp('likes')
};

export type Stats = C.TypeOf<typeof Stats>;

export type Parser<T> = C.Codec<unknown, unknown, T>;

export function many<T>(parser: Parser<T>) {
	return D.array(parser);
}

export function optional<T>(parser: Parser<T>) {
	return pipe(many(parser), D.parse(flow(array.head, D.success)));
}

export function exactly<T>(parser: Parser<T>) {
	return pipe(
		optional(parser),
		D.parse(either.fromOption(() => D.error(option.none, 'expected exactly one item')))
	);
}
