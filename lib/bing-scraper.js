const bing = require("nodejs-bing")
const EventEmitter = require("events")
const Promise = require("bluebird")

const debugMode = true

function log(str) {
	return debugMode ? console.log(str) : null
}

class BingScraper extends EventEmitter {

	scrape(query) {
		return new Promise(resolve => {
			log(`scraping: ${query}`)

			bing.image(query).then(res => {
				res.forEach(el => log(el.mediaurl))
				return resolve(res)
			})
		})
	}
}

module.exports = BingScraper