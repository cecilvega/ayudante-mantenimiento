// app/components/ProtectedRoute.tsx
'use client'

import { useAuth } from '../auth/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/signin')
        }
    }, [user, loading, router])

    if (loading) {
        return <div>Loading...</div>
    }

    return user ? <>{children}</> : null
}