import { ChessBoard } from "@/components/chess/ChessBoard";
import { Pawn } from "@/components/chess/ChessPiece";
import BoardPosition from "@/components/chess/BoardPosition";

describe("Pawn", () => {
  test("Pawn moves 1,2 and attack", () => {
    const chessBoard = new ChessBoard();
    const pawn: Pawn = chessBoard.getPiece(new BoardPosition(3, 1)) as Pawn;
    expect(pawn?.getType()).toBe("Pawn");
    expect(pawn.getMoves()).toStrictEqual([
      new BoardPosition(3, 2),
      new BoardPosition(3, 3),
    ]);
    chessBoard.move(new BoardPosition(3, 1), new BoardPosition(3, 3));
    chessBoard.move(new BoardPosition(4, 6), new BoardPosition(4, 4));
    chessBoard.move(new BoardPosition(3, 3), new BoardPosition(4, 4));
    chessBoard.move(new BoardPosition(3, 6), new BoardPosition(3, 4));
    chessBoard.move(new BoardPosition(4, 4), new BoardPosition(3, 5));
    expect(chessBoard.getFEN()).toBe(
      "rnbqkbnr/ppp2ppp/3P4/8/8/8/PPP1PPPP/RNBQKBNR b KQkq - 0 3",
    );
  });
});
