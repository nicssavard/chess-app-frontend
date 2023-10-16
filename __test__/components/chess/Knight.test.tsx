import ChessBoard from "@/components/chess/ChessBoard";
import { Knight } from "@/components/chess/ChessPiece";
import BoardPosition from "@/components/chess/BoardPosition";

describe("knight", () => {
  test("knight can move and attack", () => {
    const chessBoard = new ChessBoard();
    chessBoard.move(new BoardPosition(1, 0), new BoardPosition(2, 2));
    chessBoard.move(new BoardPosition(1, 7), new BoardPosition(2, 5));
    chessBoard.move(new BoardPosition(2, 2), new BoardPosition(3, 4));
    chessBoard.move(new BoardPosition(2, 5), new BoardPosition(1, 3));
    chessBoard.move(new BoardPosition(3, 4), new BoardPosition(4, 6));
    expect(chessBoard.getFEN()).toBe(
      "r1bqkbnr/ppppNppp/8/8/1n6/8/PPPPPPPP/R1BQKBNR b KQkq - 0 3",
    );
  });
});
