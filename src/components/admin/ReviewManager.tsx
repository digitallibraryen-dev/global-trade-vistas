import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import StarRating from "@/components/StarRating";
import { CheckCircle, XCircle, Trash, MagnifyingGlass, Prohibit } from "@phosphor-icons/react";

interface ReviewRow {
  id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string;
  status: string;
  created_at: string;
  profiles?: { full_name: string | null } | null;
}

const ReviewManager = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ReviewRow | null>(null);
  const [banTarget, setBanTarget] = useState<ReviewRow | null>(null);

  // Banned words management
  const [bannedWords, setBannedWords] = useState<{ id: string; word: string }[]>([]);
  const [newWord, setNewWord] = useState("");

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false });
    setReviews((data as unknown as ReviewRow[]) ?? []);
    setLoading(false);
  }, []);

  const fetchBannedWords = useCallback(async () => {
    const { data } = await supabase.from("banned_words").select("*").order("word");
    setBannedWords(data ?? []);
  }, []);

  useEffect(() => {
    fetchReviews();
    fetchBannedWords();
  }, [fetchReviews, fetchBannedWords]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Review ${status}` });
      fetchReviews();
    }
  };

  const deleteReview = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("reviews").delete().eq("id", deleteTarget.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Review deleted" });
      fetchReviews();
    }
    setDeleteTarget(null);
  };

  const banUser = async () => {
    if (!banTarget) return;
    // Use manage-users edge function to ban
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-users?action=toggle-ban`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: banTarget.user_id, ban: true }),
      }
    );
    const data = await res.json();
    if (data.error) {
      toast({ title: "Error", description: data.error, variant: "destructive" });
    } else {
      toast({ title: "User banned" });
    }
    setBanTarget(null);
  };

  const addBannedWord = async () => {
    if (!newWord.trim()) return;
    const { error } = await supabase.from("banned_words").insert({ word: newWord.trim().toLowerCase() });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setNewWord("");
      fetchBannedWords();
    }
  };

  const removeBannedWord = async (id: string) => {
    await supabase.from("banned_words").delete().eq("id", id);
    fetchBannedWords();
  };

  const filtered = reviews.filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesSearch = r.comment.toLowerCase().includes(search.toLowerCase()) ||
      (r.profiles?.full_name || "").toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
        <span>{reviews.length} total reviews</span>
        <Badge variant={pendingCount > 0 ? "destructive" : "secondary"}>
          {pendingCount} pending
        </Badge>
        <span>{reviews.filter((r) => r.status === "approved").length} approved</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No reviews found</p>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="glass-strong rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground text-sm">{r.profiles?.full_name || "Unknown"}</span>
                  <StarRating rating={r.rating} readonly size={14} />
                  <Badge variant={r.status === "approved" ? "outline" : r.status === "pending" ? "secondary" : "destructive"}
                    className={r.status === "approved" ? "border-green-500/50 text-green-600" : ""}>
                    {r.status}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              {r.title && <p className="text-sm font-medium text-foreground">{r.title}</p>}
              <p className="text-sm text-muted-foreground">{r.comment}</p>
              <div className="flex gap-2 flex-wrap pt-1">
                {r.status !== "approved" && (
                  <Button size="sm" variant="outline" className="gap-1 text-green-600 border-green-500/30" onClick={() => updateStatus(r.id, "approved")}>
                    <CheckCircle size={14} /> Approve
                  </Button>
                )}
                {r.status !== "rejected" && (
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => updateStatus(r.id, "rejected")}>
                    <XCircle size={14} /> Reject
                  </Button>
                )}
                <Button size="sm" variant="outline" className="gap-1 text-destructive" onClick={() => setDeleteTarget(r)}>
                  <Trash size={14} /> Delete
                </Button>
                <Button size="sm" variant="outline" className="gap-1 text-destructive" onClick={() => setBanTarget(r)}>
                  <Prohibit size={14} /> Ban User
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Banned Words */}
      <div className="glass-strong rounded-xl p-5 space-y-4 mt-8">
        <h3 className="font-semibold text-foreground">Banned Words</h3>
        <div className="flex gap-2">
          <Input value={newWord} onChange={(e) => setNewWord(e.target.value)} placeholder="Add a word…" className="max-w-xs" />
          <Button onClick={addBannedWord} disabled={!newWord.trim()}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {bannedWords.map((w) => (
            <Badge key={w.id} variant="secondary" className="gap-1 cursor-pointer hover:bg-destructive/20" onClick={() => removeBannedWord(w.id)}>
              {w.word} <XCircle size={12} />
            </Badge>
          ))}
        </div>
      </div>

      {/* Delete dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>Permanently delete this review?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteReview} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Ban dialog */}
      <AlertDialog open={!!banTarget} onOpenChange={(open) => !open && setBanTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ban User</AlertDialogTitle>
            <AlertDialogDescription>Ban the user who wrote this review? They won't be able to sign in.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={banUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Ban</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReviewManager;
