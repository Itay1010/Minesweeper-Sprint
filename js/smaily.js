'use strict'


function faceToSmile(elFace) {
    elFace.innerText = '😀'
}

function faceToNoraml(elFace) {
    elFace.innerText = '🙂'
}

function victoryFace() {
    var elFace = document.querySelector('.face')
    elFace.innerText = '😎'
}

function loseFace() {
    var elFace = document.querySelector('.face')
    elFace.innerText = '🤯'
}