import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Try seller first
        const seller = await prisma.seller.findUnique({
          where: { email: credentials.email }
        })
        if (seller) {
          const valid = await bcrypt.compare(credentials.password, seller.password)
          if (!valid) return null
          return { id: seller.id, email: seller.email, name: seller.companyName, role: 'seller' }
        }

        // Try buyer
        const buyer = await prisma.buyer.findUnique({
          where: { email: credentials.email }
        })
        if (buyer) {
          const valid = await bcrypt.compare(credentials.password, buyer.password)
          if (!valid) return null
          return { id: buyer.id, email: buyer.email, name: buyer.name, role: 'buyer' }
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id
      }
      return session
    }
  },
  pages: {
    signIn: '/login'
  },
  session: { strategy: 'jwt' }
})

export { handler as GET, handler as POST }
