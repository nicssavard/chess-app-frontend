import { ChessPosition } from "../../../typings";
import { ChessBoard } from "./ChessBoard";

export class Chesspiece {
  private color: string;
  private position: ChessPosition;
  board: ChessBoard;
  constructor(color: string, position: ChessPosition, board: ChessBoard) {
    this.color = color;
    this.position = position;
    this.board = board;
  }

  public getColor(): string {
    return this.color;
  }

  public getPosition(): ChessPosition {
    return this.position;
  }

  public move(end: ChessPosition): boolean {
    if (this.position.x === end.x && this.position.y === end.y) return false;
    const target = this.board.getPieceAtPosition(end);
    if (target && target.color === this.color) return false;

    return true;
  }

  isLinear(start: { x: number; y: number }, end: { x: number; y: number }) {
    if (start.x === end.x || start.y === end.y) {
      return true;
    }
    return false;
  }
  isDiagonal(start: { x: number; y: number }, end: { x: number; y: number }) {
    if (Math.abs(start.x - end.x) === Math.abs(start.y - end.y)) {
      return true;
    }
    return false;
  }
  lineClear(start: { x: number; y: number }, end: { x: number; y: number }) {
    if (start.x === end.x) {
      //moving vertically
      if (start.y < end.y) {
        //moving down
        for (let i = start.y + 1; i < end.y; i++) {
          if (this.board.board[i]![start.x] !== null) {
            return false;
          }
        }
      } else {
        //moving up
        for (let i = start.y - 1; i > end.y; i--) {
          if (this.board.board[i]![start.x] !== null) {
            return false;
          }
        }
      }
    } else {
      //moving horizontally
      if (start.x < end.x) {
        //moving right
        for (let i = start.x + 1; i < end.x; i++) {
          if (this.board.board[start.y]![i] !== null) {
            return false;
          }
        }
      } else {
        //moving left
        for (let i = start.x - 1; i > end.x; i--) {
          if (this.board.board[start.y]![i] !== null) {
            return false;
          }
        }
      }
    }
    return true;
  }
  DiagonalClear(
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) {
    if (start.y < end.y) {
      //moving up
      for (let i = 1; i < end.y - start.y; i++) {
        if (start.x < end.x) {
          if (this.board.board[start.y + i]![start.x + i] !== null) {
            return false;
          }
        } else {
          if (this.board.board[start.y + i]![start.x - i] !== null) {
            return false;
          }
        }
      }
    } else {
      for (let i = 1; i < start.y - end.y; i++) {
        if (start.x < end.x) {
          if (this.board.board[start.y - i]![start.x + i] !== null) {
            return false;
          }
        } else {
          if (this.board.board[start.y - i]![start.x - i] !== null) {
            return false;
          }
        }
      }
    }
  }

  setPosition(position: ChessPosition) {
    this.position = position;
  }
}

export class Pawn extends Chesspiece {
  type: string;

  constructor(color: string, position: ChessPosition, board: ChessBoard) {
    super(color, position, board);
    this.type = "Pawn";
  }

  public move(end: ChessPosition): boolean {
    if (!super.move(end)) return false;
    if (
      this.board.getPieceAtPosition(end)
        ? !this.canAttack(end)
        : !this.canMove(end)
    ) {
      return false; //check if pawn can move to end position
    }
    return true;
  }

  canMove(end: ChessPosition): boolean {
    if (this.getPosition().x !== end.x) return false; //check if pawn is moving sideways

    if (this.getColor() === "white") {
      if (this.getPosition().y === 1 && end.y === 3) {
        //check if pawn is moving 2 spaces
        if (this.lineClear(this.getPosition(), end) === false) {
          //check if there is a piece in the way
          return false;
        }
      } else if (this.getPosition().y - end.y !== -1) {
        return false;
      }
    } else if (this.getColor() === "black") {
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
  canAttack(end: ChessPosition): boolean {
    if (this.getColor() === "white") {
      if (
        this.getPosition().y - end.y === -1 &&
        Math.abs(this.getPosition().x - end.x) === 1
      ) {
        return true;
      }
    } else if (this.getColor() === "black") {
      if (
        this.getPosition().y - end.y === 1 &&
        Math.abs(this.getPosition().x - end.x) === 1
      ) {
        return true;
      }
    }
    return false;
  }
}

export class Rook extends Chesspiece {
  type: string;
  constructor(color: string, position: ChessPosition, board: ChessBoard) {
    super(color, position, board);
    this.type = "Rook";
  }

  public move(end: ChessPosition): boolean {
    if (!super.move(end)) return false;
    if (!this.canMove(end)) {
      return false; //check if pawn can move to end position
    }
    return true;
  }

  canMove(end: ChessPosition): boolean {
    if (this.isLinear(this.getPosition(), end) === false) return false;
    if (this.lineClear(this.getPosition(), end) === false) return false;
    return true;
  }
}

export class Knight extends Chesspiece {
  type: string;
  constructor(color: string, position: ChessPosition, board: ChessBoard) {
    super(color, position, board);
    this.type = "Knight";
  }
  public move(end: ChessPosition): boolean {
    if (!super.move(end)) return false;
    if (!this.canMove(end)) {
      return false; //check if pawn can move to end position
    }
    return true;
  }
  canMove(end: ChessPosition): boolean {
    if (
      !(
        (Math.abs(this.getPosition().x - end.x) === 1 &&
          Math.abs(this.getPosition().y - end.y) === 2) ||
        (Math.abs(this.getPosition().x - end.x) === 2 &&
          Math.abs(this.getPosition().y - end.y) === 1)
      )
    ) {
      //check if knight is moving in an L shape
      return false;
    }
    return true;
  }
}

export class Bishop extends Chesspiece {
  type: string;
  constructor(color: string, position: ChessPosition, board: ChessBoard) {
    super(color, position, board);
    this.type = "Bishop";
  }
  public move(end: ChessPosition): boolean {
    if (!super.move(end)) return false;
    if (!this.canMove(end)) {
      return false; //check if pawn can move to end position
    }
    return true;
  }
  canMove(end: ChessPosition): boolean {
    if (this.isDiagonal(this.getPosition(), end) === false) return false;
    if (this.DiagonalClear(this.getPosition(), end) === false) return false;
    return true;
  }
}

export class Queen extends Chesspiece {
  type: string;
  constructor(color: string, position: ChessPosition, board: ChessBoard) {
    super(color, position, board);
    this.type = "Queen";
  }
  public move(end: ChessPosition): boolean {
    if (!super.move(end)) return false;
    if (!this.canMove(end)) {
      return false; //check if pawn can move to end position
    }
    return true;
  }
  canMove(end: ChessPosition): boolean {
    if (this.isLinear(this.getPosition(), end) === false) {
      if (this.isDiagonal(this.getPosition(), end) === false) return false;
      if (this.DiagonalClear(this.getPosition(), end) === false) return false;
    } else if (this.lineClear(this.getPosition(), end) === false) return false;
    return true;
  }
}

export class King extends Chesspiece {
  type: string;
  constructor(color: string, position: ChessPosition, board: ChessBoard) {
    super(color, position, board);
    this.type = "King";
  }
  public move(end: ChessPosition): boolean {
    if (!super.move(end)) return false;
    if (!this.canMove(end)) {
      return false; //check if pawn can move to end position
    }
    return true;
  }
  canMove(end: ChessPosition): boolean {
    if (
      Math.abs(this.getPosition().x - end.x) > 1 ||
      Math.abs(this.getPosition().y - end.y) > 1
    ) {
      //check if king is moving more than 1 space
      return false;
    }
    return true;
  }
}
