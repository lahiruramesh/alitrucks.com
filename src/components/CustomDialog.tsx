'use client'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ReactNode, useEffect } from 'react'

interface CustomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: ReactNode
  children: ReactNode
  className?: string
}

export default function CustomDialog({ 
  open, 
  onOpenChange, 
  trigger, 
  children, 
  className = "w-auto p-4" 
}: CustomDialogProps) {
  
  useEffect(() => {
    if (open) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        const overlay = document.querySelector('[data-radix-dialog-overlay]') as HTMLElement
        if (overlay) {
          overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)'
          overlay.style.backdropFilter = 'blur(4px)'
          overlay.style.position = 'fixed'
          overlay.style.inset = '0'
          overlay.style.zIndex = '999'
        }
      }, 50)
      
      return () => clearTimeout(timer)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className={className}>
        {children}
      </DialogContent>
    </Dialog>
  )
}
