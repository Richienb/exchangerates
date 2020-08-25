// TODO: Use p-memoize when https://github.com/sindresorhus/p-memoize/issues/3 is merged.
import memoize from "memoized-keyv"
import KeyvLevel from "./keyv-level"

const store = new KeyvLevel("mem")

export default <ArgumentsType extends unknown[],
	ReturnType
>(function_: (...arguments_: ArgumentsType) => ReturnType, { maxAge = Infinity }: {maxAge?: number} = {}): (...arguments_: ArgumentsType) => Promise<ReturnType> => memoize(function_, { store, ttl: maxAge === Infinity ? undefined : maxAge }) as any
