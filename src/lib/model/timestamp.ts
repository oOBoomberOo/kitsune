import { DateTime } from 'luxon';

import * as D from 'io-ts/Decoder';
import * as E from 'io-ts/Encoder';
import * as Codec from 'io-ts/Codec';
import { pipe } from 'fp-ts/lib/function';

export const TimestampDecoder: D.Decoder<unknown, DateTime<true>> = pipe(
	D.string,
	D.parse((input) => {
		const result = DateTime.fromISO(input);

		if (result.isValid) {
			return D.success(result);
		} else {
			return D.failure(input, 'Timestamp');
		}
	})
);

export const TimestampEncoder: E.Encoder<string, DateTime<true>> = {
	encode: (date) => date.toISO()
};

export const Timestamp = Codec.make(TimestampDecoder, TimestampEncoder);

export type Timestamp = Codec.TypeOf<typeof Timestamp>;
