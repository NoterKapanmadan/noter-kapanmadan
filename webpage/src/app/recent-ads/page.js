import RecentVisitedAds from "@/components/layout/RecentVisitedAds";
import { getHistory } from "@/app/actions";

export default async function RecentVisitedAdsPage() {
    const vehicleAds = await getHistory();
    return (
        <RecentVisitedAds vehicleAds={vehicleAds} />
    );
}