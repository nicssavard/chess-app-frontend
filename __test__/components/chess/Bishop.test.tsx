import ChessBoard from "@/components/chess/ChessBoard";
import BoardPosition from "@/components/chess/BoardPosition";

describe("Bishop", () => {
  test("Bishop moves and attack", () => {
    //Bishop attacks third black queen
    const chessBoard = new ChessBoard();

    chessBoard.move(new BoardPosition(3, 1), new BoardPosition(3, 3));
    chessBoard.move(new BoardPosition(4, 6), new BoardPosition(4, 4));
    chessBoard.move(new BoardPosition(2, 0), new BoardPosition(6, 4));
    chessBoard.move(new BoardPosition(5, 7), new BoardPosition(3, 5));
    chessBoard.move(new BoardPosition(6, 4), new BoardPosition(3, 7));
    expect(chessBoard.getFEN()).toBe(
      "rnbBk1nr/pppp1ppp/3b4/4p3/3P4/8/PPP1PPPP/RN1QKBNR b KQkq - 0 3",
    );
  });
});
