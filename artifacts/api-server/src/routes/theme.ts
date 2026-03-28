import { Router, type IRouter } from "express";
import { db, themesTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { GenerateThemeBody, GetCurrentThemeResponse } from "@workspace/api-zod";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "dispatch2024";

const router: IRouter = Router();

const ARTIST_THEMES = [
  {
    artistName: "Egon Schiele",
    artistBio: "Österreichischer Expressionist (1890–1918), bekannt für seine intensiven, verzerrten Figurendarstellungen und rohe emotionale Kraft.",
    era: "Wiener Expressionismus",
    colorPrimary: "#8B1A1A",
    colorSecondary: "#2C1810",
    colorAccent: "#D4882A",
    colorBackground: "#0F0A06",
    colorText: "#E8D5B0",
    fontHeading: "Playfair Display",
    fontBody: "Crimson Text",
    artworkUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Egon_Schiele_-_Seated_Male_Nude_%28Self-Portrait%29_-_Google_Art_Project.jpg/800px-Egon_Schiele_-_Seated_Male_Nude_%28Self-Portrait%29_-_Google_Art_Project.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Egon_Schiele_-_Reclining_Woman_with_Green_Stockings_%28Adele_Harms%29_-_Google_Art_Project.jpg/800px-Egon_Schiele_-_Reclining_Woman_with_Green_Stockings_%28Adele_Harms%29_-_Google_Art_Project.jpg"
    ],
    artworkTitles: ["Sitzender männlicher Akt (Selbstportrait)", "Liegende Frau mit grünen Strümpfen"],
    moodDescription: "Roh, intensiv, unverhüllt. Jeder Strich ein Geständnis.",
  },
  {
    artistName: "Gustav Klimt",
    artistBio: "Österreichischer Symbolist (1862–1918), Meister des Jugendstils, bekannt für seine goldenen, ornamentalen Kompositionen.",
    era: "Wiener Jugendstil",
    colorPrimary: "#C9A84C",
    colorSecondary: "#1A0F2E",
    colorAccent: "#E8C547",
    colorBackground: "#0D0A1A",
    colorText: "#F0E6C8",
    fontHeading: "Cormorant Garamond",
    fontBody: "EB Garamond",
    artworkUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Gustav_Klimt_016.jpg/800px-Gustav_Klimt_016.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/800px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg"
    ],
    artworkTitles: ["Judith I", "Der Kuss"],
    moodDescription: "Gold und Schatten. Begehren in Ornament verwandelt.",
  },
  {
    artistName: "Jean-Michel Basquiat",
    artistBio: "Amerikanischer Neo-Expressionist (1960–1988), aufgewachsen in Brooklyn, transformierte Straßenkunst in museale Kraft.",
    era: "Neo-Expressionismus",
    colorPrimary: "#FF2D00",
    colorSecondary: "#1A1A1A",
    colorAccent: "#FFD700",
    colorBackground: "#111111",
    colorText: "#EEEEEE",
    fontHeading: "Space Grotesk",
    fontBody: "IBM Plex Mono",
    artworkUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Jean-Michel_Basquiat%2C_Untitled%2C_1982.jpg/800px-Jean-Michel_Basquiat%2C_Untitled%2C_1982.jpg"
    ],
    artworkTitles: ["Untitled (1982)"],
    moodDescription: "Anarchisch, dringend, aufgeladen. Kein Leerzeichen ohne Absicht.",
  },
  {
    artistName: "Caspar David Friedrich",
    artistBio: "Deutscher Romantiker (1774–1840), Meister der Stimmungslandschaft und des erhabenen Naturerlebnisses.",
    era: "Deutsche Romantik",
    colorPrimary: "#4A6FA5",
    colorSecondary: "#1B2A3B",
    colorAccent: "#C8A96E",
    colorBackground: "#0A1520",
    colorText: "#D4C5A9",
    fontHeading: "Libre Baskerville",
    fontBody: "Lora",
    artworkUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg/800px-Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Caspar_David_Friedrich_-_Das_Eismeer_-_Hamburger_Kunsthalle_-_02.jpg/800px-Caspar_David_Friedrich_-_Das_Eismeer_-_Hamburger_Kunsthalle_-_02.jpg"
    ],
    artworkTitles: ["Wanderer über dem Nebelmeer", "Das Eismeer"],
    moodDescription: "Einsamkeit als Weite. Der Rücken zur Welt, das Gesicht zum Abgrund.",
  },
  {
    artistName: "Frida Kahlo",
    artistBio: "Mexikanische Malerin (1907–1954), deren Selbstporträts Schmerz, Identität und Körper mit surrealer Präzision verhandeln.",
    era: "Magischer Realismus / Surrealismus",
    colorPrimary: "#8B0000",
    colorSecondary: "#1A3A1A",
    colorAccent: "#FFB347",
    colorBackground: "#0F1A0A",
    colorText: "#F5E6C8",
    fontHeading: "Abril Fatface",
    fontBody: "Merriweather",
    artworkUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/800px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg"
    ],
    artworkTitles: ["Frida Kahlo (Photograph, 1932)"],
    moodDescription: "Schmerz in Blüten verwandelt. Jedes Bild ein Körper.",
  },
  {
    artistName: "Mark Rothko",
    artistBio: "Lettisch-amerikanischer Maler (1903–1970), Pionier des abstrakten Expressionismus mit seinen meditativen Farbfeldgemälden.",
    era: "Abstrakter Expressionismus",
    colorPrimary: "#8B2500",
    colorSecondary: "#1A0A00",
    colorAccent: "#C85A00",
    colorBackground: "#0D0500",
    colorText: "#E8C8A0",
    fontHeading: "Playfair Display",
    fontBody: "Source Serif 4",
    artworkUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/No._61_%28Rust_and_Blue%29_%5BMark_Rothko%5D.jpg/800px-No._61_%28Rust_and_Blue%29_%5BMark_Rothko%5D.jpg"
    ],
    artworkTitles: ["No. 61 (Rust and Blue)"],
    moodDescription: "Stille, die brennt. Farbe als Emotion ohne Form.",
  },
  {
    artistName: "Piet Mondrian",
    artistBio: "Niederländischer Maler (1872–1944), Begründer des De Stijl, der Reduktion auf Linie, Fläche und Primärfarben.",
    era: "De Stijl / Konstruktivismus",
    colorPrimary: "#CC0000",
    colorSecondary: "#003399",
    colorAccent: "#FFCC00",
    colorBackground: "#F5F5F0",
    colorText: "#111111",
    fontHeading: "Bebas Neue",
    fontBody: "Work Sans",
    artworkUrls: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg/800px-Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg"
    ],
    artworkTitles: ["Komposition II in Rot, Blau und Gelb"],
    moodDescription: "Ordnung als Befreiung. Das Raster ist das Gedicht.",
  },
];

function getRandomTheme() {
  return ARTIST_THEMES[Math.floor(Math.random() * ARTIST_THEMES.length)];
}

async function ensureThemeExists() {
  const themes = await db.select().from(themesTable).orderBy(desc(themesTable.activeFrom)).limit(1);
  if (themes.length === 0) {
    const themeData = getRandomTheme();
    await db.insert(themesTable).values(themeData);
  }
}

router.get("/theme", async (_req, res) => {
  await ensureThemeExists();
  const [theme] = await db.select().from(themesTable).orderBy(desc(themesTable.activeFrom)).limit(1);
  res.json({
    ...theme,
    activeFrom: theme.activeFrom.toISOString(),
    artworkUrls: theme.artworkUrls ?? [],
    artworkTitles: theme.artworkTitles ?? [],
  });
});

router.post("/theme/generate", async (req, res) => {
  const body = GenerateThemeBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  if (body.data.adminPassword !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  let themeData;
  if (body.data.artistName) {
    themeData = ARTIST_THEMES.find(
      (t) => t.artistName.toLowerCase().includes(body.data.artistName!.toLowerCase())
    ) ?? getRandomTheme();
  } else {
    const current = await db.select().from(themesTable).orderBy(desc(themesTable.activeFrom)).limit(1);
    let newTheme = getRandomTheme();
    if (current.length > 0) {
      while (newTheme.artistName === current[0].artistName && ARTIST_THEMES.length > 1) {
        newTheme = getRandomTheme();
      }
    }
    themeData = newTheme;
  }

  const [theme] = await db.insert(themesTable).values(themeData).returning();

  res.json({
    ...theme,
    activeFrom: theme.activeFrom.toISOString(),
    artworkUrls: theme.artworkUrls ?? [],
    artworkTitles: theme.artworkTitles ?? [],
  });
});

export default router;
