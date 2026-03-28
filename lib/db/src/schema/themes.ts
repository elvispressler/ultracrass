import { pgTable, text, serial, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const themesTable = pgTable("artist_themes", {
  id: serial("id").primaryKey(),
  artistName: text("artist_name").notNull(),
  artistBio: text("artist_bio").notNull(),
  era: text("era").notNull(),
  colorPrimary: text("color_primary").notNull(),
  colorSecondary: text("color_secondary").notNull(),
  colorAccent: text("color_accent").notNull(),
  colorBackground: text("color_background").notNull(),
  colorText: text("color_text").notNull(),
  fontHeading: text("font_heading").notNull(),
  fontBody: text("font_body").notNull(),
  artworkUrls: json("artwork_urls").$type<string[]>().notNull().default([]),
  artworkTitles: json("artwork_titles").$type<string[]>().notNull().default([]),
  moodDescription: text("mood_description").notNull(),
  activeFrom: timestamp("active_from").notNull().defaultNow(),
});

export const insertThemeSchema = createInsertSchema(themesTable).omit({ id: true, activeFrom: true });
export type InsertTheme = z.infer<typeof insertThemeSchema>;
export type Theme = typeof themesTable.$inferSelect;
