import React from 'react';
import { Cell } from './Cell';

export const Board = ({ board, validMoves, onCellClick }) => {
  const isValidMove = (row, col) => {
    return validMoves.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="inline-block bg-green-800 p-1 rounded-lg shadow-xl">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              isValid={isValidMove(rowIndex, colIndex)}
              onClick={() => onCellClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};