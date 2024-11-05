// Display page / UI
// 1. Make a board with tiles/mines

import { TILE_STATUSES, createBoard, markTile, revealTile } from "./minesweeper.js"

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10


const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector('.board');
const mineLeftText = document.querySelector("[data-mine-count]");



board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);
        tile.element.addEventListener('click', () => {}) // Left click on tiles
        tile.element.addEventListener('contextmenu', e => { // Right click on tiles
            e.preventDefault()
            markTile(tile)
            listMinesLeft()
        })
    })
})
boardElement.style.setProperty("--size", BOARD_SIZE)
mineLeftText.textContent = NUMBER_OF_MINES

function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
      return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    }, 0)

    mineLeftText.textContent = NUMBER_OF_MINES - markedTilesCount
}

// 2.  / reveal tiles
// 3.  / mark tiles
// 4. Check or win/lose