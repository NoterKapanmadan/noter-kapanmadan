"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { SERVER_URL } from "@/utils/constants"
import { useToast } from "@/hooks/use-toast"
import { useTransition } from "react"

export default function RegisterPage() {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()

  const handleSubmit = async (formData) => {
    startTransition(async () => {
      const response = await fetch(`${SERVER_URL}/register`, {
        method: 'POST',
        cache: 'no-store',
        body: formData,
      });
  
      const { msg, error } = await response.json();
  
      if (error) {
        return toast({
          title: 'Something went wrong!',
          description: error,
        });
      }
  
      if (msg) {
        return toast({
          title: 'Success!',
          description: msg,
        });
      }
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register for NoterKapanmadan.com</CardTitle>
          <CardDescription>Create your account to start buying and selling vehicles</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="forename">Forename</Label>
                  <Input
                    name="forename"
                    id="forename"
                    type="text"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Surname</Label>
                  <Input
                    name="surname"
                    id="surname"
                    type="text"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  name="phone_number"
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  name="confirm_password"
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-6" disabled={pending}>
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}