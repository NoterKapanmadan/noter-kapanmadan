"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function TabsArea({ parallel }) {
  const pathname = usePathname()

  let defaultValue = 'allAds'
  if (pathname === "/") {
    defaultValue = "allAds"
  } else if (pathname === "/my-ads") {
    defaultValue = "myAds"
  } else if (pathname === "/favorites") {
    defaultValue = "favorites"
  } else if (pathname === "/history") {
    defaultValue = "history"
  }

  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    if (pathname === "/") {
      setValue("allAds")
    } else if (pathname === "/my-ads") {
      setValue("myAds")
    } else if (pathname === "/favorites") {
      setValue("favorites")
    } else if (pathname === "/history") {
      setValue("history")
    }
  }, [pathname])  

  return (
    <Tabs value={value}>
      <TabsList className="bg-gray-200 w-full flex *:w-full">
        <TabsTrigger value="allAds" asChild>
          <Link href="/">All Ads</Link>
        </TabsTrigger>
        <TabsTrigger value="myAds" asChild>
          <Link href="/my-ads">My Ads</Link>
        </TabsTrigger>
        <TabsTrigger value="history" asChild>
          <Link href="/history">History</Link>
        </TabsTrigger>
        <TabsTrigger value="favorites" asChild>
          <Link href="/favorites">Favorites</Link>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="allAds">
        {parallel}
      </TabsContent>
      <TabsContent value="myAds">
        {parallel}
      </TabsContent>
      <TabsContent value="history">
        {parallel}
      </TabsContent>
      <TabsContent value="favorites">
        {parallel}
      </TabsContent>
    </Tabs>
  )
}
