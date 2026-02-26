# CLAUDE.md — BigDiscounts.uk

This file documents the project structure and key information for AI-assisted development sessions.

## Project Overview

**BigDiscounts.uk** — A UK discount marketplace where sellers list products for £1/month with 0% commission. Buyers browse and contact sellers directly.

- **Live URL:** https://www.bigdiscounts.uk
- **Staging/Preview:** https://big-discounts.vercel.app
- **GitHub:** https://github.com/gaijyn1981/BigDiscounts
- **Gmail:** hello.bigdiscounts@gmail.com

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** Neon Postgres (via Prisma ORM)
- **Auth:** NextAuth.js
- **Payments:** Stripe (£1/month subscription)
- **Email:** Resend
- **Image uploads:** Cloudinary
- **Deployment:** Vercel (auto-deploys on push to main)
- **Local DB (dev):** SQLite (dev.db)

## Key Files

- app/page.tsx — Homepage
- app/sell/page.tsx — Seller landing page
- app/browse/page.tsx — Browse products
- app/layout.tsx — Root layout
- app/globals.css — Global styles
- lib/db.ts — Prisma client
- lib/auth.ts — NextAuth config
- lib/email.ts — Resend email helpers
- prisma/schema.prisma — Database schema
- middleware.ts — Route protection

## Design System

- Background: #0a0a0a (page), #111111 (sections), #1a1a1a (cards)
- Accent colour: #fcd968 (yellow)
- Text: white / gray-400 / gray-500
- Borders: #2a2a2a (standard), #fcd968 (highlighted)

## Deployment

Push to main branch — Vercel auto-deploys in ~1 minute.

git add .
git commit -m "your message"
git push origin main

## Business Logic

- Sellers register, verify email, pay £1/month via Stripe, listings go active
- Buyers browse freely, contact sellers via WhatsApp/phone/email
- No in-platform transactions — sellers handle payment directly
- Counters hidden on homepage until 50+ sellers
