import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground font-body text-center p-6">
      <h1 className="text-6xl md:text-8xl font-heading mb-6 tracking-tighter">404</h1>
      <p className="text-xl md:text-2xl text-foreground/60 italic font-light mb-12 max-w-md">
        Dieser Pfad verliert sich im Nichts. Ein Fragment, das nie existierte.
      </p>
      <Link href="/" className="inline-flex items-center gap-3 text-sm tracking-widest uppercase hover:text-primary/70 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Zurück zur Sammlung
      </Link>
    </div>
  );
}
