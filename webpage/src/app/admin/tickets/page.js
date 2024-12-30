import { ChevronDown, MoreHorizontal, Lock, Mail, CircleDot } from "lucide-react";
import { SERVER_URL } from "@/utils/constants";
import { getAuthToken } from "@/lib/auth";
import TicketsPageClient from "@/components/layout/TicketsComponent";

export default async function TicketsPage() {
  const res = await fetch(`${SERVER_URL}/admin/get-all-tickets`, {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Cookie: "Authorization=" + getAuthToken(),
    },
  });

  const { stats, tickets } = await res.json();

  const statsArray = [
    {
      id: 1,
      name: "Total Tickets",
      value: stats.totalTickets?.toString() ?? "0",
      icon: "CircleDot", // Use string instead of component function
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 2,
      name: "Pending Tickets",
      value: stats.pendingTickets?.toString() ?? "0",
      icon: "Mail",
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: 3,
      name: "Closed Tickets",
      value: stats.closedTickets?.toString() ?? "0",
      icon: "Lock",
      color: "bg-green-100 text-green-600",
    },
  ];

  const ICON_MAP = {
    CircleDot,
    Mail,
    Lock,
  };

  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Tickets</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statsArray.map((stat) => {
          const Icon = ICON_MAP[stat.icon]; // Resolve the icon dynamically
          return (
            <div
              key={stat.id}
              className="rounded-lg border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <div className={`rounded-full p-2 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.name}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <TicketsPageClient tickets={tickets} />
    </div>
  );
}