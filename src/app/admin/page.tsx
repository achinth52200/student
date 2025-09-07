import { redirect } from 'next/navigation'

export default function AdminPage() {
  // Redirect to dashboard as admin page is removed
  redirect('/dashboard')
}
