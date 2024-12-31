const BOARD_SIZE = 8;
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

export const createInitialBoard = () => {
  const board = Array(BOARD_SIZE).fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
  
  // Set initial pieces
  const mid = BOARD_SIZE / 2;
  board[mid-1][mid-1] = 'white';
  board[mid-1][mid] = 'black';
  board[mid][mid-1] = 'black';
  board[mid][mid] = 'white';
  
  return board;
};

export const isValidMove = (board, row, col, player) => {
  if (board[row][col] !== null) return false;
  
  return DIRECTIONS.some(([dx, dy]) => {
    return canFlipInDirection(board, row, col, dx, dy, player);
  });
};

const canFlipInDirection = (board, row, col, dx, dy, player) => {
  let x = row + dx;
  let y = col + dy;
  let foundOpponent = false;
  
  while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
    if (board[x][y] === null) return false;
    if (board[x][y] === player) return foundOpponent;
    foundOpponent = true;
    x += dx;
    y += dy;
  }
  
  return false;
};

export const makeMove = (board, row, col, player) => {
  const newBoard = board.map(row => [...row]);
  newBoard[row][col] = player;
  
  DIRECTIONS.forEach(([dx, dy]) => {
    if (canFlipInDirection(board, row, col, dx, dy, player)) {
      flipPiecesInDirection(newBoard, row, col, dx, dy, player);
    }
  });
  
  return newBoard;
};

const flipPiecesInDirection = (board, row, col, dx, dy, player) => {
  let x = row + dx;
  let y = col + dy;
  
  while (board[x][y] !== player) {
    board[x][y] = player;
    x += dx;
    y += dy;
  }
};

export const getValidMoves = (board, player) => {
  const moves = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (isValidMove(board, row, col, player)) {
        moves.push([row, col]);
      }
    }
  }
  
  return moves;
};

export const countPieces = (board) => {
  let black = 0;
  let white = 0;
  
  board.forEach(row => {
    row.forEach(cell => {
      if (cell === 'black') black++;
      if (cell === 'white') white++;
    });
  });
  
  return { black, white };
};