"use client";
import { Container } from "@/components/ui/Container";
import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import Board from "./Board";
import { ChessPosition } from "../../../../typings";
import useStore from "@/store/userStore";
import Waiting from "./Waiting";

const idToLocation = (id: UniqueIdentifier): ChessPosition => {
  // get coordinates for the board
  id = id.toString();

  const x = parseInt(id?.[0] ?? "0");
  const y = parseInt(id?.[1] ?? "0");
  return { x, y };
};

const fenToBoard = (fen: string): string[][] => {
  const rows = fen.split("/");
  const board: string[][] = [];
  for (let i = 0; i < 8; i++) {
    const row = rows[i];
    const newRow: string[] = [];
    for (let j = 0; j < row.length; j++) {
      const char = row[j];
      if (isNaN(parseInt(char))) {
        newRow.push(char);
      } else {
        for (let k = 0; k < parseInt(char); k++) {
          newRow.push("");
        }
      }
    }
    board.push(newRow);
  }
  return board;
};

const moveVerification = (
  start: ChessPosition,
  end: ChessPosition,
  board: string[][],
  turn: "w" | "b",
): boolean => {
  if (start.x === end.x && start.y === end.y) return false;
  const piece = board[start.y][start.x];
  const pieceColor = piece.toUpperCase() === piece ? "w" : "b";
  if (pieceColor != turn) return false;
  return true;
};

export default function Game() {
  const [isWaiting, setIsWaiting] = useState(false);
  const { user } = useStore((state) => ({ user: state.user }));
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [board, setBoard] = useState<string[][] | null>(null);
  const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(null); //board[1]![0] is the white pawn   board[6]![0] is the black pawn
  const [turn, setTurn] = useState<"w" | "b">("w");
  const [isCheck, setIsCheck] = useState<boolean>(false);
  const [isCheckMate, setIsCheckMate] = useState<boolean>(false);
  const [win, setWin] = useState<"white" | "black" | "none">("none");
  useEffect(() => {
    // Initialize WebSocket connection
    var ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_SERVER_WS}/chessGame/?userId=${user?.id}`,
    );
    setWebSocket(ws);

    return () => {
      ws.close();
    };
  }, [user?.id]);

  useEffect(() => {
    if (webSocket) {
      webSocket.onopen = (e) => {
        console.log("WebSocket connection opened", e);
      };

      webSocket.onmessage = (e) => {
        const newMessage = JSON.parse(e.data);
        console.log(newMessage);
        let board = newMessage;
        let newBoard;
        if (newMessage.messageType === "WAITING_FOR_OPPONENT") {
          console.log("waiting");
          setIsWaiting(true);
          return;
        }
        if (newMessage.messageType === "GAME_STARTED") {
          setIsWaiting(false);
        }
        if (newMessage.color) {
          board = JSON.parse(newMessage.board);
          // first message to set the color
          newBoard = fenToBoard(
            board.fen.split(" ")[0].split("/").reverse().join("/"),
          );
          setPlayerColor(newMessage.color);
        } else {
          newBoard = fenToBoard(
            board.fen.split(" ")[0].split("/").reverse().join("/"),
          );
        }
        setTurn(board.turn);
        setIsCheck(board.check);
        setIsCheckMate(board.checkmate);
        setWin(board.winner);
        setBoard(newBoard);
      };

      webSocket.onclose = (e) => {
        console.log("WebSocket connection closed", e);
      };

      webSocket.onerror = (e) => {
        console.error("WebSocket error", e);
      };
    }
  }, [webSocket]);

  const handleDragEnd = (event: DragEndEvent) => {
    //make sure that the drag is valid
    // if (!chessBoard) return;
    if (event.over == null || event.active == null) return;
    const start = idToLocation(event.active?.id);
    const end = idToLocation(event.over?.id);
    if (!moveVerification(start, end, board!, turn)) return false;
    if (webSocket) {
      webSocket.send(JSON.stringify({ start, end }));
    }
    // const newBoard = chessBoard.move(start, end);
    // if (!newBoard) {
    //   return false;
    // }
    // setTurn(chessBoard.turn);
    // setIsCheck(chessBoard.check);
    // if (chessBoard.checkmate) {
    //   setWin(chessBoard.winner);
    // }
    // setIsCheckMate(chessBoard.checkmate);
  };
  if (isWaiting) {
    return <Waiting />;
  }
  return (
    <Container>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col">
          {board && (
            <Board
              playerColor={playerColor}
              board={board}
              className={`rounded-2xl relative overflow-hidden border-4 ${turn === "w" ? "border-white" : "border-black"
                }`}
            />
          )}
        </div>
      </DndContext>
    </Container>
  );
}
