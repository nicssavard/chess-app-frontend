import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { chessBoard } from "./ChessBoard";
// import { Chessboard, Chesspiece } from "../../../typings";

interface ChessPieceProps {
  src: string;
  alt: string;
  x: number;
  y: number;
  id: string;
}

export function ChessPiece({ src, alt, id }: ChessPieceProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const isDragging = transform !== null; // Check if the piece is being dragged

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 1000 : undefined, // Apply higher z-index if dragging
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="h-full w-full"
    >
      <Image
        draggable={false}
        className="cursor-pointer"
        src={src}
        alt={alt}
        fill={true}
      />
    </div>
  );
}

export class chessPiece {
  color: string;
  board;
  position: ChessPosition;
  constructor(color: string, position: ChessPosition) {
    this.color = color;
    this.position = position;
    this.board = chessBoard.getInstance();
  }

  hasMoved(start: { x: number; y: number }, end: { x: number; y: number }) {
    if (start.x === end.x && start.y === end.y) {
      return false;
    }
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
          if (this.board.board[start.x]![i] !== null) {
            return false;
          }
        }
      } else {
        //moving up
        for (let i = start.y - 1; i > end.y; i--) {
          if (this.board.board[start.x]![i] !== null) {
            return false;
          }
        }
      }
    } else {
      //moving horizontally
      if (start.x < end.x) {
        //moving right
        for (let i = start.x + 1; i < end.x; i++) {
          if (this.board.board[i]![start.y] !== null) {
            return false;
          }
        }
      } else {
        //moving left
        for (let i = start.x - 1; i > end.x; i--) {
          if (this.board.board[i]![start.y] !== null) {
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
    if (start.x < end.x) {
      //moving down
      if (start.y < end.y) {
        //moving right
        for (let i = 1; i < end.x - start.x; i++) {
          if (this.board.board[start.x + i]![start.y + i] !== null) {
            return false;
          }
        }
      } else {
        //moving left
        for (let i = 1; i < end.x - start.x; i++) {
          if (this.board.board[start.x + i]![start.y - i] !== null) {
            return false;
          }
        }
      }
    } else {
      //moving up
      if (start.y < end.y) {
        //moving right
        for (let i = 1; i < start.x - end.x; i++) {
          if (this.board.board[start.x - i]![start.y + i] !== null) {
            return false;
          }
        }
      } else {
        //moving left
        for (let i = 1; i < start.x - end.x; i++) {
          if (this.board.board[start.x - i]![start.y - i] !== null) {
            return false;
          }
        }
      }
    }
    return true;
  }
  setCoords(end: { x: number; y: number }) {
    this.position = end;
  }
}

export class Pawn extends chessPiece {
  type = "Pawn";
  constructor(color: string, position: ChessPosition) {
    super(color, position);
  }

  move(start: { x: number; y: number }, end: { x: number; y: number }) {
    if (this.isAttackValid(start, end)) return this.board.killPiece(start, end);
    if (this.isMoveValid(start, end)) return this.board.movePiece(start, end);
    return false;
  }

  isMoveValid(start: { x: number; y: number }, end: { x: number; y: number }) {
    if (!this.hasMoved(start, end)) return false;
    if (start.y !== end.y) return false; //check if pawn is moving sideways

    if (this.board.board[end.x]![end.y] !== null) {
      //check if pawn is moving into a piece
      return false;
    }
    if (this.color === "white") {
      if (start.x === 1 && end.x === 3) {
        //check if pawn is moving 2 spaces
        if (this.lineClear(start, end) === false) {
          //check if there is a piece in the way
          return false;
        }
      } else if (start.x - end.x !== -1) {
        return false;
      }
    } else if (this.color === "black") {
      if (start.x === 6 && end.x === 4) {
        //check if pawn is moving 2 spaces
        if (this.lineClear(start, end) === false) {
          return false;
        }
      } else if (start.x - end.x !== 1) {
        return false;
      }
    }
    return true;
  }

  isAttackValid(
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) {
    if (this.color === "white") {
      if (
        start.x - end.x === -1 &&
        Math.abs(start.y - end.y) === 1 &&
        this.board.board[end.x]![end.y] !== null
      ) {
        //check if pawn is attacking
        return true;
      }
    } else if (this.color === "black") {
      if (
        start.x - end.x === 1 &&
        Math.abs(start.y - end.y) === 1 &&
        this.board.board[end.x]![end.y] !== null
      ) {
        //check if pawn is attacking
        return true;
      }
    }
    return false;
  }
}

export class Rook extends chessPiece {
  type = "Rook";
  constructor(color: string, position: ChessPosition) {
    super(color, position);
  }

  move(start: { x: number; y: number }, end: { x: number; y: number }) {
    if (this.isAttackValid(start, end)) return this.board.killPiece(start, end);
    if (this.isMoveValid(start, end)) return this.board.movePiece(start, end);
    return false;
  }

  isMoveValid(start: { x: number; y: number }, end: { x: number; y: number }) {
    if (this.hasMoved(start, end) === false) return false;
    if (this.isLinear(start, end) === false) return false;
    if (this.lineClear(start, end) === false) return false;
    return true;
  }

  isAttackValid(
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) {
    if (
      this.isMoveValid(start, end) &&
      this.board.board[end.x]![end.y] !== null
    ) {
      return true;
    }
    return false;
  }
}

export class Knight extends chessPiece {
  type = "Knight";
  constructor(color: string, position: ChessPosition) {
    super(color, position);
  }

  move(start: { x: number; y: number }, end: { x: number; y: number }) {
    if (this.isAttackValid(start, end)) return this.board.killPiece(start, end);
    if (this.isMoveValid(start, end)) return this.board.movePiece(start, end);
    return false;
  }

  isMoveValid(start: { x: number; y: number }, end: { x: number; y: number }) {
    if (
      !(
        (Math.abs(start.x - end.x) === 1 && Math.abs(start.y - end.y) === 2) ||
        (Math.abs(start.x - end.x) === 2 && Math.abs(start.y - end.y) === 1)
      )
    ) {
      //check if knight is moving in an L shape
      return false;
    }
    return true;
  }
  isAttackValid(
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) {
    if (
      this.isMoveValid(start, end) &&
      this.board.board[end.x]![end.y] !== null
    ) {
      return true;
    }
    return false;
  }
}

export class Bishop extends chessPiece {
  type = "Bishop";
  constructor(color: string, position: ChessPosition) {
    super(color, position);
  }

  move(start: { x: number; y: number }, end: { x: number; y: number }) {
    if (this.isAttackValid(start, end)) return this.board.killPiece(start, end);
    if (this.isMoveValid(start, end)) return this.board.movePiece(start, end);
    return false;
  }
  isMoveValid(start: { x: number; y: number }, end: { x: number; y: number }) {
    if (this.hasMoved(start, end) === false) return false;
    if (this.isDiagonal(start, end) === false) return false;
    if (this.DiagonalClear(start, end) === false) return false;
    return true;
  }
  isAttackValid(
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) {
    if (
      this.isMoveValid(start, end) &&
      this.board.board[end.x]![end.y] !== null
    ) {
      return true;
    }
    return false;
  }
}

export class Queen extends chessPiece {
  type = "Queen";
  constructor(color: string, position: ChessPosition) {
    super(color, position);
  }

  move(start: { x: number; y: number }, end: { x: number; y: number }) {
    if (this.isAttackValid(start, end)) return this.board.killPiece(start, end);
    if (this.isMoveValid(start, end)) return this.board.movePiece(start, end);
    return false;
  }
  isMoveValid(start: { x: number; y: number }, end: { x: number; y: number }) {
    if (this.hasMoved(start, end) === false) return false;

    if (this.isLinear(start, end) === false) {
      if (this.isDiagonal(start, end) === false) return false;
      if (this.DiagonalClear(start, end) === false) return false;
    } else if (this.lineClear(start, end) === false) return false;
    return true;
  }
  isAttackValid(
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) {
    if (
      this.isMoveValid(start, end) &&
      this.board.board[end.x]![end.y] !== null
    ) {
      return true;
    }
    return false;
  }
}

export class King extends chessPiece {
  type = "King";
  constructor(color: string, position: ChessPosition) {
    super(color, position);
  }

  move(start: { x: number; y: number }, end: { x: number; y: number }) {
    if (this.isAttackValid(start, end)) return this.board.killPiece(start, end);
    if (this.isMoveValid(start, end)) return this.board.movePiece(start, end);
    return false;
  }

  isMoveValid(start: { x: number; y: number }, end: { x: number; y: number }) {
    if (this.hasMoved(start, end) === false) return false;
    if (this.color === this.board.board[end.x]![end.y]?.color) {
      return false;
    }
    if (Math.abs(start.x - end.x) > 1 || Math.abs(start.y - end.y) > 1) {
      //check if king is moving more than 1 space
      return false;
    }
    return true;
  }
  isAttackValid(
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) {
    if (this.color === this.board.board[end.x]![end.y]?.color) {
      return false;
    }
    if (
      this.isMoveValid(start, end) &&
      this.board.board[end.x]![end.y] !== null
    ) {
      return true;
    }
    return false;
  }
}
