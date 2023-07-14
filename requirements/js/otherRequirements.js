function customAlert(s,hs="அறிவிப்பு :"){
    var section = document.createElement('section')
    var div = document.createElement('div')
    var p = document.createElement('p')
    var h = document.createElement('h1')
    var cb = document.createElement('button')

    section.classList.add('alert-section')
    div.classList.add('non_selectable')
    cb.innerText = 'சரி'
    p.innerText = s
    h.innerText = hs

    div.append(h,p,cb)


    section.append(div)
    document.body.append(section)
    cb.onclick = function(){
        if(section && !section.classList.contains('will-be-removed'))
        setTimeout(()=>{
            if(section)
            section.parentElement.removeChild(section)
        },500)
        section.classList.add('will-be-removed')
    }
    cb.focus()
}




function createRipple(e){
    if(e.target.classList.contains("click-effect"))
    var el = e.target
    if(e.target.parentNode.classList.contains("click-effect"))
    var el = e.target.parentNode

    var pos = el.getBoundingClientRect()

    const diameter = Math.max(el.clientWidth,el.clientHeight)
    const radius = diameter/2
    var span = document.createElement("span")
    span.classList.add('ripple_span')
    span.style.width = diameter+'px'
    span.style.height = diameter+'px'
    span.style.top = (e.clientY - (pos.top + radius))+'px'
    span.style.left = (e.clientX - (pos.left + radius))+'px'
    el.append(span)    
    window.setTimeout(function(span){
        span.classList.add('start_ripple')
    },100,span);
    window.setTimeout(function(span){
        span.remove()
    },1100,span);
}

{
let timer
let timer2
function showTitleMsg(e){
    if(e.type == 'mouseenter' && is_touch_enabled())
    return
    if(e.type == 'contextmenu' && !is_touch_enabled())
    return

    e.preventDefault()

    window.clearTimeout(timer2)
    var tm,el,leftOfArrow,noArrow,noTimeLimit
    if(e.target.getAttribute('titlemsg'))
    el = e.target
    else el = e.target.parentElement

    tm = el.getAttribute('titlemsg')
    leftOfArrow = el.getAttribute('tLeftOfArrow')=='no'
    noArrow = el.clientWidth < 25 || el.getAttribute('tArrow')=='no'
    noTimeLimit = el.getAttribute('tTimeLimit')=='no'

    timer2 = window.setTimeout(
        function(){
            if(e.target.dblClicked)
            return
            let div = document.createElement('div')
            var html = document.querySelector('html')
            var sp = document.createElement('span')

            var tmbel = document.querySelector('.titleMsgBox')
            if(tmbel && tmbel.getAttribute('titlems')==tm)
            return
            else hideTitleMsg()
        
            div.classList.add('titleMsgBox')
            div.innerText = tm
            document.body.append(div)

            x = el.offsetLeft
            y = el.offsetTop + el.offsetHeight + 5
            var l = (el.clientWidth/2 - 5)
            var t = -5
            if(html.clientWidth < x+div.clientWidth){
                x = el.offsetLeft + el.offsetWidth - div.clientWidth
                l = div.clientWidth - (el.clientWidth/2 + 5)
            }
            if(html.clientHeight < y+div.clientHeight){
                y = el.offsetTop - div.clientHeight - 20
                t = div.clientHeight - 10
            }        
            if(x<0){
                div.style.width = (window.innerWidth - 20 )+ 'px'
                l = el.offsetLeft + (el.clientWidth/2 - 15)
                x = 10
            }
            
            if(!noArrow)
            {
                div.append(sp)
                y = y + 5
            }
            if(noTimeLimit){
                div.style.animation = 'titleMsg 0.3s ease-in-out forwards'
            }

            div.style.left = (x)+'px'
            div.style.top = (y)+'px'
            
            if(el.offsetWidth < div.clientWidth)
            sp.style.left = (l)+'px'
            else
            sp.style.left = (div.clientWidth/2-7.5)+'px'

            sp.style.top = (t)+'px'
            
            window.clearTimeout(timer)
            if(!noTimeLimit)
            timer = window.setTimeout(hideTitleMsg,2500)
        }
    ,500,el,tm,noTimeLimit,noArrow,leftOfArrow)
}
function hideTitleMsg(e){
    if(e && e.type == 'mouseleave')
    e.target.dblClicked = false
    var tmbel = document.querySelector('.titleMsgBox')
    if(tmbel)
    {
        tmbel.parentElement.removeChild(tmbel)
    }
    window.clearTimeout(timer2)
}
function hideTitleMsgAfter250ms(e){
    e.target.dblClicked = true
}
}


//.....................setup......................
function setup(r = null){
    var req = r
    if(req == null || req instanceof Event)
    req = {"click_effect":true,"showTitleMsg":true,"alert":true}
    if(req.click_effect){
        var el = document.getElementsByClassName('click-effect')
        for(var i=0;i<el.length;i++){
            el[i].addEventListener("click",createRipple,false)
        }    
    }
    if(req.showTitleMsg){
        var el = document.querySelectorAll('[titleMsg]')
        for(var i=0;i<el.length;i++){
            if(el[i].getAttribute('titleMsg')=='')continue
            el[i].addEventListener("mouseenter",showTitleMsg)
            el[i].addEventListener("contextmenu",showTitleMsg)
            el[i].addEventListener("mouseleave",hideTitleMsg)
            el[i].addEventListener("click",hideTitleMsg)
            el[i].addEventListener("dblclick",hideTitleMsgAfter250ms)
        }
    }

}



if(window.performance && window.performance.type===window.performance.navigation.TYPE_BACK_FORWARD){
    setup()
}
window.addEventListener('load',setup,true)
window.addEventListener('orientationchange',setup,true)
window.addEventListener('pageshow',setup,true)
