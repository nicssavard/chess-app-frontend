import ChessBoard from "@/components/chess/ChessBoard";
import BoardPosition from "@/components/chess/BoardPosition";

describe("King", () => {
  test("King moves and attack", () => {
    //king attack queen 5,6
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
  test("King can castle", () => {
    const chessBoard = new ChessBoard(
      "rnbqkbnr/1ppppppp/8/8/p7/5NP1/PPPPPPBP/RNBQK2R w KQkq - 0 4",
    );
    chessBoard.move(new BoardPosition(4, 0), new BoardPosition(6, 0));
    expect(chessBoard.getFEN()).toBe(
      "rnbqkbnr/1ppppppp/8/8/p7/5NP1/PPPPPPBP/RNBQ1RK1 b kq - 1 4",
    );
  });
});
