"use client";
import { Container } from "@/components/ui/Container";
import { useState, useEffect } from "react";
import { ChessBoard } from "@/components/chess/ChessBoard";

export default function Test() {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket(
      `ws://127.0.0.1:8000/chessGame?chessGameId=${"1"}`
    );
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
        console.log(`Message received: ${e.data}`);
        // const newMessage = JSON.parse(e.data);
        // setChat((chat) => {
        //   if (!chat) return null;
        //   return {
        //     ...chat,
        //     messages: [...chat.messages, newMessage],
        //   };
        // });
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

  return (
    <Container>
      <h1 onClick={test}>Test</h1>
    </Container>
  );
}
