import ChessBoard from "./ChessBoard";
import BoardPosition from "./BoardPosition";
import { PieceColor } from "./ChessBoard";

export class Chesspiece {
  private color: PieceColor;
  private position: BoardPosition;
  private board: ChessBoard;
  private type: string;
  public possibleMoves: BoardPosition[] = [];
  public possibleAttacks: BoardPosition[] = [];
  public hasMoved: boolean = false;
  public value: number = 0;
  constructor(
    color: PieceColor,
    position: BoardPosition,
    board: ChessBoard,
    type: string,
  ) {
    this.color = color;
    this.position = position;
    this.board = board;
    this.type = type;
  }

  protected moveDirection(
    start: BoardPosition,
    end: BoardPosition,
  ): { x: number; y: number } {
    return {
      x: end.x > start.x ? 1 : end.x < start.x ? -1 : 0,
      y: end.y > start.y ? 1 : end.y < start.y ? -1 : 0,
    };
  }

  public generateMoves() { }

  public generateMovesLine(directions: BoardPosition[], length: number = 8) {
    directions.forEach((dir) => {
      let d = 1;
      while (d <= length) {
        const pos = this.getPosition().add(d * dir.x, d * dir.y);
        const endSquare = this.getBoard().getPiece(pos);
        if (endSquare === null) {
          //can move there
          this.addMove(pos);
        } else if (endSquare === undefined) {
          //outside of the board
          break;
        } else {
          //there is a piece on the endSquare
          if (this.getColor() != endSquare.getColor()) {
            this.addAttack(pos);
          }
          break;
        }
        d += 1;
      }
    });
  }
  protected lineClear(start: BoardPosition, end: BoardPosition) {
    const dir = this.moveDirection(start, end);
    const length = Math.abs(end.x - start.x);
    for (let i = 1; i < length; i++) {
      if (
        this.board.getPiece(
          new BoardPosition(start.x + i * dir.x, start.y + i * dir.y),
        ) !== null
      ) {
        return false;
      }
    }
    return true;
  }

  public lineNotThreatened(start: BoardPosition, end: BoardPosition) {
    const dir = this.moveDirection(start, end);
    const length = Math.abs(end.x - start.x) || Math.abs(end.y - start.y);
    for (let i = 0; i <= length; i++) {
      if (
        this.getBoard().isThreatened(
          new BoardPosition(start.x + i * dir.x, start.y + i * dir.y),
          this.getColor() === PieceColor.White
            ? PieceColor.Black
            : PieceColor.White,
        )
      ) {
        return false;
      }
    }
    return true;
  }

  setPosition(position: BoardPosition) {
    this.position = position;
  }
  public getColor(): PieceColor {
    return this.color;
  }

  public getPosition(): BoardPosition {
    return this.position;
  }

  public getBoard(): ChessBoard {
    return this.board;
  }

  public getType(): string {
    return this.type;
  }

  public getMoves() {
    return this.possibleMoves;
  }
  public getAttacks() {
    return this.possibleAttacks;
  }
  public addMove(move: BoardPosition) {
    this.possibleMoves.push(move);
  }
  public addAttack(attack: BoardPosition) {
    this.possibleAttacks.push(attack);
  }
  public clearMoves() {
    this.possibleMoves = [];
    this.possibleAttacks = [];
  }
  public move(end: BoardPosition) {
    this.hasMoved = true;
    this.getBoard().movePiece(this, end);
    return;
  }
  public attack(end: BoardPosition) {
    this.hasMoved = true;
    this.getBoard().killPiece(end);
    this.getBoard().movePiece(this, end);
    return;
  }
  public isInMoves(end: BoardPosition) {
    return this.possibleMoves.some((move) => move.equals(end));
  }
  public isInAttacks(end: BoardPosition) {
    return this.possibleAttacks.some((move) => move.equals(end));
  }
}

export class Pawn extends Chesspiece {
  public value: number = 1;
  constructor(color: PieceColor, position: BoardPosition, board: ChessBoard) {
    super(color, position, board, "Pawn");
  }

  public attack(end: BoardPosition) {
    if (this.getBoard().enPassant === end.toChessNotation()) {
      this.getBoard().killPiece(
        end.add(0, this.getColor() === PieceColor.White ? -1 : 1),
      );
      this.getBoard().movePiece(this, end);
      return;
    } else {
      super.attack(end);
      return;
    }
  }

  public generateMoves() {
    this.clearMoves();
    const p = this.getPosition();
    const dir = this.getColor() === PieceColor.White ? 1 : -1;
    this.canMoveTo(p.add(0, dir));
    this.canMoveTo(p.add(0, dir * 2));
    this.canAttack(p.add(1, dir));
    this.canAttack(p.add(-1, dir));
  }

  public canMoveTo(end: BoardPosition): boolean {
    if (!end.isOnBoard()) return false;
    if (this.canMoveStraight(end)) {
      this.addMove(end);
      return true;
    }
    return false;
  }

  private canMoveStraight(end: BoardPosition): boolean {
    if (this.getPosition().x !== end.x) return false; //check if pawn is moving sideways
    if (this.getBoard().getPiece(end)) return false; //check if there is a piece in the way
    const dir = this.getColor() === PieceColor.White ? 1 : -1;

    if (this.getColor() === PieceColor.White) {
      if (this.getPosition().y === 1 && end.y === 3) {
        //check if pawn is moving 2 spaces
        if (this.lineClear(this.getPosition(), end) === false) {
          //check if there is a piece in the way
          return false;
        }
      } else if (this.getPosition().y - end.y !== -1) {
        return false;
      }
    } else if (this.getColor() === PieceColor.Black) {
      if (this.getPosition().y === 6 && end.y === 4) {
        //check if pawn is moving 2 spaces
        if (this.lineClear(this.getPosition(), end) === false) {
          return false;
        }
      } else if (this.getPosition().y - end.y !== 1) {
        return false;
      }
    }
    return true;
  }
  public canAttack(end: BoardPosition): boolean {
    if (!end.isOnBoard()) return false;
    const pieceAttacked = this.getBoard().getPiece(end);
    if (pieceAttacked && this.getColor() != pieceAttacked.getColor()) {
      this.addAttack(end);
      return true;
    }
    //todo add check for color
    if (this.getBoard().turn === this.getColor()) {
      if (this.getBoard().enPassant === end.toChessNotation()) {
        this.addAttack(end);
        return true;
      }
    }
    return false;
  }
}

export class Rook extends Chesspiece {
  public value: number = 5;
  constructor(color: PieceColor, position: BoardPosition, board: ChessBoard) {
    super(color, position, board, "Rook");
  }

  public generateMoves() {
    this.clearMoves();
    const directions = [
      new BoardPosition(0, 1),
      new BoardPosition(0, -1),
      new BoardPosition(1, 0),
      new BoardPosition(-1, 0),
    ];
    this.generateMovesLine(directions);
  }
}

export class Knight extends Chesspiece {
  public value: number = 3;
  constructor(color: PieceColor, position: BoardPosition, board: ChessBoard) {
    super(color, position, board, "Knight");
  }
  public generateMoves() {
    this.clearMoves();
    const p = this.getPosition();
    this.canMoveTo(p.add(1, 2));
    this.canMoveTo(p.add(2, 1));
    this.canMoveTo(p.add(2, -1));
    this.canMoveTo(p.add(1, -2));
    this.canMoveTo(p.add(-1, -2));
    this.canMoveTo(p.add(-2, -1));
    this.canMoveTo(p.add(-2, 1));
    this.canMoveTo(p.add(-1, 2));
  }
  public canMoveTo(end: BoardPosition): boolean {
    if (!end.isOnBoard()) return false;
    if (this.getBoard().getPiece(end)) {
      if (this.getColor() != this.getBoard().getPiece(end)?.getColor()) {
        this.addAttack(end);
        return true;
      } else {
        return false;
      }
    } else {
      this.addMove(end);
      return true;
    }
  }
}

export class Bishop extends Chesspiece {
  public value: number = 3;
  constructor(color: PieceColor, position: BoardPosition, board: ChessBoard) {
    super(color, position, board, "Bishop");
  }
  public generateMoves() {
    this.clearMoves();
    const directions = [
      new BoardPosition(1, 1),
      new BoardPosition(1, -1),
      new BoardPosition(-1, 1),
      new BoardPosition(-1, -1),
    ];
    this.generateMovesLine(directions);
  }
}

export class Queen extends Chesspiece {
  public value: number = 9;
  constructor(color: PieceColor, position: BoardPosition, board: ChessBoard) {
    super(color, position, board, "Queen");
  }
  public generateMoves() {
    this.clearMoves();
    const directions = [
      new BoardPosition(0, 1),
      new BoardPosition(0, -1),
      new BoardPosition(1, 0),
      new BoardPosition(-1, 0),
      new BoardPosition(1, 1),
      new BoardPosition(1, -1),
      new BoardPosition(-1, 1),
      new BoardPosition(-1, -1),
    ];
    this.generateMovesLine(directions);
  }
}

export class King extends Chesspiece {
  public value: number = 100;
  constructor(color: PieceColor, position: BoardPosition, board: ChessBoard) {
    super(color, position, board, "King");
  }
  public move(end: BoardPosition): void {
    if (Math.abs(this.getPosition().x - end.x) > 1) {
      const rook = this.getBoard().getPiece(
        new BoardPosition(
          end.x > this.getPosition().x ? 7 : 0,
          this.getPosition().y,
        ),
      ) as Rook;
      this.getBoard().movePiece(
        rook,
        new BoardPosition(
          end.x > this.getPosition().x ? 5 : 3,
          this.getPosition().y,
        ),
      );
    }
    super.move(end);
  }

  public generateMoves() {
    this.clearMoves();
    const directions = [
      new BoardPosition(0, 1),
      new BoardPosition(0, -1),
      new BoardPosition(1, 0),
      new BoardPosition(-1, 0),
      new BoardPosition(1, 1),
      new BoardPosition(1, -1),
      new BoardPosition(-1, 1),
      new BoardPosition(-1, -1),
    ];
    this.generateMovesLine(directions, 1);
    this.generateCastlingMoves();
  }
  generateCastlingMoves() {
    if (this.hasMoved) return;

    const y = this.getColor() === PieceColor.White ? 0 : 7;

    this.tryCastling(
      new BoardPosition(0, y),
      new BoardPosition(2, y),
      new BoardPosition(1, y),
    );
    this.tryCastling(
      new BoardPosition(7, y),
      new BoardPosition(6, y),
      new BoardPosition(6, y),
    );
  }

  private tryCastling(
    rookPosition: BoardPosition,
    castlingPosition: BoardPosition,
    checkPosition: BoardPosition,
  ) {
    const rook = this.getBoard().getPiece(rookPosition);
    if (rook && this.isCastlingPossible(checkPosition, rook)) {
      this.addMove(castlingPosition);
    }
  }

  private isCastlingPossible(checkPosition: BoardPosition, rook: any): boolean {
    return (
      this.lineClear(this.getPosition(), checkPosition) &&
      this.lineNotThreatened(this.getPosition(), rook.getPosition())
    );
  }

  canMoveTo(end: BoardPosition): boolean {
    return (
      Math.abs(this.getPosition().x - end.x) <= 1 &&
      Math.abs(this.getPosition().y - end.y) <= 1
    );
  }
  protected setHasMoved() {
    this.hasMoved = true;
  }
}
