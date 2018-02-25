//var request = require("request")
const fetch = require("node-fetch")
const cheerio = require("cheerio")
const EventEmitter = require("events")
const Promise = require("bluebird")
fetch.Promise = Promise

const debugMode = true

function log(str) {
	return debugMode ? console.log(str) : null
}

class BingScraper extends EventEmitter {

	getLinkFromQuery(query) {
		return "http://www.bing.com/images/search?q=" + query + "&view=detailv2"
	}

	getNextPage(nextPageLink) {
		return "http://www.bing.com" + nextPageLink + "&view=detailv2"
	}

	getOptions(query) {
		return { 
			"mode": "no-cors",
			"method": "GET",
			"User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36" 	
		 }
	}

	scrape(query, max = 20) {
		return new Promise((resolve) => {
			log(`scraping: ${query} (x${max})`)

			let result = []

			fetch(this.getLinkFromQuery(query), {
				"mode": "no-cors",
				"method": "GET",
				"User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
			})
			.then(response => response.text())
			.then(res => {
				let $ = cheerio.load(body)

				$(".item ")

				$(".item a[class='thumb']").each(function (el) {

					let item = $(this).attr("href")
          let detail = $(this).parent().find(".fileInfo").text()

          item = {
            url: item,
            thumb: $(this).find("img").attr("src"),
            width: detail.split(' ')[0],
            height: detail.split(' ')[2],
            format: detail.split(' ')[3],
            size: detail.split(' ')[4],
            unit: detail.split(' ')[5]
          }

          log(item.url)
          result.push(item)
				})

				// Check maximum
				if (max && result.length > max) {
					log("end, max reached")
					return resolve(result)
				}

				// Search the following pages
				let page = $("li a[class='sb_pagS']").parent().next().find("a").attr("href");
				if (page) {
					resolve(this.scrape(this.getNextPage(page), max))
				} else {
					log("end, no next page")
					return resolve(result)
				}
			})
			.catch(err => {
				log("end")
				return resolve(result)
			})
		})
	}
}

module.exports = BingScraper