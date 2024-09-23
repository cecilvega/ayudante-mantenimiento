'use client'

import { Button } from "@/components/ui/button"
import { Home, Settings, User, BarChart } from "lucide-react"

export default function Navigation({ currentPage, setCurrentPage }) {
    return (
        <nav className="flex justify-around items-center h-16 bg-white border-t border-[#a5abaf]">
            <NavButton icon={Home} page="home" currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <NavButton icon={User} page="profile" currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <NavButton icon={BarChart} page="analytics" currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <NavButton icon={Settings} page="settings" currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </nav>
    )
}

function NavButton({ icon: Icon, page, currentPage, setCurrentPage }) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className={`hover:text-[#3d34e5] ${currentPage === page ? "text-[#140a9a]" : "text-[#4a4a68]"}`}
            onClick={() => setCurrentPage(page)}
        >
            <Icon className="h-6 w-6" />
        </Button>
    )
}