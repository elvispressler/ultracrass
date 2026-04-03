export interface Artwork {
  file: string;
  artist: string;
  title: string;
  year: string;
}

export function getArtworkUrl(file: string): string {
  return `${import.meta.env.BASE_URL}artworks/${file}`;
}

export const artworks: Artwork[] = [
  {
    file: "beckmann-apollo.jpg",
    artist: "Max Beckmann",
    title: "Apollo",
    year: "1924",
  },
  {
    file: "jawlensky-meditative.jpg",
    artist: "Alexej von Jawlensky",
    title: "Meditative Woman",
    year: "1913",
  },
  {
    file: "jawlensky-prophet.jpg",
    artist: "Alexej von Jawlensky",
    title: "Prophet (Sibyl)",
    year: "1923",
  },
];

export function pickArtwork(): Artwork {
  return artworks[Math.floor(Math.random() * artworks.length)];
}
