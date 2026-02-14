import { useState } from "react";
import { List } from "@phosphor-icons/react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductManager from "@/components/admin/ProductManager";
import ServiceManager from "@/components/admin/ServiceManager";
import SocialMediaManager from "@/components/admin/SocialMediaManager";
import AdminAccountManager from "@/components/admin/AdminAccountManager";
import UserManager from "@/components/admin/UserManager";
import GoogleOAuthSettings from "@/components/admin/GoogleOAuthSettings";
import AnalyticsSettings from "@/components/admin/AnalyticsSettings";
import ReviewManager from "@/components/admin/ReviewManager";

const titles: Record<string, { title: string; subtitle: string }> = {
  products: { title: "Products", subtitle: "Manage your product catalog" },
  services: { title: "Services", subtitle: "Manage your featured services" },
  social: { title: "Social Media", subtitle: "Manage social media links" },
  users: { title: "User Management", subtitle: "Manage user accounts and permissions" },
  reviews: { title: "Review Moderation", subtitle: "Approve, reject, or manage customer reviews" },
  oauth: { title: "Authentication Settings", subtitle: "Configure Google Sign-In and OAuth" },
  analytics: { title: "Analytics", subtitle: "Configure tracking and analytics" },
  admins: { title: "Settings", subtitle: "Manage admin accounts" },
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { title, subtitle } = titles[activeTab] ?? titles.products;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6 py-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary text-foreground"
          >
            <List size={22} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl">
          {activeTab === "products" && <ProductManager />}
          {activeTab === "services" && <ServiceManager />}
          {activeTab === "social" && <SocialMediaManager />}
          {activeTab === "users" && <UserManager />}
          {activeTab === "reviews" && <ReviewManager />}
          {activeTab === "oauth" && <GoogleOAuthSettings />}
          {activeTab === "analytics" && <AnalyticsSettings />}
          {activeTab === "admins" && <AdminAccountManager />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
