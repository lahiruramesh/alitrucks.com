'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/useAuth'
import { User, Phone, Mail, MapPin, FileText, Shield } from 'lucide-react'

interface BuyerProfileData {
  id: string
  userId: string
  firstName: string
  lastName: string
  phoneNumber: string
  drivingLicenseNumber: string
  verificationStatus: 'pending' | 'verified' | 'rejected'
  createdAt: string
}

export default function BuyerProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<BuyerProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/buyer/profile')
      
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setFormData({
          firstName: data.profile.firstName || '',
          lastName: data.profile.lastName || '',
          phoneNumber: data.profile.phoneNumber || '',
        })
      } else if (response.status === 404) {
        // Profile doesn't exist yet
        setProfile(null)
      } else {
        throw new Error('Failed to fetch profile')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      setError(null)
      const response = await fetch('/api/buyer/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const data = await response.json()
      setProfile(data.profile)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    }
  }

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
      case 'pending':
        return <Badge variant="outline" className="text-orange-600 border-orange-200">Pending Verification</Badge>
      case 'rejected':
        return <Badge variant="destructive">Verification Failed</Badge>
      default:
        return <Badge variant="outline">Not Verified</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading profile...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Email</span>
              </div>
              <p className="font-medium">{user?.email}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Verification Status</span>
              </div>
              {profile ? getVerificationBadge(profile.verificationStatus) : (
                <Badge variant="outline">Not Registered</Badge>
              )}
            </div>
          </div>

          <Separator />

          {profile ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Buyer Details</h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (isEditing) {
                      setFormData({
                        firstName: profile.firstName || '',
                        lastName: profile.lastName || '',
                        phoneNumber: profile.phoneNumber || '',
                      })
                    }
                    setIsEditing(!isEditing)
                  }}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleUpdateProfile} className="w-full">
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Name</span>
                    </div>
                    <p className="font-medium">
                      {profile.firstName} {profile.lastName}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Phone</span>
                    </div>
                    <p className="font-medium">{profile.phoneNumber || 'Not provided'}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Driving License</span>
                    </div>
                    <p className="font-medium">{profile.drivingLicenseNumber}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Member Since</span>
                    </div>
                    <p className="font-medium">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Complete Your Buyer Profile</h3>
              <p className="text-muted-foreground mb-4">
                Register as a buyer to start renting trucks and access all features.
              </p>
              <Button 
                onClick={() => window.location.href = '/buyer/register'}
                className="bg-green-600 hover:bg-green-700"
              >
                Register as Buyer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Receive updates about bookings and account activity
              </p>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Privacy Settings</h4>
              <p className="text-sm text-muted-foreground">
                Control how your information is shared
              </p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-red-600">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently remove your account and all data
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
