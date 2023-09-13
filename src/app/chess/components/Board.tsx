import Square from "./Square";

interface Props {
  playerColor: "w" | "b" | null;
  board: string[][];
  className?: string;
}

export default function Board({ board, className, playerColor }: Props) {
  const boardDisplayed = board.map((row, i) => {
    return (
      <div key={i} className="flex flex-row justify-center ">
        {row.map((piece: string, j) => {
          return (
            <Square
              playerColor={playerColor}
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
