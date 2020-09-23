'use strict'
const MINE = '💣';


var gMines = [];

function createMine(board, i, j) {
    var mine = {
        location: {
            i:getRandomIntInclusive(0, board.length - 1),
            j:getRandomIntInclusive(0, board.length - 1),
        },
    }
    gMines.push(mine)
}

function createMines(board) {
    gMines = [];
    createMine(board);
    createMine(board);
    console.log(gMines);
}

function getMineHTML(mine) {
    return `<span>${MINE}</span>`;
}

