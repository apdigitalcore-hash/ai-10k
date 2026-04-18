import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Oto1 from "./pages/Oto1.tsx";
import Oto2 from "./pages/Oto2.tsx";
import Downsell from "./pages/Downsell.tsx";
import ThankYou from "./pages/ThankYou.tsx";
import Calculator from "./pages/Calculator.tsx";
import Waitlist from "./pages/Waitlist.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import CarouselGenerator from "./pages/CarouselGenerator.tsx";
import LaunchTracker from "./pages/LaunchTracker.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/oto1" element={<Oto1 />} />
          <Route path="/oto2" element={<Oto2 />} />
          <Route path="/downsell" element={<Downsell />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/carousel" element={<CarouselGenerator />} />
          <Route path="/launch-tracker" element={<LaunchTracker />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
