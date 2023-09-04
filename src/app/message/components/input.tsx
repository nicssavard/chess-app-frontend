"use client";
import { useRef } from "react";
import axios from "axios";

interface Props {
  chat: Chat;
  userID: number;
  sendMessage: (message: string) => void;
}

export default function Input({ chat, userID, sendMessage }: Props) {
  const messageRef = useRef<HTMLTextAreaElement>(null);
  console.log(chat);

  const handleNewMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!messageRef.current?.value) return;
    sendMessage(messageRef.current?.value);
    messageRef.current!.value = "";
  };

  // const sendMessage = (e: { preventDefault: () => void }) => {
  //   e.preventDefault();
  //   const data = {
  //     chat: chat.id, // Replace with the actual Chat ID
  //     sender: userID, // Replace with the actual User ID (sender)
  //     content: messageRef.current?.value,
  //   };
  //   axios
  //     .post("http://127.0.0.1:8000/api/messages/", data)
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  //   messageRef.current!.value = "";
  // };

  const autoResize = (e: any) => {
    /* eslint-disable-next-line */
    e.target.style.height = "inherit"; /* eslint-disable-next-line */
    e.target.style.height = `${e.target.scrollHeight}px`; /*Error: Unsafe member access .target on an `any` value.*/
  };
  return (
    <div className=" mx-auto w-2/3 my-5 ">
      <form
        className="flex flex-row rounded-lg bg-gray-600"
        onSubmit={(e) => handleNewMessage(e)}
      >
        <textarea
          ref={messageRef}
          id="prompt-textarea"
          data-id="root"
          rows={1}
          placeholder="Aa"
          className="text-2xl my-auto mx-2 w-full resize-none border-0 bg-transparent p-0  outline-none focus:ring-0 focus-visible:ring-0  md:pl-0  hide-scrollbar"
          style={{
            maxHeight: "100px",
            height: "24px",
          }}
          onInput={autoResize}
        ></textarea>
        <button type="submit" className="px-4 py-2">
          <svg
            width="20"
            height="20"
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
      </form>
    </div>
  );
}
