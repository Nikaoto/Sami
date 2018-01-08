$(() => {
	let imageDir = "../img/"
	let currentText = ""
	let paragraphCount = 0
	let itemIds = []
	let resourceList = []
	let socket = io()

	function initImages() {
		return ["img1.jpg", "img2.jpg", "img3.jpg", "img4.gif", "img5.gif", "img6.gif", "img7.jpg", "img8.jpg",
		"img11.jpg", "img9.jpg", "img10.jpg"]
			.map((x) => x = imageDir + x)
	}

	let images = initImages()

	function readURL(input) {
	  if (input.files && input.files[0]) {
	    var reader = new FileReader();
	    reader.onload = (e) => {
	  			addItem(e.target.result)
	    };
	  	reader.readAsDataURL(input.files[0])
	  }
	}

	function getRandomImage() {
		if (images.length < 1) {
			images = initImages()
		}
		let index = Math.floor(Math.random()*images.length)
		let removedItem = images[index]
		images.splice(index, 1)
		return removedItem
	}

	function addItem(source = getRandomImage()) {
		let id = itemIds.length.toString() + "-resource-item"
		itemIds.push(id)
		let resourceItem = "<img id="+id+" class='resource hover-shadow slideLeftFadeIn' src="+source+">"
		$("#resource-list").append(resourceItem)
	}

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
				// TODO - emit request
				addItem()

				console.log("ADD RESOURCE")
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

	function getParaCount(txt) {
		return (txt.match(/\n\n/g) || []).length
	}

	$("#next-page-btn").on("click", () => {
		let headingList = $("#content-textarea").val().split("\n\n")
		sessionStorage.headingList = headingList
		window.open("../draft.html", "_self")
	})
})