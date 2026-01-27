import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Dashboard from "./Pages/Dashboard";
import Demands from "./Pages/Demands";
import DemandDetail from "./Pages/DemandDetail";
import Settings from "./Pages/Settings";

// Components
import UserNotRegisteredError from "./Components/UserNotRegisteredError";

// Layout - assuming you want a layout wrapper, but if not provided we can wrap simply.
// I'll create a simple wrapper layout if one doesn't exist or use the pages directly.
// Given I reconstructed Pages, they likely include their own layout or sidebar.
// Checking `Dashboard.jsx`, it imports `Sidebar`.
// Let's assume a simple setup where we render pages directly for now, 
// as many dashboard templates handle layout internally or via a Layout component.
// If there was a specific Layout.js, I should use it. I'll stick to a simple router.

// Note: I will wrap everything in TooltipProvider as it is required by some shadcn components
// and often omitted in individual files.

function App() {
    // Simple authentication simulation or check could go here
    // For now, we route directly to the pages.

    return (
        <TooltipProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/demands" element={<Demands />} />
                    <Route path="/demand-detail" element={<DemandDetail />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/access-denied" element={<UserNotRegisteredError />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
            <Toaster />
        </TooltipProvider>
    );
}

export default App;
