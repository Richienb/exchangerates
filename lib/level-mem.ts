// TODO: Use p-memoize when https://github.com/sindresorhus/p-memoize/issues/3 is merged.
import memoize from "memoized-keyv"
import level from "level"

const store = level('mem')

export default async <ReturnType>(function_: (...args: any[]) => ReturnType): Promise<ReturnType> => memoize(function_, {store})
