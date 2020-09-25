'use strict'
const MINE = '💣';

var gMines = [];

function createMine(rnd1, rnd2) {
    var rndI = rnd1
    var rndJ = rnd2
    var mine = {
        location: {
            i: rndI,
            j: rndJ,
        },
    }
    return mine;
    // gMines.push(mine)
}
function createMines(firstClickLocation) {
    gMines = createEmptyIdxs();
    // var nums = createNums(gBoard.length - 1);
    // var rndNums = shuffle(nums);
    for (var i = 0; i < gCountMine; i++) {
        var rnd1 = getRandomIntInclusive(0, gBoard.length - 1)
        var rnd2 = getRandomIntInclusive(0, gBoard.length - 1)
        for (var j = 0; j < gMines.length; j++) {
            while ((rnd1 === gMines[j].location.i && rnd2 === gMines[j].location.j) ||
                  (rnd1 === firstClickLocation.i && rnd2 === firstClickLocation.j)) {
                rnd1 = getRandomIntInclusive(0, gBoard.length - 1)
                rnd2 = getRandomIntInclusive(0, gBoard.length - 1)
            }
        }
        gMines.shift();
        gMines.push(createMine(rnd1, rnd2));
    }
}

function createEmptyIdxs() {
    var idxs = [];
    var emptyIdx = { location: { i: null, j: null } };
    for (var i = 0; i < gCountMine; i++) {
        idxs.push(emptyIdx)
    }
    return idxs;
}

// function createMine() {
//     var isOn = true;
//     while (isOn) {
//         var rndI = getRandomIntInclusive(0, gBoard.length - 1)
//         var rndJ = getRandomIntInclusive(0, gBoard.length - 1)
//         var rndIdx = { location: { i: rndI, j: rndJ } }
//         console.log(rndIdx);
//         for (var i = 0; i < gCountMine; i++) {
//             if (rndI === gMines[i].i && rndJ === gMines[i].j) {
//                 isOn = true;
//                 break
//             }
//             isOn = false;
//         }
//     }
//     gMines.shift();
//     gMines.push(rndIdx)
// }





function getMineHTML(mine) {
    return `<span>${MINE}</span>`;
}


