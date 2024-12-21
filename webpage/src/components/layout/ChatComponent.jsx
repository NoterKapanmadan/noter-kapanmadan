
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChatComponent()  {
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to the chat!", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { id: messages.length + 1, text: input, sender: "user" };
      const botReply = {
        id: messages.length + 2,
        text: "Thanks for your message! 😊",
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, userMessage, botReply]);
      setInput(""); // Clear input after sending
    }
  };

  return (
    <Card className="max-w-lg mx-auto border rounded-lg shadow-md">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent className="h-64 overflow-y-auto bg-gray-100 p-4 rounded-md">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 p-2 rounded-lg ${
              message.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 text-black self-start"
            }`}
          >
            {message.text}
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex gap-2 items-center p-4">
        <Input
          className="flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <Button onClick={handleSend}>Send</Button>
      </CardFooter>
    </Card>
  );
};
