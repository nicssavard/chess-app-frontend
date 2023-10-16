import { useDroppable } from "@dnd-kit/core";
import { Piece } from "./Piece";
import { ChessPosition } from "../../../../typings";

interface Props {
  playerColor: "w" | "b" | null;
  chessPiece: string | null;
  position: ChessPosition;
  id: string;
}

const pieceMap: { [key: string]: string } = {
  p: "blackPawn",
  r: "blackRook",
  n: "blackKnight",
  b: "blackBishop",
  q: "blackQueen",
  k: "blackKing",
  P: "whitePawn",
  R: "whiteRook",
  N: "whiteKnight",
  B: "whiteBishop",
  Q: "whiteQueen",
  K: "whiteKing",
};

export default function Square({
  chessPiece = null,
  position,
  id,
  playerColor,
}: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${position.x}${position.y}`,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };
  const background =
    (position.x + position.y) % 2 === 0 ? "bg-gray-500" : "bg-gray-300";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={` relative flex  h-10 w-10 flex-row  justify-center sm:h-12 sm:w-12 lg:h-16 lg:w-16 ${background}`}
    >
      {chessPiece && (
        <Piece
          canDrag={playerColor === pieceMap[chessPiece][0]}
          src={`/chessPieces/${pieceMap[chessPiece] || chessPiece}.png`}
          alt={`/chessPieces/${pieceMap[chessPiece] || chessPiece}.png`}
          x={position.x}
          y={position.y}
          id={id}
        />
      )}
    </div>
  );
}
