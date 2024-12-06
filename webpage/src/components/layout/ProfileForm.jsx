"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/date";
import { useTransition } from "react";
import { SERVER_URL } from "@/utils/constants";

export default function ProfileForm({ user, accountId }) {
  const { toast } = useToast();

  const [pending, startTransition] = useTransition();

  const handleSubmit = async (formData) => {
    startTransition(async () => {
      const res = await fetch(`${SERVER_URL}/profile/${accountId}`, {
        method: "POST",
        body: formData,
      });

      const { msg, error } = await res.json();

      console.log(msg, error);

      if (error) {
        toast({
          title: "Something went wrong!",
          description: error,
        });
      } else if (msg) {
        toast({
          title: "Success!",
          description: msg,
        });
      }
    });
  };

  return (
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
        <form action={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="forename">Forename</Label>
              <Input
                name="forename"
                id="forename"
                type="text"
                defaultValue={user.forename}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surname">Surname</Label>
              <Input
                name="surname"
                id="surname"
                type="text"
                defaultValue={user.surname}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user.email} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              name="phone_number"
              id="phone"
              type="tel"
              defaultValue={user.phone_number}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              id="description"
              type="text"
              defaultValue={user.description}
            />
          </div>

          <div className="space-y-2">
            <Label>Registration Date</Label>
            <p className="text-sm">{formatDate(user.registration_date)}</p>
          </div>

          <Button type="submit" disabled={pending} className="w-full">
            Edit Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
