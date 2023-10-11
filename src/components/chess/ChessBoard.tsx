import { ChessPosition, Chessboard, Chesspiece } from "../../../typings";
import { Pawn, Rook, Knight, Bishop, Queen, King } from "./ChessPiece";
import BoardPosition from "./BoardPosition";
import _ from "lodash";

export enum PieceColor {
  White = "w",
  Black = "b",
}

export default class ChessBoard {
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
  whiteMoves: BoardPosition[] = [];
  whiteAttacks: BoardPosition[] = [];
  blackMoves: BoardPosition[] = [];
  blackAttacks: BoardPosition[] = [];
  possibleMoves: BoardPosition[] = [];
  possibleAttacks: BoardPosition[] = [];
  FEN: string = "";
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

    const kings = this.alivePieces.filter(
      (piece) => piece.getType() === "King",
    );
    kings.forEach((king) => {
      if (king.getColor() === "w") {
        this.wKing = king as King;
      } else {
        this.bKing = king as King;
      }
    });

    this.alivePieces.forEach((piece) => {
      piece.generateMoves();
    });
    this.generatePossibleMovesAndAttacks();
  }

  public move(start: BoardPosition, end: BoardPosition): false | Chessboard {
    const piece = this.getPiece(start);
    let moveType = "";
    if (!piece) return false;
    if (piece.getColor() !== this.turn) return false;
    if (piece.isInMoves(end)) {
      moveType = "move";
    } else if (piece.isInAttacks(end)) {
      moveType = "attack";
    } else {
      return false;
    }

    if (!this.testMoveForCheck(start, end, moveType)) return false;

    if (moveType === "move") {
      piece.move(end);
    } else if (moveType === "attack") {
      piece.attack(end);
    }
    this.updateState(start, end, piece, moveType);
    this.generatePossibleMovesAndAttacks();
    this.isThreatened(new BoardPosition(3, 3), this.turn);
    this.check = this.isCheck(this.turn);

    if (this.check) {
      if (this.isCheckmate(this.turn)) {
        this.checkmate = true;
        this.winner = this.turn === PieceColor.White ? "black" : "white";
      }
    }

    this.FEN = this.getFEN();
    return this.board.map((row: (Chesspiece | null)[]) =>
      row.slice(),
    ) as Chessboard;
  }

  public movePiece(piece: Chesspiece, end: BoardPosition): void {
    const start = piece.getPosition();
    this.setPieceAt(end, piece);
    this.setPieceAt(start, null);
  }

  getSquareCode(position: ChessPosition): string {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    return `${letters[position.x]}${position.y + 1}`;
  }

  public generatePossibleMovesAndAttacks(): void {
    this.possibleMoves = [];
    this.possibleAttacks = [];
    this.whiteMoves = [];
    this.whiteAttacks = [];
    this.blackMoves = [];
    this.blackAttacks = [];
    this.getAlivePieces(PieceColor.White).forEach((piece) => {
      piece.generateMoves();
      this.whiteMoves.push(...piece.getMoves());
      this.whiteAttacks.push(...piece.getAttacks());
    });
    this.getAlivePieces(PieceColor.Black).forEach((piece) => {
      piece.generateMoves();
      this.blackMoves.push(...piece.getMoves());
      this.blackAttacks.push(...piece.getAttacks());
    });
    this.possibleMoves = this.whiteMoves.concat(this.blackMoves);
    this.possibleAttacks = this.whiteAttacks.concat(this.blackAttacks);
    this.generateCastlingMoves();
  }

  generateCastlingMoves(): void {
    this.wKing.generateCastlingMoves();
    this.bKing.generateCastlingMoves();
    this.whiteMoves.push(...this.wKing.getMoves());
    this.whiteAttacks.push(...this.wKing.getAttacks());
    this.blackMoves.push(...this.bKing.getMoves());
    this.blackAttacks.push(...this.bKing.getAttacks());
    this.possibleMoves = this.whiteMoves.concat(this.blackMoves);
    this.possibleAttacks = this.whiteAttacks.concat(this.blackAttacks);
  }
  getPossibleMoves(color: PieceColor | null = null): BoardPosition[] {
    if (color === PieceColor.White) {
      return this.whiteMoves;
    } else if (color === PieceColor.Black) {
      return this.blackMoves;
    } else {
      return this.possibleMoves;
    }
  }
  getPossibleAttacks(color: PieceColor | null = null): BoardPosition[] {
    if (color === PieceColor.White) {
      return this.whiteAttacks;
    } else if (color === PieceColor.Black) {
      return this.blackAttacks;
    } else {
      return this.possibleAttacks;
    }
  }
  testMoveForCheck(
    start: BoardPosition,
    end: BoardPosition,
    moveType: string,
  ): boolean {
    const chessBoardCopy = _.cloneDeep(this);
    const piece = chessBoardCopy.getPiece(start) as Chesspiece;
    if (moveType === "move") {
      piece.move(end);
    } else if (moveType === "attack") {
      piece.attack(end);
    }

    chessBoardCopy.generatePossibleMovesAndAttacks();
    if (chessBoardCopy.isCheck(this.turn)) return false;
    return true;
  }
  isCheck(color: PieceColor = PieceColor.White): boolean {
    const king = this.getKing(color);
    return this.possibleAttacks.some((attack) => {
      return attack.equals(king.getPosition());
    });
  }
  isCheckmate(color: PieceColor = PieceColor.White): boolean {
    let isCheckmate = true;

    this.getAlivePieces(color).some((piece) => {
      return (
        piece.getMoves().some((move) => {
          if (this.testMoveForCheck(piece.getPosition(), move, "move")) {
            isCheckmate = false;
            return true; // exits the loop early
          }
          return false; // continue checking
        }) ||
        piece.getAttacks().some((attack) => {
          if (this.testMoveForCheck(piece.getPosition(), attack, "attack")) {
            isCheckmate = false;
            return true; // exits the loop early
          }
          return false; // continue checking
        })
      );
    });

    return isCheckmate;
  }
  getCheck = (): boolean => {
    return this.check;
  };
  public isThreatened(position: BoardPosition, color: PieceColor): boolean {
    const moves = this.getPossibleMoves();
    let isThreatened =
      this.getPossibleAttacks(color).some((attack) => {
        return attack.equals(position);
      }) ||
      this.getPossibleMoves(color).some((move) => {
        return move.equals(position);
      });

    return isThreatened;
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

  public isPieceAt(position: BoardPosition): boolean {
    return this.board[position.y][position.x] !== null;
  }

  public getPiece(position: BoardPosition): Chesspiece | null | undefined {
    try {
      return this.board[position.y][position.x];
    } catch (e) {
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

  public getAlivePieces(color: PieceColor | null): Chesspiece[] {
    if (color === null) return this.alivePieces;
    return this.alivePieces.filter((p) => p.getColor() === color);
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
  public updateState(
    start: BoardPosition,
    end: BoardPosition,
    piece: Chesspiece,
    moveType: string,
  ): void {
    this.halfMoves += 1;
    if (this.turn === PieceColor.Black) {
      this.fullMoves += 1;
    }
    this.changeTurn();
    this.enPassant = "-";
    if (moveType === "attack") {
      this.halfMoves = 0;
    } else if (piece.getType() === "Pawn") {
      this.halfMoves = 0;
      if (Math.abs(start.y - end.y) === 2) {
        if (piece.getColor() === PieceColor.White) {
          this.enPassant = start.add(0, 1).toChessNotation();
        } else {
          this.enPassant = start.add(0, -1).toChessNotation();
        }
      }
    }
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
    const wRook1 = this.getPiece(new BoardPosition(0, 0));
    const wRook2 = this.getPiece(new BoardPosition(7, 0));
    const bRook1 = this.getPiece(new BoardPosition(0, 7));
    const bRook2 = this.getPiece(new BoardPosition(7, 7));
    if (!this.wKing.hasMoved) {
      // NOT perfect logic, doesn't account for rook moving and then moving back
      if (
        wRook2?.getType() === "Rook" &&
        wRook2?.getPosition().equals(new BoardPosition(7, 0))
      ) {
        castle += "K";
      }
      if (
        wRook1?.getType() === "Rook" &&
        wRook1?.getPosition().equals(new BoardPosition(0, 0))
      ) {
        castle += "Q";
      }
    }
    if (!this.bKing.hasMoved) {
      if (
        bRook2?.getType() === "Rook" &&
        bRook2?.getPosition().equals(new BoardPosition(7, 7))
      ) {
        castle += "k";
      }
      if (
        bRook1?.getType() === "Rook" &&
        bRook1?.getPosition().equals(new BoardPosition(0, 7))
      ) {
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
}
