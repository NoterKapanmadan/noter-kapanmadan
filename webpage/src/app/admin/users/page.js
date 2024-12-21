'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, UserX, UserCheck } from 'lucide-react'

const mockUsers = [
  { id: '1', name: 'John', surname: 'Doe', status: 'active' },
  { id: '2', name: 'Jane', surname: 'Smith', status: 'banned' },
  { id: '3', name: 'Alice', surname: 'Johnson', status: 'active' },
]

export default function Users() {
  const [users, setUsers] = useState(mockUsers)
  const [search, setSearch] = useState('')

  const filteredUsers = users.filter(user => 
    user.id.includes(search) || 
    `${user.name} ${user.surname}`.toLowerCase().includes(search.toLowerCase())
  )

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'banned' : 'active' }
        : user
    ))
  }

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
      <div className="flex flex-col gap-2">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="flex items-center p-4">
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {user.name} {user.surname}
                    <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                      {user.status}
                    </Badge>
                  </h3>
                  <p className="text-sm text-gray-500">ID: {user.id}</p>
                </div>
              </div>
            </div>
            <div>
              <Button
                onClick={() => toggleUserStatus(user.id)}
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
    </div>
  )
}

