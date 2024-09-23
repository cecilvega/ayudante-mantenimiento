import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function Header() {
    return (
        <header className="flex items-center justify-between h-16 border-b border-[#a5abaf] px-4 bg-[#140a9a]">
            <h1 className="text-xl font-bold text-white">MyApp</h1>
            <Button variant="ghost" size="icon" className="text-white hover:text-[#3d34e5]">
                <Menu className="h-6 w-6" />
            </Button>
        </header>
    )
}