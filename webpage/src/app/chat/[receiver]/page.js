import ChatComponent from "@/components/layout/ChatComponent";

export default async function Chat({ params }) {

  return (
    <ChatComponent receiver={params.receiver} />
  );

  
}
