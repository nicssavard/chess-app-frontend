"use client";
import useStore from "@/store/userStore";
import { useEffect, useState } from "react";
import axios from "axios";
import Input from "./input";

interface Props {
  receiverID: number;
}
export default function Chat({ receiverID }: Props) {
  const [chat, setChat] = useState<Chat | null>(null);
  const userID = useStore((state) => state.user?.id);
  useEffect(() => {
    const fetchChat = async () => {
      axios
        .get("http://127.0.0.1:8000/api/find_chat_by_participants/", {
          params: { participant1_id: receiverID, participant2_id: userID },
        })
        .then((response) => {
          setChat(response.data.chat);
        })
        .catch((error) => {
          // Handle errors
          if (error.response) {
          }

          if (
            error.response.data.error === "Chat not found" ||
            error.response.data.detail === "Not found."
          ) {
            const data = {
              participants: [userID, receiverID], // Replace with actual user IDs
            };
            axios
              .post("http://127.0.0.1:8000/api/chats/", data)
              .then((response) => {
                setChat(response.data);
              });
          }
        });
    };
    fetchChat();
  }, [receiverID]);
  return (
    <div className="bg-gray-700 min-h-full rounded-xl mx-10 flex flex-col">
      <div className=" flex-grow">
        <div className="flex flex-col ">
          {chat && userID && <ChatList chat={chat} userID={userID} />}
        </div>
      </div>
      {chat && userID && <Input chat={chat} userID={userID} />}
    </div>
  );
}

interface ChatListProps {
  chat: Chat;
  userID: number;
}
const ChatList = ({ chat, userID }: ChatListProps) => {
  return (
    <>
      {chat.messages.map((message) => {
        return <Message message={message} userId={userID} />;
      })}
    </>
  );
};

interface MessageProps {
  message: Message;
  userId: number;
}
const Message = ({ message, userId }: MessageProps) => {
  console.log(message.id, userId);
  return (
    <div
      className={`flex flex-row  ${
        userId === message.sender ? "justify-start" : "justify-end"
      }`}
    >
      {message.content}
    </div>
  );
};
