import { notFound } from "next/navigation";
import { SERVER_URL } from "@/utils/constants";
import ProfileForm from "@/components/layout/ProfileForm";
import { getAccountID } from "@/app/actions";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/utils/date";

async function fetchUser(account_id) {
  const res = await fetch(`${SERVER_URL}/profile/${account_id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const user = await res.json();
  return user;
}

export default async function ProfilePage({ params }) {
  const { account_id } = params;
  const user = await fetchUser(account_id);

  const authorizationID = await getAccountID();

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        {account_id === authorizationID ? (
          <ProfileForm user={user} accountId={account_id} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border">
                  <Image
                    src={user.profilePicture || "/avatar.png"}
                    alt="Profile picture"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="forename">Forename</Label>
                  <p className="text-sm">{user.forename}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Surname</Label>
                  <p className="text-sm">{user.surname}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <p className="text-sm">{user.email}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <p className="text-sm">{user.phone_number}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <p className="text-sm">{user.description}</p>
                </div>

                <div className="space-y-2">
                  <Label>Registration Date</Label>
                  <p className="text-sm">
                    {formatDate(user.registration_date)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
