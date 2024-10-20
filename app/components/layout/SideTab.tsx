import React from 'react'
import { Button } from "@/components/ui/button"
import { UserIcon, XIcon, LogOutIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { auth } from '@/app/firebase/config'

interface SideTabProps {
    isOpen: boolean
    onClose: () => void
    userEmail: string | undefined
}

export const SideTab: React.FC<SideTabProps> = ({ isOpen, onClose, userEmail }) => {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await auth.signOut()
            router.push('/signin')
            onClose()
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <div
            className={`fixed top-0 right-0 h-full w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-white shadow-lg transform ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            } transition-transform duration-300 ease-in-out z-50`}
        >
            <div className="p-8">
                <Button
                    variant="ghost"
                    size="lg"
                    onClick={onClose}
                    className="absolute top-6 right-6 text-[#140a9a] hover:bg-[#140a9a] hover:text-white transition-colors duration-300 p-4"
                >
                    <XIcon className="h-10 w-10" />
                </Button>
                <nav className="mt-24 space-y-8">
                    {userEmail && (
                        <div className="text-2xl font-semibold text-[#140a9a] mb-8">
                            {userEmail}
                        </div>
                    )}
                    <Link href="/profile" passHref>
                        <Button
                            variant="ghost"
                            size="lg"
                            className="w-full h-24 justify-start text-[#140a9a] hover:bg-[#140a9a] hover:text-white transition-colors duration-300 text-xl"
                        >
                            <UserIcon className="mr-4 h-10 w-10" />
                            Mi Cuenta
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="lg"
                        className="w-full h-24 justify-start text-[#140a9a] hover:bg-[#140a9a] hover:text-white transition-colors duration-300 text-xl"
                        onClick={handleLogout}
                    >
                        <LogOutIcon className="mr-4 h-10 w-10" />
                        Cerrar Sesión
                    </Button>
                </nav>
            </div>
        </div>
    )
}