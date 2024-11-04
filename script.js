// Display page / UI
// 1. Make a board with tiles/mines

import { createBoard } from "./minesweeper.js"

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10


const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector('.board');
const mineLeftText = document.querySelector("[data-mine-count]");



board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element)
    })
})
boardElement.style.setProperty("--size", BOARD_SIZE)
mineLeftText.textContent = NUMBER_OF_MINES

// 2. left click on tiles / reveal tiles
// 3. Right click on tiles / mark tiles
// 4. Check or win/lose