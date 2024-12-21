import AllChats from "@/components/layout/AllChats";
import { getAccountID, getChatRooms } from "@/app/actions";

export default async function Chat({children}) {


  const accountId = await getAccountID();
  const chatRooms = await getChatRooms();
  console.log("chatRooms: ", chatRooms);


  return (
        <div className="flex  max-h-[calc(100vh-8rem)] py-4 px-4">
          {/* Sidebar */}
          <aside className="w-80 bg-white rounder-lg border-r px-2">
            <AllChats chatRooms={chatRooms} accountId={accountId} />
          </aside>

          {/* Main Content */}
          <main className="flex-1 px-4">
            <div className="border rounded-lg px-4 py-4 h-full bg-white shadow-sm">
              {children}
            </div>
          </main>
        </div>

  )
}
