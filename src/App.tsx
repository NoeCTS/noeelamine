import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { PageTransitionProvider } from "./components/PageTransition";
import Index from "./pages/Index";
import Nothing from "./pages/Nothing";
import Pangaia from "./pages/Pangaia";
import Berlin from "./pages/Berlin";
import Aube from "./pages/Aube";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageTransitionProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/nothing" element={<Nothing />} />
            <Route path="/pangaia" element={<Pangaia />} />
            <Route path="/berlin" element={<Berlin />} />
            <Route path="/aube" element={<Aube />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransitionProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
