// Player type constants
export const PLAYER = {
    BLACK: 'black',
    WHITE: 'white'
  };
  
  // Game state shape for reference
  export const initialGameState = {
    board: Array(8).fill(null).map(() => Array(8).fill(null)),
    currentPlayer: PLAYER.BLACK,
    blackCount: 2,
    whiteCount: 2,
    gameOver: false
  };
  
  // Valid moves type example
  export const moveShape = {
    row: 0,
    col: 0
  };
  
  // Game result constants
  export const GAME_RESULT = {
    BLACK_WINS: 'Black wins!',
    WHITE_WINS: 'White wins!',
    TIE: "It's a tie!"
  };