
const canvas=document.querySelector('canvas')
const pencilwdith=document.querySelector('.pencil-width')
const pencilcolor=document.querySelectorAll('.pencil-color')
const eraserwidth=document.querySelector('.eraser-width-cont')
const undo=document.querySelector('.undo')
const redo=document.querySelector('.redo')
canvas.width=window.innerWidth
canvas.height=window.innerHeight
let ctx=canvas.getContext("2d")
let eraserWidthelem=eraserwidth.value
let currentColor='black'
ctx.strokeStyle = currentColor; // Set stroke color to green
let tracker=0
let undoRedoTracker=[]
// ctx.beginPath();
// ctx.moveTo(0, 0); // Starting point of the line
// ctx.lineTo(200, 200); // Ending point of the line
// ctx.stroke(); // Render the line
let mousedown=false
pencilwdith.addEventListener('change',(e)=>{
    ctx.lineWidth=e.target.value
})
canvas.addEventListener('mousedown',(e)=>{
    console.log(mousedown)
    mousedown=true
        // ctx.beginPath()
        // ctx.moveTo(e.clientX,e.clientY)
        let data={
            x:e.clientX,
            y:e.clientY
        }
        if(mousedown){
            socket.emit('beginPath',data)

        }
})
function beginPath(data){
    ctx.beginPath()
    ctx.moveTo(data.x,data.y)
}
canvas.addEventListener('mousemove',(e)=>{
    if(mousedown){
        let data={
            x:e.clientX,
            y:e.clientY,
            color: eraserFlag ? 'white' : currentColor,
            width: eraserFlag ? eraserWidthelem : pencilwdith
        }
        socket.emit('drawStroke',data)

    }
})
function drawStroke(data){
    ctx.strokeStyle=data.color,
    ctx.lineWidth=data.width
    ctx.lineTo(data.x,data.y)
    ctx.stroke()

}
canvas.addEventListener('mouseup',()=>{
    mousedown=false
    let url=canvas.toDataURL()
    undoRedoTracker.push(url)
    tracker=undoRedoTracker.length-1
})
undo.addEventListener('click',(e)=>{
    if(tracker>0){
        tracker--
    }
    let data={
        value:tracker,
        undoRedoTracker:undoRedoTracker
    }
    socket.emit('undoRedo',data)

})
redo.addEventListener('click',(e)=>{
    if(tracker < undoRedoTracker.length){
        tracker++
    }

    let data={
        value:tracker,
        undoRedoTracker:undoRedoTracker
    }
    socket.emit('undoRedo',data)

})
function undoRedoActions(data){
     tracker=data.value
     undoRedoTracker=data.undoRedoTracker
     let url=undoRedoTracker[tracker]
    let img=new Image()
    img.src=url
    img.onload=(e)=>{
        ctx.drawImage(img,0,0,canvas.width,canvas.height)
    }
}
pencilcolor.forEach((elem)=>{
   elem.addEventListener('click',()=>{
    currentColor = elem.classList[0]; // Assuming the class name represents the color
        ctx.strokeStyle = currentColor;
   })
})
eraserwidth.addEventListener('change',(e)=>{
    eraserwidth.value=e.target.value
    ctx.lineWidth=eraserWidthelem.value
})
eraser.addEventListener('click',()=>{
    console.log(eraserFlag)
    if(eraserFlag){
        ctx.strokeStyle='white'
        ctx.lineWidth=eraserwidth.value
    }else{
        ctx.strokeStyle=currentColor
        ctx.lineWidth=pencilwdith.value
    }
})
function onEraser(data){
    ctx.strokeStyle='white'
    ctx.lineWidth=data.value
}
socket.on('beginPath',(data)=>{
    beginPath(data)
})
socket.on('drawStroke',(data)=>{
    drawStroke(data)
})

socket.on('undoRedo',(data)=>{
    undoRedoActions(data)
})




