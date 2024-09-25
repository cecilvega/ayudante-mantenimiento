import { Button } from "@/components/ui/button";
import { User, BarChart, Settings } from "lucide-react";
import Link from 'next/link';

export default function Home() {
    return (
        <>
            <h2 className="text-2xl font-semibold mb-6 text-[#1a1a2e]">Choose a Module</h2>
            <Link href="/profile" className="w-full max-w-sm">
                <Button
                    className="w-full h-20 text-lg justify-start px-6 bg-[#f0f1f5] text-[#1a1a2e] hover:bg-[#e0e1e5] border border-[#a5abaf]"
                >
                    <User className="mr-4 h-6 w-6 text-[#140a9a]" />
                    Profile
                </Button>
            </Link>
            <Link href="/analytics" className="w-full max-w-sm">
                <Button
                    className="w-full h-20 text-lg justify-start px-6 bg-[#f0f1f5] text-[#1a1a2e] hover:bg-[#e0e1e5] border border-[#a5abaf]"
                >
                    <BarChart className="mr-4 h-6 w-6 text-[#140a9a]" />
                    Analytics
                </Button>
            </Link>
            <Link href="/settings" className="w-full max-w-sm">
                <Button
                    className="w-full h-20 text-lg justify-start px-6 bg-[#f0f1f5] text-[#1a1a2e] hover:bg-[#e0e1e5] border border-[#a5abaf]"
                >
                    <Settings className="mr-4 h-6 w-6 text-[#140a9a]" />
                    Settings
                </Button>
            </Link>
            <Link href="/entrega-componentes" className="w-full max-w-sm">
                <Button
                    className="w-full h-20 text-lg justify-start px-6 bg-[#f0f1f5] text-[#1a1a2e] hover:bg-[#e0e1e5] border border-[#a5abaf]"
                >
                    <Settings className="mr-4 h-6 w-6 text-[#140a9a]" />
                    Settings
                </Button>
            </Link>
        </>
    );
}

// import { ScrollArea } from "@/components/ui/scroll-area"
// import Header from './components/server/Header'
// import AppContent from './components/client/AppContent'
// // import RecipeList from './components/server/RecipeList'; // Adjust the path as necessary
// // import AddRecipeForm from './components/client/AddRecipeForm'; // Adjust the path as necessary
//
// export default function Home() {
//     return (
//         <div className="flex flex-col h-screen bg-white text-[#4a4a68]">
//             <Header />
//             <ScrollArea className="flex-grow">
//                 <main className="flex flex-col items-center justify-center p-4 space-y-4">
//                     <AppContent />
//                     {/*<RecipeList />*/}
//                 </main>
// </ScrollArea>
// </div>
// )
// }
