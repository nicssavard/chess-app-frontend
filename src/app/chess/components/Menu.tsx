"use client";

interface MenuProps {
  setGameType: (gameType: "random" | "bot") => void;
}

export default function Menu({ setGameType }: MenuProps) {
  const handleChoice = (
    e: { preventDefault: () => void },
    choice: "random" | "bot",
  ) => {
    e.preventDefault();
    setGameType(choice);
  };
  return (
    <>
      <div className="m-5 mt-20 rounded-xl bg-gray-900 p-10">
        <div className="flex flex-col text-xl sm:text-4xl">
          <button
            onClick={(e) => handleChoice(e, "random")}
            className="transform rounded-xl bg-gray-700 px-4 py-2 text-gray-400 shadow-sm shadow-gray-400 transition duration-100 hover:scale-110"
          >
            Find a random opponent
          </button>
          <button
            onClick={(e) => handleChoice(e, "bot")}
            className="mt-5 transform rounded-xl bg-gray-700 px-4 py-2 text-gray-400  shadow-sm shadow-gray-400 transition duration-100 hover:scale-110"
          >
            Play against a bot
          </button>
        </div>
      </div>
    </>
  );
}
