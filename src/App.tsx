import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Tours from "./pages/Tours";
import ActivityDetail from "./pages/ActivityDetail";
import ComboDeals from "./pages/ComboDeals";
import ComboDetail from "./pages/ComboDetail";
import Contact from "./pages/Contact";
import TripPlanner from "./pages/TripPlanner";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import { AIChatWidget } from "./components/AIChatWidget";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTours from "./pages/admin/AdminTours";
import TourForm from "./pages/admin/TourForm";
import AdminCombos from "./pages/admin/AdminCombos";
import ComboForm from "./pages/admin/ComboForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/activity/:id" element={<ActivityDetail />} />
            <Route path="/combo-deals" element={<ComboDeals />} />
            <Route path="/combo/:id" element={<ComboDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/trip-planner" element={<TripPlanner />} />
            <Route path="/checkout" element={<Checkout />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="tours" element={<AdminTours />} />
              <Route path="tours/create" element={<TourForm />} />
              <Route path="tours/edit/:id" element={<TourForm />} />
              <Route path="combos" element={<AdminCombos />} />
              <Route path="combos/create" element={<ComboForm />} />
              <Route path="combos/edit/:id" element={<ComboForm />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIChatWidget />
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
