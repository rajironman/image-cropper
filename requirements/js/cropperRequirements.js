
//// start of the block of codes for loadImage /////////////////////
//// loadImage helps to load the image in the correct orientation //
////////////////////////////////////////////////////////////////////
{
    let isCorrectlyOrientated , orientationCropBug

    // black+white 3x2 JPEG, with the following meta information set:
    // - EXIF Orientation: 6 (Rotated 90° CCW)
    // Image data layout (B=black, F=white):
    // BFF
    // BBB

    let testImageURL =
    'data:image/jpeg;base64,/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAA' +
    'AAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBA' +
    'QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE' +
    'BAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAIAAwMBEQACEQEDEQH/x' +
    'ABRAAEAAAAAAAAAAAAAAAAAAAAKEAEBAQADAQEAAAAAAAAAAAAGBQQDCAkCBwEBAAAAAAA' +
    'AAAAAAAAAAAAAABEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AG8T9NfSMEVMhQ' +
    'voP3fFiRZ+MTHDifa/95OFSZU5OzRzxkyejv8ciEfhSceSXGjS8eSdLnZc2HDm4M3BxcXw' +
    'H/9k='
    let timg = document.createElement('img')
    timg.onload = function () {
        isCorrectlyOrientated = timg.width === 2 && timg.height === 3
        orientationCropBug
        if (isCorrectlyOrientated) {
            let testCanvas = document.createElement("canvas");
            canvasWidth = canvasWidth = 1;
            let testCanvasCtx = testCanvas.getContext('2d')
            testCanvasCtx.drawImage(timg, 1, 1, 1, 1, 0, 0, 1, 1)
            orientationCropBug =
            testCanvasCtx.getImageData(0, 0, 1, 1).data.toString() !== '255,255,255,255'
        }
    }
    timg.src = testImageURL

    let transformCodes = [{'a':0,'h':0,'v':0},{'a':0,'h':0,'v':0},{'a':0,'h':1,'v':0},{'a':180,'h':0,'v':0},{'a':0,'h':0,'v':1},{'a':90,'h':0,'v':1},{'a':90,'h':0,'v':0},{'a':90,'h':1,'v':0},{'a':270,'h':0,'v':0}]
    let reverseTransformCodes = [{a:0,h:0,v:0},{a:0,h:0,v:0},{a:0,h:1,v:0},{a:180,h:0,v:0},{a:0,h:0,v:1},{a:270,h:1,v:0},{a:270,h:0,v:0},{a:270,h:0,v:1},{a:90,h:0,v:0}]

    function loadImage(inputImg,callback,ob){
        const maxWidth = ob.maxWidth
        const maxHeight = ob.maxHeight
        var exifOrientation = 1
        EXIF.getData(inputImg,function(){
            exifOrientation = parseInt(EXIF.getTag(this,'Orientation'))
        })

        const image = new Image()
        image.onload = function(){
            const index = exifOrientation
        
            const img = this
            if(URL.createObjectURL)
            URL.revokeObjectURL(this.src)
            let canvas = document.createElement('canvas')
            let context = canvas.getContext('2d')
            
            var imgWidth = img.naturalWidth || img.width
            var imgHeight = img.naturalHeight || img.height
            const imgRatio = imgWidth/imgHeight
            if(!(imgHeight < maxHeight && imgWidth < maxHeight))
            if((imgRatio >= maxWidth/maxHeight))
            {
                imgWidth = maxWidth
                imgHeight = maxWidth / imgRatio
            }
            else{
                imgWidth = maxHeight * imgRatio
                imgHeight = maxHeight
            }
            let canvasWidth = imgWidth
            let canvasHeight = imgHeight
            let t,t2
            t = {a:0,h:0,v:0}
            t2 = {a:0,h:0,v:0}

            if(!isCorrectlyOrientated && exifOrientation){
                t.a = transformCodes[index].a
                t.h = transformCodes[index].h
                t.v = transformCodes[index].v
            }
            if(isCorrectlyOrientated && orientationCropBug && exifOrientation){
                if(exifOrientation){
                    t.a = transformCodes[index].a
                    t.h = transformCodes[index].h
                    t.v = transformCodes[index].v
                    t2.a = reverseTransformCodes[index].a
                    t2.h = reverseTransformCodes[index].h
                    t2.v = reverseTransformCodes[index].v
                }
                if(t2.h)
                if((t2.a/90)%2)
                t.v +=t2.h
                else
                t.h +=t2.h

                if(t2.v)
                if((t2.a/90)%2)
                t.h +=t2.v
                else
                t.v +=t2.v

                t.a = t2.a + t.a
            }
            t.a = t.a%360
            t.h = t.h%2
            t.v = t.v%2
            if(t.a == 90 || t.a == 270){
                canvasWidth = imgHeight
                canvasHeight = imgWidth
            }
            canvas.width = canvasWidth
            canvas.height = canvasHeight            
            if(t.a!=0)
            context.rotate(t.a*(Math.PI/180))
            if(t.a == 90)
            context.translate(0,-imgHeight)
            if(t.a == 270)
            context.translate(-imgWidth, 0)
            if(t.a == 180)
            context.translate(-canvasWidth,-canvasHeight)
            if(t.h){
                context.translate(imgWidth,0)
                context.scale(-1,1)
            }
            if(t.v)
            {
                context.translate(0,imgHeight)
                context.scale(1,-1)
            }
            context.drawImage(img,0,0,imgWidth,imgHeight)
            callback(canvas)
        }

        if(inputImg instanceof File)
        if(url = URL.createObjectURL(inputImg))
        image.src = url
        else{
            var fr = new FileReader()
            fr.onload = function(e){
                image.src = e.target.result
            }
            if(inputImg)
            fr.readAsDataURL(inputImg)
        }
        if( typeof inputImg == 'string' )
        image.src = inputImg
    }
}



// polyfill for backward compatability of toBlob() method of Canvas 
{
    if(!HTMLCanvasElement.prototype.toBlob){
        Object.defineProperty(HTMLCanvasElement.prototype,'toBlob',{
            value:function(callback,type,quality){
                var binStr = atob(this.toDataURL(type,quality).split(',')[1]),
                len = binStr.length,
                arr = new Uint8Array(len);
                for(var i=0;i<len;i++){
                    arr[i] = binStr.charCodeAt(i);
                }
                callback(new Blob([arr],{type:type || 'image/png'}))
            }
        });
    }
}
