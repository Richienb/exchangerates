// TODO: Use p-memoize when https://github.com/sindresorhus/p-memoize/issues/3 is merged.
import memoize from "memoized-keyv"
import KeyvLevel from "./keyv-level"

const store = new KeyvLevel("mem")

export default <ArgumentsType extends unknown[],
	ReturnType,
	FunctionToMemoize = (...arguments_: ArgumentsType) => ReturnType
>(function_: FunctionToMemoize, {maxAge = Infinity}: {maxAge?: number} = {}): FunctionToMemoize => memoize(function_, {store, ttl: maxAge === Infinity ? undefined : maxAge}) as any
