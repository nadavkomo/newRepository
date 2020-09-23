'use strict'

const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];
const CELL = '⬛';
const EMPTY = '⬜';
const FLAG = '🚩';
const CRY = '😭';
const HAPPY = '😊'
const WINNER = '🏆'

var gLength;
var stopWatchInterval;
var s = 0, ms = 0;
var gBoard;
var gCells = [];
var gGame = {
    score: 0,
    isOn: false
}
var isClockOn = false;


function init(gLength) {
    isClockOn = false;
    update();
    changeEmoji();
    gBoard = buildBoard(gLength);
    printMat(gBoard, '.board-container');
    createMines(gBoard);
    createCells(gBoard)
    gGame.score = 0;
    gGame.isOn = true;
}
function buildBoard(gLength) {
    var length = Math.sqrt(gLength);
    var board = [];
    for (var i = 0; i < length; i++) {
        board.push([]);
        for (var j = 0; j < length; j++) {
            board[i][j] = CELL;
        }
    }
    return board;
}


function createCells(board) {
    for (var i = 0; i < board.length; i++) {
        var rowCells = [];
        for (var j = 0; j < board.length; j++) {
            var cell = {
                location: { i, j },
                isShown: false,
                isChosen: false,
            }
            rowCells.push(cell);
        }
        gCells.push(rowCells);
    }
}

function funcOnClick(elCell) {
    if(!gGame.isOn) return
    isClockOn = true;
    checkInterval()
    var classIdx;
    classIdx = elCell.classList[1].split('-')
    gCells[+classIdx[1]][+classIdx[2]].isShown = true;
    // console.log(elCell);
    for (var i = 0; i < gMines.length; i++) {
        if (+classIdx[1] === gMines[i].location.i && +classIdx[2] === gMines[i].location.j) {
            renderCell({ i: classIdx[1], j: classIdx[2] }, MINE)
            gameOver();
            return;
        }
    }
    renderCell({ i: classIdx[1], j: classIdx[2] }, EMPTY);
    var countMinesNegs = setMinesNegsCount(gBoard, +classIdx[1], +classIdx[2]);
    // console.log(countMinesNegs);
    if (countMinesNegs > 0) {
        renderCell({ i: classIdx[1], j: classIdx[2] }, numbers[countMinesNegs - 1]);
    }
    if (checkVictory()) {
        console.log('You\'re A Winner!!!');
        changeEmoji(WINNER)
    }
    return;
}

function clickedRight(ev, elCell) {
    if(!gGame.isOn) return
    isClockOn = true;
    checkInterval()
    ev.preventDefault();
    var classIdx;
    classIdx = elCell.classList[1].split('-')
    // console.log(elCell.innerText);
    if (elCell.innerText === EMPTY || elCell.innerText === MINE) return
    if (!gCells[+classIdx[1]][+classIdx[2]].isChosen) {
        gCells[+classIdx[1]][+classIdx[2]].isChosen = true;
        renderCell({ i: classIdx[1], j: classIdx[2] }, FLAG);
    } else {
        gCells[+classIdx[1]][+classIdx[2]].isChosen = false;
        renderCell({ i: classIdx[1], j: classIdx[2] }, CELL);
    }
}
function setMinesNegsCount(length, rowIdx, colIdx) {
    var countMinesNegs = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx ||
                (j < 0 || j > length - 1)) continue;
            if (checkMine(i, j)) countMinesNegs++;
        }
    }
    return countMinesNegs;
}

function checkMine(rowIdx, colIdx) {
    for (var i = 0; i < gMines.length; i++) {
        if (rowIdx === gMines[i].location.i &&
            colIdx === gMines[i].location.j) return true;
    }
    return false;
}

function checkInterval() {
    stopWatchInterval = setInterval(function () {
        if (!isClockOn) return;
        if (ms === 999) {
            s += 1;
            ms = 0;
        } else {
            ms += 1;
        }
        update();

    }, 1);
}

function update() {
    var elSec = document.querySelector('.s');
    var elMs = document.querySelector('.ms');
    if (!isClockOn) {
        s = 0;
        ms = 0;
    }
    elSec.innerText = s;
    elMs.innerText = ms;
}

function checkVictory() {
    var countShown = 0;
    var countFlags = 0;
    for (var i = 0; i < gCells.length; i++) {
        for (var j = 0; j < gCells.length; j++) {
            if (gCells[i][j].isShown) {
                countShown++;
            } else if (gCells[i][j].isChosen) countFlags++
        }
    }
    if (countShown === ((gCells.length ** 2) - gMines.length)) {
        if (countFlags === gMines.length) {
            gGame.isOn = false;
            isClockOn = false;
            checkInterval()
            return true;
        }
    }
    return false;
}

function gameOver() {
    gGame.isOn = false;
    isClockOn = false;
    checkInterval()
    console.log('You\'re A Loser!!!');
    changeEmoji(CRY)
}

function changeEmoji(face = HAPPY) {
    var elBtn = document.querySelector('.reset-game');
    elBtn.innerText = face;
}
var gElEasyBtn = document.querySelector('.easy');

function selectLevel(elBtn = gElEasyBtn) {
    var level = elBtn.innerText;
    if(level === 'Easy(16)')gLength = 16;
    if(level === 'Medium(25)') gLength = 64;
    if(level === 'Extream!(36)') gLength = 144;
    init(gLength)
}