import { Button } from "@/components/ui/button";
// import { Menu } from "lucide-react";
// import NetworkStatus from '../client/NetworkStatus';
// import { HomeIcon } from 'lucide-react'
import { UserIcon, HelpCircleIcon, XIcon, LogOutIcon } from 'lucide-react'
import Link from 'next/link'
import { MenuIcon } from 'lucide-react'
import { useAuth } from '@/app/auth/AuthContext';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    isOnline?: boolean;
    onMenuClick: () => void;
}

export const Header: React.FC = () => {
    const [isSideTabOpen, setIsSideTabOpen] = useState(false)
    const { user, loading } = useAuth()

    const handleMenuClick = () => {
        setIsSideTabOpen(true)
    }

    const handleSideTabClose = () => {
        setIsSideTabOpen(false)
    }

    return (
        <header className="bg-[#140a9a] text-white p-6">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-green-300 animate-pulse"></div>
                    </div>
                    <span className="text-3xl font-bold tracking-wider">KOMATSU</span>
                </div>
                <Button
                    variant="outline"
                    size="lg"
                    onClick={handleMenuClick}
                    className="text-[#140a9a] bg-white border-[#140a9a] hover:bg-[#140a9a] hover:text-white transition-colors duration-300 p-6"
                >
                    <MenuIcon className="h-10 w-10" />
                </Button>
            </div>
            <SideTab isOpen={isSideTabOpen} onClose={handleSideTabClose} userEmail={user?.email} />
        </header>
    )
}

//
// interface SideTabProps {
//     isOpen: boolean;
//     onClose: () => void;
// }
//
// export const SideTab: React.FC<SideTabProps> = ({ isOpen, onClose }) => {
//     const { user } = useAuth();
//     const router = useRouter();
//
//     const handleLogout = async () => {
//         try {
//             await auth.signOut();
//             router.push('/signin');
//             onClose();
//         } catch (error) {
//             console.error('Error signing out:', error);
//         }
//     };
//
//     return (
//         <div className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
//             <div className="p-4">
//                 <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={onClose}
//                     className="absolute top-4 right-4 text-[#140a9a] hover:bg-[#140a9a] hover:text-white transition-colors duration-300"
//                 >
//                     <XIcon className="h-6 w-6" />
//                 </Button>
//                 <nav className="mt-12 space-y-4">
//                     <Link href="/profie" passHref>
//                         <Button variant="ghost" className="w-full justify-start text-[#140a9a] hover:bg-[#140a9a] hover:text-white transition-colors duration-300">
//                             <UserIcon className="mr-2 h-5 w-5" />
//                             Mi Cuenta
//                         </Button>
//                     </Link>
//
//                     {user && (
//                         <Button
//                             variant="ghost"
//                             className="w-full justify-start text-[#140a9a] hover:bg-[#140a9a] hover:text-white transition-colors duration-300"
//                             onClick={handleLogout}
//                         >
//                             <LogOutIcon className="mr-2 h-5 w-5" />
//                             Cerrar Sesión
//                         </Button>
//                     )}
//                 </nav>
//             </div>
//         </div>
//     )
// }