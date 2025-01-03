"use client"

import Image from "next/image"
import React, {useState, useEffect} from "react"
import { ScrollArea } from "@/components/ui/scroll-area" // Optional if you have many users
import { getImageSrc } from "@/utils/file";
import Link from "next/link";
import { io } from "socket.io-client";
import { useParams } from "next/navigation";
import { SERVER_URL } from "@/utils/constants";


export default function AllChats({chatRooms, accountId}) {

  const params = useParams();
  const selectedReceiver = params?.receiver;
  
  const [latestChatRooms, setLatestChatRooms] = useState(chatRooms);
  const [socket, setSocket] = useState(null);
  console.log("chatRooms: ", chatRooms);  
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

  const fetchProfile = async (selectedReceiver) => {

    const response = await fetch(`${SERVER_URL}/profile/${selectedReceiver}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const user = await response.json();
    
    setLatestChatRooms((latestChatRooms) => {

      const chatRoomIndex = latestChatRooms.findIndex((chatRoom) => (selectedReceiver === chatRoom.account1_id && accountId === chatRoom.account2_id) 
      || (accountId === chatRoom.account1_id && selectedReceiver === chatRoom.account2_id) && selectedReceiver !== accountId );
      if(chatRoomIndex === -1) {
        return ([{
          chatroom_id: 0,
          account1_id: selectedReceiver,
          account1_forename: user.forename,
          account1_surname: user.surname,
          account1_profile_image: user.profile_image,
          account2_id: accountId,
          account2_forename: "",
          account2_surname: "",
          account2_profile_image: "",
          newest_message: "",
        }, ...latestChatRooms])
      } else {
        return latestChatRooms;
      }
    })
  };

  useEffect(() => {
    fetchProfile(selectedReceiver);

  }, [selectedReceiver]);

  const socketInitializer = (socketDef) => {
    socketDef.on('connect', () => {
      console.log('Connected');
    });

    socketDef.on('receive-message', (data) => {
      const { message, sender, receiver, date, messageId } = data;
      
      setLatestChatRooms((latestChatRooms) => {
        console.log("latest:", latestChatRooms);
        console.log("sender:", sender);
        console.log("receiver:", receiver);

        const chatRoomIndex = latestChatRooms.findIndex((chatRoom) => (receiver === chatRoom.account1_id && sender === chatRoom.account2_id) 
        || (sender === chatRoom.account1_id && receiver === chatRoom.account2_id) && receiver !== sender );
        if(chatRoomIndex === -1) {
          return latestChatRooms;
        }
        const updatedChatRooms = [...latestChatRooms];
        updatedChatRooms[chatRoomIndex].newest_message = message;
        updatedChatRooms[chatRoomIndex].newest_message_date = date;

        updatedChatRooms.sort((a, b) => {
          return new Date(b.newest_message_date) - new Date(a.newest_message_date);
        });
        return updatedChatRooms;
      })
    });

    setSocket(socketDef);
  };

  console.log("selectedChatRoom: ",  selectedReceiver);
  return (
    <ScrollArea className="h-full">
      <div>
        <h2 className="mb-4 text-lg text-center font-semibold">Chats</h2>
        {latestChatRooms.map((chatRoom) => {
          
          const user = accountId !== chatRoom.account1_id ? {
            accountId: chatRoom.account1_id,
            forename: chatRoom.account1_forename,
            surname: chatRoom.account1_surname,
            profile_image: chatRoom.account1_profile_image,
            fullname: chatRoom.account1_forename + " " + chatRoom.account1_surname,
          } : {
            accountId: chatRoom.account2_id,
            forename: chatRoom.account2_forename,
            surname: chatRoom.account2_surname,
            profile_image: chatRoom.account2_profile_image,
            fullname: chatRoom.account2_forename + " " + chatRoom.account2_surname,
          };


          return(
            <Link href={`/chat/${user.accountId}`} key={user.accountId} replace prefetch={false}>
              <div
                key={chatRoom.chatroom_id}
                className={`flex items-center justify-between h-16 w-72 mb-4 cursor-pointer p-4 border rounded-md shadow-sm transition hover:bg-gray-100 ${
                  selectedReceiver === user.accountId
                    ? "bg-gray-100 hover:bg-gray-200 border-gray-300"
                    : "border-gray-200"
                }`}
              >
                <Image
                  src={getImageSrc(user.profile_image, "low")}
                  alt={`${user.fullname} avatar`}
                  width={40}
                  height={40}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 ml-4">
                  <p className="font-medium text-gray-900">{user.fullname}</p>
                  <p className="text-sm text-gray-500 truncate max-w-[140px]">
                    {chatRoom.newest_message}
                  </p>
                </div>
              </div>
            </Link>
        )})}
      </div>
    </ScrollArea>
  )
}