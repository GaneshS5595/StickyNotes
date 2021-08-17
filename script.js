document.onmousemove = snapNote;
document.ontouchmove = snapNoteTouch;
document.onmouseup = placeNote;
document.ontouchend = placeNote;
document.onmousedown = clearMenus;

let notesCount = 0;


function addNote() {
    console.log('Add button pressed');

    notesCount++;


    let note = document.createElement('div');
    note.onmousedown = selectNote;
    note.ontouchstart = selectNote;
    note.className = 'note';


    let titleInput = document.createElement('textarea');
    titleInput.placeholder = 'Title';
    titleInput.className = 'note-title';
    titleInput.onkeydown = keyDown;
    note.appendChild(titleInput);


    let textBox = document.createElement('textarea');
    textBox.placeholder = 'Write your note here'
    textBox.className = 'note-content';
    textBox.onkeydown = keyDown;
    note.appendChild(textBox);


    let optionButton = document.createElement('button');
    optionButton.className = 'option-button';
    optionButton.textContent = 'Options';
    optionButton.onmousedown = noteMenu;
    optionButton.ontouchstart = noteMenu;
    note.appendChild(optionButton);


    note.id = 'note' + notesCount;

    document.body.appendChild(note);

    titleInput.focus();
}

let selectedNote = null;


function selectNote() {
    selectedNote = this;
}

let noteCopy = {};
let mouseDidMove = false;
let currentSwap = null;

function snapNote(event) {
    if (selectedNote !== null) {

        let mouseMovement = Math.sqrt((event.movementX ** 2) + (event.movementY ** 2));

        if (!mouseDidMove && mouseMovement > 4) {

            console.log('Mouse moved');

            selectedNote.style.visibility = 'hidden';

            currentSwap = selectedNote;

            noteCopy = copyNote(selectedNote);
            noteCopy.style.position = 'fixed';

            document.body.appendChild(noteCopy);


            noteCopy.style.top = (event.clientY - noteCopy.offsetHeight / 2) + 'px';
            noteCopy.style.left = (event.clientX - noteCopy.offsetWidth / 2) + 'px';

            mouseDidMove = true;

        } else if (mouseDidMove) {

            noteCopy.style.top = (event.clientY - noteCopy.offsetHeight / 2) + 'px';
            noteCopy.style.left = (event.clientX - noteCopy.offsetWidth / 2) + 'px';

            let notes = document.getElementsByClassName('note');

            for (let i = 0; i < notes.length; i++) {

                let rect = notes[i].getBoundingClientRect();


                if (currentSwap !== null && !noteCopy.id.includes(notes[i].id) && notes[i].id !== currentSwap.id) { // Make sure the note is a different note
                    if (event.clientX > rect.left && event.clientX < rect.right &&
                        event.clientY > rect.top && event.clientY < rect.bottom) {
                        if (notes[i].style.position !== 'fixed') {
                            console.log('Selected: ' + noteCopy.id);
                            console.log('Swap with: ' + notes[i].id);


                            let oldRects = new Map();
                            for (let i = 0; i < notes.length; i++) {
                                if (!notes[i].id.includes('copy')) {
                                    let oldRect = notes[i].getBoundingClientRect();
                                    oldRects.set(notes[i].id, oldRect);
                                }
                            }

                            currentSwap.style.visibility = 'visible';
                            checkOverflow(currentSwap.children[1]);

                            swapNotes(selectedNote, currentSwap);
                            currentSwap = notes[i];
                            swapNotes(selectedNote, currentSwap);

                            currentSwap.style.visibility = 'hidden';

                            animateReorder(oldRects, 300);
                        }
                    }
                }
            }
        }
    }
}


function snapNoteTouch(event) {
    if (selectNote !== null) {
        if (!mouseDidMove) {

            console.log('Mouse moved');

            selectedNote.style.visibility = 'hidden';

            currentSwap = selectedNote;

            noteCopy = copyNote(selectedNote);
            noteCopy.style.position = 'fixed';

            document.body.appendChild(noteCopy);


            noteCopy.style.top = (event.touches[0].clientY - noteCopy.offsetHeight / 2) + 'px';
            noteCopy.style.left = (event.touches[0].clientX - noteCopy.offsetWidth / 2) + 'px';

            mouseDidMove = true;

        } else if (mouseDidMove) {

            noteCopy.style.top = (event.touches[0].clientY - noteCopy.offsetHeight / 2) + 'px';
            noteCopy.style.left = (event.touches[0].clientX - noteCopy.offsetWidth / 2) + 'px';

            let notes = document.getElementsByClassName('note');

            for (let i = 0; i < notes.length; i++) {

                let rect = notes[i].getBoundingClientRect();


                if (currentSwap !== null && !noteCopy.id.includes(notes[i].id) && notes[i].id !== currentSwap.id) {
                    if (event.touches[0].clientX > rect.left && event.touches[0].clientX < rect.right &&
                        event.touches[0].clientY > rect.top && event.touches[0].clientY < rect.bottom) {
                        if (notes[i].style.position !== 'fixed') {
                            console.log('Selected: ' + noteCopy.id);
                            console.log('Swap with: ' + notes[i].id);


                            let oldRects = new Map();
                            for (let i = 0; i < notes.length; i++) {
                                if (!notes[i].id.includes('copy')) {
                                    let oldRect = notes[i].getBoundingClientRect();
                                    oldRects.set(notes[i].id, oldRect);
                                }
                            }

                            currentSwap.style.visibility = 'visible';
                            checkOverflow(currentSwap.children[1]);

                            swapNotes(selectedNote, currentSwap);
                            currentSwap = notes[i];
                            swapNotes(selectedNote, currentSwap);

                            currentSwap.style.visibility = 'hidden';

                            animateReorder(oldRects, 300);
                        }
                    }
                }
            }
        }
    }
}


function placeNote() {
    if (selectedNote !== null) {

        selectedNote.style.visibility = 'visible';
        checkOverflow(selectedNote.children[1]);
        selectedNote = null;

        if (mouseDidMove) {
            noteCopy.remove();
            mouseDidMove = false;
        }

        if (currentSwap !== null) {
            currentSwap.style.visibility = 'visible';
            checkOverflow(currentSwap.children[1]);
            currentSwap = null;
        }
    }
}


function swapNotes(note1, note2) {

    let title1 = note1.children[0].value;
    let content1 = note1.children[1].value;
    let id1 = note1.id
    let height1 = note1.children[1].style.height;
    let color1 = note1.style.backgroundColor;


    note1.children[0].value = note2.children[0].value;
    note1.children[1].value = note2.children[1].value;
    note1.children[1].style.height = note2.children[1].style.height;
    note1.id = note2.id
    note1.style.backgroundColor = note2.style.backgroundColor;
    note1.children[0].style.backgroundColor = note2.style.backgroundColor;
    note1.children[1].style.backgroundColor = note2.style.backgroundColor;


    note2.children[0].value = title1;
    note2.children[1].value = content1;
    note2.children[1].style.height = height1;
    note2.id = id1;
    note2.style.backgroundColor = color1;
    note2.children[0].style.backgroundColor = color1;
    note2.children[1].style.backgroundColor = color1;
}


function copyNote(originalNote) {
    let noteCopy = document.createElement('div');
    noteCopy.className = 'note';
    noteCopy.innerHTML = originalNote.innerHTML;
    noteCopy.children[0].value = originalNote.children[0].value;
    noteCopy.children[1].value = originalNote.children[1].value;
    noteCopy.id = originalNote.id + 'copy';

    let color = originalNote.style.backgroundColor;

    noteCopy.style.backgroundColor = color;
    noteCopy.children[0].style.backgroundColor = color;
    noteCopy.children[1].style.backgroundColor = color;

    noteCopy.style.animationName = 'none';

    return noteCopy;
}


function keyDown() {
    checkOverflow(this);
}


function checkOverflow(textBox) {
    textBox.style.height = "";
    while (textBox.scrollHeight > textBox.clientHeight) {
        textBox.style.height = (textBox.clientHeight + 2) + 'px';
    }
}


function noteMenu() {
    console.log('option button pressed');

    let menus = document.getElementsByClassName('note-menu');
    let thisNoteHasMenu = (this.parentNode.getElementsByClassName('note-menu').length != 0);

    for (let i = 0; i < menus.length; i++) {
        menus[i].remove();
    }

    let noteMenu = document.createElement('div');
    noteMenu.className = "note-menu";

    let colors = [
        'yellow',
        'blue',
        'green',
        'pink',
        'orange',
        'red',
        'brown',
        'chocolate',
        'coral'
    ];


    colors.forEach(color => {
        let colorOption = document.createElement('button');
        colorOption.className = "color-option";
        colorOption.style.backgroundColor = color;
        colorOption.onmousedown = setColor;
        colorOption.ontouchstart = setColor;
        noteMenu.appendChild(colorOption);
    });


    let deleteButton = document.createElement('div');
    deleteButton.className = 'delete-note';
    deleteButton.onmousedown = (() => { setTimeout(deleteNote.bind(deleteButton), 155); });
    let deleteText = document.createElement('p');
    deleteText.textContent = 'Delete';
    deleteText.className = 'delete-text';
    deleteButton.appendChild(deleteText);
    let deleteIcon = document.createElement('img');
    deleteIcon.src = 'images/delete-24px-red.svg';
    deleteIcon.className = 'delete-icon';
    deleteButton.appendChild(deleteIcon);
    noteMenu.appendChild(deleteButton);

    this.parentNode.appendChild(noteMenu);

    if (!thisNoteHasMenu) {

    }
}


function setColor() {
    console.log('color button pressed');

    let note = this.parentNode.parentNode;
    let newColor = this.style.backgroundColor;

    note.style.backgroundColor = newColor;
    note.children[0].style.backgroundColor = newColor;
    note.children[1].style.backgroundColor = newColor;
}


function clearMenus(event) {
    console.log('Clear menus');
    console.log('ClientX: ' + event.clientX);
    console.log('ClientY: ' + event.clientY);

    let noteMenus = document.getElementsByClassName('note-menu');

    for (let i = 0; i < noteMenus.length; i++) {
        let rect = noteMenus[i].getBoundingClientRect();


        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
            if (noteMenus[i].id == 'active') {
                noteMenus[i].remove();
            } else {
                noteMenus[i].id = 'active';
            }
        }
    }
}


function deleteNote() {
    let thisNote = this.parentNode.parentNode;

    let notes = document.getElementsByClassName('note');
    let oldRects = new Map();


    for (let i = 0; i < notes.length; i++) {
        let rect = notes[i].getBoundingClientRect();
        oldRects.set(notes[i].id, rect);
    }

    thisNote.remove();

    animateReorder(oldRects, 300);
}


function animateReorder(oldRects, duration) {
    console.log(oldRects);
    let notes = document.getElementsByClassName('note');
    let newRects = new Map();


    for (let i = 0; i < notes.length; i++) {
        let newRect = notes[i].getBoundingClientRect();
        newRects.set(notes[i].id, newRect);
    }



    let offsetX = parseFloat(window.getComputedStyle(notes[0]).marginLeft);
    let offsetY = parseFloat(window.getComputedStyle(notes[0]).marginTop);
    let width = parseFloat(window.getComputedStyle(notes[0]).width);
    for (let i = 0; i < notes.length; i++) {
        if (oldRects.has(notes[i].id) && newRects.has(notes[i].id)) {

            notes[i].style.position = 'fixed';
            notes[i].style.left = (oldRects.get(notes[i].id).left - offsetX) + 'px';
            notes[i].style.top = (oldRects.get(notes[i].id).top - offsetY) + 'px';
            notes[i].style.width = width + 'px';
        }
    }

    let timePassed = 0;
    let lastFrame = Date.now();


    function animateFrame() {

        let deltaT = Date.now() - lastFrame;
        timePassed += deltaT;
        lastFrame = Date.now();


        for (let i = 0; i < notes.length; i++) {
            if (oldRects.has(notes[i].id) && newRects.has(notes[i].id)) {
                let deltaX = (newRects.get(notes[i].id).left - oldRects.get(notes[i].id).left) * deltaT / duration;
                let deltaY = (newRects.get(notes[i].id).top - oldRects.get(notes[i].id).top) * deltaT / duration;

                notes[i].style.left = (parseFloat(notes[i].style.left) + deltaX) + 'px';
                notes[i].style.top = (parseFloat(notes[i].style.top) + deltaY) + 'px';
            }
        }


        if (timePassed < duration) {
            requestAnimationFrame(animateFrame);
        } else {
            for (let i = 0; i < notes.length; i++) {
                if (oldRects.has(notes[i].id) && newRects.has(notes[i].id)) {
                    notes[i].style.position = 'relative';
                    notes[i].style.left = '0px';
                    notes[i].style.top = '0px';
                    notes[i].style.width = "";
                }
            }
        }
    }

    animateFrame();
}