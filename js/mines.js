'use strict'


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

