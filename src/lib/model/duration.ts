import * as D from 'io-ts/Decoder';
import * as E from 'io-ts/Encoder';
import * as Codec from 'io-ts/Codec';

export const DurationDecoder = D.number;
export const DurationEncoder = E.id<number>();

export const Duration = Codec.make(DurationDecoder, DurationEncoder);

export type Duration = Codec.TypeOf<typeof Duration>;
