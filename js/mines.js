'use strict'

let lElManualMineBtn;

var gManualMine = {
    isOn: false,
    minesLeft: 0,
    secondPhase: false

}

function placeMines(board, cellI, cellJ, elCell) {
    var minesCount = 12
    if (gSize === 4) minesCount = 2
    else if (gSize === 8) minesCount = 12
    else if (gSize === 12) minesCount = 30
    if (!gManualMine.isOn) {
        for (var c = 0; c < minesCount; c++) {
            var randCell = getRandCell(board, cellI, cellJ)
            board[randCell.i][randCell.j].isMine = true
            gGame.mineLocation.push(randCell)
        }
    } else {
        if (gGame.mineLocation.length === 0) gManualMine.minesLeft = minesCount
        gBoard[cellI][cellJ].isMine = true
        gGame.mineLocation.push({ i: cellI, j: cellJ })
        gManualMine.minesLeft--
        placed(cellI, cellJ, elCell)
        if (gManualMine.minesLeft === 0) startGame()
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

function boom(elBtn) {
    var count = 0
    gGame.isBoom = true
    resetGame()
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (count % 7 === 0 || count === 1) {
                gBoard[i][j].isMine = true
                gGame.mineLocation.push({ i, j })
            }
            count++
        }
    }
    elBtn.disabled = true
}

function manuelSetOn(el) {
    var elMinesos = document.querySelector('.mines-left span')
    lElManualMineBtn = el
    gManualMine.isOn = true
    document.querySelector('table').classList.add('placing-mines')
    elMinesos.style.color = 'inherit'
    elMinesos.innerText = `X`
}

function manuelSetOff() {
    document.querySelector('.placing-mines').classList.remove('placing-mines')
    var elMinesos = document.querySelector('.mines-left span')
    elMinesos.style.color = 'transparent'
    lElManualMineBtn.disabled = true
}

function placed(cellI, cellJ, elCell) {
    document.querySelector('.mines-left span').innerText = `X${gManualMine.minesLeft}`
    elCell.innerText = MINE
    lElManualMineBtn
}
