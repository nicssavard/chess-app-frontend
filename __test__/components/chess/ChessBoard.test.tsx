import { ChessBoard } from "@/components/chess/ChessBoard";

describe("ChessBoard", () => {
  test("chessboard square are identified properly", () => {
    const chessBoard = new ChessBoard();
    expect(chessBoard.getSquareCode({ x: 0, y: 0 })).toBe("a1");
    expect(chessBoard.getSquareCode({ x: 7, y: 7 })).toBe("h8");
  });
  test("chessboard initial pieces are there", () => {
    const chessBoard = new ChessBoard();
    expect(chessBoard.getPiece({ x: 0, y: 0 })?.getType()).toBe("Rook");
    expect(chessBoard.getPiece({ x: 1, y: 0 })?.getType()).toBe("Knight");
    expect(chessBoard.getPiece({ x: 2, y: 0 })?.getType()).toBe("Bishop");
    expect(chessBoard.getPiece({ x: 3, y: 0 })?.getType()).toBe("Queen");
    expect(chessBoard.getPiece({ x: 4, y: 0 })?.getType()).toBe("King");
    expect(chessBoard.getPiece({ x: 5, y: 0 })?.getType()).toBe("Bishop");
    expect(chessBoard.getPiece({ x: 6, y: 0 })?.getType()).toBe("Knight");
    expect(chessBoard.getPiece({ x: 7, y: 0 })?.getType()).toBe("Rook");
    for (let i = 0; i < 8; i++) {
      expect(chessBoard.getPiece({ x: i, y: 1 })?.getType()).toBe("Pawn");
    }
    for (let i = 0; i < 8; i++) {
      expect(chessBoard.getPiece({ x: i, y: 6 })?.getType()).toBe("Pawn");
    }
    expect(chessBoard.getPiece({ x: 0, y: 7 })?.getType()).toBe("Rook");
    expect(chessBoard.getPiece({ x: 1, y: 7 })?.getType()).toBe("Knight");
    expect(chessBoard.getPiece({ x: 2, y: 7 })?.getType()).toBe("Bishop");
    expect(chessBoard.getPiece({ x: 3, y: 7 })?.getType()).toBe("Queen");
    expect(chessBoard.getPiece({ x: 4, y: 7 })?.getType()).toBe("King");
    expect(chessBoard.getPiece({ x: 5, y: 7 })?.getType()).toBe("Bishop");
    expect(chessBoard.getPiece({ x: 6, y: 7 })?.getType()).toBe("Knight");
    expect(chessBoard.getPiece({ x: 7, y: 7 })?.getType()).toBe("Rook");
  });
  test("FEN string test", () => { });
  const chessBoard = new ChessBoard();
  expect(chessBoard.getFEN()).toBe(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  );
});
test("Pawn move", () => {
  const chessBoard = new ChessBoard();
  const pawn = chessBoard.getPiece({ x: 0, y: 1 });
  expect(pawn?.getType()).toBe("Pawn");
  expect(pawn?.getMoves()).toEqual([
    { x: 0, y: 2 },
    { x: 0, y: 3 },
  ]);
});
