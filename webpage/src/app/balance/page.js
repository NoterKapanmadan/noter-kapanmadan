import BalanceForm from "@/components/layout/BalanceForm";
import { getBalance } from "@/app/actions";

export default async function BalancePage() {
  const balance = await getBalance();
  return <BalanceForm user_balance={balance.balance} />;
}
