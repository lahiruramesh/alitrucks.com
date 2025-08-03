'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileText, Upload, User, Phone } from 'lucide-react'

export default function BuyerRegistrationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    drivingLicenseNumber: '',
    additionalInfo: ''
  })
  
  const [drivingLicenseFile, setDrivingLicenseFile] = useState<File | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a JPEG, PNG, or PDF file for your driving license')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      
      setDrivingLicenseFile(file)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate form
      if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.drivingLicenseNumber) {
        throw new Error('Please fill in all required fields')
      }

      if (!drivingLicenseFile) {
        throw new Error('Please upload your driving license document')
      }

      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append('firstName', formData.firstName)
      submitData.append('lastName', formData.lastName)
      submitData.append('phoneNumber', formData.phoneNumber)
      submitData.append('drivingLicenseNumber', formData.drivingLicenseNumber)
      submitData.append('additionalInfo', formData.additionalInfo)
      submitData.append('drivingLicense', drivingLicenseFile)

      const response = await fetch('/api/buyer/register', {
        method: 'POST',
        body: submitData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/buyer/dashboard')
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Registration Successful!</h2>
            <p className="text-muted-foreground">
              Your buyer profile has been created. You will be redirected to your dashboard shortly.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2" />
          Buyer Registration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="Enter your first name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <div className="flex">
              <Phone className="w-4 h-4 mt-3 mr-2 text-muted-foreground" />
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                placeholder="+1 (555) 123-4567"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="drivingLicenseNumber">Driving License Number *</Label>
            <Input
              id="drivingLicenseNumber"
              name="drivingLicenseNumber"
              value={formData.drivingLicenseNumber}
              onChange={handleInputChange}
              required
              placeholder="Enter your driving license number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="drivingLicense">Driving License Document *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                id="drivingLicense"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="drivingLicense"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  {drivingLicenseFile 
                    ? `Selected: ${drivingLicenseFile.name}` 
                    : 'Click to upload your driving license (JPEG, PNG, or PDF, max 5MB)'
                  }
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              placeholder="Any additional information you'd like to provide..."
              rows={3}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Verification Process</h4>
            <p className="text-sm text-blue-700">
              Your documents will be reviewed by our team within 24-48 hours. 
              Once verified, you&apos;ll be able to start renting trucks immediately.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700" 
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Complete Registration'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
