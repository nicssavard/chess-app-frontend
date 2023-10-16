import Image from "next/image";
const whitePiecesChoices = [
  {
    name: "N",
    image: "whiteKnight.png",
    color: "w",
  },
  {
    name: "B",
    image: "whiteBishop.png",
    color: "w",
  },
  {
    name: "R",
    image: "whiteRook.png",
    color: "w",
  },
  {
    name: "Q",
    image: "whiteQueen.png",
    color: "w",
  },
];
const blackPiecesChoices = [
  {
    name: "n",
    image: "blackKnight.png",
    color: "b",
  },
  {
    name: "b",
    image: "blackBishop.png",
    color: "b",
  },
  {
    name: "r",
    image: "blackRook.png",
    color: "b",
  },
  {
    name: "q",
    image: "blackQueen.png",
    color: "b",
  },
];

interface props {
  color: "w" | "b";
  onPromote: (selection: string) => void;
}
export default function PromotionModal({ color, onPromote }: props) {
  const piecesChoices = color === "w" ? whitePiecesChoices : blackPiecesChoices;
  return (
    <div className="flex justify-center">
      {piecesChoices.map((piece, index) => {
        return (
          <div
            key={index}
            className="mx-2"
            onClick={() => onPromote(piece.name)}
          >
            <Piece image={piece.image} />
          </div>
        );
      })}
    </div>
  );
}
interface pieceProps {
  image: string;
}
const Piece = ({ image }: pieceProps) => {
  return (
    <Image
      src={`/chessPieces/${image}`}
      alt={image}
      className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16"
      height={100}
      width={100}
      sizes="(max-width: 640px) 100vw, 50vw"
    />
  );
};
