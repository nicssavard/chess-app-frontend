"use client";
import { useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

interface MenuProps {
  setGameType: (gameType: "random" | "bot" | "friend", gameId?: number) => void;
}

export default function Menu({ setGameType }: MenuProps) {
  const gameId = useRef<HTMLInputElement | null>(null);
  const handleChoice = (
    e: { preventDefault: () => void },
    choice: "random" | "bot" | "friend"
  ) => {
    e.preventDefault();
    if (choice === "friend") {
      if (!gameId.current?.value) return;
      let id = parseInt(gameId.current?.value);
      console.log(id);
      if (isNaN(id) || id <= 0) {
        toast.error("Invalid game id");
        gameId.current!.value = "";
        return;
      }
      setGameType(choice, parseInt(gameId.current?.value));

    } else {
      setGameType(choice);
    }
  };
  return (
    <>
      <div className="m-5 rounded-xl bg-gray-900 p-10 mt-20" >
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
          <form
            onSubmit={(e) => handleChoice(e, "friend")}
            className="mt-5 transform rounded-xl bg-gray-700 px-4 py-2 text-gray-400 shadow-sm shadow-gray-400 transition duration-100 hover:scale-110"
          >
            <div className="flex flex-row">
              <label htmlFor='game-id'>Enter game Id</label>
              <input
                ref={gameId}
                className="ml-2 w-20 rounded-xl bg-gray-200 pl-2"
                type="text"
                id='game-id'
              ></input>
              <button className="ml-4 flex-grow">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster position="top-center" />
    </>
  );
}
