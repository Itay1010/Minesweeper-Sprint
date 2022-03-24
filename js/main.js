'use strict'

const EMPTY = ' ';
const MINE = '💣';
const FLAG = '🚩';

var gGame = {
    isOn: false,
    mineLocation: [],
    visibleCells: 0,
    markedCount: 0
}
var gBoard, gTimerId, gElTimer;
var gSize = 8;
var gIsModalOpen = false

function init() {
    gBoard = creatBoard(gSize, gSize);
    gElTimer = document.querySelector('.timer')
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

function placeMines(board, cellI, cellJ) {
    var minesCount = 12
    if (gSize === 4) minesCount = 2
    else if (gSize === 8) minesCount = 12
    else if (gSize === 12) minesCount = 30
    for (var c = 0; c < minesCount; c++) {
        var randCell = getRandCell(board, cellI, cellJ)
        board[randCell.i][randCell.j].isMine = true
        gGame.mineLocation.push(randCell)

    }
}

function countMines(mat, rowIdx, colIdx) {
    var mines = 0
    var cell = mat[rowIdx][colIdx]
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            // console.log('j:', j)
            var cell = mat[i][j]
            if (cell.isMine) {
                mines++
            }
        }
    }
    return mines
}

function setMinesCount(mat) {
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[0].length; j++) {
            var currCell = mat[i][j]
            var currCount = countMines(mat, i, j)
            if (currCell.isMine || currCount === 0) continue
            mat[i][j].minesAround = currCount
        }
    }
}

function cellClicked(ev, i, j) {
    if (gGame.visibleCells === 0 && ev.button === 0) startGame(i, j)
    else if (gBoard[i][j].isDisplayed || !gGame.isOn) return

    if (ev.button === 0 && !gBoard[i][j].isFlagged) {
        if (checkVictory(false, i, j)) return;
        recursiveReveal(gBoard, i, j);
    }
    else if (ev.button === 2) {
        flagCell(i, j);
        if (checkVictory(true, i, j)) return;
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
        console.log('returning');
        return
    }
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = mat[i][j]
            // debugger
            if (cell.minesAround === 0 && !cell.isMine && !cell.isDisplayed) {
                recursiveReveal(mat, i, j)
            } else if (!cell.isMine) {
                revealCell(i, j)
            }
        }
    }
    renderBoard(gBoard)
    return
}

function flagCell(i, j) {
    //just for the model
    var modelCell = gBoard[i][j]
    if (modelCell.isFlagged) {
        if (modelCell.isMine) gGame.markedCount--
        modelCell.isFlagged = false
        return
    } else if (modelCell.isMine) gGame.markedCount++
    modelCell.isFlagged = true
}

function checkVictory(flagging, i, j) {
    if ((gGame.visibleCells) === (gSize ** 2) - gGame.mineLocation.length &&
        gGame.markedCount === gGame.mineLocation.length) {
        victory();
        return true
    }
    else if (!flagging && gBoard[i][j].isMine) {
        lose();
        return true
    }
}

function victory() {
    gGame.isOn = false
    gGame.mineLocation.forEach(function (currVal) {
        gBoard[currVal.i][currVal.j].isDisplayed
    })
    renderBoard(gBoard)
    openModal(true)
    clearInterval(gTimerId)
    gTimerId = null


}

function lose() {
    gGame.isOn = false
    gGame.mineLocation.forEach(function (currVal) {
        gBoard[currVal.i][currVal.j].isDisplayed = true
    })
    renderBoard(gBoard)
    openModal(false)
    clearInterval(gTimerId)
    gTimerId = null
}

function resetGame() {
    clearInterval(gTimerId)
    gTimerId = null
    gGame.isOn = false
    gGame.markedCount = 0
    gGame.mineLocation = []
    gGame.visibleCells = 0
    document.querySelector('.timer').innerText = '000'
    if (gIsModalOpen) closeModal()
    init()
}


function openModal(isWin) {
    gIsModalOpen = true
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'initial'
    var winOrLose = isWin ? 'You Win!' : 'You Lose!'
    setTimeout(() => { elModal.style.opacity = '100%' }, 10)
    elModal.querySelector('span').innerText = winOrLose
}

function closeModal() {
    gIsModalOpen = false
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    setTimeout(() => { elModal.style.opacity = '0%' }, 10)
}