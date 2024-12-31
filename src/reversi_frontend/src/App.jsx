import React, { useState, useCallback } from 'react';
import { Board } from './components/Board';
import { GameInfo } from './components/GameInfo';
import { 
  createInitialBoard, 
  isValidMove, 
  makeMove, 
  getValidMoves,
  countPieces 
} from './utils/gameLogic';

function App() {
  const [gameState, setGameState] = useState(() => {
    const initialBoard = createInitialBoard();
    const { black, white } = countPieces(initialBoard);
    return {
      board: initialBoard,
      currentPlayer: 'black',
      blackCount: black,
      whiteCount: white,
      gameOver: false
    };
  });

  const validMoves = getValidMoves(gameState.board, gameState.currentPlayer);

  const handleCellClick = useCallback((row, col) => {
    if (gameState.gameOver || !isValidMove(gameState.board, row, col, gameState.currentPlayer)) {
      return;
    }

    const newBoard = makeMove(gameState.board, row, col, gameState.currentPlayer);
    const nextPlayer = gameState.currentPlayer === 'black' ? 'white' : 'black';
    const { black: blackCount, white: whiteCount } = countPieces(newBoard);
    
    // Check if next player has valid moves
    const hasValidMoves = getValidMoves(newBoard, nextPlayer).length > 0;
    const currentPlayerCanMove = getValidMoves(newBoard, gameState.currentPlayer).length > 0;
    
    const gameOver = !hasValidMoves && !currentPlayerCanMove;
    const actualNextPlayer = hasValidMoves ? nextPlayer : gameState.currentPlayer;

    setGameState({
      board: newBoard,
      currentPlayer: actualNextPlayer,
      blackCount,
      whiteCount,
      gameOver
    });
  }, [gameState]);

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
      <GameInfo
        currentPlayer={gameState.currentPlayer}
        blackCount={gameState.blackCount}
        whiteCount={gameState.whiteCount}
        gameOver={gameState.gameOver}
      />
      <Board
        board={gameState.board}
        validMoves={validMoves}
        onCellClick={handleCellClick}
      />
    </div>
  );
}

export default App;