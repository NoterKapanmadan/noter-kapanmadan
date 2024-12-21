"use client"

// components/UserList.jsx
import Image from "next/image"
import React, {useState} from "react"
import { ScrollArea } from "@/components/ui/scroll-area" // Optional if you have many users
import { getImageSrc } from "@/utils/file";
import Link from "next/link";


export default function AllChats({chatRooms, accountId}) {


  
  const [latestChatRooms, setLatestChatRooms] = useState(chatRooms);

  return (
    <ScrollArea className="h-full">
      <div>
        <h2 className="mb-4 text-lg font-semibold">Chats</h2>
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
            <Link href={`/chat/${user.accountId}`} key={user.accountId}>
          <div
            key={chatRoom.chatroom_id}
            className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
          >
            
            <Image
              src={getImageSrc(user.profile_image, "low")}
              alt={`${user.fullname} avatar`}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <p className="font-medium">{user.fullname}</p>
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