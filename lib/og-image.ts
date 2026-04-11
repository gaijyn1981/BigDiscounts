/**
 * Generate a dynamic OG image URL using Cloudinary transformations.
 * Overlays the price and BigDiscounts branding on the product photo.
 */
export function generateOgImageUrl(cloudinaryUrl: string, price: number, title: string): string {
  if (!cloudinaryUrl || !cloudinaryUrl.includes('cloudinary.com')) return cloudinaryUrl

  // Extract the base URL and public ID
  const uploadIndex = cloudinaryUrl.indexOf('/upload/')
  if (uploadIndex === -1) return cloudinaryUrl

  const baseUrl = cloudinaryUrl.substring(0, uploadIndex + 8) // includes /upload/
  const publicId = cloudinaryUrl.substring(uploadIndex + 8)

  // Build transformation string:
  // - Resize to 1200x630 (standard OG size)
  // - Dark overlay for readability
  // - Price badge bottom-left
  // - BigDiscounts branding top-right
  const priceText = `%C2%A3${price.toFixed(2).replace('.', '%2E')}`
  const titleShort = encodeURIComponent(title.substring(0, 40).replace(/[,]/g, ''))

  const transforms = [
    'w_1200,h_630,c_fill,g_center',
    'e_brightness:-20',
    `l_text:Arial_52_bold:${priceText},co_rgb:fcd968,g_south_west,x_40,y_40`,
    `l_text:Arial_28:BigDiscounts.uk,co_rgb:ffffff,g_north_east,x_40,y_40`,
  ].join('/')

  return `${baseUrl}${transforms}/${publicId}`
}
