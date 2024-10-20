'use client'

import React, { useState } from 'react'
import { Header } from './Header'
import { SideTab } from './SideTab'
import { Footer } from './Footer'
import AuthStatus from '../AuthStatus'
import { useAuth } from '../../auth/AuthContext'

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isSideTabOpen, setIsSideTabOpen] = useState(false)
    const { user, loading } = useAuth()

    const handleMenuClick = () => {
        setIsSideTabOpen(true)
    }

    const handleSideTabClose = () => {
        setIsSideTabOpen(false)
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header onMenuClick={handleMenuClick}>
                <AuthStatus />
            </Header>
            <SideTab isOpen={isSideTabOpen} onClose={handleSideTabClose} />
            <main className="flex-grow">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    children
                )}
            </main>
            <Footer />
        </div>
    )
}