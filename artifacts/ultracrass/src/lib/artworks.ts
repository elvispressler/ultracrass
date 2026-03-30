export interface Artwork {
  url: string;
  artist: string;
  title: string;
  year: string;
}

export const artworks: Artwork[] = [
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/0/04/Apollo_Max_Beckmann.jpg",
    artist: "Max Beckmann",
    title: "Apollo",
    year: "1924",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/6/6c/MAX-BECKMANN_BILDNIS-MINNA-BECKMANN-TUBE_CC-BY-SA_BSTGS_14368.jpg",
    artist: "Max Beckmann",
    title: "Bildnis Minna Beckmann-Tube",
    year: "1924",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e5/MAX-BECKMANN_SEE-BEI-MONDSCHEIN_CC-BY-SA_BSTGS_13472.jpg",
    artist: "Max Beckmann",
    title: "See bei Mondschein",
    year: "1946",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/4/43/Centre_Pompidou_Femme_au_miroir_Ernst_Ludwig_Kirchner.jpg",
    artist: "Ernst Ludwig Kirchner",
    title: "Femme au miroir",
    year: "1912",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/a/af/Ernst_Ludwig_Kirchner_Leuchtturm_hinter_Bucht_1912.jpg",
    artist: "Ernst Ludwig Kirchner",
    title: "Leuchtturm hinter Bucht",
    year: "1912",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/0/05/Ernst_Ludwig_Kirchner_-_Figurenbild_%28Bundesfeuer%29.jpg",
    artist: "Ernst Ludwig Kirchner",
    title: "Figurenbild (Bundesfeuer)",
    year: "1913",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/f/fc/August_Macke_Sonniger_Garten_1908.jpg",
    artist: "August Macke",
    title: "Sonniger Garten",
    year: "1908",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/3/3c/1913_painting_by_Alexej_von_Jawlensky_-_Meditative_Woman.jpg",
    artist: "Alexej von Jawlensky",
    title: "Meditative Woman",
    year: "1913",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/6/62/Alexei_von_Jawlensky_-_Prophet_%28Sibyl%29_-_25-1992_-_Saint_Louis_Art_Museum.jpg",
    artist: "Alexej von Jawlensky",
    title: "Prophet (Sibyl)",
    year: "1923",
  },
];

export function pickArtwork(): Artwork {
  return artworks[Math.floor(Math.random() * artworks.length)];
}
