import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import Board from "./Board";
import BoardPosition from "@/components/chess/BoardPosition";
import { ChessBoard } from "@/components/chess/ChessBoard";
import { ChessPosition, Chessboard } from "../../../../../typings";
import _, { set } from "lodash";

const idToLocation = (id: UniqueIdentifier): BoardPosition => {
  // get coordinates for the board
  id = id.toString();

  const x = parseInt(id?.[0] ?? "0");
  const y = parseInt(id?.[1] ?? "0");
  return new BoardPosition(x, y);
};
export default function Game() {
  const [chessBoard, setChessBoard] = useState<ChessBoard>();
  const [board, setBoard] = useState<Chessboard>(); //board[1]![0] is the white pawn   board[6]![0] is the black pawn
  const [turn, setTurn] = useState<"w" | "b">("w");
  const [isCheck, setIsCheck] = useState<boolean>(false);
  const [isCheckMate, setIsCheckMate] = useState<boolean>(false);
  const [win, setWin] = useState<"white" | "black" | "n">("n");
  useEffect(() => {
    const test = new ChessBoard();
    setChessBoard(test);
    setBoard(test.board);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    //make sure that the drag is valid
    if (!chessBoard) return;
    if (event.over == null || event.active == null) return;
    const start = idToLocation(event.active?.id);
    const end = idToLocation(event.over?.id);
    //if (start.x === end.x && start.y === end.y) return;
    const newBoard = chessBoard.move(start, end);
    if (!newBoard) {
      return false;
    }
    setTurn(chessBoard.turn);
    setIsCheck(chessBoard.check);
    if (chessBoard.checkmate) {
      setWin(chessBoard.winner);
    }
    setIsCheckMate(chessBoard.checkmate);
  };

  const handleDragStart = (event: DragStartEvent) => {
    console.log("piece lifted");
    // chessBoard?.getPiece(idToLocation(e))
  };
  return (
    <>
      <div className="flex h-20 flex-row justify-center ">
        <span className="flex flex-col justify-center text-4xl">
          {isCheckMate && <span>{win} won</span>}
          {isCheck && !isCheckMate && <span>Check</span>}
          {/* {!isCheck && !isCheckMate && <span>{turn}</span>} */}
        </span>
      </div>
      <div className="flex flex-row justify-center">
        {/* <div className="flex flex-col justify-end w-10">
          {initialBoard.deadPieces
            .filter((p) => p.color === "white")
            .map((piece) => {
              return (
                <img
                  src={`/chessPieces/${piece.color}${piece.type}.png`}
                  alt={`/chessPieces/${piece.color}${piece.type}.png`}
                  className="h-10 w-10 shrink"
                  key={piece.id}
                />
              );
            })}
        </div> */}
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <div className="flex flex-col">
            {board && (
              <Board
                board={board}
                className={`rounded-2xl relative overflow-hidden border-4 ${turn === "w" ? "border-white" : "border-black"
                  }`}
              />
            )}
          </div>
        </DndContext>
        {/* <div className="flex flex-col justify-start w-10 overflow-hidden">
          {initialBoard.deadPieces
            .filter((p) => p.color === "black")
            .map((piece) => {
              return (
                <img
                  src={`/chessPieces/${piece.color}${piece.type}.png`}
                  alt={`/chessPieces/${piece.color}${piece.type}.png`}
                  className="h-10 w-10"
                  key={piece.id}
                />
              );
            })}
        </div> */}
      </div>
    </>
  );
}
