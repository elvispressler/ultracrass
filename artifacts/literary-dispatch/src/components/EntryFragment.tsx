import { Entry, EntryType } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { cn, formatDate } from "@/lib/utils";

const typeLabels: Record<string, string> = {
  [EntryType.diary]: "Tagebuch",
  [EntryType.observation]: "Beobachtung",
  [EntryType.quote]: "Zitat",
  [EntryType.comment]: "Kommentar",
  [EntryType.literary]: "Literatur",
};

export function EntryFragment({ entry, index }: { entry: Entry; index: number }) {
  // Deterministic layout staggering based on ID
  const alignments = [
    "md:self-start md:ml-[5%] md:mr-auto",
    "md:self-center",
    "md:self-end md:mr-[5%] md:ml-auto",
    "md:self-start md:ml-[25%] md:mr-auto",
    "md:self-end md:mr-[20%] md:ml-auto"
  ];
  const alignClass = alignments[entry.id % alignments.length];
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ 
        duration: 1.2, 
        ease: [0.22, 1, 0.36, 1],
        delay: (index % 3) * 0.15 
      }}
      className={cn(
        "max-w-2xl w-full p-8 md:p-12 my-16 relative group",
        "border-l border-primary/20 bg-gradient-to-br from-background/40 to-transparent backdrop-blur-sm",
        "hover:border-primary/50 transition-colors duration-700",
        alignClass
      )}
    >
      <div className="absolute top-0 left-0 w-1 h-12 bg-primary/40 -translate-x-[1px] transition-transform duration-500 origin-top group-hover:scale-y-150" />
      
      <header className="mb-6 flex flex-col gap-2">
        <div className="flex items-center gap-4 text-xs tracking-[0.2em] uppercase text-primary/60 font-sans">
          <span>{typeLabels[entry.type] || entry.type}</span>
          <span className="w-8 h-[1px] bg-border" />
          <span>{formatDate(entry.createdAt)}</span>
        </div>
        
        {entry.title && (
          <h2 className="text-3xl md:text-4xl font-heading text-foreground mt-4 leading-snug">
            {entry.title}
          </h2>
        )}
        
        {entry.subject && (
          <h3 className="text-lg md:text-xl font-heading italic text-foreground/70 font-light mt-1">
            {entry.subject}
          </h3>
        )}
      </header>
      
      <div className="prose prose-invert prose-p:font-body prose-p:leading-relaxed prose-p:text-foreground/80 prose-p:font-light max-w-none whitespace-pre-wrap">
        {entry.content}
      </div>
    </motion.article>
  );
}
