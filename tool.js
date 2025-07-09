const canvas = document.querySelector('canvas');
const pencilwdith = document.querySelector('.pencil-width');
const pencilcolor = document.querySelectorAll('.pencil-color');

const eraserwidth = document.querySelector('.eraser-width-cont');
const undo = document.querySelector('.undo');
const redo = document.querySelector('.redo');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");
let eraserWidthelem = eraserwidth.value;
let currentColor = 'black';
ctx.strokeStyle = currentColor;
let tracker = 0;
let undoRedoTracker = [];
let mousedown = false;

pencilwdith.addEventListener('change', (e) => {
    ctx.lineWidth = e.target.value;
});

canvas.addEventListener('mousedown', (e) => {
    mousedown = true;
    let data = {
        x: e.clientX,
        y: e.clientY
    };

    if (mousedown) {
        beginPath(data);
         // Call beginPath directly
    }
});

function beginPath(data) {
    ctx.beginPath();
    ctx.moveTo(data.x, data.y); // Start the path at the mouse position
}

canvas.addEventListener('mousemove', (e) => {
    if (mousedown) {
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? 'white' : currentColor,
            width: eraserFlag ? eraserWidthelem : pencilwdith.value
        };
        drawStroke(data);
    }
});

function drawStroke(data) {
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.width;
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
}

canvas.addEventListener('mouseup', () => {
    mousedown = false;
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    tracker = undoRedoTracker.length - 1;
});

// Undo action
undo.addEventListener('click', () => {
    if (tracker > 0) {
        tracker--;
    }
    let data = {
        value: tracker,
        undoRedoTracker: undoRedoTracker
    };
    undoRedoActions(data);
});

// Redo action
redo.addEventListener('click', () => {
    if (tracker < undoRedoTracker.length) {
        tracker++;
    }
    let data = {
        value: tracker,
        undoRedoTracker: undoRedoTracker
    };
    undoRedoActions(data);
});

function undoRedoActions(data) {
    tracker = data.value;
    undoRedoTracker = data.undoRedoTracker;
    let url = undoRedoTracker[tracker];
    let img = new Image();
    img.src = url;
    img.onload = (e) => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}

pencilcolor.forEach((elem) => {
    elem.addEventListener('click', () => {
        currentColor = elem.classList[0];

// Assuming the class name represents the color
        ctx.strokeStyle = currentColor;
        pencilcolor.forEach((el) => el.classList.remove('active'));
        elem.classList.add('active');
    });
});

eraserwidth.addEventListener('change', (e) => {
    eraserWidthelem = e.target.value;
    ctx.lineWidth = eraserWidthelem;
});

eraser.addEventListener('click', () => {
    if (eraserFlag) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = eraserWidthelem;
    } else {
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = pencilwdith.value;
    }
});

function onEraser(data) {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = data.value;
}
