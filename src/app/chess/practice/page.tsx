"use client";
import { Container } from "@/components/ui/Container";
import ChessGame from "@/components/chess/ChessGame";
export default function Home() {
  return (
    <>
      <Container>
        <ChessGame />
      </Container>
    </>
  );
}
