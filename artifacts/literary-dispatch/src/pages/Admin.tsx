import { useState, useEffect } from "react";
import { 
  useListEntries, 
  useCreateEntry, 
  useDeleteEntry, 
  useGenerateTheme,
  useVerifyPassword,
  getListEntriesQueryKey,
  getGetCurrentThemeQueryKey,
  CreateEntryInputType
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, KeyRound, Palette, Plus, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Admin() {
  const queryClient = useQueryClient();
  const [password, setPassword] = useState(localStorage.getItem("adminPassword") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const verifyMut = useVerifyPassword();

  useEffect(() => {
    if (password) {
      handleAuth(password);
    }
  }, []);

  const handleAuth = async (pwd: string) => {
    try {
      const res = await verifyMut.mutateAsync({ data: { password: pwd } });
      if (res.valid) {
        setIsAuthenticated(true);
        localStorage.setItem("adminPassword", pwd);
        setAuthError("");
      } else {
        setAuthError("Passwort inkorrekt.");
        localStorage.removeItem("adminPassword");
      }
    } catch (err) {
      setAuthError("Verbindungsfehler.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 border border-border bg-background/50 backdrop-blur-md shadow-2xl"
        >
          <div className="flex flex-col items-center text-center gap-6 mb-8">
            <KeyRound className="w-8 h-8 text-primary/50" strokeWidth={1} />
            <h1 className="text-2xl font-heading">Archivzugang</h1>
          </div>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              handleAuth(fd.get("password") as string);
            }}
            className="flex flex-col gap-4"
          >
            <Input 
              type="password" 
              name="password" 
              placeholder="Passwort eingeben..." 
              className="text-center tracking-widest font-mono"
            />
            {authError && <p className="text-destructive text-sm text-center">{authError}</p>}
            <Button type="submit" isLoading={verifyMut.isPending} className="mt-4">
              Eintreten
            </Button>
            <Link href="/" className="text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-primary mt-4 transition-colors">
              Zurück
            </Link>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-xl font-heading tracking-widest uppercase">Atelier & Archiv</h1>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-sans tracking-widest uppercase text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </Link>
            <button 
              onClick={() => {
                localStorage.removeItem("adminPassword");
                setIsAuthenticated(false);
                setPassword("");
              }}
              className="text-xs uppercase tracking-widest text-destructive hover:text-destructive/80 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5 space-y-16">
          <ThemeControlPanel password={password} />
          <CreateEntryForm password={password} />
        </div>
        
        <div className="lg:col-span-7">
          <EntriesList password={password} />
        </div>
      </main>
    </div>
  );
}

function ThemeControlPanel({ password }: { password: string }) {
  const queryClient = useQueryClient();
  const generateMut = useGenerateTheme({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCurrentThemeQueryKey() })
    }
  });

  const handleGenerate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const artistName = fd.get("artistName") as string;
    generateMut.mutate({
      data: {
        adminPassword: password,
        ...(artistName ? { artistName } : {})
      }
    });
  };

  return (
    <section className="p-8 border border-border/50 bg-secondary/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Palette className="w-32 h-32" />
      </div>
      <h2 className="text-sm uppercase tracking-[0.2em] font-sans text-primary/60 mb-6 flex items-center gap-3">
        <Palette className="w-4 h-4" />
        Ausstellungskonzept
      </h2>
      <form onSubmit={handleGenerate} className="flex flex-col gap-4 relative z-10">
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">
            Spezifischer Künstler (Optional)
          </label>
          <Input name="artistName" placeholder="z.B. Egon Schiele" />
        </div>
        <Button variant="outline" type="submit" isLoading={generateMut.isPending} className="mt-2 w-full">
          Neues Konzept generieren
        </Button>
      </form>
    </section>
  );
}

function CreateEntryForm({ password }: { password: string }) {
  const queryClient = useQueryClient();
  const createMut = useCreateEntry({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListEntriesQueryKey() });
        (document.getElementById("create-entry-form") as HTMLFormElement)?.reset();
      }
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createMut.mutate({
      data: {
        title: fd.get("title") as string,
        subject: fd.get("subject") as string,
        content: fd.get("content") as string,
        type: fd.get("type") as typeof CreateEntryInputType[keyof typeof CreateEntryInputType],
        adminPassword: password
      }
    });
  };

  return (
    <section className="p-8 border border-border/50 bg-secondary/5 relative">
      <h2 className="text-sm uppercase tracking-[0.2em] font-sans text-primary/60 mb-6 flex items-center gap-3">
        <Plus className="w-4 h-4" />
        Neuer Eintrag
      </h2>
      <form id="create-entry-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Format</label>
          <select 
            name="type" 
            required
            className="flex h-12 w-full border-b border-border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary appearance-none cursor-pointer"
          >
            <option value="diary">Tagebuch</option>
            <option value="observation">Beobachtung</option>
            <option value="quote">Zitat</option>
            <option value="comment">Kommentar</option>
            <option value="literary">Literatur</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Titel (Optional)</label>
          <Input name="title" placeholder="Der stille Raum" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Betreff / Untertitel (Optional)</label>
          <Input name="subject" placeholder="Gedanken zum Morgen" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Inhalt *</label>
          <Textarea name="content" required placeholder="Es war einmal..." className="min-h-[200px]" />
        </div>
        <Button type="submit" isLoading={createMut.isPending} className="mt-4">
          Veröffentlichen
        </Button>
      </form>
    </section>
  );
}

function EntriesList({ password }: { password: string }) {
  const { data: entries, isLoading } = useListEntries();
  const queryClient = useQueryClient();
  const deleteMut = useDeleteEntry({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListEntriesQueryKey() })
    },
    // Adding it via request options to ensure it passes through if api client uses it
    request: {
      headers: {
        'Authorization': `Bearer ${password}`,
        'X-Admin-Password': password
      }
    }
  });

  if (isLoading) return <div className="animate-pulse flex flex-col gap-4"><div className="h-24 bg-secondary/20" /><div className="h-24 bg-secondary/20" /></div>;

  const sortedEntries = entries ? [...entries].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ) : [];

  return (
    <section>
      <h2 className="text-sm uppercase tracking-[0.2em] font-sans text-primary/60 mb-6 border-b border-border/50 pb-4">
        Gesammelte Werke ({sortedEntries.length})
      </h2>
      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {sortedEntries.map((entry) => (
            <motion.div 
              key={entry.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              className="p-6 border border-border/30 hover:border-border transition-colors bg-secondary/5 group flex justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-muted-foreground mb-2">
                  <span>{entry.type}</span>
                  <span className="w-4 h-[1px] bg-border" />
                  <span>{formatDate(entry.createdAt)}</span>
                </div>
                <h3 className="font-heading text-lg truncate">
                  {entry.title || <span className="text-muted-foreground italic">Ohne Titel</span>}
                </h3>
                <p className="text-sm text-foreground/60 line-clamp-2 mt-2 font-body font-light">
                  {entry.content}
                </p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm("Wirklich unwiderruflich löschen?")) {
                    deleteMut.mutate({ id: entry.id });
                  }
                }}
                disabled={deleteMut.isPending}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                title="Löschen"
              >
                <Trash2 className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {sortedEntries.length === 0 && (
          <p className="text-center text-muted-foreground italic py-12">Die Sammlung ist leer.</p>
        )}
      </div>
    </section>
  );
}
