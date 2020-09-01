# exchangerates [![Travis CI Build Status](https://img.shields.io/travis/com/Richienb/exchangerates/master.svg?style=for-the-badge)](https://travis-ci.com/Richienb/exchangerates)

A simple exchange rates API.

## Install

```sh
npm install exchangerates
```

## API

### GET https://exchangerates.vercel.app

Returns an json object of currency exchange rates.

#### Query parameters

##### base

Type: `string`\
Default: `usd`

Use a currency as the base.

## Donating API keys

To retrieve exchange rates, we use [fixer.io](https://fixer.io) and [openexchangerates.org](https://openexchangerates.org). In order to comply with the API quota, the conversion data is cached for 24 hours and historic data is not available.

If you would like to contribute your API key to help improve this API, please send it to [richiebendall@gmail.com](mailto:richiebendall@gmail.com).
