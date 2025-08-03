'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useRequireRole } from '@/hooks/useAuth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Save, 
  Plus, 
  Edit, 
  FileText, 
  Settings, 
  Globe,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'

interface ContentSetting {
  id: string
  title: string
  content: string
  type: 'page' | 'section' | 'contact'
  status: 'active' | 'draft'
  last_updated: string
}

export default function AdminContentManagementPage() {
  const { loading } = useRequireRole('admin')
  const [settings, setSettings] = useState<ContentSetting[]>([])
  const [editingContent, setEditingContent] = useState<ContentSetting | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real implementation, fetch from API
    const mockSettings: ContentSetting[] = [
      {
        id: '1',
        title: 'Homepage Hero Section',
        content: 'Find and rent commercial vehicles for all your business needs. Fast, reliable, and affordable truck rentals.',
        type: 'section',
        status: 'active',
        last_updated: '2025-08-03'
      },
      {
        id: '2',
        title: 'About Us Page',
        content: 'AliTrucks is the leading platform connecting businesses with commercial vehicle owners...',
        type: 'page',
        status: 'active',
        last_updated: '2025-08-02'
      },
      {
        id: '3',
        title: 'Contact Information',
        content: JSON.stringify({
          phone: '1-800-TRUCKS-1',
          email: 'support@alitrucks.com',
          address: '123 Business Ave, Suite 100, San Francisco, CA 94105'
        }),
        type: 'contact',
        status: 'active',
        last_updated: '2025-08-01'
      },
      {
        id: '4',
        title: 'Footer Description',
        content: 'Your trusted platform for commercial vehicle rentals. Connecting businesses with reliable trucks for all transportation needs.',
        type: 'section',
        status: 'active',
        last_updated: '2025-08-03'
      },
      {
        id: '5',
        title: 'Privacy Policy',
        content: 'This privacy policy explains how we collect, use, and protect your personal information...',
        type: 'page',
        status: 'active',
        last_updated: '2025-07-30'
      }
    ]
    
    setSettings(mockSettings)
    setIsLoading(false)
  }, [])

  const handleSave = (content: ContentSetting) => {
    // In real implementation, save to API
    setSettings(prev => 
      prev.map(item => 
        item.id === content.id 
          ? { ...content, last_updated: new Date().toISOString().split('T')[0] }
          : item
      )
    )
    setEditingContent(null)
  }

  const handleCreate = () => {
    const newContent: ContentSetting = {
      id: Date.now().toString(),
      title: '',
      content: '',
      type: 'section',
      status: 'draft',
      last_updated: new Date().toISOString().split('T')[0]
    }
    setEditingContent(newContent)
  }

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading content management...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
              <p className="text-gray-600 mt-2">Manage static content, pages, and site information</p>
            </div>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Content
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              All Content
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Pages
            </TabsTrigger>
            <TabsTrigger value="sections" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Sections
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <ContentList 
              settings={settings} 
              onEdit={setEditingContent}
              title="All Content"
            />
          </TabsContent>

          <TabsContent value="pages" className="space-y-4">
            <ContentList 
              settings={settings.filter(s => s.type === 'page')} 
              onEdit={setEditingContent}
              title="Pages"
            />
          </TabsContent>

          <TabsContent value="sections" className="space-y-4">
            <ContentList 
              settings={settings.filter(s => s.type === 'section')} 
              onEdit={setEditingContent}
              title="Sections"
            />
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <ContactInfoManager 
              settings={settings.filter(s => s.type === 'contact')} 
              onEdit={setEditingContent}
            />
          </TabsContent>
        </Tabs>

        {/* Edit Modal */}
        {editingContent && (
          <EditContentModal
            content={editingContent}
            onSave={handleSave}
            onClose={() => setEditingContent(null)}
          />
        )}
      </div>
    </div>
  )
}

function ContentList({ 
  settings, 
  onEdit, 
  title 
}: { 
  settings: ContentSetting[]
  onEdit: (content: ContentSetting) => void
  title: string
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settings.map((setting) => (
          <Card key={setting.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{setting.title}</CardTitle>
                <Badge variant={setting.status === 'active' ? 'default' : 'secondary'}>
                  {setting.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {setting.content.length > 100 
                  ? `${setting.content.substring(0, 100)}...` 
                  : setting.content
                }
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Type: {setting.type}</span>
                <span>Updated: {setting.last_updated}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(setting)}
                className="w-full flex items-center gap-2"
              >
                <Edit className="w-3 h-3" />
                Edit
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ContactInfoManager({ 
  settings, 
  onEdit 
}: { 
  settings: ContentSetting[]
  onEdit: (content: ContentSetting) => void
}) {
  const contactInfo = settings[0] ? JSON.parse(settings[0].content) : {}

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Contact Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-600" />
              Phone Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium mb-4">{contactInfo.phone || 'Not set'}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => settings[0] && onEdit(settings[0])}
              className="w-full"
            >
              Edit
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Email Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium mb-4">{contactInfo.email || 'Not set'}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => settings[0] && onEdit(settings[0])}
              className="w-full"
            >
              Edit
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium mb-4">{contactInfo.address || 'Not set'}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => settings[0] && onEdit(settings[0])}
              className="w-full"
            >
              Edit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function EditContentModal({
  content,
  onSave,
  onClose
}: {
  content: ContentSetting
  onSave: (content: ContentSetting) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState(content)
  const isContactType = content.type === 'contact'
  const [contactData, setContactData] = useState(
    isContactType ? JSON.parse(content.content || '{}') : {}
  )

  const handleSave = () => {
    const finalContent = isContactType 
      ? { ...formData, content: JSON.stringify(contactData) }
      : formData
    onSave(finalContent)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>
            {content.id ? 'Edit Content' : 'Create New Content'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Content title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'page' | 'section' | 'contact' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="section">Section</option>
              <option value="page">Page</option>
              <option value="contact">Contact Info</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {isContactType ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  value={contactData.phone || ''}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  value={contactData.email || ''}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  placeholder="Email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <Textarea
                  value={contactData.address || ''}
                  onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                  placeholder="Physical address"
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter content here..."
                rows={8}
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
