export default class BoardPosition {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public isOnBoard(): boolean {
    return this.x >= 0 && this.x <= 7 && this.y >= 0 && this.y <= 7;
  }

  public equals(other: BoardPosition): boolean {
    return this.x === other.x && this.y === other.y;
  }

  public add(x: number, y: number) {
    return new BoardPosition(this.x + x, this.y + y);
  }

  toChessNotation(): string {
    return String.fromCharCode(97 + this.x) + (this.y + 1);
  }

  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
}
