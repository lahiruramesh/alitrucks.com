import { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In | AliTrucks',
  description: 'Sign in to your AliTrucks account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back to AliTrucks
          </h1>
          <p className="text-gray-600">
            Sign in to access your electric truck rental platform
          </p>
        </div>
        
        <LoginForm />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              href="/auth/register" 
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
