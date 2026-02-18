import { Suspense } from 'react'
import ProfileClient from './ProfileClient'

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileClient />
    </Suspense>
  )
}
