interface props {
  onPromote: (selection: string) => void;
}
export default function PromotionModal({ onPromote }: props) {
  return (
    <div className="promotion-modal">
      <div onClick={() => onPromote("Q")}>👑</div>
      <div onClick={() => onPromote("R")}>🗼</div>
      <div onClick={() => onPromote("B")}>🏰</div>
      <div onClick={() => onPromote("N")}>🐴</div>
    </div>
  );
}
