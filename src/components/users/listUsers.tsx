"use client";
import { useState, useEffect, use } from "react";
import axios from "axios";

interface Props {
  selectChat: (user: User) => void;
}
export default function ListUsers({ selectChat }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/users")
      .then((response) => {
        // Process the response data
        setUsers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        // Handle errors
        console.log("Error:", error);
      });
  }, []);

  const userList = users.map((user) => {
    return (
      <div
        key={user.id}
        onClick={() => selectChat(user)}
        className="text-xl mb-1 hover:bg-slate-700 cursor-pointer"
      >
        {user.username}
      </div>
    );
  });
  return (
    <div className="flex flex-col mr-10">
      <div className="text-2xl mb-4 border-b-2">Chats</div>
      {users && userList}
    </div>
  );
}
