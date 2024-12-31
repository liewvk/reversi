import React from 'react';
import { CircleDot } from 'lucide-react';

export const GameInfo = ({
  currentPlayer,
  blackCount,
  whiteCount,
  gameOver
}) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold mb-6 text-green-800">Reversi</h1>
      
      <div className="flex justify-center gap-12 mb-4">
        <div className="flex items-center gap-2">
          <CircleDot className="text-black" size={24} />
          <span className="text-xl font-semibold">{blackCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <CircleDot className="text-white" size={24} />
          <span className="text-xl font-semibold">{whiteCount}</span>
        </div>
      </div>

      {!gameOver ? (
        <div className="text-lg">
          Current Player: 
          <span className={`font-bold ml-2 ${
            currentPlayer === 'black' ? 'text-black' : 'text-gray-600'
          }`}>
            {currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}
          </span>
        </div>
      ) : (
        <div className="text-xl font-bold text-green-800">
          Game Over! {blackCount === whiteCount 
            ? "It's a tie!" 
            : `${blackCount > whiteCount ? 'Black' : 'White'} wins!`}
        </div>
      )}
    </div>
  );
};