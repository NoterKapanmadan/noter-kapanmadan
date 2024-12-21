import ChatComponent from "@/components/layout/ChatComponent";
import { getChatRoom } from "@/app/actions";

export default async function Chat({ params }) {

  const chatRoom = await getChatRoom(params.receiver);


  return (
    <ChatComponent receiver={params.receiver} />
  );

  
}
