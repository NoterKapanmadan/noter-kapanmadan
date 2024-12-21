import ChatComponent from "@/components/layout/ChatComponent";
import { getChatRoom } from "@/app/actions";

export default async function Chat({ params }) {

  const data = await getChatRoom(params.receiver);

  const chatRoom = data.messages;
  const userDetails = data.userDetails;


  return (
    <ChatComponent receiver={params.receiver} chatRoom={chatRoom}  userDetails={userDetails}/>
  );

  
}
