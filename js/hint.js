'use strict'


function hintActive() {
    if (gGame.hintCounter === 0) return
    gHintActive = true
    renderBoard(gBoard)
}

function hintOff() {
    gGame.hintCounter--
    var elHint = document.querySelector('.hints span').innerText = gGame.hintCounter
    gHintActive = false

}

function revealAround(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            revealCell(i, j)
        }
    }
    hintOff()
    renderBoard(gBoard)
}