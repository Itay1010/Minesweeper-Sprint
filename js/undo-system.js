'use strict'

var gameClone, boardClone;
var gRecord = []

function packageRecord() {
    var packets = []
    gameClone = { ...gGame }
    boardClone = { ...gBoard }
    packets.push(gameClone)
    packets.push(boardClone)
    gRecord.push(packets)
}

function undoMove() {
    var prevGameState = gRecord.pop()
    gGame = prevGameState[0]
    gBoard = prevGameState[1]
    console.log('gBoard', gBoard)
    // renderBoard(gBoard)
}
