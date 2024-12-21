import AllChats from "@/components/layout/AllChats";
import { getAccountID, getChatRooms } from "@/app/actions";

export default async function Chat({children}) {


  const accountId = await getAccountID();
  const chatRooms = await getChatRooms();
  console.log("chatRooms: ", chatRooms);


  return (
        <div className="flex md:flex-row flex-col max-h-[calc(100%-4.5rem)]">
          {/* Sidebar */}
          <aside className="w-80 bg-white rounder-lg border-r px-2 py-4">
            <AllChats chatRooms={chatRooms} accountId={accountId} />
          </aside>

          {/* Main Content */}
          <main className="w-full px-4 py-4">
            <div className="border rounded-lg h-full bg-white shadow-sm overflow-hidden">
              {children}
            </div>
          </main>
        </div>

  )
}
