import Image from "next/image";
import { Chesspiece } from "@/components/chess/ChessPiece";

interface props {
  deadPieces: Chesspiece[];
  color: "white" | "black";
}
export default function DeadPieces({ deadPieces, color }: props) {
  return (
    <div className="flex flex-row justify-center">
      {deadPieces.map((piece, index) => {
        return (
          <Image
            src={`/chessPieces/${color}${piece.getType()}.png`}
            alt={`/chessPieces/${color}${piece.getType()}.png`}
            className="h-10 w-10 shrink"
            width={100}
            height={100}
            key={index}
          />
        );
      })}
    </div>
  );
}
