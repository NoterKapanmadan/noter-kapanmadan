import ChatComponent from "@/components/layout/ChatComponent";
import { getAccountID, getChatRoom } from "@/app/actions";

export default async function Chat({ params }) {

  const account_ID = await getAccountID();


  const data = await getChatRoom(params.receiver);

  if(data.userDetails.length === 1) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl text-gray-500">No messages found</h1>
      </div>
    );
  }

  const chatRoom = data.messages;
  const userDetails = data.userDetails;


  return (
    <ChatComponent receiver={params.receiver} chatRoom={chatRoom}  userDetails={userDetails}/>
  );

  
}
