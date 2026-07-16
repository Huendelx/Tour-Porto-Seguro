import { MetadataRoute } from "next";
import { getAllTours } from "@/lib/tours-data";

const BASE = "https://passeador.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tours = await getAllTours();
  const tourRoutes = tours.map((t) => ({
    url: `${BASE}/passeios/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const destinoSlugs = ["porto-seguro", "arraial-da-ajuda", "trancoso", "caraiva", "praia-do-espelho"];
  const destinoRoutes = destinoSlugs.map((slug) => ({
    url: `${BASE}/destinos/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/buscar`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...destinoRoutes,
    ...tourRoutes,
  ];
}
