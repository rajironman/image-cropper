



///// start of the block of codes for cropper //////
//////////////////////////////////////////////////

{

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

const maximumWidth = 3000
const maximumHeight = 3000
const minOutputImageHeight = 150
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


function createCropper(callbackFunction,inputImage = null){

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
    "<label  class='left-img-button click-effect non-selectable'  titlemsg='rotate 90 degree' onclick='rotate90()' ><img  id='rotateBtnImg'  src='requirements/img/rotate.svg' ></label>"+
    "<label  class='click-effect non-selectable' titlemsg='horizontal flip' onclick='flipHorizontally()'><img class='click-effect' src='requirements/img/hflip.svg'></label>"+
    "<label  class='click-effect non-selectable' titlemsg='vertical flip' onclick='flipVertically()'><img src='requirements/img/vflip.svg'></label>"+
    "<label id='set-img-ratio-button' titlemsg='set image size...' class='click-effect non-selectable left-icon-button click-effect ' onclick='document.querySelector(\"#set-img-ratio-overlay\").classList.add(\"show\")'><img src='requirements/img/crop.png' class='icon' />  <span class='text dont-hide'>Set ratio</span></label>"+
    "</div>"+
    "<div id='img-submit-div'><label class='left-icon-button' onclick='finish()'><span class='text dont-hide'>close</span></label><label id='img-submit-button' onclick='getImage()'  class='left-img-button click-effect non-selectable left-icon-button click-effect '><img class='icon' src='requirements/img/check.png'><span class='text' > submit </span></label></div>"+
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
    "<label>height :<input type='number' id='set-image-height-input' placeholder='height'></label>"+
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
function rotate90(){
    angle+=90
    firstDraw()
}

// if image is already rotated 90 or 270 degree then it is flipped vertically , else horizontally
function flipHorizontally(){
    if(angle == 90 || angle == 270)
    verticalFlip = !verticalFlip // *** you know that flipping a image vertically twice result in the same image , that technique is used here 
    else horizontalFlip = !horizontalFlip // *** you know that flipping a image horizontally twice result in the same image , that technique is used here 
    firstDraw()
}

// if image is already rotated 90 or 270 degree then it is flipped horizontally , else vertically
function flipVertically(){
    if(angle == 90 || angle == 270)
    horizontalFlip = !horizontalFlip // *** you know that flipping a image horizontally twice result in the same image , that technique is used here 
    else verticalFlip = !verticalFlip // *** you know that flipping a image vertically twice result in the same image , that technique is used here 
    firstDraw()
}

// resetting things after cropped image is made as output
function finish(){
    try{
        if(cropperSection){
            cropperSection.parentElement.removeChild(cropperSection)
        }
        cropperCanvas = null
        cropperCanvasContext = null
        imageCanvas = null
        imageCanvasContext = null
        document.removeEventListener("keydown",ev2)
        window.onresize = function(){}
        window.onmouseup = function(){}
        window.ontouchend = function(){}
    }
    catch(e){
        console.error(e)
    }    
}

// getting the final cropped image
function getImage(){
    let outputCanvas = document.createElement('canvas')
    let outputCanvasContext = outputCanvas.getContext('2d')

    if(isImageInCanvas){

        outputCanvas.height = Math.min(coords.h,maxOutputImageHeight)
        outputCanvas.width = outputCanvas.height * (coords.w/coords.h)
        // the portion of the image defined by cropper is now taken and drawn into outputCanvas to get that portion as a new image
        outputCanvasContext.drawImage(imageCanvas,coords.x,coords.y,coords.w,coords.h,0,0,outputCanvas.width,outputCanvas.height)

        outputCanvas.toBlob(function(blob){
            var outputImgFile = new File([blob],'image.png',{type:'image/png'})

            // final image file is passed to the callback function given in the createCropper function
            callback(outputImgFile)

            finish()
        },'image/png')
    }
    else alert("முதலில் புகைப்படத்தை தேர்வு செய் ... ")
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
function handleInputImg(inputImg){
    var inputImgObject = new Image()

    if(inputImg && inputImg instanceof File){
        var imageType = inputImg.type

        // accepting only certain type of images 
        if(!(imageType == 'image/jpeg' || imageType == 'image/png' || imageType == 'image/jpg')){
            alert("'png' , 'jpg' மற்றும் 'jpeg' வகை புகைப்படங்கள் மட்டுமே ஏற்றுக்கொள்ளப்படும்...")
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
            alert(" புகைப்படம் குறைந்தபட்சம் "+minOutputImageHeight*1.6+"x"+minOutputImageHeight+" அளவில் இருக்க வேண்டும் ")
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
        alert('புகைப்படத்தை பதிவு ஏற்றுவதில் பிழை ஏற்பட்டது ! மீண்டும் முயற்சி செய்க... ')
        rotateBtnImg.classList.remove('rotateInfinite')
    }


    // loading the image into the inputImg object using either URL.createObjectURL() method or FileReader's readAsDataURL() method
    if(inputImg && inputImg instanceof File)
    if(URL.createObjectURL)
    inputImgObject.src = URL.createObjectURL(inputImg)
    else{    
        var fr = new FileReader()
        fr.onload = function(){    
            inputImgObject.src = fr.result
        }
        fr.onerror = function(){
            alert("புகைப்படத்தை பதிவு ஏற்றுவதில் பிழை ஏற்பட்டது ! மீண்டும் முயற்சி செய்க ... ")
            rotateBtnImg.classList.remove('rotateInfinite')
        }    

        fr.readAsDataURL(inputImg)
    }

    if(inputImg &&  typeof inputImg == 'string' )
    inputImgObject.src = inputImg
}




function canvasonmousedown(e){
    isMouseDown = true
    startX = Math.floor(( e.clientX - cropperCanvas.offsetLeft )*(canvasWidth/cropperCanvas.clientWidth))
    startY = Math.floor(( e.clientY - cropperCanvas.offsetTop )*(canvasHeight/cropperCanvas.clientHeight))
    oldMouseX = startX
    oldMouseY = startY

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

    if(isBottomRightResizerActiveFirst){
        isCursorInsideCropperFirst=false
        isResizing = true
        startX = coords.x
        startY = coords.y
        return
    }
    else if(isTopLeftResizerActiveFirst){
        isCursorInsideCropperFirst=false
        isResizing = true
        startX = coords.x+coords.w
        startY = coords.y+coords.h
        return
    }
    else if(isTopRightResizerActiveFirst){
        isCursorInsideCropperFirst=false
        isResizing = true
        startX = coords.x
        startY = coords.y+coords.h
        return
    }
    else if(isBottomLeftResizerActiveFirst){
        isCursorInsideCropperFirst=false
        isResizing = true
        startX = coords.x+coords.w
        startY = coords.y
        return
    }
    else isResizing = false

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

    let x = Math.floor(( e.clientX - cropperCanvas.offsetLeft )*(canvasWidth/cropperCanvas.clientWidth))
    let y = Math.floor(( e.clientY - cropperCanvas.offsetTop )*(canvasHeight/cropperCanvas.clientHeight))

    cropperCanvasContext.beginPath()
    cropperCanvasContext.rect(coords.x,coords.y,coords.w,coords.h)
    isCursorInsideCropper = cropperCanvasContext.isPointInPath(x,y)
    if(isCursorInsideCropper)cropperCanvas.style.cursor='grab'
    else cropperCanvas.style.cursor='crosshair'

}
function windowontouchend(){
    isTouchStarted = false
}

function ev(e){
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
function ev2(e){
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
    if(tx < 0)tw = tw + tx
    if(ty < 0)th = th + ty

    if(ty < 0)ty = 0
    if(tx < 0)tx = 0

    coords.x = Math.floor(tx)
    coords.y = Math.floor(ty)
    coords.w = Math.floor(tw)
    coords.h = Math.floor(th)

    if(isFreeSelection)
    {
        return
    }

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

function drawCropper(){


    if(coords.x > canvasWidth || coords.y > canvasHeight)
    return

    let lw = Math.ceil( Math.max( cropperCanvas.width,cropperCanvas.height ) / 1000 )

    mouseRadius = lw*20
    touchRadius = lw*40

    cropperCanvasContext.lineWidth=lw+1
    cropperCanvasContext.strokeStyle="lime"
    cropperCanvasContext.fillStyle="rgba(0, 0, 0, 0.7)"
    cropperCanvasContext.lineJoin="round"

    cropperCanvasContext.beginPath()
    cropperCanvasContext.clearRect(0,0,cropperCanvas.width,cropperCanvas.height)
    cropperCanvasContext.fillRect(0,0,cropperCanvas.width,cropperCanvas.height)

    cropperCanvasContext.strokeRect(coords.x,coords.y,coords.w,coords.h)
    if(coords.w>=1 && coords.h>=1){
        cropperCanvasContext.lineWidth=lw

        cropperCanvasContext.clearRect(coords.x,coords.y,coords.w,coords.h)
        cropperCanvasContext.save()
        cropperCanvasContext.translate(coords.x,coords.y)
        cropperCanvasContext.setLineDash([Math.ceil(lw*4),Math.ceil(lw*4)])
        cropperCanvasContext.strokeStyle="rgba(255,255,255,1)"
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


        cropperCanvasContext.restore()
    }


    cropperCanvasContext.lineWidth = lw + 2
    cropperCanvasContext.fillStyle = 'rgb(0, 255, 100)'
    cropperCanvasContext.strokeStyle = 'rgba(255,255,255,1)'

    let r = lw*5
    if(is_touch_enabled()){
        r = Math.max(lw*5 , mouseRadius/4)
        cropperCanvasContext.lineWidth = lw*2
    }

    cropperCanvasContext.beginPath()
    cropperCanvasContext.arc(coords.x+coords.w,coords.y+coords.h,r,0,2*Math.PI)
    cropperCanvasContext.fill()
    cropperCanvasContext.stroke()

    cropperCanvasContext.beginPath()
    cropperCanvasContext.arc(coords.x,coords.y,r,0,2*Math.PI)
    cropperCanvasContext.fill()
    cropperCanvasContext.stroke()

    cropperCanvasContext.beginPath()
    cropperCanvasContext.arc(coords.x+coords.w,coords.y,r,0,2*Math.PI)
    cropperCanvasContext.fill()
    cropperCanvasContext.stroke()

    cropperCanvasContext.beginPath()
    cropperCanvasContext.arc(coords.x,coords.y+coords.h,r,0,2*Math.PI)
    cropperCanvasContext.fill()
    cropperCanvasContext.stroke()

}

function firstDraw(){

    if(!inputImageCanvas || !isControlsEnabled)return
    
    img = inputImageCanvas
    angle = angle%360

    disableControls()
    rotateBtnImg.classList.add('rotateInfinite')

    cropperCanvas.style.display="block"
    cropperCanvas.style.backgroundImage="none"


    imageCanvas.width = img.width
    imageCanvas.height = img.height
    cropperCanvas.width = imageCanvas.width
    cropperCanvas.height = imageCanvas.height

    if(angle == 90 || angle == 270){
        imageCanvas.width = img.height
        imageCanvas.height = img.width
        cropperCanvas.width = img.height
        cropperCanvas.height = img.width
    }

    imageCanvasContext.save()
    canvasWidth = imageCanvas.width
    canvasHeight = imageCanvas.height


    imageCanvasContext.rotate(angle*(Math.PI/180))
    if(angle == 90)
    imageCanvasContext.translate(0,-img.height)
    if(angle == 270)
    imageCanvasContext.translate(-img.width, 0)
    if(angle == 180)
    imageCanvasContext.translate(-imageCanvas.width,-imageCanvas.height)

    if(horizontalFlip){
        imageCanvasContext.translate(img.width,0)
        imageCanvasContext.scale(-1,1)
    }
    if(verticalFlip)
    {
        imageCanvasContext.translate(0,img.height)
        imageCanvasContext.scale(1,-1)
    }

    imageCanvasContext.drawImage(img,0,0,img.width,img.height)
    imageCanvasContext.restore()

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



    cropperSection.addEventListener("mousemove",ev)
    cropperSection.addEventListener("touchmove",ev)
    document.addEventListener("keydown",ev2)
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
function setImageRatio(ratio){
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
    var availableHeight =  rootNode.clientHeight - cropperHeader.clientHeight
    var availableWidth =  rootNode.clientWidth
    var margin = 40
    if(canvasWidth/canvasHeight < availableWidth/availableHeight){
        cropperCanvas.style.height = (availableHeight-margin)+'px'
        cropperCanvas.style.width = 'auto'
        cropperCanvas.style.marginLeft = ( (availableWidth - cropperCanvas.clientWidth)/2  )+ 'px'
        cropperCanvas.style.marginTop = margin/2+'px'
    }
    else{
        cropperCanvas.style.height = 'auto'
        cropperCanvas.style.width = (availableWidth-margin)+'px'
        cropperCanvas.style.marginLeft = margin/2+'px'
        cropperCanvas.style.marginTop = ( (availableHeight - cropperCanvas.clientHeight)/2  )+ 'px'
    }
}


function is_touch_enabled(){
    return ( 'ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
}



}
