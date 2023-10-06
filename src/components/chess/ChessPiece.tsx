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
    this.clearMoves();
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
    const length = Math.abs(end.x - start.x) || Math.abs(end.y - start.y);
    for (let i = 1; i < length; i++) {
      if (
        this.board.getPiece({
          y: start.y + i * dir.y,
          x: start.x + i * dir.x,
        }) !== null
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
    this.getBoard().movePiece(this, end);
    return;
  }
  public attack(end: BoardPosition) {
    this.getBoard().killPiece(end);
    this.getBoard().movePiece(this, end);
    this.getBoard().halfMoves = 0;
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
  constructor(color: PieceColor, position: BoardPosition, board: ChessBoard) {
    super(color, position, board, "Pawn");
  }

  public move(end: BoardPosition) {
    const start = this.getPosition();
    super.move(end);
    this.getBoard().halfMoves = 0;
    if (Math.abs(start.y - end.y) === 2) {
      if (this.getColor() === PieceColor.White) {
        this.getBoard().enPassant = start.add(0, 1).toChessNotation();
      } else {
        this.getBoard().enPassant = start.add(0, -1).toChessNotation();
      }
    }
    return;
  }
  public attack(end: BoardPosition) {
    if (this.getBoard().enPassant === end.toChessNotation()) {
      this.getBoard().killPiece(
        end.add(0, this.getColor() === PieceColor.White ? -1 : 1),
      );
      this.getBoard().movePiece(this, end);
      this.getBoard().halfMoves = 0;
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
    if (
      this.getBoard().getPiece(end) &&
      this.getColor() != this.getBoard().getPiece(end)?.getColor()
    ) {
      this.addAttack(end);
      return true;
    }
    if (this.getBoard().enPassant === end.toChessNotation()) {
      this.addAttack(end);
      return true;
    }
    return false;
  }
}

export class Rook extends Chesspiece {
  hasMoved: boolean = false;
  constructor(color: PieceColor, position: BoardPosition, board: ChessBoard) {
    super(color, position, board, "Rook");
  }

  public move(end: BoardPosition): void {
    this.hasMoved = true;
    super.move(end);
  }
  public attack(end: BoardPosition): void {
    this.hasMoved = true;
    super.attack(end);
  }
  public generateMoves() {
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
  constructor(color: PieceColor, position: BoardPosition, board: ChessBoard) {
    super(color, position, board, "Bishop");
  }
  public generateMoves() {
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
  constructor(color: PieceColor, position: BoardPosition, board: ChessBoard) {
    super(color, position, board, "Queen");
  }
  public generateMoves() {
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
  hasMoved: boolean = false;
  constructor(color: PieceColor, position: BoardPosition, board: ChessBoard) {
    super(color, position, board, "King");
  }
  public move(end: BoardPosition): void {
    this.hasMoved = true;
    super.move(end);
  }
  public attack(end: BoardPosition): void {
    this.hasMoved = true;
    super.attack(end);
  }
  public generateMoves() {
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
