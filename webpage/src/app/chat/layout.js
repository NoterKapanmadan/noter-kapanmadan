import AllChats from "@/components/layout/AllChats";
import { getAccountID, getChatRooms } from "@/app/actions";

export default async function Chat({children}) {


  const accountId = await getAccountID();
  const chatRooms = await getChatRooms();
  console.log("chatRooms: ", chatRooms);


  return (
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r px-4 py-6">
            <AllChats chatRooms={chatRooms} accountId={accountId}/>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4">
            <div className="border rounded-lg p-4 h-full bg-white shadow-sm">
              {children}
            </div>
          </main>
        </div>

  )
}
