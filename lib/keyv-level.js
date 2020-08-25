"use strict"

const level = require("level")

class KeyvLevel {
	constructor(location, options) {
		this.level = level(location, options)
	}

	async get(key) {
		try {
			return await this.level.get(key, {asBuffer: false})
		} catch (error) {
			if (error.notFound) {
				return undefined
			}

			throw error
		}
	}

	async set(key, value) {
		if (value === undefined) {
			return
		}

		await this.level.put(key, value)
		return true
	}

	async _has(key) {
		try {
			await this.level.get(key)
			return true
		} catch (error) {
			if (error.notFound) {
				return false
			}

			throw error
		}
	}

	async delete(key) {
		if (await this._has(key)) {
			await this.level.del(key)
			return true
		} else {
			return false
		}
	}

	async clear() {
		await this.level.clear()
	}
}

module.exports = KeyvLevel
