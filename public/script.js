const optionscont = document.querySelector('.option-cont');
const toolscont = document.querySelector('.tools-cont');
const pencil = document.querySelector('.pencil');
const pencilcont = document.querySelector(".pencil-tool-cont");
const eraser = document.querySelector('.eraser')
console.log('er',eraser)
const stickynote = document.querySelector('.note');
const eraserCont = document.querySelector(".eraser-tool-cont");
const upload = document.querySelector('.upload');
const download=document.querySelector('.download')
const optionChild = optionscont.children[0];

let pencilflag = false;
let optionFlag = true;
let eraserFlag = false;
console.log(eraserCont.style.display)
function openTools() {
  optionChild.classList.add('fa-bars');
  optionChild.classList.remove('fa-times');
  toolscont.style.display = 'flex';
}

function closeTools() {
  optionChild.classList.remove('fa-bars');
  optionChild.classList.add('fa-times');
  toolscont.style.display = 'none';
  pencilcont.style.display = 'none';
  eraserCont.style.display = 'none';
  pencilflag = false;
  eraserFlag = false;
}

pencil.addEventListener('click', function () {
    pencilflag = !pencilflag
    pencilcont.style.display = pencilflag ? 'block' : 'none';
});

eraser.addEventListener('click', function () {
    eraserFlag = !eraserFlag;
    eraserCont.style.display = eraserFlag ? 'flex' : 'none';
    
});

optionscont.addEventListener('click', function () {
    optionFlag = !optionFlag;
    if (optionFlag) {
        openTools();
    } else {
        closeTools();
    }
});

stickynote.addEventListener('click', (e) => {
    let sticky = document.createElement('div');
    sticky.setAttribute('class', 'sticky-cont');
    sticky.innerHTML = `
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
         </div>
        <div class="note-cont">
            <textarea name="" id="" cols="5" rows="5"></textarea>
        </div>
    `;
    createSticky(sticky);
});

upload.addEventListener("click", (e) => {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);
        let stickynote = document.createElement('div');
        stickynote.setAttribute('class', 'sticky-cont');
        stickynote.innerHTML = `
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <img src="${url}"/>
        </div>
        `;
        createSticky(stickynote);
    });
});

function createSticky(element) {
    document.body.appendChild(element);
    let minimize = element.querySelector('.minimize');
    let remove = element.querySelector('.remove');
    noteActions(minimize, remove, element);

    element.onmousedown = function (event) {
        dragAndDrop(element, event);
    };

    element.ondragstart = function () {
        return false;
    };
}

function noteActions(minimize, remove, element) {
    minimize.addEventListener('click', function () {
        let noteCont = element.querySelector('.note-cont');
        let display = getComputedStyle(noteCont).getPropertyValue('display');
        noteCont.style.display = display === 'none' ? 'block' : 'none';
    });
    remove.addEventListener('click', (e) => {
        element.remove();
    });
}

function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}
download.addEventListener('click',(e)=>{
    let url=canvas.toDataURL()
    let img=document.createElement('a')
    img.href=url
    img.download='board.jpeg'
    img.click()
    console.log('clicked')
})