type User = {
  id: number;
  username: string;
  email: string;
  token: string;
};

type Chat = {
  id: number;
  messages: Message[];
  participants: [number, number];
};

type Message = {
  chat: number;
  id: number;
  sender: number;
  content: string;
  timestamp: string;
};

type ChessPosition = {
  x: number;
  y: number;
};

type Chesspiece = Pawn | Rook | Knight | Bishop | Queen | King | null;

type Chessboard = Chesspiece[][];
