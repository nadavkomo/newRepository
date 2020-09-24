'use strict'


function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = `cell cell-${i}-${j}`;
            strHTML += `<td 
                        class="${className}"
                        onmouseup="clickedLeft(this)"
                        oncontextmenu="clickedRight(event,this)"
                        onmousedown="changeEmoji()">
                        ${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function renderCell(location, value) {
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createNums(length) {
    var nums = [];
    for (var i = 0; i < length; i++) {
        nums.push(i);
    }
    return nums;
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
    return array;
}