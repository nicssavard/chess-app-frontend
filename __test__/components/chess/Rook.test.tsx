import ChessBoard from "@/components/chess/ChessBoard";
import { Rook } from "@/components/chess/ChessPiece";
import BoardPosition from "@/components/chess/BoardPosition";

describe("Rook", () => {
  test("Rook moves and attack", () => {
    const chessBoard = new ChessBoard();

    chessBoard.move(new BoardPosition(0, 1), new BoardPosition(0, 3));
    chessBoard.move(new BoardPosition(0, 6), new BoardPosition(0, 4));
    chessBoard.move(new BoardPosition(0, 0), new BoardPosition(0, 2));
    chessBoard.move(new BoardPosition(0, 7), new BoardPosition(0, 5));
    chessBoard.move(new BoardPosition(0, 2), new BoardPosition(2, 2));
    chessBoard.move(new BoardPosition(0, 5), new BoardPosition(1, 5));
    chessBoard.move(new BoardPosition(2, 2), new BoardPosition(2, 6));
    expect(chessBoard.getFEN()).toBe(
      "1nbqkbnr/1pRppppp/1r6/p7/P7/8/1PPPPPPP/1NBQKBNR b Kk - 0 4",
    );
  });
});
