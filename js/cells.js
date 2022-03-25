'use strict'


function cellClicked(el, ev, i, j) {
    if (!gGame.visibleCells && ev.button === 0 && !gGame.markedCount) startGame(i, j)
    else if (gBoard[i][j].isDisplayed || !gGame.isOn) return
    if (gHintActive) {
        revealAround(i, j)
        checkVictory(false, i, j, el)
    }
    else if (ev.button === 0 && !gBoard[i][j].isFlagged) {
        if (checkVictory(false, i, j, el)) return;
        recursiveReveal(gBoard, i, j, el);
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
    modelCell.isDisplayed = true;
    if (checkFlagging(i, j)) gGame.markedCount++
    else if (!modelCell.isMine)gGame.visibleCells++;
}

function recursiveReveal(mat, rowIdx, colIdx, el) {
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
    checkVictory(false, rowIdx, colIdx, el)
    return
}

function flagCell(i, j) {
    //just for the model
    var modelCell = gBoard[i][j]
    if (modelCell.isFlagged) {
        if (modelCell.isMine) {
            gGame.markedCount--
        }
        modelCell.isFlagged = false;
        return
    } else if (modelCell.isMine) {
        gGame.markedCount++
        return
    }
    modelCell.isFlagged = true;
}

function checkFlagging(idxI, idxJ) {
    for (var i = 0; i > gGame.mineLocation; i++) {
        currMine = gGame.mineLocation[i]
        console.log('currMine', currMine)
        if (currMine.i === idxI && currMine.j === idxJ) return true
    }
}