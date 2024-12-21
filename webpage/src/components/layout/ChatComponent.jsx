
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import io from 'socket.io-client';

export default function ChatComponent( {receiver} )  {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to the chat!", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [input2, setInput2] = useState("");


  
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

      socket.emit('send-message', { message: input, receiver: receiver });
    }
  };

  
  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    const socketDef = io(process.env.NEXT_PUBLIC_MESSAGE_SERVER, {
      path: '/socket.io',
      transports: ['websocket', 'polling'], // Ensure both transports are available
      //secure: true, // Use secure connection if your server uses HTTPS
    });
    socketDef.on('connect', () => {
      console.log('Connected');
    });

    socketDef.on('receive-message', (data) => {
      const { message, sender, date } = data;
      setInput(message); // Update state when message is received
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
        <Input
          className="flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <Button onClick={handleSend}>Send</Button>
        <Input
          className="flex-1"
          value={input2}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
      </CardFooter>
    </Card>
  );
};
