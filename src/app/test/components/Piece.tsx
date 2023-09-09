import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  src: string;
  alt: string;
  x: number;
  y: number;
  id: string;
}

export function Piece({ src, alt, id }: Props) {
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
