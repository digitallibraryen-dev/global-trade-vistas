import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import SmoothScroll from "@/components/SmoothScroll";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import AdminDashboard from "./pages/AdminDashboard";
import MyAccountPage from "./pages/MyAccountPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ServicesPage from "./pages/ServicesPage";
import FAQPage from "./pages/FAQPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import WhyUsPage from "./pages/WhyUsPage";
import SupplierVerificationPage from "./pages/SupplierVerificationPage";
import QualityInspectionPage from "./pages/QualityInspectionPage";
import PrivateLabelingPage from "./pages/PrivateLabelingPage";
import LogisticsShippingPage from "./pages/LogisticsShippingPage";
import ProductResearchPage from "./pages/ProductResearchPage";
import MarketsPage from "./pages/MarketsPage";
import ImportGuidePage from "./pages/ImportGuidePage";
import SourcingGuidePage from "./pages/SourcingGuidePage";
import AdminGuard from "./components/AdminGuard";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SmoothScroll>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/why-us" element={<WhyUsPage />} />
              <Route path="/supplier-verification" element={<SupplierVerificationPage />} />
              <Route path="/quality-inspection" element={<QualityInspectionPage />} />
              <Route path="/private-labeling" element={<PrivateLabelingPage />} />
              <Route path="/logistics-shipping" element={<LogisticsShippingPage />} />
              <Route path="/product-research" element={<ProductResearchPage />} />
              <Route path="/markets" element={<MarketsPage />} />
              <Route path="/import-guide" element={<ImportGuidePage />} />
              <Route path="/sourcing-guide" element={<SourcingGuidePage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/account" element={<MyAccountPage />} />
              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <AdminDashboard />
                  </AdminGuard>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </SmoothScroll>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
