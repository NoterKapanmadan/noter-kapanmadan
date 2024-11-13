"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ProfilePage() {
  const [user, setUser] = useState({
    forename: "John",
    surname: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    registrationDate: "08-11-2024",
    description: "Car enthusiast and frequent AutoMarket user. Always looking for great deals on classic cars.",
    balance: 1000,
    profilePicture: "/placeholder.svg?height=200&width=200"
  })

  const [addBalanceAmount, setAddBalanceAmount] = useState('')

  const handleAddBalance = () => {
    const amount = parseFloat(addBalanceAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number.",
        variant: "destructive"
      })
      return
    }
    setUser(prevUser => ({
      ...prevUser,
      balance: prevUser.balance + amount
    }))
    setAddBalanceAmount('')
    toast({
      title: "Balance added",
      description: `$${amount} has been added to your account.`
    })
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
                  src="/avatar.avif"
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
              <Input id="phone" type="tel" value={user.phone} readOnly />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={user.description} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationDate">Registration Date</Label>
              <p className="text-sm">{user.registrationDate}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Edit Profile</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}