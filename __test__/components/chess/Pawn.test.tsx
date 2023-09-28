import { ChessBoard } from "@/components/chess/ChessBoard";
import { Pawn } from "@/components/chess/ChessPiece";
import BoardPosition from "@/components/chess/BoardPosition";

describe("Pawn", () => {
  test("Pawn initial moves", () => {
    const chessBoard = new ChessBoard();
    const pawn: Pawn = chessBoard.getPiece({ x: 0, y: 1 }) as Pawn;

    expect(pawn?.getType()).toBe("Pawn");
    expect(pawn?.getMoves()).toEqual([
      { x: 0, y: 2 },
      { x: 0, y: 3 },
    ]);
  });
  test("Pawn moves 2  squares", () => {
    const chessBoard = new ChessBoard();
    const pawn: Pawn = chessBoard.getPiece({ x: 1, y: 1 }) as Pawn;
    chessBoard.move({ x: 1, y: 1 }, { x: 1, y: 3 });
    expect(pawn.getPosition()).toEqual({ x: 1, y: 3 });
    expect(chessBoard.getFEN()).toBe(
      "rnbqkbnr/pppppppp/8/8/1P6/8/P1PPPPPP/RNBQKBNR b KQkq b3 0 1",
    );
    chessBoard.move({ x: 1, y: 7 }, { x: 2, y: 5 });
    expect(chessBoard.getFEN()).toBe(
      "r1bqkbnr/pppppppp/2n5/8/1P6/8/P1PPPPPP/RNBQKBNR w KQkq - 1 2",
    );
  });
});
