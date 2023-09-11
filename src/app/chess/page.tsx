"use client";
import { useState, useEffect } from "react";
import Menu from "./components/Menu";
import { Container } from "@/components/ui/Container";
import Game from "./components/Game";

export default function Chess() {
  const [gameType, setGameType] = useState<"random" | "bot" | "friend" | "">(
    ""
  );
  const [gameId, setGameId] = useState<number>();
  const handleGameType = (
    type: "random" | "bot" | "friend",
    gameId?: number
  ) => {
    setGameType(type);
    if (gameId) {
      setGameId(gameId);
    }
  };
  return (
    <>
      <Container>
        {!gameType && <Menu setGameType={handleGameType} />}
        {gameType && <Game gameType={gameType} gameId={gameId} />}
      </Container>
    </>
  );
}
