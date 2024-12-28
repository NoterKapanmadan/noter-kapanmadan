"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import io from "socket.io-client";
import { getImageSrc } from "@/utils/file"; 
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizonal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LocalTime from "@/components/layout/LocalTime";

export default function ChatComponent({ receiver, chatRoom, userDetails }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([
    ...chatRoom
      .map(({ message_id, text, sender_id, date }) => ({
        id: message_id,
        text,
        sender: sender_id === receiver ? "receiver" : "user",
        date,
      }))
      .reverse(),
  ]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: input,
        sender: "user",
        date: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      socket.emit("send-message", { message: input, receiver: receiver });
    }
  };

  useEffect(() => {
    const socketDef = io(process.env.NEXT_PUBLIC_MESSAGE_SERVER, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });
    socketInitializer(socketDef);

    return () => {
      socketDef.close();
    };
  }, []);

  const socketInitializer = (socketDef) => {
    socketDef.on("connect", () => {
      console.log("Connected");
    });

    socketDef.on("receive-message", (data) => {
      const { message, sender, date, messageId } = data;
      const newMessage = {
        id: messageId,
        text: message,
        sender: sender === receiver ? "receiver" : "user",
        date,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    setSocket(socketDef);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const otherUser = userDetails.find((user) => user.account_id === receiver);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Link href={`/profile/${otherUser.account_id}`}>
        <div className="flex items-center bg-gray-200 p-4 shadow-sm">
          <Image
            src={getImageSrc(otherUser?.profile_image, "low")}
            alt={`${otherUser.fullname} avatar`}
            width={40}
            height={40}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <h1 className="text-lg font-semibold">{`${otherUser?.forename} ${otherUser?.surname}`}</h1>
        </div>
      </Link>

      {/* Chat Content */}
      <ScrollArea className="bg-white max-h-full flex-grow">
        <div className="px-4 pt-4 pb-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 p-3 rounded-lg max-w-lg flex flex-row whitespace-normal break-all justify-between shadow-l ${
                message.sender === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-100 text-black mr-auto"
              }`}
            >
              <p className="text-base">{message.text}</p>
              <div className="flex flex-row pr-1 pl-1 items-end min-w-8">
                <p
                  className={`text-xs mt-1 text-right ${
                    message.sender === "user" ? "text-white" : "text-gray-600"
                  }`}
                >
                  <LocalTime time={message.date} />
                </p>
              </div>
            </div>
          ))}
          {/* "anchor" div to scroll into view */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="flex items-center bg-gray-100 p-4 rounded-lg">
        <form onSubmit={handleSend} className="flex gap-4 w-full">
          <Input
            className="flex-1 text-sm p-3 border rounded-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <Button
            type="submit"
            className="bg-blue-500 text-white text-sm px-6 py-3 rounded-sm"
          >
            Send
            <SendHorizonal size={16} className="ml-1" />
          </Button>
        </form>
      </div>
    </div>
  );
}
