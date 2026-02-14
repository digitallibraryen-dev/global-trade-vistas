import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Package, Share2, UserPlus } from "lucide-react";
import ProductManager from "@/components/admin/ProductManager";
import SocialMediaManager from "@/components/admin/SocialMediaManager";
import AdminAccountManager from "@/components/admin/AdminAccountManager";

type Tab = "products" | "social" | "admins";

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "products", label: "Products", icon: Package },
  { key: "social", label: "Social Media", icon: Share2 },
  { key: "admins", label: "Add Admin", icon: UserPlus },
];

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("products");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
        <Button variant="ghost" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Tab bar */}
        <div className="flex gap-1 mb-8 overflow-x-auto border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "products" && <ProductManager />}
        {activeTab === "social" && <SocialMediaManager />}
        {activeTab === "admins" && <AdminAccountManager />}
      </div>
    </div>
  );
};

export default AdminDashboard;
