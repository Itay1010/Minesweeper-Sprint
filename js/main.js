'use strict'

const EMPTY = ' ';
const MINE = '💣';
const FLAG = '🚩';

var gGame = {
    isOn: false,
    mineLocation: [],
    visibleCells: 0,
    markedCount: 0,
    lifeCounter: 3,
    hintCounter: 3
}
var gBoard, gBestTime, gTimerId, gElTimer, gHintActive;
var gSize = 8;
var gIsModalOpen = false

function init() {
    gHintActive = false
    gBoard = creatBoard(gSize, gSize);
    gElTimer = document.querySelector('.timer span')
    renderBoard(gBoard)
    displayBestScore()

}

function startGame(i, j) {
    gGame.isOn = true
    placeMines(gBoard, i, j)
    setMinesCount(gBoard)
    timerSet()
}

function stopGame() {
    clearInterval(gTimerId);
    gTimerId = null;
    renderBoard(gBoard);

}


function checkClick(flagging, i, j, el) {
    console.log('checking');
    if (gGame.markedCount === gGame.mineLocation.length &&
        gGame.visibleCells === (gSize ** 2) - gGame.markedCount
    ) {
        victory();
        return false
    }
    else if (!flagging && gBoard[i][j].isMine) {
        loseLife(el, i, j);
        return false
        // checkVictory(true, i, j, el)
    }
    return true
}

function victory() {
    storeBestScore()
    gGame.isOn = false;
    gGame.mineLocation.forEach(function (currVal) {
        gBoard[currVal.i][currVal.j].isDisplayed = true;
    })
    victoryFace()
    openModal(true);
    stopGame()
}

function lose() {
    gGame.isOn = false
    gGame.mineLocation.forEach(function (currVal) {
        gBoard[currVal.i][currVal.j].isDisplayed = true
    })
    loseFace()
    openModal(false);
    stopGame()

}

function loseLife(el) {
    var elLife = document.querySelector('.life span')
    var elCell = el
    console.log('elCell', elCell)
    gGame.lifeCounter--
    gGame.markedCount++
    elCell.classList.add('flicker')
    elCell.innerText = MINE
    revealCell(+elCell.dataset.i, +elCell.dataset.j)
    setTimeout(function () {
        elCell.classList.remove('flicker')
        renderBoard(gBoard)
    }, 2500);

    var strHTML = HTMLSyringe(gGame.lifeCounter, '❤');
    elLife.innerText = strHTML;
    if (gGame.lifeCounter === 0) lose();
    if (gGame.markedCount === gGame.mineLocation.length &&
        gGame.visibleCells === (gSize ** 2) - gGame.markedCount
    ) {
        victory();
    }
}

function resetGame() {
    clearInterval(gTimerId)
    var elTopBar = document.querySelector('.top-bar')
    gTimerId = null;
    gGame.isOn = false;
    gGame.lifeCounter = 3;
    gGame.markedCount = 0;
    gGame.mineLocation = [];
    gGame.visibleCells = 0;
    displayBestScore()
    elTopBar.querySelector('.timer span').innerText = '000'
    elTopBar.querySelector('.life span').innerText = '❤❤❤'
    elTopBar.querySelector('.face').innerText = '🙂'
    elTopBar.querySelectorAll('.hints button').forEach((el) => {
        el.innerHTML = '<img src="./img/lightbulb-on.png" alt=""></img>'
        el.disabled = false
    })

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
