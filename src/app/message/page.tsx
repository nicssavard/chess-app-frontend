"use client";
import { Container } from "@/components/ui/Container";
import Chat from "./components/Chat";
import ListUsers from "@/components/users/listUsers";

import { useState } from "react";
export default function ChatPage() {
  const [receiverID, setreceiverID] = useState<number | null>(null);
  const selectChat = (user: User) => {
    setreceiverID(user.id);
  };
  return (
    <div className="lg:w-4/5 mx-auto flex-grow">
      <div className="flex flex-row pt-6 min-h-full">
        <h1 className="">
          <ListUsers selectChat={selectChat} />
        </h1>
        <div className="flex-grow ">
          {receiverID && <Chat receiverID={receiverID} />}
        </div>
      </div>
    </div>
  );
}
