import { useListEntries, useGetCurrentTheme } from "@workspace/api-client-react";
import { EntryFragment } from "@/components/EntryFragment";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  const { data: theme } = useGetCurrentTheme();
  const { data: entries } = useListEntries();

  // Sort entries newest first
  const sortedEntries = entries ? [...entries].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ) : [];

  return (
    <main className="min-h-screen w-full flex flex-col relative pb-32">
      {/* Secret Admin Link */}
      <Link 
        href="/admin" 
        className="absolute top-8 right-8 z-50 text-xs tracking-widest uppercase opacity-0 hover:opacity-100 transition-opacity duration-500 font-sans p-4"
      >
        Archiv
      </Link>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] w-full flex items-end justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {theme?.artworkUrls?.[0] && (
            <motion.img
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.35 }}
              transition={{ duration: 2, ease: "easeOut" }}
              src={theme.artworkUrls[0]}
              alt={theme.artworkTitles?.[0] || "Artwork"}
              className="w-full h-full object-cover mix-blend-luminosity grayscale-[30%]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          className="relative z-10 p-8 md:p-16 max-w-5xl w-full text-center"
        >
          <div className="flex flex-col items-center gap-6">
            <span className="text-xs md:text-sm tracking-[0.4em] uppercase font-sans opacity-60"
              style={{ color: 'var(--theme-accent, var(--theme-primary))' }}>
              {theme?.era || "Gegenwart"}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading leading-none"
              style={{ color: 'var(--theme-text, #E8D5B0)' }}>
              {theme?.artistName || "Literary Dispatch"}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mt-4 font-light leading-relaxed italic opacity-70"
              style={{ color: 'var(--theme-text, #E8D5B0)', fontFamily: 'var(--theme-font-body)' }}>
              {theme?.moodDescription || "Fragmente, Beobachtungen und Gedanken im Raum verstreut."}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Entries Section */}
      <section className="relative z-20 flex flex-col px-4 md:px-12 max-w-7xl mx-auto w-full mt-12 md:mt-24">
        {sortedEntries.length === 0 ? (
          <div className="py-32 text-center text-foreground/40 font-heading italic text-xl">
            Noch keine Einträge vorhanden. Die Stille überwiegt.
          </div>
        ) : (
          sortedEntries.map((entry, index) => (
            <EntryFragment key={entry.id} entry={entry} index={index} />
          ))
        )}
      </section>
    </main>
  );
}
