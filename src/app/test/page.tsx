"use client";
import { Container } from "@/components/ui/Container";
import { useState, useEffect } from "react";

export default function Test() {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket("ws://127.0.0.1:8000/chat");
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
        console.log(e);
        //const data = JSON.parse(e.data);
        console.log(`Message received: ${e.data}`);
      };

      webSocket.onclose = (e) => {
        console.log("WebSocket connection closed", e);
      };

      webSocket.onerror = (e) => {
        console.error("WebSocket error", e);
      };
    }
  }, [webSocket]);

  const message = () => {
    console.log("test");
    console.log(webSocket);
    if (!webSocket) return;
    webSocket.send("ping");
  };

  return (
    <Container>
      <div onClick={message}>test</div>
    </Container>
  );
}
