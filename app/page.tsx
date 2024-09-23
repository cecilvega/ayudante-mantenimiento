import { ScrollArea } from "@/components/ui/scroll-area"
import Header from './components/server/Header'
import AppContent from './components/client/AppContent'
import RecipeList from './components/server/RecipeList'; // Adjust the path as necessary
// import AddRecipeForm from './components/client/AddRecipeForm'; // Adjust the path as necessary

export default function Home() {
    return (
        <div className="flex flex-col h-screen bg-white text-[#4a4a68]">
            <Header />
            <ScrollArea className="flex-grow">
                <main className="flex flex-col items-center justify-center p-4 space-y-4">
                    <AppContent />
                    <RecipeList />
                    {/*<AddRecipeForm />*/}
                </main>
            </ScrollArea>
        </div>
    )
}