let express = require("express")
let app = express()
let http = require("http").createServer(app)
let io = require("socket.io")(http)
let BingScraper = require("./lib/bing-image-scraper")

const PORT = process.env.PORT || 5000
const scraper = new BingScraper()

function getOneResult(results) {
	return results[Math.floor(Math.random() * (results.length - 1))]
}

app.use(express.static("public"))

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html")
})

io.on("connection", (socket) => {
	console.log("user connected")

	socket.on("search", (query) => {
		scraper.scrape(query).then((results) => {
			result = getOneResult(results)
			console.log("server.js: result =", result)
			socket.emit("scrape result", result)
		})
	})

	socket.on("disconnect", () => {
		console.log("user disconnected")
	})

})

http.listen(PORT, () => {
	console.log("Listening on PORT", PORT)
})

