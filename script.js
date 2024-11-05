// Import functions and constants from minesweeper.js
import {
  TILE_STATUSES,
  createBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose,
} from "./minesweeper.js";

// Set board size and number of mines
const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 3;

// Create the board with tiles and mines
const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);

// Get elements from the DOM to display the board and messages
const boardElement = document.querySelector(".board");
const mineLeftText = document.querySelector("[data-mine-count]");
const messageText = document.querySelector(".subtext");

// Loop over each tile in the board and add it to the DOM
board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.element);
    
    // Add event listener for left click (reveal tile)
    tile.element.addEventListener("click", () => {
      revealTile(board, tile);
      checkGameEnd();
    });

    // Add event listener for right click (mark tile)
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault();  // Prevents context menu from opening
      markTile(tile);
      listMinesLeft();  // Update remaining mine count
    });
  });
});

// Set CSS custom property to define board size
boardElement.style.setProperty("--size", BOARD_SIZE);

// Display initial mine count
mineLeftText.textContent = NUMBER_OF_MINES;

// Function to update and display the count of unmarked mines
function listMinesLeft() {
  const markedTilesCount = board.reduce((count, row) => {
    return count + row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length;
  }, 0);

  mineLeftText.textContent = NUMBER_OF_MINES - markedTilesCount;
}

// Function to check if the game is won or lost
function checkGameEnd() {
  const win = checkWin(board);
  const lose = checkLose(board);

  // Disable further clicks if game is over
  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true });
    boardElement.addEventListener("contextmenu", stopProp, { capture: true });
  }

  // Display appropriate message for win or lose
  if (win) {
    messageText.textContent = "You win!";
  }
  if (lose) {
    messageText.textContent = "You lose...";
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile); // Unmark wrong tiles
        if (tile.mine) revealTile(board, tile); // Reveal all mines
      });
    });
  }
}

// Prevent further click events if the game is over
function stopProp(e) {
  e.stopImmediatePropagation();
}
