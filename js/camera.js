////////////////////////////////////////////////////////////
// CAMERA
////////////////////////////////////////////////////////////
var supportCamera = false;
var cameraW = 640;
var cameraH = 480;
var imgWidth = 0;
var imgHeight = 0;
var cameraData = {w:0, h:0};
var shouldFaceUser = true;
var faceingMode = false;

var createBinaryFile = function(uintArray) {
    var data = new Uint8Array(uintArray);
    var file = new BinaryFile(data);
 
    file.getByteAt = function(iOffset) {
        return data[iOffset];
    };
    file.getBytesAt = function(iOffset, iLength) {
        var aBytes = [];
        for (var i = 0; i < iLength; i++) {
            aBytes[i] = data[iOffset  + i];
        }
        return aBytes;
    };
    file.getLength = function() {
        return data.length;
    };
    return file;
};


/*!
 * 
 * BUILD UPLOAD AND CAMERA - This is the function that runs to build camera and uload events
 * 
 */
function buildCamera(){
	imgWidth = photoW;
	imgHeight = photoH;
	cameraW = photoW;
	cameraH = photoH;
	
	if(hasGetUserMedia()) {
		supportCamera = true;
	}else {
		supportCamera = false;
	}
	
	$('#btn_hiddenCamera').on('change', function(e) {
		e.preventDefault();
		if(this.files.length === 0) return;
		var imageFile = this.files[0];
		var img = new Image();
		var url = window.URL ? window.URL : window.webkitURL;
		img.src = url.createObjectURL(imageFile);
		img.onload = function(e) {
			url.revokeObjectURL(this.src);

			var width;
			var height;
			var binaryReader = new FileReader();
			binaryReader.onloadend=function(d) {
				var exif, transform = "none";
				exif=EXIF.readFromBinaryFile(createBinaryFile(d.target.result));

				if(exif.Orientation === 8) {
					width = img.height;
					height = img.width;
					transform = "left";
				} else if(exif.Orientation === 6) {
					width = img.height;
					height = img.width;
					transform = "right";
				} else if(exif.Orientation === 1) {
					width = img.width;
					height = img.height;
				} else if(exif.Orientation === 3) {
					width = img.width;
					height = img.height;
					transform = "flip";
				} else {
					width = img.width;
					height = img.height;
				}
				var MAX_WIDTH = imgWidth;
				var MAX_HEIGHT = imgHeight;
				
				if(photoUploadSize == 'contain'){
					if (width/MAX_WIDTH > height/MAX_HEIGHT) {
						if (width > MAX_WIDTH) {
							height *= MAX_WIDTH / width;
							width = MAX_WIDTH;
						}
					} else {
						if (height > MAX_HEIGHT) {
							width *= MAX_HEIGHT / height;
							height = MAX_HEIGHT;
						}
					}
				}else if(photoUploadSize == 'cover'){
					if (width/MAX_WIDTH > height/MAX_HEIGHT) {
						if (width > MAX_WIDTH) {
							width *= MAX_HEIGHT / height;
							height = MAX_HEIGHT;
						}else if (height < MAX_HEIGHT) {
							height = MAX_HEIGHT;
							width = width * (MAX_HEIGHT / height);
						}
					} else {
						if (height > MAX_HEIGHT) {
							height *= MAX_WIDTH / width;
							width = MAX_WIDTH;
						}else if (width < MAX_WIDTH) {
							height = height * (MAX_WIDTH / width);
							width = MAX_WIDTH;
						}
					}
				}
				
				if(transform === 'left') {
					var tempHeight = height;
					height = width;
					width = tempHeight;
					
					transform = 'none';
				} else if(transform === 'right') {
					var tempHeight = height;
					height = width;
					width = tempHeight;
					transform = 'none';
				} else if(transform === 'flip') {
					transform = 'none';
				}
				
				ss_canvas = document.querySelector('#webCanvas');
				ss_canvas.width=width;
				ss_canvas.height=height;
				ss_ctx = ss_canvas.getContext('2d');
				ss_ctx.clearRect(0, 0, ss_canvas.width, ss_canvas.height);
				
				if(transform === 'left') {
					ss_ctx.setTransform(0, -1, 1, 0, 0, height);
					drawImageIOSFix(ss_ctx, img, 0, 0, height, width);
				} else if(transform === 'right') {
					ss_ctx.setTransform(0, 1, -1, 0, width, 0);
					drawImageIOSFix(ss_ctx, img, 0, 0, height, width);
				} else if(transform === 'flip') {
					ss_ctx.setTransform(1, 0, 0, -1, 0, height);
					drawImageIOSFix(ss_ctx, img, 0, 0, width, height);
				} else {
					ss_ctx.setTransform(1, 0, 0, 1, 0, 0);
					drawImageIOSFix(ss_ctx, img, 0, 0, width, height);
				}
				ss_ctx.setTransform(1, 0, 0, 1, 0, 0);
				
				var datauri = ss_canvas.toDataURL("image/png");			
				handleSnap(datauri);
				$("#btn_hiddenCamera").val("");
			};
			binaryReader.readAsArrayBuffer(imageFile);
		};
	});
	
	resizeCamera();
}


/*!
 * 
 * CHECK CAMERA SUPPORT - This is the function that runs to check camera support
 * 
 */
var isWebcam=false;
var localMediaStream=null;
function hasGetUserMedia() {
	var proceedCheck = false;
	
	if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === ""){
		proceedCheck = true;
	}else if(location.protocol == 'https:'){
		proceedCheck = true;
	}
	
	if(proceedCheck){
  		return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
	}else{
		return false;	
	}
}

/*!
 * 
 * START CAMERA - This is the function that runs to start camera
 * 
 */
function initWebcam(){
		

	toggleCameraReady(false);
	video = document.querySelector('#webCamera');

	toggleCameraError('PENDING');

	setTimeout(function(){
		if (navigator.mediaDevices.getUserMedia) {       
			navigator.mediaDevices.getUserMedia({video:{facingMode: shouldFaceUser ? 'user' : 'environment'}})
		.then(function(stream) {
			video.srcObject = stream;
			localMediaStream = stream;
			isWebcam = true;
			toggleCameraReady(true);
			$('#videoHolder').show();
				
			checkFacingMode();
		})
		.catch(function(error) {
			toggleCameraError(error.name);
		});
		}
	}, 1000)
}


/*!
 * 
 * TOGGLE CAMERA BUTTON - This is the function that runs to toggle camera page buttons
 * 
 */
function toggleCameraReady(con){
	if(con){
		textCameraAllow.visible = false;
		textCameraDenied.visible = false;
		textCameraNotSupport.visible = false;
		textNoCamera.visible = false;
		
		btnStartCamera.visible=false;
	}else{
		btnStartCamera.visible=true;
	}
}

/*!
 * 
 * DISABLE CAMERA - This is the function that runs to disable camera
 * 
 */
function closeWebcam(){
	$('#videoHolder').hide();
	if(isWebcam){
		localMediaStream.getVideoTracks().forEach(function (track) {
			track.stop();
		});
		localMediaStream=null;
		isWebcam = false;
	}
}

/*!
 * 
 * SNAP FROM CAMERA - This is the function that runs to take photo from camera
 * 
 */
function snapCanvas() {
	if(localMediaStream!=null){
		var finalSnap = {w:0, h:0};
		finalSnap.w = cameraW;
		finalSnap.h = cameraH;
		
		if(video.videoHeight > cameraH){
			var ratio = cameraH / video.videoHeight;
			finalSnap.w = video.videoWidth * ratio;
			finalSnap.h = video.videoHeight * ratio;
		}
		
		$('#webCanvas').attr('width',finalSnap.w);
		$('#webCanvas').attr('height',finalSnap.h);
		
		ss_canvas = document.querySelector('#webCanvas');
		ss_ctx = ss_canvas.getContext('2d');
		
		ss_ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
		ss_ctx.drawImage(video, 0, 0, finalSnap.w, finalSnap.h);
		
		toggleCameraError('NONE');
		webcamUri = ss_canvas.toDataURL("image/png");
		handleSnap(webcamUri);
	}
	closeWebcam();
}

function handleSnap(source, frm){
	img = new Image();
	img.onload = function(){
		addPhotoToCanvas(img);
		toggleTransform(true);
	}
	img.src = source;
}

/*!
 * 
 * CAMERA EVENT HANDLE - This is the function that runs for camera access handle event
 * 
 */
function onFailure(err) {
	toggleCameraError(err.name);
}

function toggleCameraError(con){
	textCameraAllow.visible = false;
	textCameraDenied.visible = false;
	textCameraNotSupport.visible = false;
	textNoCamera.visible = false;
	btnSwitch.visible = false;
	
	if(con=='PERMISSION_DENIED'||con=='PermissionDeniedError'||con=='NotAllowedError'){
		//You have denied permission to access camera, click <img src='images/camerablock.png' > on address bar to access camera
		textCameraDenied.visible = true;
		closeWebcam();
	}else if(con=='PENDING'){
		//Please allow your camera on the address bar
		textCameraAllow.visible = true;
	}else if(con=='NONE'){
		//Fine;
	}else if(!supportCamera){
		textCameraNotSupport.visible = true;
		//Sorry, your browser does not support camera. Try photos
		closeWebcam();
	}else{
		//Sorry, we can't access to your camera. Try photos
		textNoCamera.visible = true;
		closeWebcam();
	}
}

/*!
 * 
 * RESIZE CAMERA - This is the function that runs to resize camera
 * 
 */
function resizeCamera(){
	$('#webCamera').attr('width',cameraW*scalePercent);
	$('#webCamera').attr('height',cameraH*scalePercent);
	
	$('#webCanvas').attr('width',cameraW);
	$('#webCanvas').attr('height',cameraH);
	
	//$('#videoHolder').css('left', Number((photoX - (cameraW/2))));
	//$('#videoHolder').css('top', Number((photoY - (cameraH/2))));
	
	var extraX = Number((photoX - (cameraW/2)) * scalePercent);
	var extraY = Number((photoY - (cameraH/2)) * scalePercent);
	
	$('#videoHolder').css('left', (offset.left/2) + extraX);
	$('#videoHolder').css('top', (offset.top/2) + extraY);
}

/*!
 * 
 * IOS UPLOAD IMAGE FIX - This is the function that runs for ios upload fix
 * 
 */
function detectVerticalSquash(img_ios) {
    var iw = img_ios.naturalWidth, ih = img_ios.naturalHeight;
    var canvas_ios = document.createElement('canvas');
    canvas_ios.width = 1;
    canvas_ios.height = ih;
    var ctx_ios = canvas_ios.getContext('2d');
    ctx_ios.drawImage(img_ios, 0, 0);
    var data = ctx_ios.getImageData(0, 0, 1, ih).data;
    var sy = 0;
    var ey = ih;
    var py = ih;
    while (py > sy) {
        var alpha = data[(py - 1) * 4 + 3];
        if (alpha === 0) {
            ey = py;
        } else {
            sy = py;
        }
        py = (ey + sy) >> 1;
    }
    var ratio = (py / ih);
    return (ratio===0)?1:ratio;
}

function drawImageIOSFix(ctx_ios, img_ios, sx, sy, sw, sh) {
    var vertSquashRatio = detectVerticalSquash(img_ios);
    ctx_ios.drawImage(img_ios, sx, sy, sw, sh / vertSquashRatio);
}

/*!
 * 
 * RETURN CAMERA SUPPORT - This is the function that runs for camera support checking
 * 
 */
function checkSupportCamera(){
	var isSupport = true;
	
	if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === ""){
		if(!supportCamera){
			alert('Sorry, your browser does not support camera.');
			isSupport = false;
		}
	}else if(location.protocol == 'http:'){
		alert('Camera access required to be served from a secure site HTTPS');
		isSupport = false;
	}else if(!supportCamera){
		alert('Sorry, your browser does not support camera.');
		isSupport = false;
	}
	
	return isSupport;
}

function checkFacingMode(){
	var supports = navigator.mediaDevices.getSupportedConstraints();
	if( supports['facingMode'] === true ) {
		navigator.mediaDevices
		.enumerateDevices()
		.then(gotDevices);
	}
}

function gotDevices(deviceInfos) {
	var videoType = 0;
	for (var i = 0; i !== deviceInfos.length; ++i) {
		var deviceInfo = deviceInfos[i];
		if (deviceInfo.kind === "videoinput") {
			videoType++;
		}
	}
	
	if(videoType > 1){
		faceingMode = true;	
	}
	
	if(faceingMode){
		btnSwitch.visible = true;
	}
}