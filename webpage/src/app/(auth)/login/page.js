"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { SERVER_URL } from "@/utils/constants"
import { useToast } from "@/hooks/use-toast"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = (formData) => {
    startTransition(async () => {
      const response = await fetch(`${SERVER_URL}/auth/login`, {
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
        toast({
          title: 'Success!',
          description: msg,
        });

        router.replace('/')
      }
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to NoterKapanmadan.com</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="space-y-2">
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
                <Label htmlFor="password">Password</Label>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-6" disabled={pending}>
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}