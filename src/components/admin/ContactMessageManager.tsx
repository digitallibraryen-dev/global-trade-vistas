import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Trash, EnvelopeOpen, Envelope } from "@phosphor-icons/react";
import { toast } from "sonner";

interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

const ContactMessageManager = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMessages((data as any) || []);
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (msg: ContactMessage) => {
    await supabase.from("contact_messages").update({ read: !msg.read } as any).eq("id", msg.id);
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    toast.success("Message deleted");
    if (selected?.id === id) setSelected(null);
    fetchMessages();
  };

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <p className="text-muted-foreground text-sm">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`glass rounded-xl p-4 cursor-pointer transition-all ${!msg.read ? "border-l-4 border-primary" : ""} ${selected?.id === msg.id ? "ring-2 ring-primary/30" : ""}`}
              onClick={() => setSelected(msg)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h4 className={`text-sm truncate ${!msg.read ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>
                    {msg.subject}
                  </h4>
                  <p className="text-xs text-muted-foreground">{msg.full_name} · {msg.email} · {format(new Date(msg.created_at), "MMM d, yyyy HH:mm")}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); toggleRead(msg); }} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground">
                    {msg.read ? <Envelope size={16} /> : <EnvelopeOpen size={16} />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive">
                    <Trash size={16} />
                  </button>
                </div>
              </div>
              {selected?.id === msg.id && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{msg.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessageManager;
