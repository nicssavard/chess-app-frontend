import { useDroppable } from "@dnd-kit/core";
import { Piece } from "./Piece";
import { ChessPosition, Chesspiece } from "../../../../../typings";

interface Props {
  chessPiece: Chesspiece | null;
  position: ChessPosition;
  id: string;
  effect: string;
}
const colorMap: { [key: string]: string } = {
  b: "black",
  w: "white",
};

export default function Square({
  chessPiece = null,
  position,
  id,
  effect,
}: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${position.x}${position.y}`,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };
  let background =
    (position.x + position.y) % 2 === 0 ? "bg-gray-500" : "bg-gray-300";
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={` relative flex  h-10 w-10 flex-row  justify-center sm:h-12 sm:w-12 lg:h-16 lg:w-16 ${background}`}
    >
      {effect === "move" && (
        <div className="absolute h-full w-full rounded-full bg-green-300 opacity-50"></div>
      )}
      {effect === "attack" && (
        <div className="absolute h-full w-full rounded-full bg-red-600 opacity-50"></div>
      )}
      {chessPiece && (
        <Piece
          src={`/chessPieces/${colorMap[chessPiece.getColor()]
            }${chessPiece.getType()}.png`}
          alt={`/chessPieces/${chessPiece.getColor()}${chessPiece.getType()}.png`}
          x={position.x}
          y={position.y}
          id={id}
        />
      )}
    </div>
  );
}
