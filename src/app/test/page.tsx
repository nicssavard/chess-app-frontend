"use client";
import { Container } from "@/components/ui/Container";
import { useState, useEffect } from "react";
import { ChessBoard } from "@/components/chess1/ChessBoard";

export default function Test() {
  const board = new ChessBoard();
  return (
    <Container>
      <h1>Test</h1>
    </Container>
  );
}
