
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import Article from "./pages/Article";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Write from "./pages/Write";
import Profile from "./pages/Profile";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/articles/:slug" element={<Article />} />
                <Route path="/about" element={<About />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/write" element={<Write />} />
                <Route path="/write/:id" element={<Write />} />
                <Route path="/profile" element={<Profile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
