import { useState } from "react";
import { List } from "@phosphor-icons/react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductManager from "@/components/admin/ProductManager";
import SocialMediaManager from "@/components/admin/SocialMediaManager";
import AdminAccountManager from "@/components/admin/AdminAccountManager";

const titles: Record<string, { title: string; subtitle: string }> = {
  products: { title: "Products", subtitle: "Manage your product catalog" },
  social: { title: "Social Media", subtitle: "Manage social media links" },
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
        {/* Top bar */}
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

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl">
          {activeTab === "products" && <ProductManager />}
          {activeTab === "social" && <SocialMediaManager />}
          {activeTab === "admins" && <AdminAccountManager />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
