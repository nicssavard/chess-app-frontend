import ChessBoard from "@/components/chess/ChessBoard";
import BoardPosition from "@/components/chess/BoardPosition";

describe("Queen", () => {
  test("Queen moves and attack", () => {
    //queen attack pawn 6,6
    const chessBoard = new ChessBoard();

    chessBoard.move(new BoardPosition(4, 1), new BoardPosition(4, 3));
    chessBoard.move(new BoardPosition(4, 6), new BoardPosition(4, 4));
    chessBoard.move(new BoardPosition(3, 0), new BoardPosition(6, 3));
    chessBoard.move(new BoardPosition(3, 6), new BoardPosition(3, 5));
    chessBoard.move(new BoardPosition(6, 3), new BoardPosition(6, 6));
    expect(chessBoard.getFEN()).toBe(
      "rnbqkbnr/ppp2pQp/3p4/4p3/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 0 3",
    );
  });
});
