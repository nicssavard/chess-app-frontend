import { Chessboard, Chesspiece } from "../../../../../typings";
import Square from "./Square";

interface Props {
  board: Chessboard;
  possibleMoves: any[][];
  className?: string;
}

export default function Board({ board, possibleMoves, className }: Props) {
  const boardDisplayed = board.map((row, i) => {
    return (
      <div key={i} className="flex flex-row justify-center ">
        {row.map((piece: Chesspiece | null, j) => {
          return (
            <Square
              effect={possibleMoves[i][j]}
              chessPiece={piece}
              position={{ x: j, y: i }}
              id={`${j}${i}`}
              key={j}
            />
          );
        })}
      </div>
    );
  });

  return (
    <div className={`flex flex-col-reverse ${className}`}>{boardDisplayed}</div>
  );
}
