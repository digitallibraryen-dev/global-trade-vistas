import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MagnifyingGlass,
  ShieldCheck,
  ShieldSlash,
  UserCircle,
  DotsThreeVertical,
  Trash,
  Prohibit,
  CheckCircle,
  GoogleLogo,
  Envelope,
} from "@phosphor-icons/react";

interface UserRow {
  id: string;
  email: string;
  name: string;
  created_at: string;
  last_sign_in_at: string | null;
  provider: string;
  is_admin: boolean;
  banned: boolean;
}

const UserManager = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [acting, setActing] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);

  const getAuthHeaders = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      Authorization: `Bearer ${session?.access_token}`,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      "Content-Type": "application/json",
    };
  }, []);

  const callAction = useCallback(async (action: string, body?: Record<string, unknown>) => {
    const headers = await getAuthHeaders();
    const isGet = !body;
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-users?action=${action}`,
      {
        method: isGet ? "GET" : "POST",
        headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
      }
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  }, [getAuthHeaders]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await callAction("list");
      setUsers(data.users ?? []);
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to load users", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [callAction, toast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleAction = async (action: string, userId: string, body: Record<string, unknown>, successMsg: string) => {
    setActing(userId);
    try {
      await callAction(action, body);
      toast({ title: successMsg });
      fetchUsers();
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Action failed", variant: "destructive" });
    } finally {
      setActing(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await handleAction("delete-user", deleteTarget.id, { userId: deleteTarget.id }, `User ${deleteTarget.email} deleted`);
    setDeleteTarget(null);
  };

  // Filtering
  const filtered = users.filter((u) => {
    const matchesSearch =
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.name?.toLowerCase().includes(search.toLowerCase());
    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "admin" && u.is_admin) ||
      (roleFilter === "user" && !u.is_admin);
    const matchesProvider =
      providerFilter === "all" || u.provider === providerFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !u.banned) ||
      (statusFilter === "disabled" && u.banned);
    return matchesSearch && matchesRole && matchesProvider && matchesStatus;
  });

  const isSelf = (userId: string) => currentUser?.id === userId;

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
        <Select value={providerFilter} onValueChange={setProviderFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Method" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="google">Google</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>{users.length} total users</span>
        <span>{users.filter((u) => u.is_admin).length} admins</span>
        <span>{users.filter((u) => u.banned).length} disabled</span>
      </div>

      {/* Table */}
      <div className="glass-strong rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left bg-muted/30">
                <th className="px-4 py-3 font-medium text-muted-foreground">User</th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Method</th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Joined</th>
                <th className="px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Last Login</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">Loading users...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  {users.length === 0 ? "No users registered yet" : "No users match your filters"}
                </td></tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                    {/* User info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <UserCircle size={28} className="text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {u.name || "—"}
                            {isSelf(u.id) && <span className="text-xs text-primary ml-1">(you)</span>}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Provider */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        {u.provider === "google" ? (
                          <><GoogleLogo size={14} /> <span>Google</span></>
                        ) : (
                          <><Envelope size={14} /> <span>Email</span></>
                        )}
                      </div>
                    </td>
                    {/* Joined */}
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    {/* Last login */}
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : "Never"}
                    </td>
                    {/* Role */}
                    <td className="px-4 py-3">
                      <Badge variant={u.is_admin ? "default" : "secondary"}>
                        {u.is_admin ? "Admin" : "User"}
                      </Badge>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <Badge variant={u.banned ? "destructive" : "outline"} className={!u.banned ? "border-green-500/50 text-green-600" : ""}>
                        {u.banned ? "Disabled" : "Active"}
                      </Badge>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" disabled={acting === u.id}>
                            <DotsThreeVertical size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleAction("toggle-admin", u.id, { userId: u.id, makeAdmin: !u.is_admin }, u.is_admin ? "Admin role removed" : "Admin role granted")
                            }
                            disabled={isSelf(u.id) && u.is_admin}
                          >
                            {u.is_admin ? (
                              <><ShieldSlash size={14} className="mr-2" /> Remove Admin</>
                            ) : (
                              <><ShieldCheck size={14} className="mr-2" /> Make Admin</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleAction("toggle-ban", u.id, { userId: u.id, ban: !u.banned }, u.banned ? "Account enabled" : "Account disabled")
                            }
                            disabled={isSelf(u.id)}
                          >
                            {u.banned ? (
                              <><CheckCircle size={14} className="mr-2" /> Enable Account</>
                            ) : (
                              <><Prohibit size={14} className="mr-2" /> Disable Account</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteTarget(u)}
                            disabled={isSelf(u.id)}
                          >
                            <Trash size={14} className="mr-2" /> Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete <strong>{deleteTarget?.email}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManager;
