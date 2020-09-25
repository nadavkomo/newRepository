'use strict'

const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];
const CELL = '⬛';
const EMPTY = '⬜';
const FLAG = '🚩';
const CRY = '😭';
const HAPPY = '😊';
const WINNER = '🏆';
const SHOCKED = '😲';

var gRecursiveInterval;
var bestScoreS = 0;
var bestScoreMs = 0;
var elFlagsCounter = document.querySelector('.flags');
var gElHintButtun;
var hintClicked;
var firstClick;
var gCountDeath;
var countShown;
var countNumsOfFlags;
var gCountMine;
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

// function handler(event) {
//     switch (event.which) {
//         case 1:
//             clickedLeft()
//             break;
//         case 2:
//             break;
//         case 3:
//             clickedRight()
//             break;
//         default:
//     }
// };







function init(gLength) {
    gRecursiveInterval = clearInterval(gRecursiveInterval);
    hintClicked = false;
    firstClick = true;
    liveAgain();
    gCountDeath = 0;
    countNumsOfFlags = gCountMine;
    elFlagsCounter.innerText = `FLAGS : ${countNumsOfFlags}`
    isClockOn = false;
    update();
    changeEmoji();
    gBoard = buildBoard(gLength);
    printMat(gBoard, '.board-container');
    createCells(gBoard)
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
    gCells = [];
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
function renderMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (checkMine(i, j)) {
                renderCell({ i, j, }, MINE)

            }
        }
    }
}
function changeEmojiShocked() {
    console.log('check');
    if (!gGame.isOn) return
    changeEmoji(SHOCKED)
}


function clickedLeft(elCell) {
    if (!gGame.isOn) return
    changeEmoji()
    if (firstClick) {
        classIdx = elCell.classList[1].split('-')
        firstClick = false;
        createMines(gCells[+classIdx[1]][+classIdx[2]].location);
    }
    isClockOn = true;
    checkInterval()
    var classIdx;
    classIdx = elCell.classList[1].split('-')
    gCells[+classIdx[1]][+classIdx[2]].isShown = true;
    for (var i = 0; i < gMines.length; i++) {
        if (+classIdx[1] === gMines[i].location.i && +classIdx[2] === gMines[i].location.j) {
            if (hintClicked) {
                renderCell({ i: classIdx[1], j: classIdx[2] }, MINE)
            } else {
                gameOver();
                return;
            }
        }
    }

    var countMinesNegs = setMinesNegsCount(gBoard, +classIdx[1], +classIdx[2]);
    if (countMinesNegs > 0) {
        renderCell({ i: classIdx[1], j: classIdx[2] }, numbers[countMinesNegs - 1]);
        if (hintClicked) checkNeg(classIdx[1], classIdx[2]);
    }
    else {
        renderCell({ i: classIdx[1], j: classIdx[2] }, EMPTY);
        if (!hintClicked) {
            checkNeg(classIdx[1], classIdx[2]);
        }
    }
    if (!hintClicked) {
        if (checkVictory()) {
            console.log('You\'re A Winner!!!');
            changeEmoji(WINNER)
        }
    }
    if (hintClicked) {
        for (var i = +classIdx[1] - 1; i <= +classIdx[1] + 1; i++) {
            if (i < 0 || i > gBoard.length - 1) {
                continue;
            }
            for (var j = +classIdx[2] - 1; j <= +classIdx[2] + 1; j++) {
                if (j < 0 || j > gBoard.length - 1) {
                    continue;
                }
                if (checkMine(i, j)) renderCell({ i, j, }, MINE);
                else {
                    var countMinesNegs2 = setMinesNegsCount(gBoard, i, j);
                    if (countMinesNegs2 > 0) {
                        renderCell({ i, j, }, numbers[countMinesNegs2 - 1]);
                    } else {
                        renderCell({ i, j, }, EMPTY);
                    }
                }
            }
        }
        setTimeout(function () {
            hintClicked = false;
            gElHintButtun.classList.add("invisible");
            for (var i = +classIdx[1] - 1; i <= +classIdx[1] + 1; i++) {
                if (i < 0 || i > gBoard.length - 1) {
                    continue;
                }
                for (var j = +classIdx[2] - 1; j <= +classIdx[2] + 1; j++) {
                    if (j < 0 || j > gBoard.length - 1) {
                        continue;
                    }
                    renderCell({ i, j, }, CELL)
                }
            }
        }, 1000)

    }
}
function checkNeg(idxI, idxJ) {
    gRecursiveInterval =  setTimeout(function () {
        for (var i = +idxI - 1; i <= +idxI + 1; i++) {
            if (i < 0 || i > gBoard.length - 1) {
                continue;
            }
            for (var j = +idxJ - 1; j <= +idxJ + 1; j++) {
                if (i === +idxI && j === +idxJ ||
                    (j < 0 || j > gBoard.length - 1)) {
                    continue;
                }
                if (checkMine(i, j)) continue;
                gCells[i][j].isShown = true;
                var countMinesNegs1 = setMinesNegsCount(gBoard, i, j);
                if (countMinesNegs1 > 0) {
                    renderCell({ i, j, }, numbers[countMinesNegs1 - 1]);
                } else {
                    renderCell({ i, j, }, EMPTY);
                    var elNegCell = document.querySelector(`.cell-${i}-${j}`);
                    clickedLeft(elNegCell)
                }
            }
        }
    },1)
}


function clickedRight(ev, elCell) {
    if (!gGame.isOn) return
    changeEmoji()
    isClockOn = true;
    checkInterval()
    ev.preventDefault();
    var classIdx;
    classIdx = elCell.classList[1].split('-')
    console.log(elCell.innerText);
    if (elCell.innerText === EMPTY || elCell.innerText === MINE) return
    if (!gCells[+classIdx[1]][+classIdx[2]].isChosen) {
        gCells[+classIdx[1]][+classIdx[2]].isChosen = true;
        renderCell({ i: classIdx[1], j: classIdx[2] }, FLAG);
        countNumsOfFlags--
        if (checkVictory()) {
            console.log('You\'re A Winner!!!');
            changeEmoji(WINNER);
        }
    } else {
        gCells[+classIdx[1]][+classIdx[2]].isChosen = false;
        renderCell({ i: classIdx[1], j: classIdx[2] }, CELL);
        countNumsOfFlags++;
    }
    elFlagsCounter.innerText = `FLAGS : ${countNumsOfFlags}`
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
    gGame.score = { s, ms }
    if (!isClockOn) {
        s = 0;
        ms = 0;
    }
    elSec.innerText = s;
    elMs.innerText = ms;
}
function updateBestScore() {
    if (gGame.score.s > bestScoreS) {
        bestScoreS = gGame.score.s;
        bestScoreMs = gGame.score.ms;
        var elBestScore = document.querySelector('.best-score');
        elBestScore.innerText = `BEST SCORE: ${bestScoreS}sec and ${bestScoreMs}ms`
    } else if (gGame.score.s === bestScoreS && gGame.score.ms > bestScoreMs) {
        bestScoreMs = gGame.score.ms;
        var elBestScore = document.querySelector('.best-score');
        elBestScore.innerText = `BEST SCORE: ${bestScoreS}sec and ${bestScoreMs}ms`
    }
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
            updateBestScore();
            return true;
        }
    }
    return false;
}

function gameOver() {
    gCountDeath++
    var elLive = document.querySelector(`.live${gCountDeath}`);
    elLive.classList.add("invisible");
    if (gCountDeath > 2) {
        gGame.isOn = false;
        isClockOn = false;
        checkInterval()
        setTimeout(function () {
            renderMines();
        }, 1000)
        console.log('You\'re A Loser!!!');
        changeEmoji(CRY)
    }
}

function changeEmoji(face = HAPPY) {
    var elBtn = document.querySelector('.reset-game');
    elBtn.innerText = face;
}
var gElEasyBtn = document.querySelector('.easy');

function selectLevel(elBtn = gElEasyBtn) {
    var level = elBtn.innerText;
    if (level === 'Easy(4*4)') {
        gCountMine = 2;
        gLength = 16;
    }
    if (level === 'Medium(8*8)') {
        gCountMine = 12;
        gLength = 64;
    }
    if (level === 'Extream!(12*12)') {
        gCountMine = 30;
        gLength = 144;
    }
    init(gLength)
}

function liveAgain() {
    var elLives = document.querySelectorAll('.live')
    elLives[0].classList.remove("invisible");
    elLives[1].classList.remove("invisible");
    elLives[2].classList.remove("invisible");
    var elHints = document.querySelectorAll('.hints');
    elHints[0].classList.remove("invisible");
    elHints[1].classList.remove("invisible");
    elHints[2].classList.remove("invisible");
    elHints[0].style.backgroundColor = "cornflowerblue"
    elHints[1].style.backgroundColor = "cornflowerblue"
    elHints[2].style.backgroundColor = "cornflowerblue"
}

function getHint(elHint) {
    console.log('HINT');
    console.log(elHint);
    hintClicked = true
    gElHintButtun = elHint;
    elHint.style.backgroundColor = "yellow";
}