'use client'

import { Button } from "@/components/ui/button";
import { Home, User, BarChart, Settings } from "lucide-react";
import { usePathname, useRouter } from 'next/navigation';

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <nav className="flex justify-around items-center h-16 bg-white border-t border-[#a5abaf]">
            <Button
                variant="ghost"
                size="icon"
                className={`hover:text-[#3d34e5] ${pathname === "/" ? "text-[#140a9a]" : "text-[#4a4a68]"}`}
                onClick={() => router.push('/')}
            >
                <Home className="h-6 w-6" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className={`hover:text-[#3d34e5] ${pathname === "/profile" ? "text-[#140a9a]" : "text-[#4a4a68]"}`}
                onClick={() => router.push('/profile')}
            >
                <User className="h-6 w-6" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className={`hover:text-[#3d34e5] ${pathname === "/analytics" ? "text-[#140a9a]" : "text-[#4a4a68]"}`}
                onClick={() => router.push('/analytics')}
            >
                <BarChart className="h-6 w-6" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className={`hover:text-[#3d34e5] ${pathname === "/settings" ? "text-[#140a9a]" : "text-[#4a4a68]"}`}
                onClick={() => router.push('/settings')}
            >
                <Settings className="h-6 w-6" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className={`hover:text-[#3d34e5] ${pathname === "/settings" ? "text-[#140a9a]" : "text-[#4a4a68]"}`}
                onClick={() => router.push('/entrega-componentes')}
            >
                <Settings className="h-6 w-6" />
            </Button>
        </nav>
    );
}
// 'use client'
//
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
//
// export default function Navigation() {
//     const pathname = usePathname()
//
//     return (
//         <nav>
//             <ul className="flex space-x-4">
//                 <li><Link href="/" className={pathname === '/' ? 'font-bold' : ''}>Home</Link></li>
//                 <li><Link href="/profile" className={pathname === '/profile' ? 'font-bold' : ''}>Profile</Link></li>
//                 <li><Link href="/analytics" className={pathname === '/analytics' ? 'font-bold' : ''}>Analytics</Link></li>
//                 <li><Link href="/settings" className={pathname === '/settings' ? 'font-bold' : ''}>Settings</Link></li>
//             </ul>
//         </nav>
//     )
// }

// 'use client'
//
// import { Button } from "@/components/ui/button"
// import { Home, Settings, User, BarChart } from "lucide-react"
// import { LucideIcon } from "lucide-react";
//
// interface NavigationProps {
//     currentPage: string;
//     setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
// }
//
// type NavButtonProps = {
//     icon: LucideIcon;
//     page: string;
//     currentPage: string;
//     setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
// };
//
// export default function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
//
//     return (
//         <nav className="flex justify-around items-center h-16 bg-white border-t border-[#a5abaf]">
//             <NavButton icon={Home} page="home" currentPage={currentPage} setCurrentPage={setCurrentPage} />
//             <NavButton icon={User} page="profile" currentPage={currentPage} setCurrentPage={setCurrentPage} />
//             <NavButton icon={BarChart} page="analytics" currentPage={currentPage} setCurrentPage={setCurrentPage} />
//             <NavButton icon={Settings} page="settings" currentPage={currentPage} setCurrentPage={setCurrentPage} />
//         </nav>
//     )
// }
//
// function NavButton({ icon: Icon, page, currentPage, setCurrentPage }: NavButtonProps) {
//     return (
//         <Button
//             variant="ghost"
//             size="icon"
//             className={`hover:text-[#3d34e5] ${currentPage === page ? "text-[#140a9a]" : "text-[#4a4a68]"}`}
//             onClick={() => setCurrentPage(page)}
//         >
//             <Icon className="h-6 w-6" />
//         </Button>
//     )
// }