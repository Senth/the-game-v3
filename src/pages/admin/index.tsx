import React from 'react'
import { useRouter } from 'next/router'

// Export subpages
export { default as Seasons } from './seasons'

export default function Admin(): JSX.Element {
  // Route to seasons
  const router = useRouter()
  router.push('/admin/seasons')

  return <></>
}
