import ChessBoard from "@/components/chess/ChessBoard";
import BoardPosition from "@/components/chess/BoardPosition";

describe("Queen", () => {
  test("Queen moves and attack", () => {
    //queen attack pawn 6,6
    const chessBoard = new ChessBoard();

    chessBoard.move(new BoardPosition(4, 1), new BoardPosition(4, 3));
    chessBoard.move(new BoardPosition(4, 6), new BoardPosition(4, 4));
    chessBoard.move(new BoardPosition(3, 0), new BoardPosition(5, 2));
    chessBoard.move(new BoardPosition(3, 6), new BoardPosition(3, 5));
    chessBoard.move(new BoardPosition(5, 2), new BoardPosition(5, 6));
    chessBoard.move(new BoardPosition(4, 7), new BoardPosition(5, 6));
    expect(chessBoard.getFEN()).toBe(
      "rnbq1bnr/ppp2kpp/3p4/4p3/4P3/8/PPPP1PPP/RNB1KBNR w KQ - 0 4",
    );
  });
});
