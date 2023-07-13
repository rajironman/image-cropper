////   Just import all the requirements
////   call the createCropper() function with a callback function as first argument 
////   and optionally you can pass a image file or image url wih you want to crop as second argument 
////   after cropping and submitting the cropped image , the cropped image will be then passed to the callback funtion
////   ===========================================
////   createCropper(callbackFunction,[imageFile])
////   ===========================================
///// start of the block of codes for cropper ////
//////////////////////////////////////////////////
let cropper = ()=>{

// variable declaration

// Totally 3 canvas elements are used here
//    * cropperCnavas - to draw cropper 
//    * imageCanvas - to draw the input image 
//    * outputCanvas - to render and save the final cropped image
let cropperCanvas   
let cropperCanvasContext             
let imageCanvas     
let imageCanvasContext  


let dropImgFileButton
let cropperSection

let inputImageCanvas
let angle 
let horizontalFlip ,verticalFlip 
let isMouseDown,isTouchStarted
let startX,startY
let canvasWidth,canvasHeight
let isFirstTouchedInsideCropper
let isCursorInsideCropper ,isCursorInsideCropperFirst
let oldTouchX,oldTouchY,oldMouseX,oldMouseY
let isBottomRightResizerActive,isTopRightResizerActive,isTopLeftResizerActive,isBottomLeftResizerActive
let isBottomRightResizerActiveFirst,isTopRightResizerActiveFirst,isTopLeftResizerActiveFirst,isBottomLeftResizerActiveFirst
let isResizing
let rotateBtnImg
let isControlsEnabled

let callback

const maximumWidth = 2400
const maximumHeight = 2400
const minOutputImageHeight = 100
const maxOutputImageHeight = Infinity
let mouseRadius 
let touchRadius
let isFreeSelection = true
let outputImgRatio = 1.6
let isImageInCanvas 
let coords = {
    "x":20,
    "y":20,
    "w":200,
    "h":200
}

let cropperObj = {}
cropperObj.createCropper = function (callbackFunction,inputImage = null){

    inputImageCanvas = null
    outputImgFile = null
    angle = 0
    horizontalFlip = verticalFlip = false
    isMouseDown = isTouchStarted = false
    startX = startY = 0
    canvasWidth = canvasHeight = 0
    isFirstTouchedInsideCropper = false
    isCursorInsideCropper = isCursorInsideCropperFirst = false
    oldTouchX = oldTouchY = oldMouseX = oldMouseY = 0
    isBottomRightResizerActive = isTopRightResizerActive = isTopLeftResizerActive = isBottomLeftResizerActive = false
    isBottomRightResizerActiveFirst = isTopRightResizerActiveFirst = isTopLeftResizerActiveFirst = isBottomLeftResizerActiveFirst = false
    isResizing = false
    isImageInCanvas = false
    isControlsEnabled = true

    callback = callbackFunction
    
    cropperSection = document.createElement('section')
    document.body.append(cropperSection)
    cropperSection.id = 'cropper-section'
    cropperSection.innerHTML = "<div id='cropper-header'>"+
    "<div id='input-div'><label titlemsg='select the image you want to crop...' for='img-input' class='click-effect non-selectable left-icon-button click-effect '><img class='icon' src='requirements/img/plus.png'> <span class='text dont-hide'>select image</span><input id='img-input' type='file' accept='image/*'  ></label>"+
    "<label  class='non-selectable dragAndDrop' id='drop-img-file-button'><img style='width:30px;height:30px;margin-right:15px;' src='requirements/img/dragAndDrop.svg'> drag and drop the image</label></div>"+
    "<div id='controls-div'>"+
    "<label  class='left-img-button click-effect non-selectable'  titlemsg='rotate 90 degree' onclick='rotate90()' ><img  id='rotateBtnImg'  src='requirements/img/rotate.png' ></label>"+
    "<label  class='click-effect non-selectable' titlemsg='horizontal flip' onclick='flipHorizontally()'><img class='click-effect' src='requirements/img/hflip.png'></label>"+
    "<label  class='click-effect non-selectable' titlemsg='vertical flip' onclick='flipVertically()'><img src='requirements/img/vflip.png'></label>"+
    "<label  class='click-effect non-selectable' titlemsg='settings' onclick='document.querySelector(\"#set-img-ratio-overlay\").classList.add(\"show\")'><img src='requirements/img/settings.png'></label>"+
    "</div>"+
    "<div id='img-submit-div'><label class='left-icon-button non-selectable click-effect' titleMsg='close' id='cropper-close-button' onclick='finish()'><img class='icon' src='requirements/img/close.png'></label><label titleMsg='submit' id='img-submit-button' onclick='getImage()'  class='left-img-button click-effect non-selectable left-icon-button click-effect '><img class='icon' src='requirements/img/check.png'><span class='text' > submit </span></label></div>"+
    "</div>"+
    "<div id ='cropper-body'><canvas id='cropper-canvas' style='display:none'></canvas></div>"+
    "<div id='set-img-ratio-overlay' onclick=\"if(event.target === this || ( event.target.tagName.toLowerCase() == 'button'))this.classList.remove('show')\">"+
    "<div id='set-img-ratio-container'><h1>set aspect ratio</h1>"+
    "<button id='free-aspect-ratio-button' onclick='setImageRatio(0)'  class='click-effect'>free aspect ratio</button>"+
    "<h3>select ratio</h3>"+
    "<div><button onclick='setImageRatio(1)'>1 x 1</button>"+
    "<button onclick='setImageRatio(3/2)'>3 x 2</button>"+
    "<button onclick='setImageRatio(5/3)'>5 x 3</button>"+
    "<button onclick='setImageRatio(4/3)'>4 x 3</button>"+
    "<button onclick='setImageRatio(5/4)'>5 x 4</button>"+
    "<button onclick='setImageRatio(7/5)'>7 x 5</button>"+
    "<button onclick='setImageRatio(10/8)'>10 x 8</button>"+
    "<button onclick='setImageRatio(16/9)'>16 x 9</button>"+
    "<button onclick='setImageRatio(9/16)'>9 x 16</button>"+
    "<button onclick='setImageRatio(3/4)'>3 x 4</button>"+
    "<button onclick='setImageRatio(4/5)'>4 x 5</button></div>"+
    "<h3>custom ratio</h3>"+
    "<div id='custom-img-ratio-div'>"+
    "<label>width &nbsp;: <input type='number' id='set-image-width-input' placeholder='width'></label>x"+
    "<label>height : <input type='number' id='set-image-height-input' placeholder='height'></label>"+
    "<button onclick='setImageRatio(document.querySelector(\"#set-image-width-input\").value/document.querySelector(\"#set-image-height-input\").value)' style='background-color:grey;color:white' class='click-effect'>ok</button>"+
    "</div></div></div>"
    
    // To initialize some extra features like ripple effect on click , custom tooltip
    setup()

    cropperCanvas = document.getElementById('cropper-canvas')
    cropperCanvasContext = cropperCanvas.getContext("2d")

    imageCanvas = document.createElement("canvas")
    imageCanvasContext = imageCanvas.getContext("2d")

    dropImgFileButton = document.getElementById('drop-img-file-button')
    // rotate button is also used as an animation material to give the feel of something is being loaded
    rotateBtnImg = document.getElementById('rotateBtnImg')

    // overriding the onmousedown , ontouchstart , onmouseup , ontouchend functions 
    // with our own functions to handle the respetive events of mouse or touch screen
    cropperCanvas.onmousedown = canvasonmousedown
    cropperCanvas.ontouchstart = canvasontouchstart
    window.onmouseup = windowonmouseup
    window.ontouchend = windowontouchend

    // overriding the dragover , functions 
    // with our own functions to handle the respetive events to get the image ddragged & dropped into the button 
    // and pass the dropped image to the handleInputImgs function as argument
    dropImgFileButton.ondragover = draggingOver
    dropImgFileButton.ondragenter = draggingOver
    dropImgFileButton.ondragleave = notDraggingOver
    dropImgFileButton.ondragend = notDraggingOver
    dropImgFileButton.ondrop = function(e){
        e.preventDefault()
        e.stopPropagation()
        notDraggingOver(e)
        if(e.dataTransfer.files.length > 0)
        handleInputImg(e.dataTransfer.files[0])
    }

    // overriding the onchange method of input element to send the selected image to handleInputImgs function as argument 
    document.getElementById('img-input').onchange = function(){
        if(this.files && this.files[0])
        handleInputImg(this.files[0])
    }

    // passing the image passed in createCropper function's argument to the handleInputImgs function as argument, if one is passed
    if(inputImage && inputImage instanceof File)
    handleInputImg(inputImage)

    if(inputImage && typeof inputImage == 'string' )
    handleInputImg(inputImage)
}

// Every time the orientations changes , the image is redrawn in the imageCanvas using firstDraw function

// adding 90degree to the angle variable
cropperObj.rotate90 = function(){
    angle += 90
    angle %= 360
    firstDraw()
}

// if image is already rotated 90 or 270 degree then it is flipped vertically , else horizontally
cropperObj.flipHorizontally = function(){
    if(angle == 90 || angle == 270)
    verticalFlip = !verticalFlip // *** you know that flipping a image vertically twice result in the same image , that technique is used here 
    else horizontalFlip = !horizontalFlip // *** you know that flipping a image horizontally twice result in the same image , that technique is used here 
    firstDraw()
}

// if image is already rotated 90 or 270 degree then it is flipped horizontally , else vertically
cropperObj.flipVertically = function(){
    if(angle == 90 || angle == 270)
    horizontalFlip = !horizontalFlip // *** you know that flipping a image horizontally twice result in the same image , that technique is used here 
    else verticalFlip = !verticalFlip // *** you know that flipping a image vertically twice result in the same image , that technique is used here 
    firstDraw()
}

// resetting things after cropped image is made as output
cropperObj.finish = function (){
    try{
        if(cropperSection){
            cropperSection.parentElement.removeChild(cropperSection)
        }
        cropperCanvas = null
        cropperCanvasContext = null
        imageCanvas = null
        imageCanvasContext = null
        document.removeEventListener("keydown",keyDownEventHanlder)
        window.onresize = function(){}
        window.onmouseup = function(){}
        window.ontouchend = function(){}
    }
    catch(e){
        console.error(e)
    }    
}

// getting the final cropped image
cropperObj.getImage = function(){
    let outputCanvas = document.createElement('canvas')
    let outputCanvasContext = outputCanvas.getContext('2d')

    if(isImageInCanvas){

        outputCanvas.height = Math.min(coords.h,maxOutputImageHeight)
        outputCanvas.width = outputCanvas.height * (coords.w/coords.h)
        // the portion of the image defined by cropper is now taken and drawn into outputCanvas to get that portion as a new image
        let x = coords.x * (imageCanvas.width/canvasWidth)
        let y = coords.y * (imageCanvas.height/canvasHeight)
        let w = coords.w * (imageCanvas.width/canvasWidth)
        let h = coords.h * (imageCanvas.height/canvasHeight)
        outputCanvasContext.drawImage(imageCanvas,x,y,w,h,0,0,outputCanvas.width,outputCanvas.height)

        outputCanvas.toBlob(function(blob){
            var outputImgFile = new File([blob],'image.png',{type:'image/png'})

            // final image file is passed to the callback function given in the createCropper function
            callback(outputImgFile)

            finish()
        },'image/png')
    }
    else customAlert("முதலில் புகைப்படத்தை தேர்வு செய் ... \n\n First select the picture...")
}

// handling the event of dragging a file over the button 'drop-img-file-button'
function draggingOver(e){
    e.preventDefault()
    e.stopPropagation()
    dropImgFileButton.classList.add('draggingOver')
}
// handling the event of dragging a file away from the button without dropping it into the button after dragging over it 'drop-img-file-button'
function notDraggingOver(e){
    e.preventDefault()
    e.stopPropagation()
    dropImgFileButton.classList.remove('draggingOver')
}

// handling the files
cropperObj.handleInputImg = function(inputImg){
    var inputImgObject = new Image()
    inputImgObject.crossOrigin = 'anonymous'

    if(inputImg && inputImg instanceof File){
        var imageType = inputImg.type

        // accepting only certain type of images 
        if(!(imageType == 'image/jpeg' || imageType == 'image/png' || imageType == 'image/jpg')){
            customAlert("'png' , 'jpg' மற்றும் 'jpeg' வகை புகைப்படங்கள் மட்டுமே ஏற்றுக்கொள்ளப்படும்...\n\nOnly 'png' , 'jpg' and 'jpeg' type pictures are accepted")
            return
        }
    }

    // starting the rotating animation of rotate image button
    rotateBtnImg.classList.add('rotateInfinite')

    // new image objet to first load the image without correct orientation 

    // loading the image after it is loaded in inputImgObject into the inputImageCanvas after correcting the orientation using loadImage() function
    inputImgObject.onload = function(){
        if(URL.createObjectURL)
        URL.revokeObjectURL(this.src)
        if(this.height < minOutputImageHeight)
        {
            customAlert(" புகைப்படம் குறைந்தபட்சம் "+minOutputImageHeight+" உயரம் இருக்க வேண்டும் \n\nImage should be atleast "+minOutputImageHeight+" in height ")
            rotateBtnImg.classList.remove('rotateInfinite')
        }
        else
        loadImage(
            inputImg,function (i){
                inputImageCanvas = i
                angle = 0
                horizontalFlip = false
                verticalFlip = false
                firstDraw()
            },{orientation:true,maxWidth:maximumWidth,maxHeight:maximumHeight}
        )
    }
    inputImgObject.onerror = function(){
        customAlert("புகைப்படத்தை பதிவு ஏற்றுவதில் பிழை ஏற்பட்டது ! மீண்டும் முயற்சி செய்க ... \n\nNote :\n\nOnly Images from Sources which allows cross origin request can be loaded...")
        rotateBtnImg.classList.remove('rotateInfinite')
    }


    // loading the image into the inputImg object using either URL.createObjectURL() method or FileReader's readAsDataURL() method
    if(inputImg && inputImg instanceof File){
        if(URL.createObjectURL)
        inputImgObject.src = URL.createObjectURL(inputImg)
        else{
            var fr = new FileReader()
            fr.onload = function(){    
                inputImgObject.src = fr.result
            }
            fr.onerror = function(){
                customAlert("புகைப்படத்தை பதிவு ஏற்றுவதில் பிழை ஏற்பட்டது ! மீண்டும் முயற்சி செய்க ... \n\nNote :\n\nOnly Images from Sources which allows cross origin request can be loaded...")
                rotateBtnImg.classList.remove('rotateInfinite')
            }
    
            fr.readAsDataURL(inputImg)
        }
    }

    // passing the url if the url is given as argument
    if(inputImg &&  typeof inputImg == 'string' )
    inputImgObject.src = inputImg
}




function canvasonmousedown(e){
    isMouseDown = true
    startX = Math.floor(( e.clientX - cropperCanvas.offsetLeft )*(canvasWidth/cropperCanvas.clientWidth))
    startY = Math.floor(( e.clientY - cropperCanvas.offsetTop )*(canvasHeight/cropperCanvas.clientHeight))
    oldMouseX = startX
    oldMouseY = startY

    // checking whether the user is dragging any of the resizer disc of cropper and if true , then determining which resizer is being dragged
    cropperCanvasContext.beginPath()
    cropperCanvasContext.arc(coords.x+coords.w,coords.y+coords.h,mouseRadius,0,2*Math.PI)
    isBottomRightResizerActiveFirst = cropperCanvasContext.isPointInPath(startX,startY)

    cropperCanvasContext.beginPath()
    cropperCanvasContext.arc(coords.x,coords.y,mouseRadius,0,2*Math.PI)
    isTopLeftResizerActiveFirst = cropperCanvasContext.isPointInPath(startX,startY)

    cropperCanvasContext.beginPath()
    cropperCanvasContext.arc(coords.x+coords.w,coords.y,mouseRadius,0,2*Math.PI)
    isTopRightResizerActiveFirst = cropperCanvasContext.isPointInPath(startX,startY)

    cropperCanvasContext.beginPath()
    cropperCanvasContext.arc(coords.x,coords.y+coords.h,mouseRadius,0,2*Math.PI)
    isBottomLeftResizerActiveFirst = cropperCanvasContext.isPointInPath(startX,startY)

    // if the user is dragging any of the resizer disc , it is made as free end and it will move along with the cursor/pointer , the resizer disc diagonally opposite to it is set fixed 
    isResizing = false
    if(isBottomRightResizerActiveFirst){
        startX = coords.x
        startY = coords.y
        return
    }
    else if(isTopLeftResizerActiveFirst){
        startX = coords.x+coords.w
        startY = coords.y+coords.h
        return
    }
    else if(isTopRightResizerActiveFirst){
        startX = coords.x
        startY = coords.y+coords.h
        return
    }
    else if(isBottomLeftResizerActiveFirst){
        startX = coords.x+coords.w
        startY = coords.y
        return
    }
    else isResizing = false


    // checking whether the user is dragging the cropper
    cropperCanvasContext.beginPath()
    cropperCanvasContext.rect(coords.x,coords.y,coords.w,coords.h)
    isCursorInsideCropperFirst = cropperCanvasContext.isPointInPath(startX,startY)
    if(isCursorInsideCropperFirst)
    cropperCanvas.style.cursor="grabbing"
}
function canvasontouchstart(e){
    isTouchStarted = true
    startX = Math.floor(( e.touches[0].clientX - cropperCanvas.offsetLeft )*(canvasWidth/cropperCanvas.clientWidth))
    startY = Math.floor(( e.touches[0].clientY - cropperCanvas.offsetTop )*(canvasHeight/cropperCanvas.clientHeight))
    oldTouchX = startX
    oldTouchY = startY


    // checking whether the user is dragging any of the resizer disc of cropper and if true , then determining which resizer is being dragged
    cropperCanvasContext.beginPath()
    cropperCanvasContext.rect(coords.x+10,coords.y+10,coords.w+20,coords.h+20)
    isFirstTouchedInsideCropper = cropperCanvasContext.isPointInPath(startX,startY)
    
    cropperCanvasContext.beginPath()
    cropperCanvasContext.arc(coords.x+coords.w,coords.y+coords.h,touchRadius,0,2*Math.PI)
    isBottomRightResizerActiveFirst = cropperCanvasContext.isPointInPath(startX,startY)
    
    cropperCanvasContext.beginPath()
    cropperCanvasContext.arc(coords.x,coords.y,touchRadius,0,2*Math.PI)
    isTopLeftResizerActiveFirst = cropperCanvasContext.isPointInPath(startX,startY)

    cropperCanvasContext.beginPath()
    cropperCanvasContext.arc(coords.x+coords.w,coords.y,touchRadius,0,2*Math.PI)
    isTopRightResizerActiveFirst = cropperCanvasContext.isPointInPath(startX,startY)

    cropperCanvasContext.beginPath()
    cropperCanvasContext.arc(coords.x,coords.y+coords.h,touchRadius,0,2*Math.PI)
    isBottomLeftResizerActiveFirst = cropperCanvasContext.isPointInPath(startX,startY)

    // if the user is dragging any of the resizer disc , it is made as free end and it will move along with the cursor/pointer , the resizer disc diagonally opposite to it is set fixed 
    if(isBottomRightResizerActiveFirst){
        startX = coords.x
        startY = coords.y
    }
    else if(isTopLeftResizerActiveFirst){
        startX = coords.x+coords.w
        startY = coords.y+coords.h
    }
    else if(isTopRightResizerActiveFirst){
        startX = coords.x
        startY = coords.y+coords.h
    }
    else if(isBottomLeftResizerActiveFirst){
        startX = coords.x+coords.w
        startY = coords.y
    }
    else isResizing = false

    if(isBottomLeftResizerActiveFirst || isBottomRightResizerActiveFirst || isTopLeftResizerActiveFirst || isTopRightResizerActiveFirst){
        isCursorInsideCropperFirst=false
        isResizing = true
    }
}
function windowonmouseup(e){
    isMouseDown = false

    // Note : The dimesion of canvasWidth & cropperCanvas's width are in different scale   
    // Note : The dimesion of canvasHeight & cropperCanvas's height are in different scale   
    let x = Math.floor(( e.clientX - cropperCanvas.offsetLeft )*(canvasWidth/cropperCanvas.clientWidth))
    let y = Math.floor(( e.clientY - cropperCanvas.offsetTop )*(canvasHeight/cropperCanvas.clientHeight))

    // determining where the cursor is when he stopped pressing down the mouse to change its look acording to where it is hovering
    cropperCanvasContext.beginPath()
    cropperCanvasContext.rect(coords.x,coords.y,coords.w,coords.h)
    isCursorInsideCropper = cropperCanvasContext.isPointInPath(x,y)
    if(isCursorInsideCropper)cropperCanvas.style.cursor='grab'
    else cropperCanvas.style.cursor='crosshair'
}
function windowontouchend(){
    isTouchStarted = false
}

function moveEventHandler(e){
    e.preventDefault()
    if( e.type == "mousemove"){
        let x = Math.floor(( e.clientX - cropperCanvas.offsetLeft )*(canvasWidth/cropperCanvas.clientWidth))
        let y = Math.floor(( e.clientY - cropperCanvas.offsetTop )*(canvasHeight/cropperCanvas.clientHeight))
        let dx = x - oldMouseX
        let dy = y - oldMouseY
        oldMouseX = x
        oldMouseY = y


        cropperCanvasContext.beginPath()
        cropperCanvasContext.rect(coords.x,coords.y,coords.w,coords.h)
        isCursorInsideCropper = cropperCanvasContext.isPointInPath(x,y)

        if(isCursorInsideCropper && !isMouseDown)cropperCanvas.style.cursor='grab'
        if(!isCursorInsideCropper) {
            cropperCanvas.style.cursor='crosshair'
        }
        if(isCursorInsideCropperFirst && isMouseDown && !isResizing){
            cropperCanvas.style.cursor='grabbing'
            moveCropper(dx,dy)
            drawCropper()
        }
        if(!isCursorInsideCropperFirst && isMouseDown && !isResizing){
            updateCropperCoords(startX,startY,x,y)
            drawCropper()
        }

        cropperCanvasContext.beginPath()
        cropperCanvasContext.arc(coords.x+coords.w,coords.y+coords.h,mouseRadius,0,2*Math.PI)
        isBottomRightResizerActive = cropperCanvasContext.isPointInPath(x,y)
    
        cropperCanvasContext.beginPath()
        cropperCanvasContext.arc(coords.x,coords.y,mouseRadius,0,2*Math.PI)
        isTopLeftResizerActive = cropperCanvasContext.isPointInPath(x,y)

        cropperCanvasContext.beginPath()
        cropperCanvasContext.arc(coords.x+coords.w,coords.y,mouseRadius,0,2*Math.PI)
        isTopRightResizerActive = cropperCanvasContext.isPointInPath(x,y)

        cropperCanvasContext.beginPath()
        cropperCanvasContext.arc(coords.x,coords.y+coords.h,mouseRadius,0,2*Math.PI)
        isBottomLeftResizerActive = cropperCanvasContext.isPointInPath(x,y)
        
        if(isMouseDown && ( isTopRightResizerActiveFirst || isTopLeftResizerActiveFirst || isBottomRightResizerActiveFirst || isBottomLeftResizerActiveFirst) ){
            updateCropperCoords(startX,startY,x,y)
            drawCropper()
        }
        if((isTopRightResizerActive && !isMouseDown) || (isTopRightResizerActiveFirst && isMouseDown))cropperCanvas.style.cursor="ne-resize"
        if((isBottomLeftResizerActive && !isMouseDown) || (isBottomLeftResizerActiveFirst && isMouseDown))cropperCanvas.style.cursor="sw-resize"
        if((isBottomRightResizerActive && !isMouseDown) || (isBottomRightResizerActiveFirst && isMouseDown))cropperCanvas.style.cursor="se-resize"
        if((isTopLeftResizerActive && !isMouseDown) || (isTopLeftResizerActiveFirst && isMouseDown))cropperCanvas.style.cursor="nw-resize"

    }

    if(e.type == "touchmove" ){
        let x = Math.floor(( e.touches[0].clientX - cropperCanvas.offsetLeft )*(canvasWidth/cropperCanvas.clientWidth))
        let y = Math.floor(( e.touches[0].clientY - cropperCanvas.offsetTop )*(canvasHeight/cropperCanvas.clientHeight))
        let dx = x - oldTouchX
        let dy = y - oldTouchY 
        if(isFirstTouchedInsideCropper && isTouchStarted && !isResizing){
            moveCropper(dx,dy)
            drawCropper()
        }
        if(!isFirstTouchedInsideCropper && isTouchStarted && !isResizing){
            updateCropperCoords(startX,startY,x,y)
            drawCropper()
        }

        if( ( isBottomRightResizerActiveFirst || isTopLeftResizerActiveFirst || isTopRightResizerActiveFirst || isBottomLeftResizerActiveFirst  ) && isTouchStarted){
            updateCropperCoords(startX,startY,x,y)
            drawCropper()
        }
        
        oldTouchX = x
        oldTouchY = y
    }

}
function keyDownEventHanlder(e){
    let keyCode = e.keyCode || e.which

    if(!e.ctrlKey){
        if(keyCode == 189)updateCropperCoords(coords.x,coords.y,coords.w+coords.x-2,coords.h+coords.y-1)
        if(keyCode == 187)updateCropperCoords(coords.x,coords.y,coords.w+coords.x+2,coords.h+coords.y+1)
    }
    if(!e.ctrlKey){
        if(keyCode == 38)moveCropper(0,-5) //up
        if(keyCode == 40)moveCropper(0,5) //down
        if(keyCode == 37)moveCropper(-5,0) //left
        if(keyCode == 39)moveCropper(5,0) //right        
    }
    if(e.ctrlKey){
        if(keyCode == 38)moveCropper(0,-2) //up
        if(keyCode == 40)moveCropper(0,2) //down
        if(keyCode == 37)moveCropper(-2,0) //left
        if(keyCode == 39)moveCropper(2,0) //right        
    }

    if((keyCode > 36 && keyCode < 41) || keyCode == 187 || keyCode == 189)drawCropper()
}
function moveCropper(dx,dy){
    if( canvasWidth-coords.x-coords.w < dx )dx = canvasWidth-coords.x-coords.w
    if( canvasHeight-coords.y-coords.h < dy )dy = canvasHeight-coords.y-coords.h
    if( dx<0 && ( coords.x < -dx ) )dx = -coords.x
    if( dy<0 && ( coords.y < -dy ) )dy = -coords.y

    coords.x+=dx
    coords.y+=dy
}
function updateCropperCoords(startX,startY,x,y){
    let tx,ty,tw,th

    tx = startX>x?x:startX 
    ty = startY>y?y:startY 
    tw = Math.abs(x-startX)
    th = Math.abs(y-startY)

    if(tx+tw > canvasWidth)tw = canvasWidth - tx
    if(ty+th > canvasHeight)th = canvasHeight - ty
    if(tx < 0){
        tw = tw + tx
        tx = 0
    }
    if(ty < 0){
        th = th + ty
        ty = 0
    }

    coords.x = Math.floor(tx)
    coords.y = Math.floor(ty)
    coords.w = Math.floor(tw)
    coords.h = Math.floor(th)

    if(isFreeSelection)
    return

    let tr = (tw/th)
    if( tr > outputImgRatio ){
        coords.h = Math.floor(th)
        coords.w = th * outputImgRatio
        if(startX > x)coords.x = Math.ceil(tx+(tw-coords.w))
    }
    else if( tr < outputImgRatio) {
        coords.w = Math.floor(tw)
        coords.h = tw / outputImgRatio
        if(startY > y)coords.y = Math.ceil(ty+(th-coords.h))
    }
    else{
        coords.w = Math.floor(tw)
        coords.h = tw / outputImgRatio
        if(startY > y)coords.y = Math.ceil(ty+(th-coords.h))
    }
}

// drawing cropper at the position specified by coords object
function drawCropper(){

    // returning without drawing , if starting position is out of the canvas
    if(coords.x > canvasWidth || coords.y > canvasHeight)
    return

    // calculating baseUnit to specify the styles of the cropper instead of giving hardcoded values
    // Note : the cropper canvas may vary in dimension , so to make cropper size same for the user view irrespective of the cropper size baseUnit is used
    let baseUnit = Math.ceil( cropperCanvas.width  / (cropperCanvas.clientWidth ) )

    // mouseRadius or touchRadius Used to define the coverage area around the resizer discs so as to give better user experience
    // Note : without this user need to point their cursor or finger exactly at the resizer disc drawn at the vertices of the cropper rectangle
    mouseRadius = baseUnit*20
    touchRadius = baseUnit*20

    // setting styles of the cropper
    cropperCanvasContext.lineWidth = baseUnit+1
    cropperCanvasContext.strokeStyle = "lime"
    cropperCanvasContext.fillStyle = "rgba(0, 0, 0, 0.7)"
    cropperCanvasContext.lineJoin = "round"

    // clearing the canvas to redraw the cropper at new position
    cropperCanvasContext.beginPath()
    cropperCanvasContext.clearRect(0,0,cropperCanvas.width,cropperCanvas.height)
    cropperCanvasContext.fillRect(0,0,cropperCanvas.width,cropperCanvas.height)

    // drawing semi-transparent overlay of cropper to visualize the cropper better
    cropperCanvasContext.strokeRect(coords.x,coords.y,coords.w,coords.h)

    if(coords.w>=1 && coords.h>=1){ // condition to check whether the cropper is atleast 1unit in both width and height

        // setting the context's origin to (coords.x,coords.y) starting point of cropper to easily specify the position of the cropper gridlines
        cropperCanvasContext.clearRect(coords.x,coords.y,coords.w,coords.h)
        cropperCanvasContext.save()
        cropperCanvasContext.translate(coords.x,coords.y)
        cropperCanvasContext.setLineDash([Math.ceil(baseUnit*4),Math.ceil(baseUnit*4)])
        cropperCanvasContext.strokeStyle="rgba(255,255,255,1)"

        // drawing the grid lines of cropper
        cropperCanvasContext.beginPath()
        cropperCanvasContext.moveTo(coords.w / 3 , 0)
        cropperCanvasContext.lineTo(coords.w / 3 , coords.h)
        cropperCanvasContext.moveTo(2 * coords.w / 3 , 0)
        cropperCanvasContext.lineTo(2 * coords.w / 3 , coords.h)
        cropperCanvasContext.moveTo(0 , coords.h / 3)
        cropperCanvasContext.lineTo(coords.w , coords.h / 3)
        cropperCanvasContext.moveTo(0 , 2 * coords.h / 3)
        cropperCanvasContext.lineTo(coords.w , 2 * coords.h / 3)
        cropperCanvasContext.stroke()

        // restoring the context's origin to initial point of canvas
        cropperCanvasContext.restore()
    }


    // setting styles for cropper
    cropperCanvasContext.fillStyle = 'rgb(0, 255, 100)'
    cropperCanvasContext.strokeStyle = 'rgba(255,255,255,1)'
    let radius = baseUnit*4 + 2
    if(is_touch_enabled()){
        cropperCanvasContext.lineWidth = baseUnit*2 
    }

    // function to draw arc at the speified position
    function drawArAt(x,y){
        cropperCanvasContext.beginPath()
        cropperCanvasContext.arc(x,y,radius,0,2*Math.PI)
        cropperCanvasContext.fill()
        cropperCanvasContext.stroke()
    }
    // drawing the four resizer circlur discs at the vertices of the cropper rectangle
    drawArAt(coords.x+coords.w,coords.y+coords.h)
    drawArAt(coords.x,coords.y)
    drawArAt(coords.x+coords.w,coords.y)
    drawArAt(coords.x,coords.y+coords.h)
}

// drawing the image in imageCanvas and load it's output as background image of cropperCanvas
// Note : drawing the image in canvas itself will highly impact performance as we will then need to redraw it whnever we draw the cropper 
function firstDraw(){

    if(!inputImageCanvas || !isControlsEnabled)return
    
    img = inputImageCanvas

    disableControls()
    rotateBtnImg.classList.add('rotateInfinite')

    cropperCanvas.style.display="block"
    cropperCanvas.style.backgroundImage="none"

    // setting the imageCanvas and cropperCanvas dimensions according to the input image's dimension and angle of rotation
    // angle of rotation is used to determine whether the dimensions need to be swapped or not 
    imageCanvas.width = img.width
    imageCanvas.height = img.height
    if(angle == 90 || angle == 270){
        imageCanvas.width = img.height
        imageCanvas.height = img.width
    }
    cropperCanvas.width = imageCanvas.width
    cropperCanvas.height = imageCanvas.height

    // saving the context properties to make a savepoint that can be restored
    imageCanvasContext.save()

    let rootNode = document.querySelector('html')
    let cropperHeader = document.getElementById('cropper-header')
    let margin = 20
    let availableHeight =  rootNode.offsetHeight - cropperHeader.offsetHeight - 2*margin
    let availableWidth =  rootNode.offsetWidth - 2*margin
    
    // setting the dimension according to the available height and width if any of them exceeds corresponding dimension
    if(cropperCanvas.width > availableWidth || cropperCanvas.height > availableHeight){
        if(cropperCanvas.width / availableWidth >= cropperCanvas.height / availableHeight){
            cropperCanvas.width = availableWidth
            cropperCanvas.height = availableWidth * imageCanvas.height/imageCanvas.width
        }
        else{
            cropperCanvas.width = availableHeight * imageCanvas.width/imageCanvas.height
            cropperCanvas.height = availableHeight 
        }
    }
    canvasWidth = cropperCanvas.width
    canvasHeight = cropperCanvas.height

    // pre set up for rotating
    imageCanvasContext.rotate(angle*(Math.PI/180))
    if(angle == 90)
    imageCanvasContext.translate(0,-img.height)
    if(angle == 270)
    imageCanvasContext.translate(-img.width, 0)
    if(angle == 180)
    imageCanvasContext.translate(-imageCanvas.width,-imageCanvas.height)

    // pre set up for flipping horizontally
    if(horizontalFlip){
        imageCanvasContext.translate(img.width,0)
        imageCanvasContext.scale(-1,1)
    }

    // pre set up for flipping vertically
    if(verticalFlip)
    {
        imageCanvasContext.translate(0,img.height)
        imageCanvasContext.scale(1,-1)
    }

    imageCanvasContext.drawImage(img,0,0,img.width,img.height)

    // restoring to the savepoint
    imageCanvasContext.restore()

    // drawing the cropper at the middle of the canvas for the first time 
    if( canvasWidth/canvasHeight > outputImgRatio ){
        coords.h = canvasHeight / 2
        coords.w = coords.h * outputImgRatio
        coords.y = Math.ceil( ( canvasHeight - coords.h ) / 2  )
        coords.x = Math.ceil( ( canvasWidth - coords.w ) / 2  )
    }else{
        coords.w = canvasWidth / 2
        coords.h = coords.w / outputImgRatio

        coords.x = Math.ceil( ( canvasWidth - coords.w ) / 2  )
        coords.y = Math.ceil( ( canvasHeight - coords.h ) / 2  )
    }
    positionTheCanvas()


    // getting the image from the imageCanvas and setting it as the bakground for the cropperCanvas
    imageCanvas.toBlob(function(blob){
        var fr = new FileReader()
        fr.readAsDataURL(blob)
        fr.onload = function(){
            cropperCanvas.style.backgroundImage="url('"+this.result+"')"
            isImageInCanvas = true
            drawCropper()
            rotateBtnImg.classList.remove('rotateInfinite')
            enableControls()
        }
    },'image/png')

    // setting eventlisteners to handle the events - mousemove,touchmove,keydown & resize (window resizing)
    cropperSection.addEventListener("mousemove",moveEventHandler)
    cropperSection.addEventListener("touchmove",moveEventHandler)
    document.addEventListener("keydown",keyDownEventHanlder)
    window.onresize = positionTheCanvas

}

// enabling the cropper controls like rotate , vertical flip , horizontal flip
function enableControls(){
    isControlsEnabled = true
    var el = document.querySelectorAll('#canvas-controls label')
    for(var i = 0;i<el.length;i++)
    el[i].style.opacity = '1.0'
}

// disabling the controls 
function disableControls(){
    isControlsEnabled = false
    var el = document.querySelectorAll('#canvas-controls label:nth-of-type(n+2)')
    for(var i = 0;i<el.length;i++)
    el[i].style.opacity = '0.4'
}

// setting the output image ratio passed as argument
cropperObj.setImageRatio = function(ratio){
    if( ratio && ratio > 0 && ratio != Infinity){
        isFreeSelection = false
        outputImgRatio = ratio
    }
    else{
        isFreeSelection = true
        outputImgRatio = 1
    }
    firstDraw()
}



function positionTheCanvas(){
    var rootNode = document.querySelector('html')
    var cropperHeader = document.getElementById('cropper-header')
    var availableHeight =  rootNode.offsetHeight - cropperHeader.offsetHeight
    var availableWidth =  rootNode.offsetWidth
    var margin = 20
    if(canvasWidth/canvasHeight < availableWidth/availableHeight){
        cropperCanvas.style.height = (availableHeight-2*margin)+'px'
        cropperCanvas.style.width = 'auto'
        cropperCanvas.style.marginLeft = ( (availableWidth - cropperCanvas.offsetWidth)/2  )+ 'px'
        cropperCanvas.style.marginTop = margin+'px'
    }
    else{
        cropperCanvas.style.height = 'auto'
        cropperCanvas.style.width = (availableWidth-2*margin)+'px'
        cropperCanvas.style.marginLeft = margin+'px'
        cropperCanvas.style.marginTop = ( (availableHeight - cropperCanvas.offsetHeight)/2  )+ 'px'
    }
}





return cropperObj

}

function is_touch_enabled(){
    return ( 'ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
}

let cropperObj = cropper()
let createCropper = cropperObj.createCropper
let flipHorizontally = cropperObj.flipHorizontally
let flipVertically = cropperObj.flipVertically
let getImage = cropperObj.getImage
let finish = cropperObj.finish
let handleInputImg = cropperObj.handleInputImg
let rotate90 = cropperObj.rotate90
let setImageRatio = cropperObj.setImageRatio