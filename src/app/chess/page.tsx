"use client";
import { useState, useEffect } from "react";
import Menu from "./components/Menu";
import { Container } from "@/components/ui/Container";
import Game from "./components/Game";

export default function Chess() {
  const [gameType, setGameType] = useState<"random" | "bot" | "friend" | "">(
    "",
  );
  const handleGameType = (type: "random" | "bot") => {
    setGameType(type);
  };
  return (
    <>
      <Container>
        {!gameType && <Menu setGameType={handleGameType} />}
        {gameType && <Game />}
      </Container>
    </>
  );
}
