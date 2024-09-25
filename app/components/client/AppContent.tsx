'use client'

import { useState } from "react"
import Navigation from './Navigation'
import HomeContent from './HomeContent'
import ProfileContent from '../server/ProfileContent'
import AnalyticsContent from '../server/AnalyticsContent'
import SettingsContent from '../server/SettingsContent'

export default function AppContent() {
    const [currentPage, setCurrentPage] = useState("home")

    const renderContent = () => {
        switch (currentPage) {
            case "home":
                return <HomeContent setCurrentPage={setCurrentPage} />
            case "profile":
                return <ProfileContent />
            case "analytics":
                return <AnalyticsContent />
            case "settings":
                return <SettingsContent />
            default:
                return null
        }
    }

    return (
        <>
            {renderContent()}
            <Navigation />
        </>
    )
}