var width = 500;    // We will scale the photo width to this
var height = 0;     // This will be computed based on the input stream

var streaming = false, takingPhoto;

var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var photo = document.getElementById('photo');
var startbutton = document.getElementById('startbutton');
var clearbutton = document.getElementById('clearbutton');

function startup() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
    })
    .catch(function(err) {
        console.log("An error occurred: " + err);
    });    
}

video.addEventListener('canplay', function(ev){
    if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
        console.log("addEventListener")
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
    }
}, false);

startup();

startbutton.addEventListener('click', function(ev){
    takepicture();
    // takingPhoto = setInterval(function() {
    //     takepicture();
    // }, 10);
    ev.preventDefault();
}, false);

clearbutton.addEventListener('click', function(ev){
    clearphoto();
    // clearInterval(takingPhoto);
    ev.preventDefault();
}, false);

function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        
        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);

        loadAndPredict();
    } else {
        clearphoto();
    }
}

function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
}
