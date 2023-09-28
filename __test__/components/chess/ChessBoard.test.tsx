import BoardPosition from "@/components/chess/BoardPosition";
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
  test("FEN string test", () => {
    const chessBoard = new ChessBoard();
    expect(chessBoard.getFEN()).toBe(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    );
    expect(chessBoard.getFENBoard()).toBe(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
    );
    expect(chessBoard.getFENTurn()).toBe("w");
    expect(chessBoard.getFENCastle()).toBe("KQkq");
    expect(chessBoard.getFENEnPassant()).toBe("-");
    expect(chessBoard.getFENHalfMoves()).toBe("0");
    expect(chessBoard.getFENFullMoves()).toBe("1");
  });

  test("Create piece from FEN letter", () => {
    const chessBoard = new ChessBoard();
    expect(chessBoard.createPieceFromFENLetter("P")?.getColor()).toBe("w");
    expect(chessBoard.createPieceFromFENLetter("p")?.getColor()).toBe("b");
    expect(
      chessBoard
        .createPieceFromFENLetter("R", new BoardPosition(3, 3))
        ?.getPosition(),
    ).toStrictEqual(new BoardPosition(3, 3));
    expect(chessBoard.createPieceFromFENLetter("p")?.getType()).toBe("Pawn");
    expect(chessBoard.createPieceFromFENLetter("r")?.getType()).toBe("Rook");
    expect(chessBoard.createPieceFromFENLetter("n")?.getType()).toBe("Knight");
    expect(chessBoard.createPieceFromFENLetter("b")?.getType()).toBe("Bishop");
    expect(chessBoard.createPieceFromFENLetter("q")?.getType()).toBe("Queen");
    expect(chessBoard.createPieceFromFENLetter("k")?.getType()).toBe("King");
  });
  // test("generate ChessBoard from FEN code", () => {
  //   const chessBoard = new ChessBoard(
  //     "r1bqkbnr/pp1ppppp/2n5/2p5/3NP3/8/PPPP1PPP/RNBQKB1R b KQkq - 3 3",
  //   );
  //   expect(chessBoard.getFEN()).toBe(
  //     "r1bqkbnr/pp1ppppp/2n5/2p5/3NP3/8/PPPP1PPP/RNBQKB1R b KQkq - 3 3",
  //   );
  // });
});
