import AllChats from "@/components/layout/AllChats";
import { getAccountID, getChatRooms } from "@/app/actions";

export default async function Chat({children}) {


  const accountId = await getAccountID();
  const chatRooms = await getChatRooms();
  console.log("chatRooms: ", chatRooms);


  return (
        <div className="flex md:flex-row flex-col max-h-[calc(100%-4.5rem)] py-4 px-4">
          {/* Sidebar */}
          <aside className="w-80 bg-white rounder-lg border-r px-2">
            <AllChats chatRooms={chatRooms} accountId={accountId} />
          </aside>

          {/* Main Content */}
          <main className="w-full px-4">
            <div className="border rounded-lg px-4 py-4 h-full bg-white shadow-sm">
              {children}
            </div>
          </main>
        </div>

  )
}
