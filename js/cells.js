'use strict'

function cellClicked(el, ev, i, j) {
    //a VARY messy function, be gentle with it or it'll break the game!
    if (!gGame.visibleCells && ev.button === 0 && !gGame.markedCount) startGame(i, j)
    else if (gBoard[i][j].isDisplayed || !gGame.isOn) return
    if (gHintActive) {
        revealAround(i, j)
    }
    else if (ev.button === 0 && !gBoard[i][j].isFlagged) {
        if (checkClick(false, i, j, el)) {
            recursiveReveal(gBoard, i, j);
            checkClick(false, i, j, el)
            renderBoard(gBoard);
        }
    }
    else if (ev.button === 2) {
        flagCell(i, j);
        checkClick(true, i, j, el);
        renderBoard(gBoard);
    }    
}

function revealCell(i, j) {
    //just for the model
    //is being used to reveal all mines in both win and lose states
    var modelCell = gBoard[i][j]
    modelCell.isDisplayed = true;
    if (checkFlagging(i, j)) gGame.markedCount++
    else if (!modelCell.isMine) gGame.visibleCells++;
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
    return
}

function flagCell(i, j) {
    //just for the model
    var modelCell = gBoard[i][j]
    if (!modelCell.isFlagged) {
        modelCell.isFlagged = true;
        if (modelCell.isMine) {
            gGame.markedCount++
        }
    } else {
        modelCell.isFlagged = false;
        if (modelCell.isMine) {
            gGame.markedCount--
        }
    }
}

function checkFlagging(idxI, idxJ) {
    for (var i = 0; i > gGame.mineLocation; i++) {
        currMine = gGame.mineLocation[i]
        if (currMine.i === idxI && currMine.j === idxJ) return true
    }
}