"use client";
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;

const Home = () => {
  const [input, setInput] = useState('');

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    socket = io(process.env.NEXT_PUBLIC_MESSAGE_SERVER, {
      path: '/socket.io',
      transports: ['websocket', 'polling'], // Ensure both transports are available
      //secure: true, // Use secure connection if your server uses HTTPS
    });
    socket.on('connect', () => {
      console.log('Connected');
    });

    socket.on('update-input', (msg) => {
      setInput(msg); // Update state when message is received
    });
  };

  const onChangeHandler = (e) => {
    setInput(e.target.value);
    socket.emit('input-change', e.target.value); // Send input to server
  };

  return (
    <input
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
    />
  );
};

export default Home;
