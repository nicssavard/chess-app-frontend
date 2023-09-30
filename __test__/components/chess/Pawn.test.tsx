import { ChessBoard } from "@/components/chess/ChessBoard";
import { Pawn } from "@/components/chess/ChessPiece";
import BoardPosition from "@/components/chess/BoardPosition";

describe("Pawn", () => {
  test("Pawn moves 1,2 and attack", () => {
    const chessBoard = new ChessBoard(
      "r1bqkbnr/pppp1ppp/2n5/3Pp3/8/8/PPP1PPPP/RNBQKBNR w KQkq e6 0 3",
    );

    const pawn2Squares: Pawn = chessBoard.getPiece(
      new BoardPosition(0, 1),
    ) as Pawn;
    //test for initial 2 squares moves
    expect(pawn2Squares.getMoves()).toStrictEqual([
      new BoardPosition(0, 2),
      new BoardPosition(0, 3),
    ]);
    expect(pawn2Squares.getAttacks()).toStrictEqual([]);

    //test move, attack and enPassant
    const pawn: Pawn = chessBoard.getPiece(new BoardPosition(3, 4)) as Pawn;
    expect(pawn?.getType()).toBe("Pawn");
    expect(pawn.getMoves()).toStrictEqual([new BoardPosition(3, 5)]);
    expect(pawn.getAttacks()).toStrictEqual([
      new BoardPosition(4, 5),
      new BoardPosition(2, 5),
    ]);
  });
});
