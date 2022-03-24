'use strict'

const EMPTY = ' ';
const MINE = '💣';
const FLAG = '🚩';

var gGame = {
    isOn: false,
    mineLocation: [],
    visibleCells: 0,
    markedCount: 0,
    lifeCounter: 3
}
var gBoard, gTimerId, gElTimer;
var gSize = 8;
var gIsModalOpen = false

function init() {
    gBoard = creatBoard(gSize, gSize);
    gElTimer = document.querySelector('.timer')
    gSize = 8
    renderBoard(gBoard)
}

function startGame(i, j) {
    gGame.isOn = true
    placeMines(gBoard, i, j)
    setMinesCount(gBoard)
    timerSet()
}

function timerSet() {
    var timerStart = new Date
    gTimerId = setInterval(cycleTimer, 1000, timerStart);
}

function cycleTimer(startT) {
    var currTime = (+Date.now() - +startT) / 1000
    currTime = currTime.toFixed(0)
    gElTimer.innerText = currTime > 9 ? '0' : '00'
    gElTimer.innerText = currTime > 99 ? '' : '00'
    gElTimer.innerText += currTime

}

function cellClicked(el, ev, i, j) {
    if (gGame.visibleCells === 0 && ev.button === 0) startGame(i, j)
    else if (gBoard[i][j].isDisplayed || !gGame.isOn) return

    if (ev.button === 0 && !gBoard[i][j].isFlagged) {
        if (checkVictory(false, i, j, el)) return;
        recursiveReveal(gBoard, i, j);
    }
    else if (ev.button === 2) {
        flagCell(i, j);
        if (checkVictory(true, i, j, el)) return;
    }
    //DOM
    renderBoard(gBoard)
}

function revealCell(i, j) {
    //just for the model
    //is being used to reveal all mines in both win and lose states
    var modelCell = gBoard[i][j]
    modelCell.isDisplayed = true
    gGame.visibleCells++
}

function recursiveReveal(mat, rowIdx, colIdx) {
    var middleCell = mat[rowIdx][colIdx]
    revealCell(rowIdx, colIdx)
    if (middleCell.minesAround !== 0) {
        return
    }
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = mat[i][j];
            if (cell.minesAround === 0 && !cell.isMine && !cell.isDisplayed) {
                recursiveReveal(mat, i, j);
            } else if (!cell.isDisplayed && !cell.isMine) {
                revealCell(i, j);
            }
        }
    }
    renderBoard(gBoard)
    checkVictory(false, rowIdx, colIdx, 0)
    return
}

function flagCell(i, j) {
    //just for the model
    var modelCell = gBoard[i][j]
    if (modelCell.isFlagged) {
        if (modelCell.isMine) gGame.markedCount--
        modelCell.isFlagged = false;
        return
    } else if (modelCell.isMine) gGame.markedCount++
    modelCell.isFlagged = true;
}

function checkVictory(flagging, i, j, el) {
    if (gGame.markedCount === gGame.mineLocation.length &&
        (gGame.visibleCells) === (gSize ** 2) - gGame.mineLocation.length
    ) {
        victory();
        return true
    }
    else if (!flagging && gBoard[i][j].isMine) {
        loseLife(el);
        return true
    }
}

function victory() {
    gGame.isOn = false;
    gGame.mineLocation.forEach(function (currVal) {
        gBoard[currVal.i][currVal.j].isDisplayed = true;
    })
    renderBoard(gBoard);
    victoryFace()
    openModal(true);
    clearInterval(gTimerId);
    gTimerId = null;


}

function lose() {
    gGame.isOn = false
    gGame.mineLocation.forEach(function (currVal) {
        gBoard[currVal.i][currVal.j].isDisplayed = true
    })
    renderBoard(gBoard);
    loseFace()
    openModal(false);
    clearInterval(gTimerId);
    gTimerId = null;
}

function loseLife(el) {
    var elLife = document.querySelector('.life')
    var elCell = el
    gGame.lifeCounter--
    if (gGame.lifeCounter === 0) {
        lose();
    }
    else {
        elCell.classList.add('flicker')
        elCell.innerText = MINE
        gBoard[elCell.dataset.i][elCell.dataset.j].isDisplayed = true
        setTimeout(function () {
            elCell.classList.remove('flicker')
            renderBoard(gBoard)
        }, 2500);
    }
    var strHTML = HTMLSyringe(gGame.lifeCounter, '❤');
    elLife.innerText = strHTML;
}

function resetGame() {
    clearInterval(gTimerId)
    gTimerId = null;
    gGame.isOn = false;
    gGame.lifeCounter = 3;
    gGame.markedCount = 0;
    gGame.mineLocation = [];
    gGame.visibleCells = 0;
    document.querySelector('.timer').innerText = '000'
    document.querySelector('.life').innerText = '❤❤❤'
    document.querySelector('input[value="8"]').checked = 'checked'
    
    if (gIsModalOpen) closeModal()
    init()
}


function openModal(isWin) {
    gIsModalOpen = true;
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'initial'
    var winOrLose = isWin ? 'You Win!' : 'You Lose!'
    setTimeout(() => { elModal.style.opacity = '89%' }, 10)
    elModal.querySelector('span').innerText = winOrLose
    
}

function closeModal() {
    gIsModalOpen = false;
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none';
    setTimeout(() => { elModal.style.opacity = '0%' }, 10)
}


function hintActive() {

}


