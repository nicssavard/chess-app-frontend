import { ChessBoard } from "./ChessBoard";
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

  protected moveDirection(
    start: BoardPosition,
    end: BoardPosition,
  ): { x: number; y: number } {
    return {
      x: end.x > start.x ? 1 : end.x < start.x ? -1 : 0,
      y: end.y > start.y ? 1 : end.y < start.y ? -1 : 0,
    };
  }

  public move(start: BoardPosition, end: BoardPosition) {
    return;
  }
  public canMove(end: BoardPosition): boolean {
    if (!this.basicMoveChecks(end)) return false;
    return this.canMoveTo(end);
  }

  protected canMoveTo(end: BoardPosition): boolean {
    return true;
  }

  protected basicMoveChecks(end: BoardPosition): boolean {
    if (this.position.x === end.x && this.position.y === end.y) return false;
    const target = this.board.getPiece(end);
    if (target && target.color === this.color) return false;

    return true;
  }

  protected isPathClear(start: BoardPosition, end: BoardPosition): boolean {
    if (this.isLinear(start, end)) {
      return this.lineClear(start, end);
    } else if (this.isDiagonal(start, end)) {
      return this.diagonalClear(start, end);
    }
    return false;
  }

  protected isLinear(
    start: { x: number; y: number },
    end: { x: number; y: number },
  ) {
    return start.x === end.x || start.y === end.y;
  }
  protected isDiagonal(
    start: { x: number; y: number },
    end: { x: number; y: number },
  ) {
    return Math.abs(start.x - end.x) === Math.abs(start.y - end.y);
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
  protected diagonalClear(start: BoardPosition, end: BoardPosition) {
    const dir = this.moveDirection(start, end);
    for (let i = 1; i < Math.abs(end.y - start.y); i++) {
      if (
        this.board.getPiece({
          x: start.x + i * dir.x,
          y: start.y + i * dir.y,
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
}

export class Pawn extends Chesspiece {
  constructor(color: PieceColor, position: BoardPosition, board: ChessBoard) {
    super(color, position, board, "Pawn");
  }

  public move(start: BoardPosition, end: BoardPosition) {
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

  public clearMoves() {
    this.possibleMoves = [];
    this.possibleAttacks = [];
  }
  public generateMoves() {
    this.clearMoves();
    const p = this.getPosition();
    const dir = this.getColor() === PieceColor.White ? 1 : -1;
    this.canMoveTo(p.add(0, dir));
    this.canMoveTo(p.add(0, dir * 2));
    this.canAttack(p.add(1, dir));
    this.canAttack(p.add(-1, dir));
    // if (this.getColor() === PieceColor.White) {
    //   if (this.canMoveTo(p.add(0, 1))) {
    //     this.possibleMoves.push(p.add(0, 1));
    //   }
    //   if (this.canMoveTo(p.add(0, 2))) {
    //     this.possibleMoves.push(p.add(0, 2));
    //   }
    //   if (this.canAttack(p.add(1, 1))) {
    //     this.addAttack(p.add(1, 1));
    //   }
    //   if (this.canAttack(p.add(-1, 1))) {
    //     this.addAttack(p.add(-1, 1));
    //   }
    // } else {
    //   if (this.canMoveTo(p.add(0, -1))) {
    //     this.possibleMoves.push(p.add(0, -1));
    //   }
    //   if (this.canMoveTo(p.add(0, -2))) {
    //     this.possibleMoves.push(p.add(0, -2));
    //   }
    //   if (this.canAttack(p.add(1, -1))) {
    //     this.addAttack(p.add(1, -1));
    //   }
    //   if (this.canAttack(p.add(-1, -1))) {
    //     this.addAttack(p.add(-1, -1));
    //   }
    // }
  }
  public addMove(move: BoardPosition) {
    this.possibleMoves.push(move);
  }
  public addAttack(attack: BoardPosition) {
    console.log("addAttack");
    console.log(attack);
    this.possibleAttacks.push(attack);
  }

  public getMoves() {
    this.generateMoves();
    return this.possibleMoves;
  }
  public getAttacks() {
    this.generateMoves();
    return this.possibleAttacks;
  }

  protected canMoveTo(end: BoardPosition): boolean {
    if (this.canMoveStraight(end)) {
      this.addMove(end);
      return true;
    }
    return false;
  }

  private canMoveStraight(end: BoardPosition): boolean {
    if (this.getPosition().x !== end.x) return false; //check if pawn is moving sideways

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
  private canAttack(end: BoardPosition): boolean {
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
    //   if (this.getColor() === PieceColor.White) {
    //     if (
    //       this.getPosition().y - end.y === -1 &&
    //       Math.abs(this.getPosition().x - end.x) === 1
    //     ) {
    //       return true;
    //     }
    //   } else if (this.getColor() === PieceColor.Black) {
    //     if (
    //       this.getPosition().y - end.y === 1 &&
    //       Math.abs(this.getPosition().x - end.x) === 1
    //     ) {
    //       return true;
    //     }
    //   }
    return false;
  }
}

export class Rook extends Chesspiece {
  hasMoved: boolean = false;
  constructor(color: PieceColor, position: BoardPosition, board: ChessBoard) {
    super(color, position, board, "Rook");
  }

  protected canMoveTo(end: BoardPosition): boolean {
    return (
      this.isLinear(this.getPosition(), end) &&
      this.lineClear(this.getPosition(), end)
    );
  }

  protected setHasMoved() {
    this.hasMoved = true;
  }
}

export class Knight extends Chesspiece {
  constructor(color: PieceColor, position: BoardPosition, board: ChessBoard) {
    super(color, position, board, "Knight");
  }
  protected canMoveTo(end: BoardPosition): boolean {
    return (
      (Math.abs(this.getPosition().x - end.x) === 1 &&
        Math.abs(this.getPosition().y - end.y) === 2) ||
      (Math.abs(this.getPosition().x - end.x) === 2 &&
        Math.abs(this.getPosition().y - end.y) === 1)
    );
  }
}

export class Bishop extends Chesspiece {
  constructor(color: PieceColor, position: BoardPosition, board: ChessBoard) {
    super(color, position, board, "Bishop");
  }
  protected canMoveTo(end: BoardPosition): boolean {
    return (
      this.isDiagonal(this.getPosition(), end) &&
      this.diagonalClear(this.getPosition(), end)
    );
  }
}

export class Queen extends Chesspiece {
  constructor(color: PieceColor, position: BoardPosition, board: ChessBoard) {
    super(color, position, board, "Queen");
  }
  protected canMoveTo(end: BoardPosition): boolean {
    if (this.isLinear(this.getPosition(), end)) {
      return this.lineClear(this.getPosition(), end);
    } else if (this.isDiagonal(this.getPosition(), end)) {
      return this.diagonalClear(this.getPosition(), end);
    }
    return false;
  }
}

export class King extends Chesspiece {
  hasMoved: boolean = false;
  constructor(color: PieceColor, position: BoardPosition, board: ChessBoard) {
    super(color, position, board, "King");
  }
  protected canMoveTo(end: BoardPosition): boolean {
    return (
      Math.abs(this.getPosition().x - end.x) <= 1 &&
      Math.abs(this.getPosition().y - end.y) <= 1
    );
  }
  protected setHasMoved() {
    this.hasMoved = true;
  }
}
