"use client";
import { useState, useEffect, use } from "react";
import axios from "axios";
import { User } from "../../../typings";

interface Props {
  selectChat: (user: User) => void;
}
export default function ListUsers({ selectChat }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER}/api/users`)
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
        className="mb-1 cursor-pointer text-xl hover:bg-slate-700"
      >
        {user.username}
      </div>
    );
  });
  return (
    <div className="mr-10 flex flex-col">
      <div className="mb-4 border-b-2 text-2xl">Chats</div>
      {users && userList}
    </div>
  );
}
