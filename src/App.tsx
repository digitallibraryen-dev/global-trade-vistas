import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import SmoothScroll from "@/components/SmoothScroll";
import useGAPageTracking from "@/hooks/useGAPageTracking";
import ScrollToTop from "./components/ScrollToTop";

// Eager: homepage (critical path)
import Index from "./pages/Index";

// Lazy: all other pages
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const MyAccountPage = lazy(() => import("./pages/MyAccountPage"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const WhyUsPage = lazy(() => import("./pages/WhyUsPage"));
const SupplierVerificationPage = lazy(() => import("./pages/SupplierVerificationPage"));
const QualityInspectionPage = lazy(() => import("./pages/QualityInspectionPage"));
const PrivateLabelingPage = lazy(() => import("./pages/PrivateLabelingPage"));
const LogisticsShippingPage = lazy(() => import("./pages/LogisticsShippingPage"));
const ProductResearchPage = lazy(() => import("./pages/ProductResearchPage"));
const MarketsPage = lazy(() => import("./pages/MarketsPage"));
const ImportGuidePage = lazy(() => import("./pages/ImportGuidePage"));
const SourcingGuidePage = lazy(() => import("./pages/SourcingGuidePage"));
const AdminGuard = lazy(() => import("./components/AdminGuard"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const AppRoutes = () => {
  useGAPageTracking();
  return (
    <SmoothScroll>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
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
              <Suspense fallback={<PageFallback />}>
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </SmoothScroll>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
