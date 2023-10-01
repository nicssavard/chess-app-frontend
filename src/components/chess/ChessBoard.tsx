import { ChessPosition, Chessboard, Chesspiece } from "../../../typings";
import { Pawn, Rook, Knight, Bishop, Queen, King } from "./ChessPiece";
import BoardPosition from "./BoardPosition";
import _, { forEach } from "lodash";

export enum PieceColor {
  White = "w",
  Black = "b",
}

export class ChessBoard {
  board: Chessboard = []; //has to be checked with y,x  board[y][x]
  turn: PieceColor = PieceColor.White;
  halfMoves: number = 0;
  fullMoves: number = 1;
  enPassant: string = "-";
  check: boolean = false;
  checkmate: boolean = false;
  winner: "white" | "black" | "n" = "n";
  pieces: string = "rnbqkbnrppppppppPPPPPPPPRNBQKBNR";
  alivePieces: Chesspiece[] = [];
  deadPieces: Chesspiece[] = [];
  moveHistory: string[] = []; //FEN notation
  possibleMoves: ChessPosition[] = [];
  possibleAttacks: ChessPosition[] = [];
  FEN: string = "";
  // wPawn1: Pawn = new Pawn(PieceColor.White, { x: 0, y: 1 }, this);
  // wPawn2: Pawn = new Pawn(PieceColor.White, { x: 1, y: 1 }, this);
  // wPawn3: Pawn = new Pawn(PieceColor.White, { x: 2, y: 1 }, this);
  // wPawn4: Pawn = new Pawn(PieceColor.White, { x: 3, y: 1 }, this);
  // wPawn5: Pawn = new Pawn(PieceColor.White, { x: 4, y: 1 }, this);
  // wPawn6: Pawn = new Pawn(PieceColor.White, { x: 5, y: 1 }, this);
  // wPawn7: Pawn = new Pawn(PieceColor.White, { x: 6, y: 1 }, this);
  // wPawn8: Pawn = new Pawn(PieceColor.White, { x: 7, y: 1 }, this);
  // bPawn1: Pawn = new Pawn(PieceColor.Black, { x: 0, y: 6 }, this);
  // bPawn2: Pawn = new Pawn(PieceColor.Black, { x: 1, y: 6 }, this);
  // bPawn3: Pawn = new Pawn(PieceColor.Black, { x: 2, y: 6 }, this);
  // bPawn4: Pawn = new Pawn(PieceColor.Black, { x: 3, y: 6 }, this);
  // bPawn5: Pawn = new Pawn(PieceColor.Black, { x: 4, y: 6 }, this);
  // bPawn6: Pawn = new Pawn(PieceColor.Black, { x: 5, y: 6 }, this);
  // bPawn7: Pawn = new Pawn(PieceColor.Black, { x: 6, y: 6 }, this);
  // bPawn8: Pawn = new Pawn(PieceColor.Black, { x: 7, y: 6 }, this);
  wRook1: Rook = new Rook(PieceColor.White, new BoardPosition(0, 0), this);
  wRook2: Rook = new Rook(PieceColor.White, new BoardPosition(7, 0), this);
  bRook1: Rook = new Rook(PieceColor.Black, new BoardPosition(0, 7), this);
  bRook2: Rook = new Rook(PieceColor.Black, new BoardPosition(7, 7), this);
  // wKnight1: Knight = new Knight(PieceColor.White, { x: 1, y: 0 }, this);
  // wKnight2: Knight = new Knight(PieceColor.White, { x: 6, y: 0 }, this);
  // bKnight1: Knight = new Knight(PieceColor.Black, { x: 1, y: 7 }, this);
  // bKnight2: Knight = new Knight(PieceColor.Black, { x: 6, y: 7 }, this);
  // wBishop1: Bishop = new Bishop(PieceColor.White, { x: 2, y: 0 }, this);
  // wBishop2: Bishop = new Bishop(PieceColor.White, { x: 5, y: 0 }, this);
  // bBishop1: Bishop = new Bishop(PieceColor.Black, { x: 2, y: 7 }, this);
  // bBishop2: Bishop = new Bishop(PieceColor.Black, { x: 5, y: 7 }, this);
  // wQueen: Queen = new Queen(PieceColor.White, { x: 3, y: 0 }, this);
  // bQueen: Queen = new Queen(PieceColor.Black, { x: 3, y: 7 }, this);
  wKing: King = new King(PieceColor.White, new BoardPosition(4, 0), this);
  bKing: King = new King(PieceColor.Black, new BoardPosition(4, 7), this);

  constructor(
    fen: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  ) {
    this.board = [];
    this.board = Array.from({ length: 8 }, () =>
      Array(8).fill(null),
    ) as Chessboard;
    this.initializeBoard(fen);
  }

  public initializeBoard(fen: string): void {
    // Populate the board with pawns

    let pieces = this.pieces;
    const fenBoard = fen.split(" ")[0];
    const fenRows = fenBoard.split("/");
    for (let i = 0; i < fenRows.length; i++) {
      const row = fenRows[i];
      let x = 0;
      for (let j = 0; j < row.length; j++) {
        const letter = row[j];
        if (isNaN(Number(letter))) {
          const piece = this.createPieceFromFENLetter(
            letter,
            new BoardPosition(x, 7 - i),
          );
          if (piece) {
            this.setPieceAt(new BoardPosition(x, 7 - i), piece);
            pieces = pieces.replace(letter, "");
            this.alivePieces.push(piece);
          }
          x++;
        } else {
          x += Number(letter);
        }
      }
    }
    for (let i = 0; i < pieces.length; i++) {
      const letter = pieces[i];
      const piece = this.createPieceFromFENLetter(
        letter,
        new BoardPosition(0, 0),
      );
      this.deadPieces.push(piece!);
    }

    this.turn = fen.split(" ")[1] === "w" ? PieceColor.White : PieceColor.Black;
    this.enPassant = fen.split(" ")[3];
    this.halfMoves = Number(fen.split(" ")[4]);
    this.fullMoves = Number(fen.split(" ")[5]);
  }

  public createPieceFromFENLetter(
    letter: string,
    boardPosition: BoardPosition = new BoardPosition(0, 0),
  ): Chesspiece | null {
    const color =
      letter === letter.toUpperCase() ? PieceColor.White : PieceColor.Black;
    switch (letter.toLowerCase()) {
      case "p":
        return new Pawn(color, boardPosition, this);
      case "r":
        return new Rook(color, boardPosition, this);
      case "n":
        return new Knight(color, boardPosition, this);
      case "b":
        return new Bishop(color, boardPosition, this);
      case "q":
        return new Queen(color, boardPosition, this);
      case "k":
        if (color === PieceColor.White) {
          this.wKing = new King(color, boardPosition, this);
          return this.wKing;
        } else {
          this.bKing = new King(color, boardPosition, this);
          return this.bKing;
        }
      default:
        return null;
    }
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
    fen = fen.split("/").reverse().join("/");
    fen += ` ${this.turn === PieceColor.White ? "w" : "b"} `;
    let castle = "";
    if (!this.wKing.hasMoved) {
      if (!this.wRook2.hasMoved) {
        castle += "K";
      }
      if (!this.wRook1.hasMoved) {
        castle += "Q";
      }
    }
    if (!this.bKing.hasMoved) {
      if (!this.bRook2.hasMoved) {
        castle += "k";
      }
      if (!this.bRook1.hasMoved) {
        castle += "q";
      }
    }
    fen += castle.length > 0 ? `${castle} ` : "- ";

    fen += this.enPassant;
    fen += ` ${this.halfMoves} ${this.fullMoves}`;

    return fen;
  }

  public getFENBoard() {
    return this.getFEN().split(" ")[0];
  }
  public getFENTurn() {
    return this.getFEN().split(" ")[1];
  }

  public getFENCastle() {
    return this.getFEN().split(" ")[2];
  }
  public getFENEnPassant() {
    return this.getFEN().split(" ")[3];
  }
  public getFENHalfMoves() {
    return this.getFEN().split(" ")[4];
  }
  public getFENFullMoves() {
    return this.getFEN().split(" ")[5];
  }

  public move(start: BoardPosition, end: BoardPosition): false | Chessboard {
    const piece = this.getPiece(start);
    let moveType = "";
    if (!piece) return false;
    if (piece.getColor() !== this.turn) return false;
    if (piece.canMoveTo(end)) {
      moveType = "move";
    } else if (piece.canAttackTo(end)) {
      moveType = "attack";
    } else {
      return false;
    }

    //TODO test for check

    if (moveType === "move") {
      piece.move(end);
    } else if (moveType === "attack") {
      piece.attack(end);
    }
    //   const piece = this.getPiece(start);
    //   if (!piece) return false;
    //   if (piece.getColor() !== this.turn) return false;
    //   if (!piece.canMove(end)) return false;
    //   if (!this.testMoveForCheck(piece, end)) return false;
    //   this.makeMove(start, end);
    //
    //   if (this.isCheck(this.turn)) {
    //     this.check = true;
    //     if (this.isCheckmate(this.turn)) {
    //       this.checkmate = true;
    //       this.winner = this.turn === PieceColor.White ? "black" : "white";
    //     }
    //   } else {
    //     this.check = false;
    //   }
    this.alivePieces.forEach((piece) => {
      piece.generateMoves();
    });

    this.FEN = this.getFEN();
    return this.board.map((row: (Chesspiece | null)[]) =>
      row.slice(),
    ) as Chessboard;
  }

  public movePiece(piece: Chesspiece, end: BoardPosition): void {
    const start = piece.getPosition();
    this.setPieceAt(end, piece);
    this.setPieceAt(start, null);
    this.updateState();
  }
  public makeMove(start: BoardPosition, end: BoardPosition): void {
    let piece = this.getPiece(start);
    const deadPiece = this.getPiece(end);

    this.setPieceAt(end, piece);
    this.setPieceAt(start, null);

    if (piece?.getType() === "Pawn" && this.pawnPromotion(piece, end)) {
      this.promotePawn(piece);
    }
    if (piece?.getColor() === PieceColor.Black) {
      this.fullMoves++;
    }
    this.halfMoves++;
    this.enPassant = "-";
    piece?.move(
      new BoardPosition(start.x, start.y),
      new BoardPosition(end.x, end.y),
    );

    if (deadPiece) {
      this.halfMoves = 0;
      this.deadPieces.push(deadPiece);
      this.alivePieces = this.alivePieces.filter(
        (piece) => piece !== deadPiece,
      );
    }
    this.changeTurn();
    this.moveHistory.push(this.getFEN());
  }

  getSquareCode(position: ChessPosition): string {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    return `${letters[position.x]}${position.y + 1}`;
  }

  testMoveForCheck(piece: Chesspiece, end: BoardPosition): boolean {
    piece = _.cloneDeep(piece);
    const chessBoardCopy = _.cloneDeep(this);
    const attackedPiece = chessBoardCopy.board[end.y]![end.x];
    if (piece?.getColor() !== this.turn) return false;
    if (attackedPiece && attackedPiece.getType() === "King") return false;

    chessBoardCopy.makeMove(piece.getPosition(), end);
    if (chessBoardCopy.isCheck(this.turn)) return false;

    return true;
  }
  isCheck(color: PieceColor = PieceColor.White): boolean {
    const king = this.getKing(color);
    let isCheck = false;
    const pieces = this.getPieces(
      color === PieceColor.White ? PieceColor.Black : PieceColor.White,
    );
    pieces.forEach((p) => {
      if (p?.canMove(king!.getPosition())) {
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
    for (const piece of this.getPieces(color)) {
      // For each piece, iterate through all possible moves
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          const end = new BoardPosition(x, y);
          if (piece.canMove(end)) {
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
    if (
      (piece.getColor() === PieceColor.White && end.y === 7) ||
      (piece.getColor() === PieceColor.Black && end.y === 0)
    ) {
      return true;
    }
    return false;
  }

  public isPieceAt(position: ChessPosition): boolean {
    return this.board[position.y][position.x] !== null;
  }

  public getPiece(position: ChessPosition): Chesspiece | null | undefined {
    try {
      return this.board[position.y][position.x];
    } catch (e) {
      console.log(position);
      return undefined;
    }
  }

  public getKing(color: PieceColor): King {
    if (color === PieceColor.White) {
      return this.wKing;
    } else {
      return this.bKing;
    }
  }

  public killPiece(location: BoardPosition): void {
    const piece = this.getPiece(location);
    if (piece) {
      this.board[location.y][location.x] = null;
      this.deadPieces.push(piece);
      this.alivePieces = this.alivePieces.filter((p) => p !== piece);
    }
  }
  public getPieces(color: PieceColor): Chesspiece[] {
    return this.alivePieces.filter((p) => p?.getColor() === color);
  }

  public setPieceAt(position: BoardPosition, piece: Chesspiece | null): void {
    this.board[position.y][position.x] = piece;
    if (piece) {
      piece.setPosition(position);
    }
  }

  public printBoard(): void {
    console.log(_.cloneDeep(this.board).reverse());
  }

  public getAlivePieces() {
    return this.alivePieces;
  }

  public setAlivePieces(pieces: Chesspiece[]): void {
    this.alivePieces = pieces;
  }

  public getDeadPieces() {
    return this.deadPieces;
  }

  promotePawn(piece: Chesspiece): void {
    const queen = new Queen(piece.getColor(), piece.getPosition(), this);
    this.setPieceAt(piece.getPosition(), queen);
    this.setAlivePieces(this.alivePieces.map((p) => (p === piece ? queen : p)));
  }

  public changeTurn(): void {
    this.turn =
      this.turn === PieceColor.White ? PieceColor.Black : PieceColor.White;
  }
  public updateState(): void {
    this.halfMoves += 1;
    if (this.turn === PieceColor.Black) {
      this.fullMoves += 1;
    }
    this.changeTurn();
    this.enPassant = "-";

    //   this.check = this.isCheck();
    //   this.checkmate = this.isCheckmate();
    //   if (this.checkmate) {
    //     this.winner = this.turn === PieceColor.White ? "black" : "white";
    //   }
  }
}
