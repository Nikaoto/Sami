var ctx = 0;
var filesarr = [];
var video = new Whammy.Video(27);

function generateVideo() {
  if (filesarr.length > 0) {

  for (i = 0; i < filesarr.length; i++) {
    var file = filesarr[i];
    if (file.type.match(/image.*/)) {
      process(file);
    }
  }
}

function process(file) {
  var reader = new FileReader();  
  reader.onload = function(event) {
    var dataUri = event.target.result;
    var img = new Image();
    //load image and drop into canvas
    img.onload = function() {
      //a custom fade in and out slideshow
      context.globalAlpha = 0.2;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      video.add(context);
      context.clearRect(0,0,context.canvas.width,context.canvas.height);
      context.globalAlpha = 0.4;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      video.add(context);
      context.clearRect(0,0,context.canvas.width,context.canvas.height);
      context.globalAlpha = 0.6;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      video.add(context);
      context.clearRect(0,0,context.canvas.width,context.canvas.height);
      context.globalAlpha = 0.8;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      video.add(context);                       
      context.clearRect(0,0,context.canvas.width,context.canvas.height);
      context.globalAlpha = 1;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      //this should be a loop based on some user input
      video.add(context);
      video.add(context);
      video.add(context);
      video.add(context);
      video.add(context);
      video.add(context);
      video.add(context);

      context.clearRect(0,0,context.canvas.width,context.canvas.height);
      context.globalAlpha = 0.8;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      video.add(context);
      context.clearRect(0,0,context.canvas.width,context.canvas.height);
      context.globalAlpha = 0.6;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      video.add(context);
      context.clearRect(0,0,context.canvas.width,context.canvas.height);
      context.globalAlpha = 0.4;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      video.add(context);
            
      ctx++;
      finalizeVideo();
    };
    img.src = dataUri;
  };
  reader.onerror = function(event) {
      console.error("File could not be read! Code " + event.target.error.code);
  };

  reader.readAsDataURL(file);
}

function finalizeVideo(){
  //check if its ready
  if(ctx==filesarr.length){
    var start_time = +new Date;
    var output = video.compile();
    var end_time = +new Date;
    var url = webkitURL.createObjectURL(output);
    console.log(url)

    /*document.getElementById('awesome').src = url; //toString converts it to a URL via Object URLs, falling back to DataURL
    document.getElementById('download').style.display = '';
    document.getElementById('download').href = url;
    document.getElementById('status').innerHTML = "Compiled Video in " + (end_time - start_time) + "ms, file size: " + Math.ceil(output.size / 1024) + "KB";*/
}