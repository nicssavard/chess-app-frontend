import { useState } from "react";
import { ChessBoard, chessBoard } from "./ChessBoard";
import { DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
// import { ChessPosition, Chessboard } from "../../../typings";
const initialBoard = chessBoard.getInstance();
initialBoard.initializeBoard();

const idToLocation = (id: UniqueIdentifier): ChessPosition => {
  // get coordinates for the board
  id = id.toString();

  const x = parseInt(id?.[0] ?? "0");
  const y = parseInt(id?.[1] ?? "0");
  return { x, y };
};
export default function ChessGame() {
  const [board, setBoard] = useState<Chessboard>(initialBoard.board); //board[1]![0] is the white pawn   board[6]![0] is the black pawn
  const [turn, setTurn] = useState<"white" | "black">("white");
  const [isCheck, setIsCheck] = useState<boolean>(false);
  const [isCheckMate, setIsCheckMate] = useState<boolean>(false);
  const [win, setWin] = useState<"white" | "black" | "none">("none");
  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over == null || event.active == null) return;
    const start = idToLocation(event.active?.id);
    const end = idToLocation(event.over?.id);

    if (
      start.x === undefined ||
      start.y === undefined ||
      end.x === undefined ||
      end.y === undefined
    ) {
      return;
    }
    // eslint-disable-next-line
    const pieceMoved = board[start.y]![start.x]; //coordinate system is flipped
    if (!pieceMoved) return;
    const boardStart = { x: start.y, y: start.x };
    const boardEnd = { x: end.y, y: end.x };
    // eslint-disable-next-line
    const newBoard = pieceMoved.move(boardStart, boardEnd);
    // Create a new copy of the board, then modify the copy

    // Update the staxxte with the modified copy
    if (!newBoard) {
      return false;
    }
    // eslint-disable-next-line
    setBoard(newBoard);
    setTurn(initialBoard.turn);
    setIsCheck(initialBoard.check);
    if (initialBoard.checkmate) {
      setWin(initialBoard.winner);
    }
    setIsCheckMate(initialBoard.checkmate);
    console.log(initialBoard);
  };

  return (
    <>
      <div className="flex h-20 flex-row justify-center ">
        <span className="flex flex-col justify-center text-4xl">
          {isCheckMate && <span>{win} won</span>}
          {isCheck && !isCheckMate && <span>Check</span>}
          {!isCheck && !isCheckMate && <span>{turn}</span>}
        </span>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col rounded-2xl">
          <ChessBoard board={board} />
        </div>
      </DndContext>
    </>
  );
}
