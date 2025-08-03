'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Info, AlertCircle } from 'lucide-react'

interface Policy {
  id: number
  policy_type: 'fuel' | 'return' | 'cancellation'
  title: string
  content: string
  is_default: boolean
  is_active: boolean
}

interface PoliciesDialogProps {
  policyType: 'fuel' | 'return' | 'cancellation'
  selectedPolicyId?: number
  onPolicySelect?: (policyId: number) => void
  trigger?: React.ReactNode
}

const policyTypeLabels = {
  fuel: 'Fuel Policy',
  return: 'Return Policy', 
  cancellation: 'Cancellation Policy'
}

const policyTypeDescriptions = {
  fuel: 'Guidelines for fuel/charging requirements when returning the vehicle',
  return: 'Rules and procedures for returning the vehicle after rental',
  cancellation: 'Terms and conditions for cancelling bookings'
}

export default function PoliciesDialog({ 
  policyType, 
  selectedPolicyId, 
  onPolicySelect,
  trigger 
}: PoliciesDialogProps) {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const supabase = createClient()

  const fetchPolicies = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('platform_policies')
        .select('*')
        .eq('policy_type', policyType)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPolicies((data || []) as Policy[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch policies')
    } finally {
      setLoading(false)
    }
  }, [supabase, policyType])

  useEffect(() => {
    if (open) {
      fetchPolicies()
    }
  }, [open, fetchPolicies])

  const handlePolicySelect = (policyId: number) => {
    if (onPolicySelect) {
      onPolicySelect(policyId)
      setOpen(false)
    }
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Info className="w-4 h-4 mr-2" />
      View {policyTypeLabels[policyType]}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {policyTypeLabels[policyType]} Options
          </DialogTitle>
          <DialogDescription>
            {policyTypeDescriptions[policyType]}. 
            {onPolicySelect && ' Select the policy that best fits your vehicle rental.'}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {!loading && !error && policies.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No policies available for {policyTypeLabels[policyType].toLowerCase()}.
            </div>
          )}
          
          {!loading && !error && policies.length > 0 && (
            <div className="space-y-4">
              {policies.map((policy) => (
                <div 
                  key={policy.id} 
                  className={`
                    border rounded-lg p-4 transition-colors
                    ${selectedPolicyId === policy.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                    ${onPolicySelect ? 'cursor-pointer' : ''}
                  `}
                  onClick={() => onPolicySelect && handlePolicySelect(policy.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {policy.title}
                    </h3>
                    <div className="flex gap-2">
                      {policy.is_default && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                      {selectedPolicyId === policy.id && onPolicySelect && (
                        <Badge variant="default">Selected</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {policy.content}
                  </p>
                  {onPolicySelect && selectedPolicyId !== policy.id && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePolicySelect(policy.id)
                      }}
                    >
                      Select This Policy
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {!onPolicySelect && (
          <div className="flex justify-end pt-4">
            <Button onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
