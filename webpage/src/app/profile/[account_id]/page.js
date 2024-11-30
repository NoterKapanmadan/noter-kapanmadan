import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { notFound } from "next/navigation";
import { SERVER_URL } from "@/utils/constants";
import { formatDate } from "@/utils/date";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-primary-foreground shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold">NoterKapanmadan</h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border">
                <Image
                  src={user.profilePicture || "/placeholder.svg"}
                  alt="Profile picture"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <Button variant="outline">Change Picture</Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="forename">Forename</Label>
                <Input id="forename" value={user.forename} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Surname</Label>
                <Input id="surname" value={user.surname} readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={user.phone_number} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={user.description} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationDate">Registration Date</Label>
              <p className="text-sm">{formatDate(user.registration_date)}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Edit Profile</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
