import { useDroppable } from "@dnd-kit/core";
// import { Chesspiece, ChessPosition } from "../../../typings";
import { chessPiece, ChessPiece } from "./ChessPiece";

interface Props {
  chessPiece: Chesspiece | null;
  position: ChessPosition;
  id: string;
}

export default function Square({ chessPiece = null, position, id }: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${position.x}${position.y}`,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };
  const background =
    (position.x + position.y) % 2 === 0 ? "bg-gray-300" : "bg-gray-500";
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={` relative flex  h-10 w-10 flex-row  justify-center sm:h-12 sm:w-12 lg:h-16 lg:w-16 ${background}`}
    >
      {chessPiece && (
        <ChessPiece
          src={`/chessPieces/${chessPiece.color}${chessPiece.type}.png`}
          alt={`/chessPieces/${chessPiece.color}${chessPiece.type}.png`}
          x={position.x}
          y={position.y}
          id={id}
        />
      )}
    </div>
  );
}