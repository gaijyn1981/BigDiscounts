import { prisma } from "@/lib/db";

export async function generateUniqueSlug(title: string, existingId?: string): Promise<string> {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 60);

  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === existingId) break;
    slug = `${base}-${counter}`;
    counter++;
  }

  return slug;
}
