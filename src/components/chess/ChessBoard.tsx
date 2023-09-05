// import { ChessPosition, Chessboard, Chesspiece } from "../../../typings";
import {
  Pawn,
  Rook,
  Knight,
  Bishop,
  Queen,
  King,
  chessPiece,
} from "./ChessPiece";
import Square from "./Square";

interface Props {
  board: Chessboard;
}

export function ChessBoard({ board }: Props) {
  const boardDisplayed = board.map((row, i) => {
    return (
      <div key={i} className="flex flex-row justify-center">
        {row.map((piece: Chesspiece, j) => {
          return (
            <Square
              chessPiece={piece}
              position={{ x: j, y: i }}
              id={`${j}${i}`}
              key={j}
            />
          );
        })}
      </div>
    );
  });

  return <div className="flex flex-col-reverse">{boardDisplayed}</div>;
}

export class chessBoard {
  private static instance: chessBoard | null = null;
  board: Chessboard;
  turn: "white" | "black" = "white";
  check = false;
  checkmate = false;
  winner: "white" | "black" | "none" = "none";
  alivePieces: Chesspiece[];
  deadPieces: Chesspiece[];
  wPawn1: Pawn | undefined;
  wPawn2: Pawn | undefined;
  wPawn3: Pawn | undefined;
  wPawn4: Pawn | undefined;
  wPawn5: Pawn | undefined;
  wPawn6: Pawn | undefined;
  wPawn7: Pawn | undefined;
  wPawn8: Pawn | undefined;
  bPawn1: Pawn | undefined;
  bPawn2: Pawn | undefined;
  bPawn3: Pawn | undefined;
  bPawn4: Pawn | undefined;
  bPawn5: Pawn | undefined;
  bPawn6: Pawn | undefined;
  bPawn7: Pawn | undefined;
  bPawn8: Pawn | undefined;
  wRook1: Rook | undefined;
  wRook2: Rook | undefined;
  bRook1: Rook | undefined;
  bRook2: Rook | undefined;
  wKnight1: Knight | undefined;
  wKnight2: Knight | undefined;
  bKnight1: Knight | undefined;
  bKnight2: Knight | undefined;
  wBishop1: Bishop | undefined;
  wBishop2: Bishop | undefined;
  bBishop1: Bishop | undefined;
  bBishop2: Bishop | undefined;
  wQueen: Queen | undefined;
  bQueen: Queen | undefined;
  wKing: King | undefined;
  bKing: King | undefined;

  private constructor() {
    // Private constructor to prevent instantiation from outside
    console.log("constructor");
    // this.wPawn1 = new Pawn("white");
    this.board = Array.from({ length: 8 }, () =>
      Array<Chesspiece>(8).fill(null)
    ) as Chessboard;

    this.alivePieces = [];
    this.deadPieces = [];
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new chessBoard();
    }
    return this.instance;
  }

  public initializeBoard(): void {
    // Populate the board with pawns
    this.wPawn1 = new Pawn("white", { x: 1, y: 0 });
    this.wPawn2 = new Pawn("white", { x: 1, y: 1 });
    this.wPawn3 = new Pawn("white", { x: 1, y: 2 });
    this.wPawn4 = new Pawn("white", { x: 1, y: 3 });
    this.wPawn5 = new Pawn("white", { x: 1, y: 4 });
    this.wPawn6 = new Pawn("white", { x: 1, y: 5 });
    this.wPawn7 = new Pawn("white", { x: 1, y: 6 });
    this.wPawn8 = new Pawn("white", { x: 1, y: 7 });
    this.bPawn1 = new Pawn("black", { x: 6, y: 0 });
    this.bPawn2 = new Pawn("black", { x: 6, y: 1 });
    this.bPawn3 = new Pawn("black", { x: 6, y: 2 });
    this.bPawn4 = new Pawn("black", { x: 6, y: 3 });
    this.bPawn5 = new Pawn("black", { x: 6, y: 4 });
    this.bPawn6 = new Pawn("black", { x: 6, y: 5 });
    this.bPawn7 = new Pawn("black", { x: 6, y: 6 });
    this.bPawn8 = new Pawn("black", { x: 6, y: 7 });
    this.wRook1 = new Rook("white", { x: 0, y: 0 });
    this.wRook2 = new Rook("white", { x: 0, y: 7 });
    this.bRook1 = new Rook("black", { x: 7, y: 0 });
    this.bRook2 = new Rook("black", { x: 7, y: 7 });
    this.wKnight1 = new Knight("white", { x: 0, y: 1 });
    this.wKnight2 = new Knight("white", { x: 0, y: 6 });
    this.bKnight1 = new Knight("black", { x: 7, y: 1 });
    this.bKnight2 = new Knight("black", { x: 7, y: 6 });
    this.wBishop1 = new Bishop("white", { x: 0, y: 2 });
    this.wBishop2 = new Bishop("white", { x: 0, y: 5 });
    this.bBishop1 = new Bishop("black", { x: 7, y: 2 });
    this.bBishop2 = new Bishop("black", { x: 7, y: 5 });
    this.wQueen = new Queen("white", { x: 0, y: 3 });
    this.bQueen = new Queen("black", { x: 7, y: 3 });
    this.wKing = new King("white", { x: 0, y: 4 });
    this.bKing = new King("black", { x: 7, y: 4 });

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

  public getBoard(): Chessboard {
    return this.board;
  }

  public movePiece(
    start: ChessPosition,
    end: ChessPosition
  ): Chessboard | false {
    if (this.board[start.x]![start.y] === undefined) return false;

    const piece: Chesspiece | undefined = this.board[start.x]![start.y];
    if (piece?.color !== this.turn) {
      return false;
    }
    if (piece === null || piece === undefined) {
      return false;
    }
    //check if the move would put his own king in check
    this.board[end.x]![end.y] = piece;
    const nullPiece = this.board[end.x]![end.y];
    this.board[start.x]![start.y] = null;
    piece.setCoords(end);
    if (this.isCheck(this.turn)) {
      if (nullPiece) {
        this.board[end.x]![end.y] = nullPiece;
      }
      //check if the move would put his own king in check
      this.board[end.x]![end.y] = null;
      this.board[start.x]![start.y] = piece;
      piece.setCoords(start);
      return false;
    }
    this.board[end.x]![end.y] = piece;
    this.board[start.x]![start.y] = null;

    // Create a new copy of the board
    const newBoard: Chessboard = this.board.map((row: Chesspiece[]) =>
      row.slice()
    ) as Chessboard;

    //piece.setCoords(end);
    this.turn = this.turn === "white" ? "black" : "white";
    if (this.isCheck(this.turn)) {
      this.setCheck(true);
      console.log("check");
      if (this.isCheckmate(this.turn)) {
        this.checkmate = true;
        this.winner = this.turn === "white" ? "black" : "white";
      }
    } else {
      this.setCheck(false);
    }

    return newBoard; // Return the new copy
  }

  public killPiece(
    start: { x: number; y: number },
    end: { x: number; y: number }
  ): Chessboard | false {
    const piece = this.board[start.x]![start.y];
    if (piece?.color !== this.turn) {
      return false;
    }
    const deadPiece = this.board[end.x]![end.y];
    if (piece?.color === deadPiece?.color) {
      return false;
    }
    if (piece === null || piece === undefined) {
      return false;
    }
    if (deadPiece === null || deadPiece === undefined) {
      return false;
    }
    //check if the move would put his own king in check
    const nullPiece = this.board[end.x]![end.y];
    this.board[end.x]![end.y] = piece;
    this.board[start.x]![start.y] = null;
    piece.setCoords(end);
    if (this.isCheck(this.turn)) {
      if (nullPiece) {
        this.board[end.x]![end.y] = nullPiece;
      }
      this.board[start.x]![start.y] = piece;
      piece.setCoords(start);
      return false;
    }
    //check if the move would put his own king in check

    this.board[end.x]![end.y] = piece;
    this.board[start.x]![start.y] = null;
    this.deadPieces.push(deadPiece);
    this.alivePieces = this.alivePieces.filter((p) => p !== deadPiece);
    // Create a new copy of the board
    const newBoard: Chessboard = this.board.map((row) =>
      row.slice()
    ) as Chessboard;

    piece.setCoords(end);
    this.turn = this.turn === "white" ? "black" : "white";
    if (this.isCheck(this.turn)) {
      this.setCheck(true);
      console.log("check");
      if (this.isCheckmate(this.turn)) {
        this.checkmate = true;
        this.winner = this.turn === "white" ? "black" : "white";
      }
      console.log(this.checkmate);
    } else {
      this.setCheck(false);
    }
    return newBoard; // Return the new copy
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
      if (p?.isAttackValid(p.position, king!.position)) {
        isCheck = true;
      }
    });
    return isCheck;
  }
  setCheck(isCheck: boolean): void {
    this.check = isCheck;
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
          const start = piece.position;
          const end = { x, y };

          if (
            piece.isMoveValid(start, end) ||
            piece.isAttackValid(start, end)
          ) {
            if (!this.isCheck(color)) {
              return false;
            }
          }
        }
      }
    }

    return true; // No legal moves removed the check, so it's checkmate
  }
}
