import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CategoryClient from './CategoryClient'

const categoryData: Record<string, { meta_title: string; meta_desc: string; h1: string; description: string }> = {
  "Electronics & Tech": {
    meta_title: "Electronics & Tech Products from UK Sellers | BigDiscounts",
    meta_desc: "Browse electronics and tech products from UK sellers on BigDiscounts. Direct contact, competitive prices, no buyer fees.",
    h1: "Electronics & Tech Products from UK Sellers",
    description: "Discover a wide range of electronics and technology products listed by UK sellers on BigDiscounts. From gadgets and smart home devices to computers, accessories, and audio equipment, our electronics category connects buyers directly with UK businesses offering competitive prices. Unlike traditional retail platforms, BigDiscounts charges sellers a simple £1/month fee with zero commission, meaning you benefit from fairer pricing and direct communication with the seller. Browse the latest tech listings, contact sellers directly, and buy with confidence from UK-based businesses."
  },
  "Phone & Accessories": {
    meta_title: "Phone & Accessories from UK Sellers | BigDiscounts",
    meta_desc: "Shop phone accessories and mobile products from UK sellers on BigDiscounts. No buyer fees, direct contact with sellers.",
    h1: "Phone & Accessories from UK Sellers",
    description: "Find mobile phones, cases, chargers, screen protectors, and all kinds of phone accessories listed by UK sellers on BigDiscounts. Whether you are looking for the latest smartphone accessories or replacement parts, our Phone & Accessories category brings together UK businesses offering direct sales with no platform commission. Buyers can browse listings, compare prices, and contact sellers directly — cutting out the middleman and ensuring a transparent, straightforward purchase. All sellers on BigDiscounts are UK-based, giving you confidence in every transaction."
  },
  "Clothing & Fashion": {
    meta_title: "Clothing & Fashion from UK Sellers | BigDiscounts Marketplace",
    meta_desc: "Shop clothing and fashion from UK sellers on BigDiscounts. Independent brands, direct contact, no buyer fees.",
    h1: "Clothing & Fashion from UK Sellers",
    description: "Browse clothing, fashion, and accessories from UK sellers and businesses on BigDiscounts. From everyday wardrobe staples to seasonal collections and unique styles, our Clothing & Fashion category features listings from UK retailers and brands selling directly to buyers. BigDiscounts was built to support UK sellers of all sizes — from small fashion labels to established retailers — by offering a fair £1/month listing fee with zero commission. Shop direct, enjoy transparent pricing, and connect with UK fashion sellers without paying inflated platform fees."
  },
  "Home & Living": {
    meta_title: "Home & Living Products from UK Sellers | BigDiscounts",
    meta_desc: "Discover home and living products from UK sellers on BigDiscounts. Furniture, decor, and homeware at fair prices.",
    h1: "Home & Living Products from UK Sellers",
    description: "Explore home décor, furniture, kitchenware, soft furnishings, and everyday homeware from UK sellers on BigDiscounts. Whether you are refreshing a room or searching for a specific item, our Home & Living category connects you directly with UK businesses offering a broad range of products at competitive prices. Sellers on BigDiscounts keep 100% of every sale, which means better value for buyers and a more direct relationship between you and the people behind the products. Browse listings, ask questions directly, and buy with confidence."
  },
  "Garden & Outdoor": {
    meta_title: "Garden & Outdoor Products from UK Sellers | BigDiscounts",
    meta_desc: "Browse garden and outdoor products from UK sellers on BigDiscounts. Tools, furniture, plants and more at fair prices.",
    h1: "Garden & Outdoor Products from UK Sellers",
    description: "Find garden tools, outdoor furniture, planters, seeds, barbecues, and everything you need for your outdoor space from UK sellers on BigDiscounts. Our Garden & Outdoor category brings together UK businesses selling directly to buyers — no unnecessary markups, no platform commission eating into seller margins. Whether you are a keen gardener or simply looking to improve your outdoor living space, BigDiscounts makes it easy to browse, compare, and contact sellers directly. All listings are from UK-based sellers committed to fair, transparent trading."
  },
  "Pets": {
    meta_title: "Pet Products from UK Sellers | BigDiscounts Marketplace",
    meta_desc: "Shop pet food, accessories, and supplies from UK sellers on BigDiscounts. Direct contact, no buyer fees.",
    h1: "Pet Products from UK Sellers",
    description: "Browse pet food, treats, toys, accessories, bedding, and supplies for dogs, cats, small animals, and more from UK sellers on BigDiscounts. Our Pets category connects pet owners directly with UK businesses and retailers offering a wide range of products at competitive prices. BigDiscounts was designed to support UK sellers of all sizes — meaning you get access to products from businesses that genuinely care about what they sell. Contact sellers directly, ask questions about products, and buy with the confidence of dealing with a real UK business."
  },
  "Baby & Kids": {
    meta_title: "Baby & Kids Products from UK Sellers | BigDiscounts",
    meta_desc: "Shop baby and kids products from UK sellers on BigDiscounts. Clothes, toys, accessories and more at fair prices.",
    h1: "Baby & Kids Products from UK Sellers",
    description: "Discover clothing, toys, nursery furniture, accessories, and everyday essentials for babies and children from UK sellers on BigDiscounts. Our Baby & Kids category features listings from UK businesses selling directly to parents and families, with no platform commission inflating prices. BigDiscounts connects buyers with sellers who take pride in the products they offer — giving you the opportunity to ask questions and buy directly from the source. Browse our growing selection of baby and children's products and support UK businesses at the same time."
  },
  "Health & Beauty": {
    meta_title: "Health & Beauty Products from UK Sellers | BigDiscounts",
    meta_desc: "Shop health and beauty products from UK sellers on BigDiscounts. Skincare, supplements, and more at fair prices.",
    h1: "Health & Beauty Products from UK Sellers",
    description: "Browse skincare, haircare, supplements, vitamins, beauty tools, and wellness products from UK sellers on BigDiscounts. Our Health & Beauty category brings together UK businesses offering a wide range of products directly to buyers — cutting out unnecessary intermediaries and keeping prices fair. Whether you are looking for everyday essentials or specialist wellness products, BigDiscounts makes it simple to find, compare, and contact UK sellers directly. All listings come from UK-based businesses committed to transparent pricing and direct communication with their customers."
  },
  "Toys & Games": {
    meta_title: "Toys & Games from UK Sellers | BigDiscounts Marketplace",
    meta_desc: "Shop toys and games from UK sellers on BigDiscounts. Board games, outdoor toys, and more at competitive prices.",
    h1: "Toys & Games from UK Sellers",
    description: "Find board games, outdoor toys, educational games, puzzles, action figures, and more from UK sellers on BigDiscounts. Our Toys & Games category features listings from UK businesses selling directly to buyers, with no commission charges keeping prices competitive. Whether you are shopping for a birthday gift or stocking up on family favourites, BigDiscounts makes it easy to browse UK toy sellers, contact them directly, and buy with confidence. Support UK businesses while finding great value on toys and games for all ages."
  },
  "Sports & Fitness": {
    meta_title: "Sports & Fitness Products from UK Sellers | BigDiscounts",
    meta_desc: "Shop sports and fitness equipment from UK sellers on BigDiscounts. Gym gear, outdoor sports, and more.",
    h1: "Sports & Fitness Products from UK Sellers",
    description: "Browse gym equipment, fitness accessories, sportswear, outdoor gear, and wellness products from UK sellers on BigDiscounts. Our Sports & Fitness category connects buyers directly with UK businesses offering competitive prices on a wide range of products. From home workout equipment to specialist sports accessories, BigDiscounts gives you access to UK sellers who are passionate about what they sell. Contact sellers directly, compare listings, and buy without paying inflated platform fees. All sellers on BigDiscounts are UK-based."
  },
  "Food & Drink": {
    meta_title: "Food & Drink Products from UK Sellers | BigDiscounts",
    meta_desc: "Shop food and drink products from UK sellers on BigDiscounts. Specialty foods, drinks, and more direct from UK businesses.",
    h1: "Food & Drink Products from UK Sellers",
    description: "Discover specialty foods, drinks, snacks, condiments, and artisan products from UK sellers and businesses on BigDiscounts. Our Food & Drink category brings together UK producers and retailers selling directly to buyers — with no commission charges and full transparency on pricing. Whether you are looking for everyday staples or unique specialty products, BigDiscounts connects you with UK food and drink businesses committed to quality and fair trading. Browse listings, contact sellers directly, and enjoy buying from real UK businesses."
  },
  "Books & Stationery": {
    meta_title: "Books & Stationery from UK Sellers | BigDiscounts Marketplace",
    meta_desc: "Shop books and stationery from UK sellers on BigDiscounts. Notebooks, pens, educational books and more.",
    h1: "Books & Stationery from UK Sellers",
    description: "Browse books, notebooks, pens, planners, art supplies, and stationery products from UK sellers on BigDiscounts. Our Books & Stationery category features listings from UK businesses selling directly to buyers at competitive prices. Whether you are a student, professional, or hobbyist, BigDiscounts makes it easy to find quality stationery and reading materials from UK sellers who are passionate about their products. Contact sellers directly, compare options, and buy without unnecessary fees. All listings come from UK-based businesses."
  },
  "Tools & DIY": {
    meta_title: "Tools & DIY Products from UK Sellers | BigDiscounts",
    meta_desc: "Shop tools and DIY supplies from UK sellers on BigDiscounts. Power tools, hand tools, and home improvement products.",
    h1: "Tools & DIY Products from UK Sellers",
    description: "Find power tools, hand tools, fixings, home improvement supplies, and DIY essentials from UK sellers on BigDiscounts. Our Tools & DIY category connects buyers directly with UK businesses offering competitive prices on a broad range of products. Whether you are a professional tradesperson or a weekend DIY enthusiast, BigDiscounts gives you access to UK sellers with the tools and supplies you need. Browse listings, contact sellers directly, and buy with confidence from real UK businesses committed to fair, transparent pricing."
  },
  "Automotive": {
    meta_title: "Automotive Products from UK Sellers | BigDiscounts Marketplace",
    meta_desc: "Shop car accessories, parts, and automotive products from UK sellers on BigDiscounts. Direct contact, competitive prices.",
    h1: "Automotive Products from UK Sellers",
    description: "Browse car accessories, cleaning products, spare parts, tools, and automotive essentials from UK sellers on BigDiscounts. Our Automotive category brings together UK businesses selling directly to buyers — cutting out unnecessary platform fees and keeping prices competitive. Whether you are maintaining your vehicle, upgrading accessories, or searching for a specific part, BigDiscounts makes it straightforward to find UK automotive sellers, compare listings, and contact them directly. All sellers are UK-based, giving you confidence in every purchase."
  },
  "Arts & Crafts": {
    meta_title: "Arts & Crafts Supplies from UK Sellers | BigDiscounts",
    meta_desc: "Shop arts and crafts supplies from UK sellers on BigDiscounts. Paints, fabrics, tools, and more at fair prices.",
    h1: "Arts & Crafts Supplies from UK Sellers",
    description: "Discover paints, canvases, fabrics, sewing supplies, craft tools, and creative materials from UK sellers on BigDiscounts. Our Arts & Crafts category features listings from UK businesses and makers selling directly to buyers, with no commission charges keeping prices fair. Whether you are a professional artist, a hobbyist, or looking for craft supplies for a project, BigDiscounts connects you with UK sellers who understand their products. Browse listings, contact sellers directly, and support UK arts and crafts businesses."
  },
  "Office & Business": {
    meta_title: "Office & Business Products from UK Sellers | BigDiscounts",
    meta_desc: "Shop office and business supplies from UK sellers on BigDiscounts. Furniture, stationery, tech and more.",
    h1: "Office & Business Products from UK Sellers",
    description: "Browse office furniture, business supplies, technology, and workplace essentials from UK sellers on BigDiscounts. Our Office & Business category connects buyers directly with UK businesses offering competitive prices on products designed for professional environments. Whether you are equipping a home office or sourcing supplies for a larger workspace, BigDiscounts makes it easy to find UK sellers, compare listings, and purchase directly. All sellers on BigDiscounts are UK-based, and our transparent £1/month fee model means better value for everyone."
  },
  "Gifts & Seasonal": {
    meta_title: "Gifts & Seasonal Products from UK Sellers | BigDiscounts",
    meta_desc: "Shop gifts and seasonal products from UK sellers on BigDiscounts. Unique gifts, decorations, and seasonal items.",
    h1: "Gifts & Seasonal Products from UK Sellers",
    description: "Find unique gifts, seasonal decorations, occasion products, and thoughtful presents from UK sellers on BigDiscounts. Our Gifts & Seasonal category brings together UK businesses offering a wide range of gift ideas for all occasions — birthdays, Christmas, anniversaries, and more. BigDiscounts connects buyers directly with UK sellers, allowing for personal communication and the kind of service you would expect from a real business. Browse listings, contact sellers directly, and find the perfect gift from a UK business that cares about its customers."
  },
  "Cleaning & Household": {
    meta_title: "Cleaning & Household Products from UK Sellers | BigDiscounts",
    meta_desc: "Shop cleaning and household products from UK sellers on BigDiscounts. Everyday essentials at competitive prices.",
    h1: "Cleaning & Household Products from UK Sellers",
    description: "Browse cleaning products, household essentials, laundry supplies, and home maintenance items from UK sellers on BigDiscounts. Our Cleaning & Household category features listings from UK businesses selling directly to buyers at competitive prices. Whether you are stocking up on everyday essentials or looking for specialist cleaning products, BigDiscounts makes it easy to find UK sellers, compare options, and contact them directly. All sellers on BigDiscounts are UK-based, and our transparent pricing model means you always know exactly what you are paying."
  },
  "Other": {
    meta_title: "Products from UK Sellers | BigDiscounts Marketplace",
    meta_desc: "Browse a wide range of products from UK sellers on BigDiscounts. Direct contact, no buyer fees, transparent pricing.",
    h1: "Products from UK Sellers on BigDiscounts",
    description: "Explore a wide variety of products from UK sellers and businesses on BigDiscounts. Our marketplace supports sellers of all kinds — from niche specialists to multi-category retailers — offering buyers direct access to UK businesses at fair, transparent prices. BigDiscounts charges sellers a simple £1/month listing fee with zero commission, meaning better value for buyers and a fairer deal for sellers. Browse all available listings, contact sellers directly, and discover what UK businesses have to offer across a broad range of categories."
  }
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const name = decodeURIComponent(params.category)
  const data = categoryData[name]
  if (!data) return { title: 'BigDiscounts' }
  return {
    title: data.meta_title,
    description: data.meta_desc,
    alternates: { canonical: `https://www.bigdiscounts.uk/browse/${encodeURIComponent(name)}` }
  }
}

export async function generateStaticParams() {
  return Object.keys(categoryData).map(cat => ({ category: cat }))
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const name = decodeURIComponent(params.category)
  const data = categoryData[name]
  if (!data) notFound()
  return <CategoryClient category={name} h1={data.h1} description={data.description} />
}
