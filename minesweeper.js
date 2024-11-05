// Define statuses for tiles
export const TILE_STATUSES = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
};

// Create a new game board with specified size and number of mines
export function createBoard(boardSize, numberOfMines) {
  const board = [];
  const minePositions = getMinePositions(boardSize, numberOfMines);

  // Create a grid of tiles
  for (let x = 0; x < boardSize; x++) {
    const row = [];
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement("div");
      element.dataset.status = TILE_STATUSES.HIDDEN; // Set initial status

      const tile = {
        element,
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, { x, y })), // Set as mine if in mine positions
        get status() {
          return element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      };

      row.push(tile);
    }
    board.push(row);
  }

  return board;
}

// Toggle tile status between marked and hidden
export function markTile(tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED) {
    return;
  }

  tile.status = tile.status === TILE_STATUSES.MARKED
    ? TILE_STATUSES.HIDDEN
    : TILE_STATUSES.MARKED;
}

// Reveal the tile and check adjacent tiles if necessary
export function revealTile(board, tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN) {
    return;
  }

  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE; // Mark as mine if it's a mine
    return;
  }

  tile.status = TILE_STATUSES.NUMBER; // Otherwise mark as number
  const adjacentTiles = nearbyTiles(board, tile);
  const mines = adjacentTiles.filter((t) => t.mine);
  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, board)); // Reveal surrounding tiles if no mines are adjacent
  } else {
    tile.element.textContent = mines.length; // Display number of adjacent mines
  }
}

// Check if all non-mine tiles are revealed
export function checkWin(board) {
  return board.every((row) => {
    return row.every((tile) => {
      return (
        tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUSES.HIDDEN ||
            tile.status === TILE_STATUSES.MARKED))
      );
    });
  });
}

// Check if any mine tile is revealed (loss condition)
export function checkLose(board) {
  return board.some((row) => {
    return row.some((tile) => tile.status === TILE_STATUSES.MINE);
  });
}

// Generate random mine positions
function getMinePositions(boardSize, numberOfMines) {
  const positions = [];

  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    };

    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position); // Add unique mine position
    }
  }

  return positions;
}

// Check if two positions match
function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}

// Generate a random number within the given size
function randomNumber(size) {
  return Math.floor(Math.random() * size);
}

// Get all tiles adjacent to the specified tile
function nearbyTiles(board, { x, y }) {
  const tiles = [];

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset];
      if (tile) tiles.push(tile);
    }
  }

  return tiles;
}
