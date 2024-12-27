import { SERVER_URL } from "@/utils/constants";
import { sendHistory, isAuthenticated, getAccountID } from "@/app/actions";
import { getAuthToken } from "@/lib/auth";
import AdView from "@/components/layout/AdView"
import { redirect } from 'next/navigation';

export default async function AdPage({ params }) {
  const isAuth = await isAuthenticated();
  sendHistory(params.adID);

  const account_id = await getAccountID();

  const ad_ID = params.adID;
  const res = await fetch(`${SERVER_URL}/ad/get-ad/${ad_ID}`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Cookie": "Authorization=" + getAuthToken(),
    }
  });
  
  if (!res.ok) {
    redirect("/not-found");
  }
  
  const ad = await res.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <AdView ad={ad} isAuth={isAuth} currentUserID={account_id}/>
      </main>
    </div>
  );
}