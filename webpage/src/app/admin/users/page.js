'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, UserX, UserCheck } from 'lucide-react'
import { SERVER_URL } from '@/utils/constants'
import Link from 'next/link'

export default function Users() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    const response = await fetch(`${SERVER_URL}/admin/get-users?searchKey=${search}`)

    if (response.ok) {
      const data =  await response.json()
      setUsers(data)
      setLoading(false)
      console.log(data)
    }
  }

  useEffect(() => { 
    fetchUsers()
  } , [])

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers()
    }, 120);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          type="text"
          placeholder="Search by ID or name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      {loading ? (
        <div className="font-medium text-center">Loading...</div>
      ) : (
        <div className="flex flex-col gap-2 overflow-scroll">
          {users.map((user) => (
            <Card key={user.id} className="flex items-center p-4">
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex flex-col">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Link className="hover:underline" href={`/profile/${user.account_id}`} target="_blank">
                          {user.forename} {user.surname}
                        </Link>
                        <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                          {user.status}
                        </Badge>
                      </h3>
                    <p className="text-sm text-gray-500">ID: {' '}
                      <Link className="text-blue-500 hover:underline" href={`/profile/${user.account_id}`} target="_blank">
                        {user.account_id}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <Button
                  onClick={() => console.log("asd")}
                  variant={user.status === 'active' ? 'destructive' : 'default'}
                  className="h-8"
                > 
                  {user.status === 'active' ? (<UserX size={20} />) : <UserCheck size={20} />}
                  {user.status === 'active' ? 'Ban' : 'Unban'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

