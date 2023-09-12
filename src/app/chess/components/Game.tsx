"use client";
import { Container } from "@/components/ui/Container";
import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import Board from "@/app/test/components/Board";
import { ChessPosition } from "../../../../typings";
import useStore from "@/store/userStore";

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

interface ChessGame {
  gameId?: number;
  gameType: "random" | "bot" | "friend";
}
export default function Game({ gameId, gameType }: ChessGame) {
  const { user } = useStore((state) => ({ user: state.user }));
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [board, setBoard] = useState<string[][] | null>(null);
  const [userColor, setUserColor] = useState<"w" | "b" | null>(null); //board[1]![0] is the white pawn   board[6]![0] is the black pawn
  const [turn, setTurn] = useState<"w" | "b">("w");
  const [isCheck, setIsCheck] = useState<boolean>(false);
  const [isCheckMate, setIsCheckMate] = useState<boolean>(false);
  const [win, setWin] = useState<"white" | "black" | "none">("none");
  console.log(userColor);
  useEffect(() => {
    // Initialize WebSocket connection
    if (gameId && user?.id) {
      var ws = new WebSocket(
        `ws://127.0.0.1:8000/chessGame?chessGameId=${gameId}&userId=${user?.id}`
      );
    } else {
      var ws = new WebSocket(
        `ws://127.0.0.1:8000/chessGame?chessGameId=${""}&userId=${user?.id}`
      );
    }
    setWebSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (webSocket) {
      webSocket.onopen = (e) => {
        console.log("WebSocket connection opened", e);
      };

      webSocket.onmessage = (e) => {
        // console.log(`Message received: ${e.data}`);
        const newMessage = JSON.parse(e.data);
        console.log(newMessage);
        let newBoard;
        if (newMessage.color) {
          newBoard = fenToBoard(
            newMessage.board.fen.split(" ")[0].split("/").reverse().join("/")
          );
          setUserColor(newMessage.color);
        } else {
          // const newBoard = newMessage.fen
          //   .split(" ")[0]
          //   .split("/")
          //   .reverse()
          //   .join("/");
          newBoard = fenToBoard(
            newMessage.fen.split(" ")[0].split("/").reverse().join("/")
          );
        }
        console.log(newBoard);
        // setChat((chat) => {
        //   if (!chat) return null;
        //   return {
        //     ...chat,
        //     messages: [...chat.messages, newMessage],
        //   };
        // });
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

  const test = () => {
    if (webSocket) {
      webSocket.send("test");
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log(event);
    //make sure that the drag is valid
    // if (!chessBoard) return;
    if (event.over == null || event.active == null) return;
    const start = idToLocation(event.active?.id);
    const end = idToLocation(event.over?.id);
    if (start.x === end.x && start.y === end.y) return;
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

  return (
    <Container>
      <h1 onClick={test}>Test</h1>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col">
          {board && (
            <Board
              board={board}
              className={`rounded-2xl relative overflow-hidden border-4 ${
                turn === "w" ? "border-white" : "border-black"
              }`}
            />
          )}
        </div>
      </DndContext>
    </Container>
  );
}
