'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, Settings, User, BarChart, Menu } from "lucide-react"

export default function AppLanding() {
    const [currentPage, setCurrentPage] = useState("home")

    const renderContent = () => {
        switch (currentPage) {
            case "home":
                return (
                    <>
                        <h2 className="text-2xl font-semibold mb-6 text-[#1a1a2e]">Choose a Module</h2>
                        <Button
                            className="w-full max-w-sm h-20 text-lg justify-start px-6 bg-[#f0f1f5] text-[#1a1a2e] hover:bg-[#e0e1e5] border border-[#a5abaf]"
                            onClick={() => setCurrentPage("profile")}
                        >
                            <User className="mr-4 h-6 w-6 text-[#140a9a]" />
                            Profile
                        </Button>
                        <Button
                            className="w-full max-w-sm h-20 text-lg justify-start px-6 bg-[#f0f1f5] text-[#1a1a2e] hover:bg-[#e0e1e5] border border-[#a5abaf]"
                            onClick={() => setCurrentPage("analytics")}
                        >
                            <BarChart className="mr-4 h-6 w-6 text-[#140a9a]" />
                            Analytics
                        </Button>
                        <Button
                            className="w-full max-w-sm h-20 text-lg justify-start px-6 bg-[#f0f1f5] text-[#1a1a2e] hover:bg-[#e0e1e5] border border-[#a5abaf]"
                            onClick={() => setCurrentPage("settings")}
                        >
                            <Settings className="mr-4 h-6 w-6 text-[#140a9a]" />
                            Settings
                        </Button>
                    </>
                )
            case "profile":
                return <h2 className="text-2xl font-semibold text-[#1a1a2e]">Profile Page</h2>
            case "analytics":
                return <h2 className="text-2xl font-semibold text-[#1a1a2e]">Analytics Page</h2>
            case "settings":
                return <h2 className="text-2xl font-semibold text-[#1a1a2e]">Settings Page</h2>
            default:
                return null
        }
    }

    return (
        <div className="flex flex-col h-screen bg-white text-[#4a4a68]">
            <header className="flex items-center justify-between h-16 border-b border-[#a5abaf] px-4 bg-[#140a9a]">
                <h1 className="text-xl font-bold text-white">MyApp</h1>
                <Button variant="ghost" size="icon" className="text-white hover:text-[#3d34e5]">
                    <Menu className="h-6 w-6" />
                </Button>
            </header>

            <ScrollArea className="flex-grow">
                <main className="flex flex-col items-center justify-center p-4 space-y-4">
                    {renderContent()}
                </main>
            </ScrollArea>

            <nav className="flex justify-around items-center h-16 bg-white border-t border-[#a5abaf]">
                <Button
                    variant="ghost"
                    size="icon"
                    className={`hover:text-[#3d34e5] ${currentPage === "home" ? "text-[#140a9a]" : "text-[#4a4a68]"}`}
                    onClick={() => setCurrentPage("home")}
                >
                    <Home className="h-6 w-6" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`hover:text-[#3d34e5] ${currentPage === "profile" ? "text-[#140a9a]" : "text-[#4a4a68]"}`}
                    onClick={() => setCurrentPage("profile")}
                >
                    <User className="h-6 w-6" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`hover:text-[#3d34e5] ${currentPage === "analytics" ? "text-[#140a9a]" : "text-[#4a4a68]"}`}
                    onClick={() => setCurrentPage("analytics")}
                >
                    <BarChart className="h-6 w-6" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`hover:text-[#3d34e5] ${currentPage === "settings" ? "text-[#140a9a]" : "text-[#4a4a68]"}`}
                    onClick={() => setCurrentPage("settings")}
                >
                    <Settings className="h-6 w-6" />
                </Button>
            </nav>
        </div>
    )
}