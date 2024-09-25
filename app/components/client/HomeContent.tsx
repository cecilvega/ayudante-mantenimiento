'use client'

import { Button } from "@/components/ui/button"
import { User, BarChart, Settings } from "lucide-react"

interface ModuleButtonProps {
    icon: React.ComponentType;
    label: string;
    onClick: () => void;
  }


export default function HomeContent({ setCurrentPage }:{
    setCurrentPage: (page: string) => void;
  }) {
    return (
        <>
            <h2 className="text-2xl font-semibold mb-6 text-[#1a1a2e]">Choose a Module</h2>
            <ModuleButton icon={User} label="Profile" onClick={() => setCurrentPage("profile")} />
            <ModuleButton icon={BarChart} label="Analytics" onClick={() => setCurrentPage("analytics")} />
            <ModuleButton icon={Settings} label="Settings" onClick={() => setCurrentPage("settings")} />
        </>
    )
}

function ModuleButton({  label, onClick }: ModuleButtonProps) {
    return (
        <Button
            className="w-full max-w-sm h-20 text-lg justify-start px-6 bg-[#f0f1f5] text-[#1a1a2e] hover:bg-[#e0e1e5] border border-[#a5abaf]"
            onClick={onClick}
        >
            {/*<Icon className="mr-4 h-6 w-6 text-[#140a9a]" />*/}
            {label}
        </Button>
    )
}