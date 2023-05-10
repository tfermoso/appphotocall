////////////////////////////////////////////////////////////
// APP v3.4
////////////////////////////////////////////////////////////

/*!
 * 
 * APP SETTINGS CUSTOMIZATION START
 * 
 */
var photoW = 680; //photo container width
var photoH = 510; //photo container height
var photoFileName = 'funphoto' //image download name

var photoBg = '#000'; //photo and camera container bacgkround colour
var photoUploadSize = 'contain' //(contain, cover, original)
var transformToolFill = "yellow"; //transform tool guide fill colour
var transformToolLine = "blue"; //transform tool guide line colour
var transformToolWidth = 10; //transform tool guide width
var transparentHitArea = false; //sticker transparent hit area

var maxFrame = 5; //total stickers display
var enableWatermark = true; //add watermark to the picture

var shareEnable = false; //display share facebook button
var shareTitle = 'Have fun with Funphoto!';//facebook share title
var shareMessage = 'Check out my photo and start decorate your own photo with this app now!'; //facebook share message
var shareImageWidth = 300; //facebook share image width, height will maintain proportion to photo container height
var loaderBgColour = '#000'; //uploading background colour

var stickerLoaderText = 'Loading stickers... [NUMBER]'; //sticker loader display

/*!
 *
 * APP SETTINGS CUSTOMIZATION END
 *
 */

var sticker

/*!
 * 
 * PAGE BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildPageButton(){
	//main
	btnCamera.cursor = "pointer";
	btnCamera.addEventListener("click", function(evt) {
		if(checkSupportCamera()){
			closeWebcam();
			initWebcam();
			goPage('camera');
		}
	});
	
	btnUpload.cursor = "pointer";
	btnUpload.addEventListener("click", function(evt) {
		closeWebcam();
		$('#btn_hiddenCamera').click();
	});
	
	//camera
	btnStartCamera.cursor = "pointer";
	btnStartCamera.addEventListener("click", function(evt) {
		if(checkSupportCamera()){
			closeWebcam();
			initWebcam();
			goPage('camera');
		}
	});
	
	btnSwitch.cursor = "pointer";
	btnSwitch.addEventListener("click", function(evt) {
		shouldFaceUser = shouldFaceUser == true ? false : true;
		closeWebcam();
		initWebcam();
	});
	
	btnTakephoto.cursor = "pointer";
	btnTakephoto.addEventListener("click", function(evt) {
		snapCanvas();
	});
	
	btnCancel.cursor = "pointer";
	btnCancel.addEventListener("click", function(evt) {
		closeWebcam();
		goPage('main');
	});
	
	
	//transform
	btnZoomIn.cursor = "pointer";
	btnZoomIn.addEventListener("mousedown", function(evt) {
		startTransformAction("scaleUp");
	});
	btnZoomIn.addEventListener("pressup", function(evt) {
		stopTransformAction();
	});
	
	btnZoomOut.cursor = "pointer";
	btnZoomOut.addEventListener("mousedown", function(evt) {
		startTransformAction("scaleDown");
	});
	btnZoomOut.addEventListener("pressup", function(evt) {
		stopTransformAction();
	});
	
	btnDone.cursor = "pointer";
	btnDone.addEventListener("click", function(evt) {
		if(editStepNum==1){
			toggleStep(true);
		}else{
			toggleTransform(false);	
		}
	});
	
	btnRemove.cursor = "pointer";
	btnRemove.addEventListener("click", function(evt) {
		if(editStepNum==1){
			toggleStep(false);
		}else{
			transformObj('remove',true);
		}
	});
	
	btnRotateLeft.cursor = "pointer";
	btnRotateLeft.addEventListener("mousedown", function(evt) {
		startTransformAction('rotateL');
	});
	btnRotateLeft.addEventListener("pressup", function(evt) {
		stopTransformAction();
	});
	
	btnRotateRight.cursor = "pointer";
	btnRotateRight.addEventListener("mousedown", function(evt) {
		startTransformAction('rotateR');
	});
	btnRotateRight.addEventListener("pressup", function(evt) {
		stopTransformAction();
	});
	
	btnFlipX.cursor = "pointer";
	btnFlipX.addEventListener("click", function(evt) {
		transformObj('flipX',true);
	});
	
	btnFlipY.cursor = "pointer";
	btnFlipY.addEventListener("click", function(evt) {
		transformObj('flipY',true);
	});
	
	btnBringFront.cursor = "pointer";
	btnBringFront.addEventListener("click", function(evt) {
		transformObj('front',true);
	});
	
	btnBringBack.cursor = "pointer";
	btnBringBack.addEventListener("click", function(evt) {
		transformObj('back',true);
	});
	
	btnRemove.cursor = "pointer";
	btnRemove.addEventListener("click", function(evt) {
		transformObj('remove',true);
	});
	
	photoUploadBg.addEventListener("click", function(evt) {
		if(editStepNum!=1){
			toggleTransform(false);
		}
	});
	
	
	//stickers
	for(n=0;n<maxFrame;n++){
		$.frameObj['c'+n].cursor = "pointer";
		$.frameObj['c'+n].addEventListener("click", function(evt) {
			catNum = evt.target.cat;
			displayStickers();
		});
		
		$.frameObj['i'+n].cursor = "pointer";
		$.frameObj['i'+n].addEventListener("click", function(evt) {
			addStickerToCanvas(evt.target.id);
		});
	}
	
	btnStickerLeft.cursor = "pointer";
	btnStickerLeft.addEventListener("click", function(evt) {
		toggleStickers(false);
	});
	
	btnStickerRight.cursor = "pointer";
	btnStickerRight.addEventListener("click", function(evt) {
		toggleStickers(true);
	});
	
	btnStickerCatLeft.cursor = "pointer";
	btnStickerCatLeft.addEventListener("click", function(evt) {
		toggleStickersCat(false);
	});
	
	btnStickerCatRight.cursor = "pointer";
	btnStickerCatRight.addEventListener("click", function(evt) {
		toggleStickersCat(true);
	});
	
	btnBackSmall.cursor = "pointer";
	btnBackSmall.addEventListener("click", function(evt) {
		displayStickersCat();
	});
	
	//edit
	btnFinish.cursor = "pointer";
	btnFinish.addEventListener("click", function(evt) {
		goPage('result');
	});
	
	btnBack.cursor = "pointer";
	btnBack.addEventListener("click", function(evt) {
		toggleStep(false);
	});
	
	btnContinue.cursor = "pointer";
	btnContinue.addEventListener("click", function(evt) {
		toggleStep(true);
	});
	
	//complete
	btnDownload.cursor = "pointer";
	btnDownload.addEventListener("click", function(evt) {
		saveImagePhp();
	});
	
	btnStartOver.cursor = "pointer";
	btnStartOver.addEventListener("click", function(evt) {
		goPage('main');
	});
	
	btnFacebook.cursor = "pointer";
	btnFacebook.addEventListener("click", function(evt) {
		uploadImage('facebook');
	});
}

/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
function goPage(page){
	$('#btn_download').hide();
	
	toggleShareLoader(false);
	mainContainer.visible=false;
	editContainer.visible=false;
	editOptionContainer.visible=false;
	cameraOptionContainer.visible=false;
	resultOptionContainer.visible=false;
	
	switch(page){
		case 'main':
			imageUploaded = false;
			removeTarget('base');
			textNoCamera.visible = false;
			mainContainer.visible=true;
		break;
		
		case 'camera':
			toggleCameraReady();
			editContainer.visible=true;
			cameraOptionContainer.visible=true
		break;
		
		case 'edit':
			editStepNum = 0;
			toggleStep(true);
			editContainer.visible=true;
			editOptionContainer.visible=true;
		break;
		
		case 'result':
			editStepNum = 3;
			resultOptionContainer.visible=true;
			editContainer.visible=true;
			updateTransformEdit();
			toggleWatermark(true);
			
			if(isIOS){
				saveImage();
				$('#btn_download').show();
			}
		break;
	}
}

/*!
 * 
 * TOGGLE PHOTO EDIT STEP - This is the function that runs to toggle photo edit step
 * 
 */
var editStepNum = 0;
function toggleStep(con){
	if(con){
		editStepNum++;
	}else{
		editStepNum--;
	}
	
	titleEditPhoto.visible = false;
	titleAddSticker.visible = false;
	
	switch(editStepNum){
		case 0:
			goPage('main');
		break;
		
		case 1:
			targetTransform=uploadPhoto;
			toggleTransformGuide(true);
			toggleTransform(true);
			titleEditPhoto.visible = true;
		break;
		
		case 2:
			toggleTransform(false);
			displayStickersCat();
			if(category_arr.length == 1){
				displayStickers();
			}
			titleAddSticker.visible = true;
		break;	
	}
	updateTransformEdit();
}


/*!
 * 
 * TOGGLE TRANSFORM TOOLS - This is the function that runs to show/hide transform tools
 * 
 */
function toggleTransform(con){
	transformIconContainer.visible = con;
	btnBack.visible=true;
	btnContinue.visible=true;
	
	var transformTotal, transformTotal2;
	if(editStepNum == 1){
		btnBringBack.visible=false;
		btnBringFront.visible=false;
		transformTotal = 6;
		transformTotal2 = 2;
		$.transformObj = [btnZoomIn, btnZoomOut, btnRotateLeft, btnRotateRight,btnDone, btnRemove];
		$.transformObj2 = [btnFlipX, btnFlipY];
	}else{
		btnBringBack.visible=true;
		btnBringFront.visible=true;
		transformTotal = 6;
		transformTotal2 = 4;
		$.transformObj = [btnZoomIn, btnZoomOut, btnRotateLeft, btnRotateRight, btnBringBack, btnBringFront];
		$.transformObj2 = [btnFlipX, btnFlipY, btnDone, btnRemove];
	}
	
	var transformWidth = 0;
	var transformSpace = 8;
	var transformStartX = 0;
	
	for(n=0;n<transformTotal;n++){		
		if(n==0){
			transformWidth = ($.transformObj[n].image.naturalWidth * (transformTotal-1)) + (transformSpace * (transformTotal-1));
			transformStartX = (canvasW/2) - (transformWidth/2);	
		}
		
		$.transformObj[n].x = transformStartX;
		transformStartX += $.transformObj[n].image.naturalWidth + transformSpace;
	}
	
	transformWidth = 0;
	transformStartX = 0;

	for(n=0;n<transformTotal2;n++){		
		if(n==0){
			transformWidth = ($.transformObj2[n].image.naturalWidth * (transformTotal2-1)) + (transformSpace * (transformTotal2-1));
			transformStartX = (canvasW/2) - (transformWidth/2);	
		}
		$.transformObj2[n].x = transformStartX;
		transformStartX += $.transformObj2[n].image.naturalWidth + transformSpace;
	}

	if(con){
		bgSticker.visible = true;
		bgTransform.visible = true;
		stickerIconContainer.visible = false;
		btnBackSmall.visible = false;
		btnFinish.visible=false;
		
		btnBack.visible=false;
		btnContinue.visible=false;
	}else{
		bgTransform.visible = false;
		stickerIconContainer.visible = true;
		
		if(category_arr.length == 1){
			btnFinish.visible = true;
			btnBack.visible=true;
			btnContinue.visible=true;
		 }else{
			if(stickerOption==1){
				btnFinish.visible = true;
			}else if(stickerOption==2){
				btnBack.visible=false;
				btnContinue.visible=false;
				btnBackSmall.visible = true;
				btnBack.visible=false;
				btnContinue.visible=false;
			}
		 }
		toggleTransformGuide(false);
	}
}
 
 /*!
 * 
 * START STICKERS - This is the function that runs to build stickers option
 * 
 */
 var stickerOption = 0;
 var catNum = 0;
 var catPageNum = 0;
 var catPageMax = 0;
 
 var itemPageNum = 0;
 var itemPageMax = 0;
 var thumbList = 5;
 
 function buildStickers(){
	catPageNum=1;
	itemPageNum=1;
	catPageMax=category_arr.length/thumbList;
	
	if (String(catPageMax).indexOf('.') > -1){
		catPageMax=Math.floor(catPageMax)+1;
	}
	
	displayStickersCat();
 }
 
 /*!
 * 
 * HIDE STICKERS OPTION - This is the function that runs to hide stickers option
 * 
 */
 function hideStickers(){
	 stickerOption = 0;
	 
	 //disable all stickers
	 for(n=0;n<stickers_arr.length;n++){
		 $.iconStickersObj[stickers_arr[n].thumbID].visible = false;
	 }
	 
	 //disable all frame
	 for(n=0;n<maxFrame;n++){
		 $.frameObj['i'+n].visible=false;
		 $.frameObj['c'+n].visible=false;
	 }
	 
	 //disable arrow
	 btnStickerLeft.visible=false;
	 btnStickerRight.visible=false;
	 btnStickerCatLeft.visible=false;
	 btnStickerCatRight.visible=false;
	 btnBackSmall.visible=false;
	 btnFinish.visible=false;
 }
 
 /*!
 * 
 * STICKERS CATEGORY OPTION - This is the function that runs to display stickers by cateogry option
 * 
 */
 function toggleStickersCat(con){
	 if(con){
		 catPageNum++;
		 catPageNum = catPageNum > catPageMax ? catPageMax : catPageNum;
	 }else{
		 catPageNum--;
		 catPageNum = catPageNum < 1 ? 1 : catPageNum;
	 }
	 displayStickersCat();
 }
 
 function displayStickersCat(){
	 hideStickers();
	 stickerOption = 1;
	 
	 //reset items
	 itemPageNum = 1;
	 
	 //display category by page
	 var startIcon = thumbList * (catPageNum-1);
	 var startFrame = 0;
	 
	 for(n=startIcon;n<category_arr.length;n++){
		 if(startFrame < maxFrame){
			$.frameObj['c'+startFrame].cat = category_arr[n].cat;
			$.frameObj['c'+startFrame].visible = true;
			$.iconStickersObj[category_arr[n].thumbID].visible = true;
			$.iconStickersObj[category_arr[n].thumbID].x = $.frameObj['c'+startFrame].x;
			$.iconStickersObj[category_arr[n].thumbID].y = $.frameObj['c'+startFrame].y - 5;
			startFrame++;
		 }
	 }
	 
	 //arrow
	 if(catPageNum==1){
		btnStickerCatLeft.visible=false;
	 }else{
		btnStickerCatLeft.visible=true;
	 }
	 
	 if(catPageNum==catPageMax){
		btnStickerCatRight.visible=false;
	 }else{
		btnStickerCatRight.visible=true;
	 }
	 
	 btnFinish.visible = true;
	 btnBack.visible=true;
	 btnContinue.visible=true;
 }
 
 /*!
 * 
 * STICKERS OPTION - This is the function that runs to display stickers by cateogry list option
 * 
 */
 var item_arr = [];
 function toggleStickers(con){
	 if(con){
		 itemPageNum++;
		 itemPageNum = itemPageNum > itemPageMax ? itemPageMax : itemPageNum;
	 }else{
		 itemPageNum--;
		 itemPageNum = itemPageNum < 1 ? 1 : itemPageNum;
	 }
	 displayStickers();
 }
 
 function displayStickers(){
	 hideStickers();
	 item_arr = [];
	 stickerOption = 2;
	 
	 for(n=0;n<stickers_arr.length;n++){
		 if(catNum == stickers_arr[n].cat){
			item_arr.push(n);
		 }
	 }
	 
	itemPageMax=item_arr.length/thumbList;
	if (String(itemPageMax).indexOf('.') > -1){
		itemPageMax=Math.floor(itemPageMax)+1;
	}
	
	//display category by page
	 var startIcon = thumbList * (itemPageNum-1);
	 var startFrame = 0;
	 
	 for(n=startIcon;n<item_arr.length;n++){
		 if(startFrame < maxFrame){
			$.frameObj['i'+startFrame].id = item_arr[n];
			$.frameObj['i'+startFrame].visible = true;
			
			$.iconStickersObj[stickers_arr[item_arr[n]].thumbID].visible = true;
			$.iconStickersObj[stickers_arr[item_arr[n]].thumbID].x = $.frameObj['i'+startFrame].x;
			$.iconStickersObj[stickers_arr[item_arr[n]].thumbID].y = $.frameObj['i'+startFrame].y - 5;
			startFrame++;
		 }
	 }
	 
	 //arrow
	 if(itemPageNum==1){
		btnStickerLeft.visible=false;
	 }else{
		btnStickerLeft.visible=true;
	 }
	 
	 if(itemPageNum==itemPageMax){
		btnStickerRight.visible=false;
	 }else{
		btnStickerRight.visible=true;
	 }
	 
	 if(category_arr.length == 1){
		btnFinish.visible = true;
	 	btnBack.visible=true;
	 	btnContinue.visible=true;
	 }else{
	 	btnBackSmall.visible=true;
		 btnBack.visible=false;
		 btnContinue.visible=false;
	 }
 }
 
 /*!
 * 
 * ADD CAMERA/UPLOAD IMAGE - This is the function that runs to add image to canvas from camera or upload
 * 
 */
 var uploadPhoto;
 var transform_arr=[];
 
 function addPhotoToCanvas(img){
	removeTarget('base');
	
	uploadPhoto = new createjs.Bitmap(img);
	photoUploadContainer.addChild(uploadPhoto);
	centerReg(uploadPhoto);
	
	uploadPhoto.x = photoX;
	uploadPhoto.y = photoY;
	
	transform_arr.push(uploadPhoto);
	initTransform(uploadPhoto);
	stage.update();
	
	goPage('edit');
	updateTransformEdit();
}

/*!
 * 
 * ADD STICKER - This is the function that runs to add sticker to canvas
 * 
 */
function addStickerToCanvas(id){
	var newSticker = new createjs.Bitmap(stickerLoader.getResult(stickers_arr[id].imageID));
	photoUploadContainer.addChild(newSticker);
	
	centerReg(newSticker);
	if(transparentHitArea){
		createHitarea(newSticker);
	}
	newSticker.x=photoX;
	newSticker.y=photoY;
	
	transform_arr.push(newSticker);
	initTransform(newSticker);
}

/*!
 * 
 * REMOVE UPLOAD/CAMERA IMAGE - This is the function that runs to remove upload/camera image
 * 
 */
function removeTarget(con){
	var removeUpload=false;
	for(n=0;n<transform_arr.length;n++){
		if(transform_arr[n]==targetTransform){
			if(targetTransform==uploadPhoto){
				removeUpload=true;	
			}
			photoUploadContainer.removeChild(targetTransform);
			transform_arr.splice(n,1);
		}
	}
	if(removeUpload||con=="base"){
		toggleWatermark(false);
		removeAllSticker();
		uploadPhoto=null;
	}
	toggleTransform(false);
}

/*!
 * 
 * REMOVE ALL STICKERS - This is the function that runs to remove all stickers
 * 
 */
function removeAllSticker(){
	for(n=0;n<transform_arr.length;n++){
		photoUploadContainer.removeChild(transform_arr[n]);
	}
	transform_arr.length=0;
}

/*!
 * 
 * INIT TRANSFORM - This is the function that runs to initiate transform event to object
 * 
 */
function initTransform(obj){
	targetTransform=obj;
	toggleTransformEdit(obj,true);
	toggleTransformGuide(true);
}

/*!
 * 
 * UPDATE TRANSFORM OBJECTS - This is the function that runs to update transform objects
 * 
 */
function updateTransformEdit(){
	for(n=0;n<transform_arr.length;n++){
		toggleTransformEdit(transform_arr[n], false);
	}
	
	if(editStepNum==1&&uploadPhoto!=null){
		toggleTransformEdit(uploadPhoto, true);
	}else if(editStepNum==2){
		for(n=0;n<transform_arr.length;n++){
			toggleTransformEdit(transform_arr[n], true);
		}
		toggleTransformEdit(uploadPhoto, false);
	}
}

/*!
 * 
 * TOGGLE TRANSFORM EVENT - This is the function that runs to run/stop transform event
 * 
 */
function toggleTransformEdit(obj,con){
	if(con){
		obj.cursor = "pointer";
		obj.addEventListener("mousedown", handleObjDown);
		obj.addEventListener("pressmove", handleObjMove);
		obj.addEventListener("pressup", handleObjUp);	
	}else{
		obj.cursor = "";
		obj.removeEventListener("mousedown", handleObjDown);
		obj.removeEventListener("pressmove", handleObjMove);
		obj.removeEventListener("pressup", handleObjUp);	
	}
}

/*!
 * 
 * TRANSFORM EVENT HANDLE - This is the function that runs for transform event handle
 * 
 */
function handleObjDown(evt) {
    targetTransform=evt.target;
	toggleTransformGuide(true);
	var o = evt.target;
	o.offset = {x:o.x-(evt.stageX), y:o.y- (evt.stageY)};
}

function handleObjMove(evt) {
    var o = evt.target;
	o.x = (evt.stageX) + o.offset.x;
	o.y = (evt.stageY) + o.offset.y;
	updateTransformGuide();
	o.alpha=.8;
}

function handleObjUp(evt) {
    var o = evt.target;
	o.alpha=1;
}

/*!
 * 
 * TOGGLE TRANSFORM GUIDE - This is the function that runs to run/stop transform guide
 * 
 */
function toggleTransformGuide(con){
	if(con){
		if(targetTransform!=null){
			setupMultitouch();
			guideFill.visible=guideBorder.visible=tl.visible=tr.visible=bl.visible=br.visible=true;
			photoUploadContainer.setChildIndex(guideFill, 0);
			
			guideFill.graphics.clear();
			guideFill.graphics.beginFill("#000").drawRect(0, 0, targetTransform.image.naturalWidth, targetTransform.image.naturalHeight);
			
			guideBorder.graphics.clear();
			guideBorder.graphics.beginStroke(transformToolLine);
			guideBorder.graphics.setStrokeStyle(2);
			guideBorder.snapToPixel = true;
			guideBorder.graphics.drawRect(0,0,targetTransform.image.naturalWidth,targetTransform.image.naturalHeight);
			
			guideFill.regX=targetTransform.regX;
			guideFill.regY=targetTransform.regY;
			guideFill.x=targetTransform.x;
			guideFill.y=targetTransform.y;
			guideFill.scaleX=targetTransform.scaleX;
			guideFill.scaleY=targetTransform.scaleY;
			guideFill.rotation=targetTransform.rotation;
			
			guideBorder.regX=targetTransform.regX;
			guideBorder.regY=targetTransform.regY;
			guideBorder.x=targetTransform.x;
			guideBorder.y=targetTransform.y;
			guideBorder.scaleX=targetTransform.scaleX;
			guideBorder.scaleY=targetTransform.scaleY;
			guideBorder.rotation=targetTransform.rotation;
			
			tl.regX=(targetTransform.image.naturalWidth/2)+(transformToolWidth/2);
			tl.regY=(targetTransform.image.naturalHeight/2)+(transformToolWidth/2);
			tl.x=targetTransform.x;
			tl.y=targetTransform.y;
			tl.scaleX=targetTransform.scaleX;
			tl.scaleY=targetTransform.scaleY;
			tl.rotation=targetTransform.rotation;
			
			tr.regX=-(targetTransform.image.naturalWidth/2)+(transformToolWidth/2);
			tr.regY=(targetTransform.image.naturalHeight/2)+(transformToolWidth/2);
			tr.x=targetTransform.x;
			tr.y=targetTransform.y;
			tr.scaleX=targetTransform.scaleX;
			tr.scaleY=targetTransform.scaleY;
			tr.rotation=targetTransform.rotation;
			
			bl.regX=(targetTransform.image.naturalWidth/2)+(transformToolWidth/2);
			bl.regY=-(targetTransform.image.naturalHeight/2)+(transformToolWidth/2);
			bl.x=targetTransform.x;
			bl.y=targetTransform.y;
			bl.scaleX=targetTransform.scaleX;
			bl.scaleY=targetTransform.scaleY;
			bl.rotation=targetTransform.rotation;
			
			br.regX=-(targetTransform.image.naturalWidth/2)+(transformToolWidth/2);
			br.regY=-(targetTransform.image.naturalHeight/2)+(transformToolWidth/2);
			br.x=targetTransform.x;
			br.y=targetTransform.y;
			br.scaleX=targetTransform.scaleX;
			br.scaleY=targetTransform.scaleY;
			br.rotation=targetTransform.rotation;
			
			var childNum = photoUploadContainer.getChildIndex(targetTransform);
			photoUploadContainer.setChildIndex(guideFill, childNum-1);
			
			toggleTransform(true);
		}
	}else{
		removeMultitouch();
		targetTransform=null;
		guideFill.visible=guideBorder.visible=tl.visible=tr.visible=bl.visible=br.visible=false;
	}
}

/*!
 * 
 * UPDATE TRANSFORM GUIDE - This is the function that runs to update transform guide
 * 
 */
function updateTransformGuide(){
	if(targetTransform!=null){
		guideFill.x=guideBorder.x=targetTransform.x;
		guideFill.y=guideBorder.y=targetTransform.y;
		guideFill.scaleX=guideBorder.scaleX=targetTransform.scaleX;
		guideFill.scaleY=guideBorder.scaleY=targetTransform.scaleY;
		guideFill.rotation=guideBorder.rotation=targetTransform.rotation;
		
		
		for(n=0;n<transformToolGuide_arr.length;n++){
			transformToolGuide_arr[n].x=targetTransform.x;
			transformToolGuide_arr[n].y=targetTransform.y;
			transformToolGuide_arr[n].scaleX=targetTransform.scaleX;
			transformToolGuide_arr[n].scaleY=targetTransform.scaleY;
			transformToolGuide_arr[n].rotation=targetTransform.rotation;
		}
	}
}


/*!
 * 
 * TRANSFORM EVENT - This is the function that runs to loop transform action
 * 
 */
var transformInterval = null;
var transformTimer = 0;
var transformTimerMax = 300;
var transformTimerMin = 50;
var transformAction='';

function startTransformAction(action){
	stopTransformAction();
	transformAction=action;
	transformTimer=transformTimerMax;
	loopTransformAction();
}

function loopTransformAction(){
	clearInterval(transformInterval)
	transformInterval = setInterval(loopTransformAction, transformTimer)
	transformTimer-=100;
	transformTimer=transformTimer<transformTimerMin?transformTimerMin:transformTimer;
	
	if(transformAction=="rotateL"){
		transformObj('rotate',false);
	}else if(transformAction=="rotateR"){
		transformObj('rotate',true);
	}else if(transformAction=="scaleUp"){
		transformObj('scale',true);
	}else if(transformAction=="scaleDown"){
		transformObj('scale',false);
	}
}

function stopTransformAction(){
	clearInterval(transformInterval);
	transformAction=''
}

/*!
 * 
 * TRANSFORM ACTION - This is the function that runs to transform object
 * 
 */
function transformObj(cas,con){
	switch(cas){
		case 'rotate':
			var rotatePercent=3;
			if(con){
				targetTransform.rotation+=rotatePercent
			}else{
				targetTransform.rotation-=rotatePercent
			}
		break;
		
		case 'scale':
			var scalePercent=.05;
			var curScaleNum = Math.abs(targetTransform.scaleX);
			if(con){
				curScaleNum+=scalePercent
			}else{
				curScaleNum-=scalePercent;
				curScaleNum=curScaleNum<.1?.1:curScaleNum;
			}
			if(targetTransform.scaleX < 0){
				targetTransform.scaleX = 0-(curScaleNum);
			}else{
				targetTransform.scaleX = Math.abs(curScaleNum);
			}
			if(targetTransform.scaleY < 0){
				targetTransform.scaleY = 0-(curScaleNum);
			}else{
				targetTransform.scaleY = Math.abs(curScaleNum);
			}
		break;
		
		case 'flipX':
			if(targetTransform.scaleX < 0){
				targetTransform.scaleX = Math.abs(targetTransform.scaleX);
			}else{
				targetTransform.scaleX = 0-(targetTransform.scaleX);
			}
		break;
		
		case 'flipY':
			if(targetTransform.scaleY < 0){
				targetTransform.scaleY = Math.abs(targetTransform.scaleY);
			}else{
				targetTransform.scaleY = 0-(targetTransform.scaleY);
			}
		break;
		
		case 'back':
			var backIndex = photoUploadContainer.getChildIndex(targetTransform);
			if(backIndex-1 != 0){
				backIndex -= 1;
			}
			photoUploadContainer.setChildIndex( targetTransform, backIndex);
		break;
		
		case 'front':
			var frontIndex = photoUploadContainer.getChildIndex(targetTransform);
			frontIndex += 1;
			photoUploadContainer.setChildIndex( targetTransform, frontIndex);
		break;
		
		case 'remove':
			removeTarget();
		break;
	}
	updateTransformGuide()
}

function setupMultitouch(){
	stage.addEventListener("mousedown", handlerMultitouchMethod);
	stage.addEventListener("pressmove", handlerMultitouchMethod);
	stage.addEventListener("pressup", handlerMultitouchMethod);
}

function removeMultitouch(){
	mulitouch_arr.length = 0;
	stage.removeEventListener("mousedown", handlerMultitouchMethod);
	stage.removeEventListener("pressmove", handlerMultitouchMethod);
	stage.removeEventListener("pressup", handlerMultitouchMethod);
}

var mulitouch_arr = [];
function handlerMultitouchMethod(evt) {
	 switch (evt.type){
		 case 'mousedown':
		 	object_arr.x = targetTransform.x;
			object_arr.y = targetTransform.y;
		 	object_arr.rotation = targetTransform.rotation;
			object_arr.scaleX = targetTransform.scaleX;
			object_arr.scaleY = targetTransform.scaleY;
		 	updateTouchID(evt, 'add');
		 break;
			
		 case 'pressmove':
		 	updateTouchID(evt, 'update');
		 break;
		 
		 case 'pressup':
		 	updateTouchID(evt, 'remove');
		 break;
	 }
}

function updateTouchID(evt, con){
	var existNm = -1;
	for(n=0;n<mulitouch_arr.length; n++){
		if(evt.pointerID == mulitouch_arr[n].pointerID){
			existNm = n;	
		}
	}
	if(con == 'add'){
		if(existNm == -1){
			mulitouch_arr.push({pointerID:evt.pointerID, start:{x:evt.stageX, y:evt.stageY}, current:{x:evt.stageX, y:evt.stageY}, old:{x:evt.stageX, y:evt.stageY}});
		}
	}else if(con == 'update'){
		mulitouch_arr[existNm].current.x = evt.stageX;
		mulitouch_arr[existNm].current.y = evt.stageY;
	}else if(con == 'remove'){
		mulitouch_arr.splice(existNm,1);
	}
}

var object_arr = {x:0, y:0, rotation:0, scaleX:0, scaleY:0};
function adjustMultitouchTransform(){
	if(mulitouch_arr.length >= 2){
		//rotation
		var startAngle = Math.atan2((mulitouch_arr[0].start.y - mulitouch_arr[1].start.y), (mulitouch_arr[0].start.x - mulitouch_arr[1].start.x)) * (180 / Math.PI);
		var currentAngle = Math.atan2((mulitouch_arr[0].current.y - mulitouch_arr[1].current.y), (mulitouch_arr[0].current.x - mulitouch_arr[1].current.x)) * (180 / Math.PI);
		targetTransform.rotation = object_arr.rotation + (currentAngle - startAngle);
		
		//scale
		var scale = getDistance(mulitouch_arr[0].current, mulitouch_arr[1].current) / getDistance(mulitouch_arr[0].old, mulitouch_arr[1].old);
		var scaleX = 0;
		var scaleY = 0;
		if(targetTransform.scaleX > 0){
			scaleX = scale - 1;
		}else{
			scaleX = 1 - scale;
		}
		
		if(targetTransform.scaleY > 0){
			scaleY = scale - 1;
		}else{
			scaleY = 1 - scale;
		}
		targetTransform.scaleX = object_arr.scaleX + scaleX;
		targetTransform.scaleY = object_arr.scaleY + scaleY;
		
		//move
		var average = {x: 0, y: 0};
		average.x += (mulitouch_arr[0].current.x - mulitouch_arr[0].start.x);
		average.y += (mulitouch_arr[0].current.y - mulitouch_arr[0].start.y);

		targetTransform.x = object_arr.x + average.x;
		targetTransform.y = object_arr.y + average.y;
		
		updateTransformGuide();
	}
}

function getDistance(p1, p2) {
	var x = p2.x - p1.x;
	var y = p2.y - p1.y;
	return Math.sqrt((x * x) + (y * y));
};

function updateApp(){
	adjustMultitouchTransform();	
}

/*!
 * 
 * SAVE IMAGE - This is the function that runs to download image
 * 
 */
function saveImage(){
	photoContainer.cache(photoX-(photoW/2),photoY-(photoH/2),photoW,photoH);
	//var data = photoContainer.getCacheDataURL();
	var data = photoContainer.cacheCanvas.toDataURL();
	photoContainer.uncache();
	
	var downloadLink = document.getElementById('btn_download');
	downloadLink.href = data;
	downloadLink.download = photoFileName+'.jpg';
	
	if(!isIOS){
		$("#btn_download").trigger('click');
	}else{
		downloadLink.target = '_blank';
	}
}

function toggleWatermark(con){
	if(con && enableWatermark){
		photoContainer.addChild(watermark);
		watermark.x = canvasW/100 * 85;
		watermark.y = canvasH/100 * 57;
	}else{
		photoContainer.removeChild(watermark);	
	}
}

function saveImagePhp(){
	photoContainer.cache(photoX-(photoW/2),photoY-(photoH/2),photoW,photoH);
	//var data = photoContainer.getCacheDataURL();
	var data = photoContainer.cacheCanvas.toDataURL();
	
	photoContainer.uncache();
	//data = data.substr(data.indexOf(',') + 1).toString();
         
	var dataInput = document.createElement("input") ;
	dataInput.setAttribute("name", 'imgdata') ;
	dataInput.setAttribute("value", data);
	dataInput.setAttribute("type", "hidden");
	 
	var nameInput = document.createElement("input") ;
	nameInput.setAttribute("name", 'name') ;
	nameInput.setAttribute("value", photoFileName + '.png');
	
	var myForm = document.createElement("form");
	myForm.method = 'post';
	myForm.action = 'save.php';
	myForm.target = '_blank';
	myForm.appendChild(dataInput);
	myForm.appendChild(nameInput);
	 
	document.body.appendChild(myForm);
	myForm.submit();
	document.body.removeChild(myForm);
}

function downloadImage(data, filename) {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}


/*!
 * 
 * LOAD XML - This is the function that runs to load xml
 * 
 */
var category_arr = [];
var stickers_arr = [];
function loadXML(src){
	stickerLoaderTxt.visible = true;
	btnCamera.visible = false;
	btnUpload.visible = false;
	
	stickerLoaderTxt.text = stickerLoaderText.replace('[NUMBER]', '0%');
	
	$.ajax({
       url: src,
       type: "GET",
       dataType: "xml",
       success: function (result) {
		    var catCountNum = 0;
			stickersFest=[];
			
            $(result).find('category').each(function(){
				var itemCountNum = 0;
				var catID = 'iconCat'+catCountNum+'Thumb'+(Number($(this).attr('thumbnail')));
				category_arr.push({cat:catCountNum, thumbID:catID});
				
				var catItem = $(this).find('item').each(function(){
					var itemThumbID = 'iconCat'+catCountNum+'Thumb'+itemCountNum;
					var itemImageID = 'iconCat'+catCountNum+'Image'+itemCountNum;
					stickers_arr.push({cat:catCountNum, thumbID:itemThumbID,imageID:itemImageID});
					stickersFest.push({src:$(this).find('thumbnail').text(), id:itemThumbID});
					stickersFest.push({src:$(this).find('image').text(), id:itemImageID});
					itemCountNum++;
				});
				catCountNum++;
			});
			loadStickers();
       }
	});
}

/*!
 * 
 * PRELOAD STICKERS - This is the function that runs to preload stickers assets
 * 
 */
var stickerLoader, stickersFest;
function loadStickers(){
	stickerLoader = new createjs.LoadQueue(false);
	stickerLoader.addEventListener("complete", handleStickersComplete);
	stickerLoader.loadManifest(stickersFest);
	stickerLoader.on("progress", handleStickerProgress, this);
}

function handleStickerProgress(){
	stickerLoaderTxt.text = stickerLoaderText.replace('[NUMBER]', Math.round(stickerLoader.progress/1*98)+'%');	
}

function handleStickersComplete() {
	stickerLoaderTxt.visible = false;
	/*if(!isIOS){
		btnCamera.visible=true;
	}*/
	btnCamera.visible = true;
	btnUpload.visible = true;
	buildCanvasStickers();
	buildStickers();
};


/*!
 * 
 * UPLOAD IMAGE - This is the function that runs to upload your photo
 * 
 */
var imageUploaded = false;
var imagePath = '';
var shareScalePercent = 1;
var sharePhotoW;
var sharePhotoH;

function uploadImage(action){
	if(imageUploaded){
		share(action);
	}else{
		toggleShareLoader(true);
		shareContainer.removeAllChildren();
		
		photoContainer.mask = null;
		photoContainer.cache(photoX-(photoW/2),photoY-(photoH/2),photoW,photoH);
		var sharePhoto = photoContainer.clone(true);
		photoContainer.uncache();
		photoContainer.mask = maskPhoto;
		shareContainer.visible=false;
		shareContainer.addChild(sharePhoto);
		shareScalePercent = shareImageWidth/photoW;
		sharePhoto.scaleX = sharePhoto.scaleY = shareScalePercent;
		
		sharePhotoW = photoW*shareScalePercent;
		sharePhotoH = photoH*shareScalePercent;
		shareContainer.cache((photoX-(photoW/2))*shareScalePercent,(photoY-(photoH/2))*shareScalePercent,sharePhotoW,sharePhotoH);
		//var data = photoContainer.getCacheDataURL();
		var data = shareContainer.cacheCanvas.toDataURL();
		shareContainer.uncache();
		
		$.ajax({
			type: "POST",
			url: "upload.php",
			data: {img:data}
		}).done(function(o) {
			toggleShareLoader(false);
			imagePath = jQuery.parseJSON(o);
			imageUploaded = true;
			share(action);
		});
	}
}

function toggleShareLoader(con){
	loaderContainer.visible=con;
}

/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	var title = shareTitle;
	var text = shareMessage;
	var shareurl = '';
	
	if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+imagePath+'&width='+sharePhotoW+'&height='+sharePhotoH);
	}
	
	window.open(shareurl);
}