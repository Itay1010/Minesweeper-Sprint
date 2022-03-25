'use strict'

let localElHint;

function hintActive(el) {
    localElHint = el
    if (gGame.hintCounter === 0 || !gGame.isOn) return
    gHintActive = true
    renderBoard(gBoard)
}

function hintOff(coords) {
    localElHint.disabled = true
    localElHint.querySelector('img').src = './img/lightbulb-off.png'
    gGame.hintCounter--
    gHintActive = false
    setTimeout(function () {
        coords.forEach((element) => {
            var idxI = element[0]
            var idxJ = element[1]
            gBoard[idxI][idxJ].isDisplayed = false
        })
        renderBoard(gBoard)
    }, 2000);
}

function revealAround(rowIdx, colIdx) {
    var coords = []
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (gBoard[i][j].isDisplayed) continue
            coords.push([i, j])
        }
    }
    coords.forEach((element) => {
        var idxI = element[0]
        var idxJ = element[1]
        gBoard[idxI][idxJ].isDisplayed = true
    })

    hintOff(coords)
    renderBoard(gBoard)
}