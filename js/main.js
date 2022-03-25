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
var gBoard, gTimerId, gElTimer, gHintActive;
var gSize = 8;
var gIsModalOpen = false

function init() {
    gHintActive = false
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

function stopGame() {
    clearInterval(gTimerId);
    gTimerId = null;
    renderBoard(gBoard);
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

function checkVictory(flagging, i, j, el) {
    if (gGame.markedCount === gGame.mineLocation.length &&
        gGame.visibleCells === (gSize ** 2) - gGame.markedCount
    ) {
        victory();
        return true
    }
    else if (!flagging && gBoard[i][j].isMine) {
        loseLife(el, i, j);
        checkVictory(true, i, j, el)
        return true
    }
}

function victory() {
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
    gGame.lifeCounter--
    gGame.markedCount++
    if (gGame.lifeCounter === 0) {
        lose();
    }
    else {
        elCell.classList.add('flicker')
        elCell.innerText = MINE
        revealCell(+elCell.dataset.i, +elCell.dataset.j)
        setTimeout(function () {
            elCell.classList.remove('flicker')
            renderBoard(gBoard)
        }, 2500);
    }
    var strHTML = HTMLSyringe(gGame.lifeCounter, '❤');
    elLife.innerText = strHTML;
    return
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
    elTopBar.querySelector('.timer').innerText = '000'
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


