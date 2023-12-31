"use client";
import useStore from "@/store/userStore";
import { useEffect, useState } from "react";
import axios from "axios";
import Input from "./input";
import { Chat, Message } from "../../../../typings";

interface Props {
  receiverID: number;
}
export default function Chat({ receiverID }: Props) {
  const [chat, setChat] = useState<Chat | null>(null);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const userID = useStore((state) => state.user?.id);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_SERVER_WS}/chat/?chatId=${chat?.id}`,
    );
    setWebSocket(ws);

    return () => {
      ws.close();
    };
  }, [chat]);

  useEffect(() => {
    if (webSocket) {
      webSocket.onopen = (e) => {
        console.log("WebSocket connection opened", e);
      };

      webSocket.onmessage = (e) => {
        console.log(`Message received: ${e.data}`);
        const newMessage = JSON.parse(e.data);
        setChat((chat) => {
          if (!chat) return null;
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
          };
        });
      };

      webSocket.onclose = (e) => {
        console.log("WebSocket connection closed", e);
      };

      webSocket.onerror = (e) => {
        console.error("WebSocket error", e);
      };
    }
  }, [webSocket]);

  useEffect(() => {
    const fetchChat = async () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/find_chat_by_participants/`,
          {
            params: { participant1_id: receiverID, participant2_id: userID },
          },
        )
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
              .post(`${process.env.NEXT_PUBLIC_SERVER}/api/chats/`, data)
              .then((response) => {
                setChat(response.data);
              });
          }
        });
    };
    fetchChat();
  }, [receiverID]);

  const sendMessage = (message: string) => {
    const object = {
      message: message,
      chatId: chat?.id,
      senderId: userID,
    };
    if (!webSocket) return;
    webSocket.send(JSON.stringify(object));
  };

  return (
    <div className="mx-10 flex min-h-full flex-col rounded-xl bg-gray-700">
      <div className=" flex-grow">
        <div className="flex flex-col ">
          {chat && userID && <ChatList chat={chat} userID={userID} />}
        </div>
      </div>
      {chat && userID && (
        <Input chat={chat} userID={userID} sendMessage={sendMessage} />
      )}
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
        return <Message message={message} userId={userID} key={message.id} />;
      })}
    </>
  );
};

interface MessageProps {
  message: Message;
  userId: number;
}
const Message = ({ message, userId }: MessageProps) => {
  return (
    <div
      className={`flex flex-row ${userId === message.sender ? "justify-start" : "justify-end"
        }`}
    >
      <div
        className={`rounded-lg p-2 my-1 mx-2 ${userId === message.sender
            ? "mr-15 bg-blue-400 text-white"
            : "ml-15 bg-slate-200 text-slate-900"
          }`}
      >
        {message.content}
      </div>
    </div>
  );
};
