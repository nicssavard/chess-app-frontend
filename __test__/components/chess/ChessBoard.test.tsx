import { ChessBoard } from "@/components/chess/ChessBoard";

test("chessboard square code are valid", () => {
  const chessBoard = new ChessBoard();
  expect(chessBoard.getSquareCode({ x: 0, y: 0 })).toBe("a1");
  expect(chessBoard.getSquareCode({ x: 7, y: 7 })).toBe("h8");
});
