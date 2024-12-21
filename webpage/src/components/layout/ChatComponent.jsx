"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import io from 'socket.io-client';

export default function ChatComponent({ receiver, chatRoom }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([
    // Prepopulate messages, but reverse the order
    ...chatRoom
      .map(({ message_id, text, sender_id, date }) => ({
        id: message_id,
        text,
        sender: sender_id === receiver ? "receiver" : "user",
        date,
      }))
      .reverse(), // Reverse the order to show oldest messages first
  ]);
  const [input, setInput] = useState("");

  console.log('ChatComponent', receiver, chatRoom);

  const handleSend = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    if (input.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: input,
        sender: "user",
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput(""); // Clear input after sending

      socket.emit('send-message', { message: input, receiver: receiver });
    }
  };

  useEffect(() => {
    const socketDef = io(process.env.NEXT_PUBLIC_MESSAGE_SERVER, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });
    socketInitializer(socketDef);

    return () => {
      socketDef.close(); // Clean up the connection when the component unmounts
    };
  }, []);

  const socketInitializer = (socketDef) => {
    socketDef.on('connect', () => {
      console.log('Connected');
    });

    socketDef.on('receive-message', (data) => {
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
        <form onSubmit={handleSend} className="flex gap-2 w-full items-center">
          <Input
            className="flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
