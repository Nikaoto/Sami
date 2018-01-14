$(() => {
	const IMPORTANT_WORD_LENGTH = 5
	const PARAGRAPH_DELIMITER = "\n"
	let currentText = ""
	let paragraphCount = 0
	let itemIds = []
	let resourceList = []
	let socket = io()

	function addItem(source) {
		let id = itemIds.length.toString() + "-resource-item"
		itemIds.push(id)
		let resourceItem = "<img id="+id+" class='resource hover-shadow slideLeftFadeIn' src="+source+">"
		$("#resource-list").append(resourceItem)
	}

	socket.on("scrape result", result => { addItem(result.thumb) })

	function removeItem() {
		$("#"+itemIds[itemIds.length-1].toString()).remove()
		console.log("removing "+ (itemIds.length-1).toString())
		itemIds.pop(itemIds.length-1)
	}

	$("#content-textarea").bind("input propertychange", (e) => {
		console.log("text changed")
		currentText = $("#content-textarea").val()
		if (paragraphCount < getParaCount(currentText)) {
			for (i=0; i<=getParaCount(currentText) - paragraphCount; i++) {
				paragraphCount++

				let paragraphs = currentText.trim().split(PARAGRAPH_DELIMITER)
				let lastParagraph = paragraphs[paragraphs.length - 1]
				sendScrapeRequest(getImportantWords(lastParagraph))
			}
		}
		if (paragraphCount >= getParaCount(currentText)) {
			for (i=0; i<paragraphCount-getParaCount(currentText); i++) {
				paragraphCount--
				removeItem()
				console.log("REMOVE RESOURCE")	
			}
		}
	})

	function getImportantWords(paragraph) {
		let words = paragraph.trim().split(" ").map(x => x.trim())
		if (words.length === 0) {
			console.log("WARN: words.length === 0")
			return []
		}

		let actualWords = words.filter(word => word.length > 1)
		if (actualWords.length === 0) {
			console.log("WARN: actualWords.length === 0")
			return []
		}

		let importantWords = words.filter(word => word.length >= IMPORTANT_WORD_LENGTH)
		if (importantWords.length === 0) {
			return [actualWords[Math.floor(random()*actualWords.length)]]
		} else {
			return importantWords
		}
	}

	function sendScrapeRequest(words) {
		for (let word of words) {
			socket.emit("search", word)
			console.log("emit search for '" + word + "'")
		}
	}

	function getParaCount(txt) {
		const len = PARAGRAPH_DELIMITER.length
		let count = 0
		for (let i in txt) {
			if (txt.substr(i, len) === PARAGRAPH_DELIMITER) {
				count ++
			}
		}
		return count
	}

	$("#choose-files-btn").bind("change", (e) => {
		let input = e.target
		if (input.files && input.files[0]) {
			
			let values = Object.keys(input.files).map((k) => input.files[k])
			console.log("Object.keys =", Object.keys(input.files))
			console.log("values =", values)

			values.map((file) => {			
				let reader = new FileReader()			
	    	reader.onload = (e) => addItem(e.target.result)
	  		reader.readAsDataURL(file)
			})
	  }
	})

	$("#next-page-btn").on("click", () => {
		let headingList = $("#content-textarea").val().split("\n\n")
		sessionStorage.headingList = headingList
		window.open("../draft.html", "_self")
	})
})