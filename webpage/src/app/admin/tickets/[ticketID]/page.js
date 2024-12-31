import TicketDetailsClient from "@/components/layout/TicketDetailsClient";
import { SERVER_URL } from "@/utils/constants";
import { getAuthToken } from "@/lib/auth";

/**
 * Server Component to fetch ticket details and render the Client Component.
 *
 * @param {Object} props
 * @param {Object} props.params
 * @param {string} props.params.ticketID
 */
export default async function TicketDetails({ params }) {
  const { ticketID } = params;

  const res = await fetch(`${SERVER_URL}/admin/get-ticket/${ticketID}`, {
    method: "GET",
    cache: 'no-cache',
    headers: {
      "Content-Type": "application/json",
      "Cookie": "Authorization=" + getAuthToken(),
    },
  });

  console.log(res)

  if (!res.ok) {
    throw new Error("Failed to fetch ticket data");
  }

  const { ticket } = await res.json();

  const ticketData = ticket.rows[0]

  return <TicketDetailsClient ticket={ticketData} />;
}