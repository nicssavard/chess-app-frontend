import BoardPosition from "@/components/chess/BoardPosition";
import ChessBoard from "@/components/chess/ChessBoard";

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
    expect(chessBoard.alivePieces.length).toBe(32);
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
  test("Create ChessBoard from FEN code", () => {
    const chessBoard = new ChessBoard(
      "r1bqkbnr/pp1ppppp/8/2p5/2PnP3/8/PP1P1PPP/RNBQKB1R b KQkq c3 0 4",
    );
    expect(chessBoard.getFEN()).toBe(
      "r1bqkbnr/pp1ppppp/8/2p5/2PnP3/8/PP1P1PPP/RNBQKB1R b KQkq c3 0 4",
    );

    expect(chessBoard.wKing.getPosition()).toStrictEqual(
      new BoardPosition(4, 0),
    );
    expect(chessBoard.alivePieces.length).toBe(31);
    expect(chessBoard.deadPieces.length).toBe(1);
  });
  test("test Check", () => {
    const chessBoard = new ChessBoard();
    chessBoard.move(new BoardPosition(4, 1), new BoardPosition(4, 3));
    chessBoard.move(new BoardPosition(5, 6), new BoardPosition(5, 4));
    chessBoard.move(new BoardPosition(3, 0), new BoardPosition(7, 4));
    expect(chessBoard.getCheck()).toBe(true);
  });
  test("test Checkmate", () => {
    const chessBoard = new ChessBoard();
    chessBoard.move(new BoardPosition(4, 1), new BoardPosition(4, 3));
    chessBoard.move(new BoardPosition(4, 6), new BoardPosition(4, 4));
    chessBoard.move(new BoardPosition(3, 0), new BoardPosition(7, 4));
    chessBoard.move(new BoardPosition(4, 7), new BoardPosition(4, 6));
    chessBoard.move(new BoardPosition(7, 4), new BoardPosition(4, 4));
    expect(chessBoard.checkmate).toBe(true);
  });
  test("testMoveForCheck", () => {
    const chessBoard = new ChessBoard();
    chessBoard.move(new BoardPosition(4, 1), new BoardPosition(4, 3));
    chessBoard.move(new BoardPosition(4, 6), new BoardPosition(4, 4));
    chessBoard.move(new BoardPosition(3, 0), new BoardPosition(7, 4));
    expect(
      chessBoard.move(new BoardPosition(5, 6), new BoardPosition(5, 5)),
    ).toBe(false);
  });
});
