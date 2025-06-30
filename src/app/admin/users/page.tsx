'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Search, 
  Plus, 
  Edit, 
  Shield, 
  User, 
  ShoppingCart,
  MoreHorizontal,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { UserProfile, UserRole } from '@/lib/auth'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all')
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Add user modal states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [addUserLoading, setAddUserLoading] = useState(false)
  const [addUserForm, setAddUserForm] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'buyer' as UserRole,
    phone: '',
  })

  // Fetch users
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (selectedRole !== 'all') {
        query = query.eq('role', selectedRole)
      }

      const { data, error } = await query

      if (error) throw error
      setUsers(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))
      setSuccessMessage('User role updated successfully')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: !isActive })
        .eq('id', userId)

      if (error) throw error
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: !isActive } : user
      ))
      setSuccessMessage(`User ${isActive ? 'deactivated' : 'activated'} successfully`)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const createUser = async () => {
    try {
      setAddUserLoading(true)
      setError(null)

      // Validate form
      if (!addUserForm.email || !addUserForm.password || !addUserForm.full_name) {
        setError('Please fill in all required fields')
        return
      }

      // Get current session for authorization
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('You must be logged in to perform this action')
        return
      }

      // Call API endpoint to create user
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(addUserForm),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user')
      }

      // Reset form and close modal
      setAddUserForm({
        email: '',
        password: '',
        full_name: '',
        role: 'buyer',
        phone: '',
      })
      setIsAddUserOpen(false)
      
      setSuccessMessage('User created successfully')
      // Refresh users list
      await fetchUsers()
      
    } catch (err: any) {
      console.error('Error creating user:', err)
      setError(err.message || 'Failed to create user')
    } finally {
      setAddUserLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />
      case 'seller': return <User className="h-4 w-4" />
      case 'buyer': return <ShoppingCart className="h-4 w-4" />
    }
  }

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'destructive'
      case 'seller': return 'secondary' 
      case 'buyer': return 'default'
    }
  }

  const getUserInitials = (user: UserProfile) => {
    const name = user.full_name || user.email
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and roles</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with role and permissions.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="add-email">Email *</Label>
                <Input
                  id="add-email"
                  type="email"
                  placeholder="user@example.com"
                  value={addUserForm.email}
                  onChange={(e) => setAddUserForm({
                    ...addUserForm,
                    email: e.target.value
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="add-password">Password *</Label>
                <Input
                  id="add-password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={addUserForm.password}
                  onChange={(e) => setAddUserForm({
                    ...addUserForm,
                    password: e.target.value
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="add-full-name">Full Name *</Label>
                <Input
                  id="add-full-name"
                  placeholder="John Doe"
                  value={addUserForm.full_name}
                  onChange={(e) => setAddUserForm({
                    ...addUserForm,
                    full_name: e.target.value
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="add-phone">Phone Number</Label>
                <Input
                  id="add-phone"
                  placeholder="+1 (555) 123-4567"
                  value={addUserForm.phone}
                  onChange={(e) => setAddUserForm({
                    ...addUserForm,
                    phone: e.target.value
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="add-role">Role</Label>
                <Select
                  value={addUserForm.role}
                  onValueChange={(value: UserRole) => setAddUserForm({
                    ...addUserForm,
                    role: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">
                      <div className="flex items-center">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buyer
                      </div>
                    </SelectItem>
                    <SelectItem value="seller">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Seller
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddUserOpen(false)}
                disabled={addUserLoading}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={createUser}
                disabled={addUserLoading}
                className="bg-green-600 hover:bg-green-700 text-white border-green-600"
              >
                {addUserLoading ? 'Creating...' : 'Create User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {successMessage && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Label htmlFor="role">Filter by Role</Label>
              <Select 
                value={selectedRole} 
                onValueChange={(value) => {
                  setSelectedRole(value as UserRole | 'all')
                  // Trigger refetch when role filter changes
                  if (value !== selectedRole) {
                    fetchUsers()
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="seller">Sellers</SelectItem>
                  <SelectItem value="buyer">Buyers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          {user.avatar_url ? (
                            <AvatarImage src={user.avatar_url} alt="User Avatar" />
                          ) : (
                            <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.full_name || 'No name'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                        {getRoleIcon(user.role)}
                        <span className="ml-1">{user.role}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.is_active ? (
                        <Badge variant="secondary" className="text-green-700 bg-green-100">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-700 bg-red-50">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={user.role}
                          onValueChange={(newRole: UserRole) => updateUserRole(user.id, newRole)}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="seller">Seller</SelectItem>
                            <SelectItem value="buyer">Buyer</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant={user.is_active ? "destructive" : "default"}
                          onClick={() => toggleUserStatus(user.id, user.is_active)}
                        >
                          {user.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
