
import ServerRecipeWrapper from './ServerRecipeWrapper';

export default function AnalyticsContent() {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-[#1a1a2e]">Analytics</h2>
            <p className="mb-4">Here are your recipes:</p>
            <ServerRecipeWrapper />
            {/* Add any additional analytics content here */}
        </div>
    );
}
// import React from 'react';
// import RecipeList from './RecipeList';
// import Header from "@/app/components/server/Header";
// import {ScrollArea} from "@/components/ui/scroll-area";
// // import AppContent from "@/app/components/client/AppContent"; // Adjust the import path as needed
//
// // export function AnalyticsContent() {
// //   return (
// //     <div>
// //       <h2>Analytics</h2>
// //       <RecipeList />
// //     </div>
// //   );
// // }
//
// export default function AnalyticsContent() {
//     return (
//         <div className="flex flex-col h-screen bg-white text-[#4a4a68]">
//             <Header />
//             <ScrollArea className="flex-grow">
//                 <main className="flex flex-col items-center justify-center p-4 space-y-4">
//                     {/*<AppContent />*/}
//                     {/*<AddRecipeForm />*/}
//                     <RecipeList />
//                 </main>
//             </ScrollArea>
//         </div>
//     )
// }