import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Package, ShareNetwork, UserPlus, SignOut, House, Users, Lock, ChartLine, ChatCircleDots } from "@phosphor-icons/react";
import logo from "@/assets/logo.png";

type NavItem = { key: string; label: string; icon: React.ElementType };

const navItems: NavItem[] = [
  { key: "products", label: "Products", icon: Package },
  { key: "social", label: "Social Media", icon: ShareNetwork },
  { key: "users", label: "Users", icon: Users },
  { key: "reviews", label: "Reviews", icon: ChatCircleDots },
  { key: "oauth", label: "Authentication", icon: Lock },
  { key: "analytics", label: "Analytics", icon: ChartLine },
  { key: "admins", label: "Add Admin", icon: UserPlus },
];

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  open: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ activeTab, onTabChange, open, onClose }: AdminSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 flex flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <img src={logo} alt="Logo" className="h-8 w-8 rounded-full object-cover" />
          <span className="text-base font-bold text-sidebar-foreground">Admin</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <button
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <House size={18} />
            Back to Site
          </button>

          <div className="my-3 border-t border-sidebar-border" />

          {navItems.map((item) => {
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onTabChange(item.key);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border px-4 py-4 space-y-3">
          <p className="text-xs text-sidebar-foreground/50 truncate">
            {user?.email}
          </p>
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <SignOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
