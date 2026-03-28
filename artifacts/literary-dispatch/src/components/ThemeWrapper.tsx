import React, { useEffect, useState } from "react";
import { useGetCurrentTheme } from "@workspace/api-client-react";
import { applyDynamicTheme } from "@/lib/dynamic-theme";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { data: theme, isLoading } = useGetCurrentTheme();
  const [themeColors, setThemeColors] = useState<{
    bg: string; text: string; primary: string; accent: string;
  }>({ bg: "#0A1520", text: "#D4C5A9", primary: "#C8A96E", accent: "#C8A96E" });

  useEffect(() => {
    if (theme) {
      applyDynamicTheme(theme);
      setThemeColors({
        bg: theme.colorBackground,
        text: theme.colorText,
        primary: theme.colorPrimary,
        accent: theme.colorAccent,
      });
    }
  }, [theme]);

  return (
    <div
      className="min-h-screen noise-bg"
      style={{
        backgroundColor: themeColors.bg,
        color: themeColors.text,
        transition: "background-color 1.5s cubic-bezier(0.22,1,0.36,1), color 1s ease",
      }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: themeColors.bg, color: themeColors.text }}
          >
            <div className="flex flex-col items-center gap-6 opacity-40">
              <Loader2 className="w-8 h-8 animate-spin" strokeWidth={1} />
              <span className="uppercase tracking-[0.3em] text-xs font-light">Erschaffe Atmosphäre</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
