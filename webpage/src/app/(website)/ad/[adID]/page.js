import { SERVER_URL } from "@/utils/constants";
import { sendHistory, isAuthenticated, getAccountID, getBrands, getModels } from "@/app/actions";
import { getAuthToken } from "@/lib/auth";
import { notFound } from "next/navigation";
import AdView from "@/components/layout/AdView"

export default async function AdPage({ params }) {
  const isAuth = await isAuthenticated();
  sendHistory(params.adID);

  const resView = await fetch(`${SERVER_URL}/ad/increment-views`, {
    method: "POST",
    headers: {
      "Cookie": "Authorization=" + getAuthToken(),
    },
    body: JSON.stringify({ adID: params.adID }),
  });

  const metrics = await fetch(`${SERVER_URL}/ad/get-metrics/${params.adID}`,
    {
      method: "GET",
      headers: {
        "Cookie": "Authorization=" + getAuthToken(),
      },
    }
  );

  const {views, favorites} = await metrics.json();
  const metricsData = [views, favorites]; 

  console.log(favorites)

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
    return notFound();
  }
  const ad = await res.json();

  if(!ad || ad.status === "inactive") {
    return notFound();
  }

  const brands = await getBrands();
  const models = await getModels(ad.brand);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <AdView ad={ad} isAuth={isAuth} currentUserID={account_id} brands={brands} defaultBrandModels={models} metricsData={metricsData}/>
      </main>
    </div>
  );
}