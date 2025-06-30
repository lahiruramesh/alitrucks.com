import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

export const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      const { error } = await auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        alert('Failed to sign out. Please try again.');
        return;
      }

      console.log('User signed out successfully');
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('An unexpected error occurred during sign out.');
    }
  };

  return { logout };
};
