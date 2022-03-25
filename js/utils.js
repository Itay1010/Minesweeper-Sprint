'use strict'

function creatBoard(sizeX, sizeY) {
    var board = [];
    for (var i = 0; i < sizeX; i++) {
        board[i] = [];
        for (var j = 0; j < sizeY; j++) {
            var cell = {
                isMine: false,
                isDisplayed: false,
                isFlagged: false,
                minesAround: 0
            }
            board[i].push(cell)
        }
    }
    return board;
}

function renderBoard(board) {
    var strHTML = "";
    for (var i = 0; i < board.length; i++) {
        strHTML += "<tr>";
        for (var j = 0; j < board[0].length; j++) {
            // var className = board[i][j].content;
            var cellState = board[i][j].isDisplayed
            var className = cellState ? 'displayed ' : 'hidden ';
            className += gHintActive ? 'hint-active ' : ''
            var apply = EMPTY
            if (board[i][j].isFlagged) apply = FLAG
            if (cellState) {
                if (board[i][j].isMine) apply = MINE
                else if (board[i][j].minesAround > 0) apply = board[i][j].minesAround
            }
            strHTML += `<td data-i="${i}" data-j="${j}" oncontextmenu="return false;" onmouseup="cellClicked(this, event, ${i}, ${j})" class="cell ${className} ">${apply}</td>`;
        }
        strHTML += "</tr>";
    }
    var elTable = document.querySelector('table');
    elTable.innerHTML = strHTML;
}

function changeSize(val) {
    switch (+val) {
        case 4:
            gSize = 4
            break;

        case 8:
            gSize = 8
            break;

        case 12:
            gSize = 12
            break;

        default:
            gSize = 8
            break;
    }
    resetGame()
}

function getRandCell(board, skipI, skipJ) {
    var res = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (i === skipI && j === skipJ) {
                continue
            }
            else if (!board[i][j].isMine) {
                res.push({ i, j })
            }
        }
    }
    return res[getRandomInt(0, res.length)]
}

function HTMLSyringe(count, strHTML) {
    var serum = ''
    for (var i = 0; i < count; i++) {
        serum += strHTML
    }
    return serum
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function shuffle(items) {
    var randIdx, keep;
    for (var i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length);
        keep = items[i];
        items[i] = items[randIdx];
        items[randIdx] = keep;
    }
    return items;
}

function storeBestScore() {
    gTime = new Date - gTime
    if (gTime < +localStorage.getItem(`bestScore${gSize}`)) {
        localStorage.setItem(`bestScore${gSize}`, '' + gTime)
    }
}

function displayBestScore() {

}