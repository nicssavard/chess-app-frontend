import { ChessPosition, Chessboard, Chesspiece } from "../../../typings";
import { Pawn, Rook, Knight, Bishop, Queen, King } from "./ChessPiece";
import _ from "lodash";

enum PieceColor {
  White = "white",
  Black = "black",
}

export class ChessBoard {
  board: Chessboard = []; //has to be checked with y,x  board[y][x]
  turn: PieceColor = PieceColor.White;
  check: boolean = false;
  checkmate: boolean = false;
  winner: "white" | "black" | "none" = "none";
  alivePieces: Chesspiece[] = [];
  deadPieces: Chesspiece[] = [];
  moveHistory: string[] = []; //FEN notation
  wPawn1: Pawn = new Pawn(PieceColor.White, { x: 0, y: 1 }, this);
  wPawn2: Pawn = new Pawn(PieceColor.White, { x: 1, y: 1 }, this);
  wPawn3: Pawn = new Pawn(PieceColor.White, { x: 2, y: 1 }, this);
  wPawn4: Pawn = new Pawn(PieceColor.White, { x: 3, y: 1 }, this);
  wPawn5: Pawn = new Pawn(PieceColor.White, { x: 4, y: 1 }, this);
  wPawn6: Pawn = new Pawn(PieceColor.White, { x: 5, y: 1 }, this);
  wPawn7: Pawn = new Pawn(PieceColor.White, { x: 6, y: 1 }, this);
  wPawn8: Pawn = new Pawn(PieceColor.White, { x: 7, y: 1 }, this);
  bPawn1: Pawn = new Pawn(PieceColor.Black, { x: 0, y: 6 }, this);
  bPawn2: Pawn = new Pawn(PieceColor.Black, { x: 1, y: 6 }, this);
  bPawn3: Pawn = new Pawn(PieceColor.Black, { x: 2, y: 6 }, this);
  bPawn4: Pawn = new Pawn(PieceColor.Black, { x: 3, y: 6 }, this);
  bPawn5: Pawn = new Pawn(PieceColor.Black, { x: 4, y: 6 }, this);
  bPawn6: Pawn = new Pawn(PieceColor.Black, { x: 5, y: 6 }, this);
  bPawn7: Pawn = new Pawn(PieceColor.Black, { x: 6, y: 6 }, this);
  bPawn8: Pawn = new Pawn(PieceColor.Black, { x: 7, y: 6 }, this);
  wRook1: Rook = new Rook(PieceColor.White, { x: 0, y: 0 }, this);
  wRook2: Rook = new Rook(PieceColor.White, { x: 7, y: 0 }, this);
  bRook1: Rook = new Rook(PieceColor.Black, { x: 0, y: 7 }, this);
  bRook2: Rook = new Rook(PieceColor.Black, { x: 7, y: 7 }, this);
  wKnight1: Knight = new Knight(PieceColor.White, { x: 1, y: 0 }, this);
  wKnight2: Knight = new Knight(PieceColor.White, { x: 6, y: 0 }, this);
  bKnight1: Knight = new Knight(PieceColor.Black, { x: 1, y: 7 }, this);
  bKnight2: Knight = new Knight(PieceColor.Black, { x: 6, y: 7 }, this);
  wBishop1: Bishop = new Bishop(PieceColor.White, { x: 2, y: 0 }, this);
  wBishop2: Bishop = new Bishop(PieceColor.White, { x: 5, y: 0 }, this);
  bBishop1: Bishop = new Bishop(PieceColor.Black, { x: 2, y: 7 }, this);
  bBishop2: Bishop = new Bishop(PieceColor.Black, { x: 5, y: 7 }, this);
  wQueen: Queen = new Queen(PieceColor.White, { x: 3, y: 0 }, this);
  bQueen: Queen = new Queen(PieceColor.Black, { x: 3, y: 7 }, this);
  wKing: King = new King(PieceColor.White, { x: 4, y: 0 }, this);
  bKing: King = new King(PieceColor.Black, { x: 4, y: 7 }, this);

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
  // wPawns: Pawn[] = [];
  // bPawns: Pawn[] = [];
  // wRooks: Rook[] = [];
  // bRooks: Rook[] = [];
  // wKnights: Knight[] = [];
  // bKnights: Knight[] = [];
  // wBishops: Bishop[] = [];
  // bBishops: Bishop[] = [];
  // wQueen!: Queen;
  // bQueen!: Queen;
  // wKing!: King;
  // bKing!: King;

  // constructor() {
  //   this.board = Array.from({ length: 8 }, () =>
  //     Array<Chesspiece>(8).fill(null)
  //   ) as Chessboard;
  //   this.setupPieces();
  //   this.initializeBoard();
  // }

  // private setupPieces(): void {
  //   // Pawns
  //   for (let i = 0; i < 8; i++) {
  //     this.wPawns.push(new Pawn(PieceColor.White, { x: i, y: 1 }, this));
  //     this.bPawns.push(new Pawn(PieceColor.Black, { x: i, y: 6 }, this));
  //   }

  //   // Rooks
  //   this.wRooks.push(
  //     new Rook(PieceColor.White, { x: 0, y: 0 }, this),
  //     new Rook(PieceColor.White, { x: 7, y: 0 }, this)
  //   );
  //   this.bRooks.push(
  //     new Rook(PieceColor.Black, { x: 0, y: 7 }, this),
  //     new Rook(PieceColor.Black, { x: 7, y: 7 }, this)
  //   );

  //   // Knights
  //   this.wKnights.push(
  //     new Knight(PieceColor.White, { x: 1, y: 0 }, this),
  //     new Knight(PieceColor.White, { x: 6, y: 0 }, this)
  //   );
  //   this.bKnights.push(
  //     new Knight(PieceColor.Black, { x: 1, y: 7 }, this),
  //     new Knight(PieceColor.Black, { x: 6, y: 7 }, this)
  //   );

  //   // Bishops
  //   this.wBishops.push(
  //     new Bishop(PieceColor.White, { x: 2, y: 0 }, this),
  //     new Bishop(PieceColor.White, { x: 5, y: 0 }, this)
  //   );
  //   this.bBishops.push(
  //     new Bishop(PieceColor.Black, { x: 2, y: 7 }, this),
  //     new Bishop(PieceColor.Black, { x: 5, y: 7 }, this)
  //   );

  //   // Queens and Kings
  //   this.wQueen = new Queen(PieceColor.White, { x: 3, y: 0 }, this);
  //   this.bQueen = new Queen(PieceColor.Black, { x: 4, y: 7 }, this);
  //   this.wKing = new King(PieceColor.White, { x: 4, y: 0 }, this);
  //   this.bKing = new King(PieceColor.Black, { x: 3, y: 7 }, this);
  // }
  // public initializeBoard(): void {
  //   this.board[0] = [
  //     this.wRooks[0],
  //     this.wKnights[0],
  //     this.wBishops[0],
  //     this.wQueen,
  //     this.wKing,
  //     this.wBishops[1],
  //     this.wKnights[1],
  //     this.wRooks[1],
  //   ];
  //   this.board[1] = [...this.wPawns];
  //   this.board[6] = [...this.bPawns];
  //   this.board[7] = [
  //     this.bRooks[0],
  //     this.bKnights[0],
  //     this.bBishops[0],
  //     this.bQueen,
  //     this.bKing,
  //     this.bBishops[1],
  //     this.bKnights[1],
  //     this.bRooks[1],
  //   ];
  //   this.alivePieces = [
  //     ...this.wPawns,
  //     ...this.bPawns,
  //     ...this.wRooks,
  //     ...this.bRooks,
  //     ...this.wKnights,
  //     ...this.bKnights,
  //     ...this.wBishops,
  //     ...this.bBishops,
  //     this.wQueen,
  //     this.bQueen,
  //     this.wKing,
  //     this.bKing,
  //   ];
  // }
  public getFEN(): string {
    //Not okay
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
          switch (piece.getType()) {
            case "Pawn":
              fen += piece.getColor() === PieceColor.White ? "P" : "p";
              break;
            case "Rook":
              fen += piece.getColor() === PieceColor.White ? "R" : "r";
              break;
            case "Knight":
              fen += piece.getColor() === PieceColor.White ? "N" : "n";
              break;
            case "Bishop":
              fen += piece.getColor() === PieceColor.White ? "B" : "b";
              break;
            case "Queen":
              fen += piece.getColor() === PieceColor.White ? "Q" : "q";
              break;
            case "King":
              fen += piece.getColor() === PieceColor.White ? "K" : "k";
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
    fen += ` ${this.turn === PieceColor.White ? "w" : "b"} `;

    return fen;
  }

  public move(start: ChessPosition, end: ChessPosition): false | Chessboard {
    const piece = this.getPieceAtPosition(start);
    if (!piece) return false;
    if (piece.getColor() !== this.turn) return false;
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
        this.winner = this.turn === PieceColor.White ? "black" : "white";
      }
    } else {
      this.check = false;
    }
    return newBoard;
  }

  public makeMove(start: ChessPosition, end: ChessPosition): void {
    let piece = this.getPieceAtPosition(start);
    if (piece?.getType() === "Pawn" && this.pawnPromotion(piece, end)) {
      piece = new Queen(piece.getColor(), end, this);
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
    this.turn =
      this.turn === PieceColor.White ? PieceColor.Black : PieceColor.White;
    this.moveHistory.push(this.getFEN());
  }

  testMoveForCheck(piece: Chesspiece, end: ChessPosition): boolean {
    const chessBoardCopy = _.cloneDeep(this);
    const attackedPiece = chessBoardCopy.board[end.y]![end.x];
    if (piece?.getColor() !== this.turn) {
      return false;
    }
    if (piece === null || piece === undefined) {
      return false;
    }

    if (attackedPiece && attackedPiece.getType() === "King") {
      return false;
    }
    chessBoardCopy.makeMove(piece.getPosition(), end);
    if (chessBoardCopy.isCheck(this.turn)) {
      return false;
    }
    return true;
  }
  isCheck(color: PieceColor = PieceColor.White): boolean {
    const flatBoard = this.board.flat();
    const king = flatBoard.filter(
      (p) => p?.getType() === "King" && p?.getColor() === color
    )[0];
    let isCheck = false;
    const pieces = flatBoard.filter((p) => {
      return (
        p !== null &&
        p !== undefined &&
        p.getColor() ===
          (color === PieceColor.White ? PieceColor.Black : PieceColor.White)
      );
    });
    pieces.forEach((p) => {
      if (p?.move(king!.getPosition())) {
        isCheck = true;
      }
    });
    return isCheck;
  }

  isCheckmate(color: PieceColor = PieceColor.White): boolean {
    // If the player is not in check, then it's not checkmate
    if (!this.isCheck(color)) {
      return false;
    }

    // Iterate through all of the player's pieces
    for (const piece of this.alivePieces.filter(
      (p) => p?.getColor() === color
    )) {
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

    if (piece.getColor() === PieceColor.White && end.y === 7) {
      this.board[end.y]![end.x] = new Queen(PieceColor.White, end, this);
      return true;
    }
    if (piece.getColor() === PieceColor.Black && end.y === 0) {
      this.board[end.y]![end.x] = new Queen(PieceColor.Black, end, this);
      return true;
    }
    return false;
  }

  public getPieceAtPosition(position: ChessPosition): Chesspiece | null {
    return this.board[position.y][position.x];
  }
}
