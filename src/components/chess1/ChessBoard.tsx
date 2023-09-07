import { ChessPosition, Chessboard, Chesspiece } from "../../../typings";
import { Pawn, Rook, Knight, Bishop, Queen, King } from "./ChessPiece";
import _ from "lodash";

export class ChessBoard {
  board: Chessboard;
  turn: "white" | "black" = "white";
  check: boolean = false;
  checkmate: boolean = false;
  winner: "white" | "black" | "none" = "none";
  alivePieces: Chesspiece[] = [];
  deadPieces: Chesspiece[] = [];
  moveHistory: string[] = []; //FEN notation
  wPawn1: Pawn = new Pawn("white", { x: 0, y: 1 }, this);
  wPawn2: Pawn = new Pawn("white", { x: 1, y: 1 }, this);
  wPawn3: Pawn = new Pawn("white", { x: 2, y: 1 }, this);
  wPawn4: Pawn = new Pawn("white", { x: 3, y: 1 }, this);
  wPawn5: Pawn = new Pawn("white", { x: 4, y: 1 }, this);
  wPawn6: Pawn = new Pawn("white", { x: 5, y: 1 }, this);
  wPawn7: Pawn = new Pawn("white", { x: 6, y: 1 }, this);
  wPawn8: Pawn = new Pawn("white", { x: 7, y: 1 }, this);
  bPawn1: Pawn = new Pawn("black", { x: 0, y: 6 }, this);
  bPawn2: Pawn = new Pawn("black", { x: 1, y: 6 }, this);
  bPawn3: Pawn = new Pawn("black", { x: 2, y: 6 }, this);
  bPawn4: Pawn = new Pawn("black", { x: 3, y: 6 }, this);
  bPawn5: Pawn = new Pawn("black", { x: 4, y: 6 }, this);
  bPawn6: Pawn = new Pawn("black", { x: 5, y: 6 }, this);
  bPawn7: Pawn = new Pawn("black", { x: 6, y: 6 }, this);
  bPawn8: Pawn = new Pawn("black", { x: 7, y: 6 }, this);
  wRook1: Rook = new Rook("white", { x: 0, y: 0 }, this);
  wRook2: Rook = new Rook("white", { x: 7, y: 0 }, this);
  bRook1: Rook = new Rook("black", { x: 0, y: 7 }, this);
  bRook2: Rook = new Rook("black", { x: 7, y: 7 }, this);
  wKnight1: Knight = new Knight("white", { x: 1, y: 0 }, this);
  wKnight2: Knight = new Knight("white", { x: 6, y: 0 }, this);
  bKnight1: Knight = new Knight("black", { x: 1, y: 7 }, this);
  bKnight2: Knight = new Knight("black", { x: 6, y: 7 }, this);
  wBishop1: Bishop = new Bishop("white", { x: 2, y: 0 }, this);
  wBishop2: Bishop = new Bishop("white", { x: 5, y: 0 }, this);
  bBishop1: Bishop = new Bishop("black", { x: 2, y: 7 }, this);
  bBishop2: Bishop = new Bishop("black", { x: 5, y: 7 }, this);
  wQueen: Queen = new Queen("white", { x: 3, y: 0 }, this);
  bQueen: Queen = new Queen("black", { x: 3, y: 7 }, this);
  wKing: King = new King("white", { x: 4, y: 0 }, this);
  bKing: King = new King("black", { x: 4, y: 7 }, this);

  constructor() {
    this.board = [];
    console.log("Chessboard created");
    console.log(this);
    this.board = Array.from({ length: 8 }, () =>
      Array<Chesspiece>(8).fill(null)
    ) as Chessboard;
    this.initializeBoard();
  }

  public initializeBoard(): void {
    // Populate the board with pawns

    this.alivePieces.push(
      this.wPawn1,
      this.wPawn2,
      this.wPawn3,
      this.wPawn4,
      this.wPawn5,
      this.wPawn6,
      this.wPawn7,
      this.wPawn8,
      this.bPawn1,
      this.bPawn2,
      this.bPawn3,
      this.bPawn4,
      this.bPawn5,
      this.bPawn6,
      this.bPawn7,
      this.bPawn8,
      this.wRook1,
      this.wRook2,
      this.bRook1,
      this.bRook2,
      this.wKnight1,
      this.wKnight2,
      this.bKnight1,
      this.bKnight2,
      this.wBishop1,
      this.wBishop2,
      this.bBishop1,
      this.bBishop2,
      this.wQueen,
      this.bQueen,
      this.wKing,
      this.bKing
    );

    this.board[0] = [
      this.wRook1,
      this.wKnight1,
      this.wBishop1,
      this.wQueen,
      this.wKing,
      this.wBishop2,
      this.wKnight2,
      this.wRook2,
    ];
    this.board[1] = [
      this.wPawn1,
      this.wPawn2,
      this.wPawn3,
      this.wPawn4,
      this.wPawn5,
      this.wPawn6,
      this.wPawn7,
      this.wPawn8,
    ];
    this.board[6] = [
      this.bPawn1,
      this.bPawn2,
      this.bPawn3,
      this.bPawn4,
      this.bPawn5,
      this.bPawn6,
      this.bPawn7,
      this.bPawn8,
    ];
    this.board[7] = [
      this.bRook1,
      this.bKnight1,
      this.bBishop1,
      this.bQueen,
      this.bKing,
      this.bBishop2,
      this.bKnight2,
      this.bRook2,
    ];
  }

  public getFEN(): string {
    let fen = "";
    for (let i = 0; i < 8; i++) {
      let emptyCount = 0;
      for (let j = 0; j < 8; j++) {
        const piece = this.board[i][j];
        if (piece) {
          if (emptyCount > 0) {
            fen += emptyCount;
            emptyCount = 0;
          }
          switch (piece.constructor.name) {
            case "Pawn":
              fen += piece.color === "white" ? "P" : "p";
              break;
            case "Rook":
              fen += piece.color === "white" ? "R" : "r";
              break;
            case "Knight":
              fen += piece.color === "white" ? "N" : "n";
              break;
            case "Bishop":
              fen += piece.color === "white" ? "B" : "b";
              break;
            case "Queen":
              fen += piece.color === "white" ? "Q" : "q";
              break;
            case "King":
              fen += piece.color === "white" ? "K" : "k";
              break;
            default:
              break;
          }
        } else {
          emptyCount++;
        }
      }
      if (emptyCount > 0) {
        fen += emptyCount;
      }
      if (i !== 7) {
        fen += "/";
      }
    }
    fen += ` ${this.turn === "white" ? "w" : "b"} `;

    return fen;
  }

  public move(start: ChessPosition, end: ChessPosition): false | Chessboard {
    const piece = this.getPieceAtPosition(start);
    if (!piece) return false;
    if (piece.color !== this.turn) return false;
    if (!piece.move(end)) return false;
    if (!this.testMoveForCheck(piece, end)) return false;
    this.makeMove(start, end);
    const newBoard: Chessboard = this.board.map((row: Chesspiece[]) =>
      row.slice()
    ) as Chessboard;

    if (this.isCheck(this.turn)) {
      this.check = true;
      if (this.isCheckmate(this.turn)) {
        this.checkmate = true;
        this.winner = this.turn === "white" ? "black" : "white";
      }
    } else {
      this.check = false;
    }

    return newBoard;
  }

  public makeMove(start: ChessPosition, end: ChessPosition): void {
    let piece = this.getPieceAtPosition(start);
    if (piece?.type === "Pawn" && this.pawnPromotion(piece, end)) {
      piece = new Queen(piece.color, end, this);
    }
    const deadPiece = this.getPieceAtPosition(end);
    if (deadPiece) {
      this.deadPieces.push(deadPiece);
      this.alivePieces = this.alivePieces.filter(
        (piece) => piece !== deadPiece
      );
    }

    this.board[end.y][end.x] = piece;
    this.board[start.y][start.x] = null;
    piece?.setPosition(end);
    this.turn = this.turn === "white" ? "black" : "white";
    this.moveHistory.push(this.getFEN());
  }

  testMoveForCheck(piece: Chesspiece, end: ChessPosition): boolean {
    const chessBoardCopy = _.cloneDeep(this);
    const attackedPiece = chessBoardCopy.board[end.y]![end.x];
    if (piece?.color !== this.turn) {
      return false;
    }
    if (piece === null || piece === undefined) {
      return false;
    }

    if (attackedPiece && attackedPiece.type === "King") {
      return false;
    }
    chessBoardCopy.makeMove(piece.position, end);
    // chessBoardCopy.board[end.x]![end.y] = piece;
    // chessBoardCopy.board[start.x]![start.y] = null;
    // piece.setPosition(end);
    if (chessBoardCopy.isCheck(this.turn)) {
      return false;
    }
    return true;
  }
  isCheck(color: "white" | "black" = "white"): boolean {
    const flatBoard = this.board.flat();
    const king = flatBoard.filter(
      (p) => p?.type === "King" && p?.color === color
    )[0];
    let isCheck = false;
    const pieces = flatBoard.filter((p) => {
      return (
        p !== null &&
        p !== undefined &&
        p.color === (color === "white" ? "black" : "white")
      );
    });
    pieces.forEach((p) => {
      if (p?.move(king!.position)) {
        isCheck = true;
      }
    });
    return isCheck;
  }

  isCheckmate(color: "white" | "black" = "white"): boolean {
    // If the player is not in check, then it's not checkmate
    if (!this.isCheck(color)) {
      return false;
    }

    // Iterate through all of the player's pieces
    for (const piece of this.alivePieces.filter((p) => p?.color === color)) {
      if (piece === null || piece === undefined) {
        return false;
      }
      // For each piece, iterate through all possible moves
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          const end = { x, y };
          if (piece.move(end)) {
            if (this.testMoveForCheck(piece, end)) {
              return false;
            }
            if (!this.isCheck(color)) {
              return false;
            }
          }
        }
      }
    }

    return true; // No legal moves removed the check, so it's checkmate
  }

  pawnPromotion(piece: Chesspiece, end: ChessPosition): boolean {
    if (!piece) {
      return false;
    }

    if (piece.color === "white" && end.y === 7) {
      this.board[end.y]![end.x] = new Queen("white", end, this);
      return true;
    }
    if (piece.color === "black" && end.y === 0) {
      this.board[end.y]![end.x] = new Queen("black", end, this);
      return true;
    }
    return false;
  }

  public getPieceAtPosition(position: ChessPosition): Chesspiece | null {
    return this.board[position.y][position.x];
  }
}
