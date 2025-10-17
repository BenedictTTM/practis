import { redirect } from 'next/navigation'

export default function Page() {
  // Server-side redirect to the main products page
  redirect('/main/products')
  return null
}