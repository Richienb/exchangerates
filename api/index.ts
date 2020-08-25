import { NowRequest, NowResponse } from "@vercel/node"
import got from "got"
import mapObject from "map-obj"
import Decimal from "decimal.js"
import lowercaseKeys from "lowercase-keys"
import mem from "../lib/level-mem"
import * as Sentry from "@sentry/node"

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
	release: process.env.VERCEL_GITHUB_COMMIT_SHA
})

const changeExchangeRateBase = mem(<ExchangeRates extends Record<string, number>>(exchangeRates: ExchangeRates, newBase: keyof ExchangeRates): Record<string, number> => {
	const newBaseExchangeRate = exchangeRates[newBase]
	return mapObject(exchangeRates, (key: string, value) => [key, new Decimal(value).dividedBy(newBaseExchangeRate).toNumber()])
})

const getFixer = async () => {
	const { body } = await got<{
		success: boolean
		error?: {
			code: number
			type: string
		}
		timestamp: number
		base: string
		date: string
		rates: Record<string, number>
	}>("http://data.fixer.io/api/latest", {
		searchParams: {
			access_key: process.env.FIXER_ACCESS_KEY
		},
		responseType: "json"
	})

	if (!body.success) {
		throw new Error(`Fixer error: ${body.error!.type} (${body.error!.code}).`)
	}

	return lowercaseKeys(await changeExchangeRateBase(body.rates, "USD"))
}

const getOpenExchangeRates = async () => {
	const { body } = await got<{
		disclaimer: string
		license: string
		timestamp: number
		base: string
		rates: Record<string, number>
	}>("https://openexchangerates.org/api/latest.json", {
		searchParams: {
			app_id: process.env.OPEN_EXCHANGE_RATES_APP_ID
		},
		responseType: "json"
	})

	return lowercaseKeys(body.rates)
}

const getExchangeRates = mem(async () => {
	const [openExchangeRates, fixer] = await Promise.all([getFixer(), getOpenExchangeRates()])
	return {
		...openExchangeRates,
		...fixer
	}
}, { maxAge: 86400 })

export default async (request: NowRequest, response: NowResponse) => {
	response.setHeader("Cache-Control", "Cache-Control: maxage=0, s-maxage=86400, stale-while-revalidate")
	response.json(await changeExchangeRateBase(await getExchangeRates(), (request.query.base as string) ?? "usd"))
}
