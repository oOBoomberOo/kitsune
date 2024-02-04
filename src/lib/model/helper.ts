import { either } from 'fp-ts';
import { isLeft, type Either } from 'fp-ts/lib/Either';
import { flow } from 'fp-ts/lib/function';
import * as D from 'io-ts/Decoder';
import * as E from 'io-ts/Encoder';

export * as decoder from 'io-ts/Decoder';
export * as encoder from 'io-ts/Encoder';

export function yeet<T>(either: Either<string, T>): T {
	if (isLeft(either)) {
		throw new Error(either.left);
	}

	return either.right;
}

export function report(error: D.DecodeError) {
	return D.draw(error);
}

export function toDecode<T, In>(parser: D.Decoder<In, T>): (input: In) => T {
	return flow(parser.decode, either.mapLeft(report), yeet);
}

export function toDecodeList<T>(parser: D.Decoder<unknown, T>): (input: unknown) => T[] {
	return flow(D.array(parser).decode, either.mapLeft(report), yeet);
}

export function toEncode<T, Out>(parser: E.Encoder<Out, T>): (input: T) => Out {
	return parser.encode;
}

export function toEncodeList<T, Out>(parser: E.Encoder<Out, T>): (input: T[]) => Out[] {
	return E.array(parser).encode;
}

export function decode<T>(parser: D.Decoder<unknown, T>, input: unknown): T {
	return toDecode(parser)(input);
}

export function decodeList<T>(parser: D.Decoder<unknown, T>, input: unknown): T[] {
	return toDecode(D.array(parser))(input);
}

export function encode<T>(parser: E.Encoder<unknown, T>, input: T): unknown {
	return toEncode(parser)(input);
}

export function encodeList<T>(parser: E.Encoder<unknown, T>, input: T[]): unknown {
	return toEncode(E.array(parser))(input);
}
