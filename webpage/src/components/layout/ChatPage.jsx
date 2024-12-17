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
    socket = io(); // Connect to Socket.IO server

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
