import { DefaultSession, NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          firstName: profile.given_name || profile.name.split(' ')[0],
          lastName: profile.family_name || profile.name.split(' ').slice(1).join(' '),
          provider: 'google',
          googleId: profile.sub,
        }
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const customer = await prisma.customer.findUnique({
            where: { email: credentials.email }
          })

          if (!customer || !customer.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            customer.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: customer.id,
            email: customer.email,
            name: `${customer.firstName} ${customer.lastName}`,
            firstName: customer.firstName,
            lastName: customer.lastName,
            image: customer.image,
            provider: customer.provider,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.firstName = user.firstName ?? ''
        token.lastName = user.lastName ?? ''
        token.provider = user.provider ?? account?.provider ?? ''
        
        if (account?.provider === 'google') {
          // Crear o actualizar usuario de Google en nuestra base de datos
          const existingCustomer = await prisma.customer.findUnique({
            where: { email: user.email! }
          })

          if (!existingCustomer) {
            await prisma.customer.create({
              data: {
                id: user.id,
                email: user.email!,
                firstName: user.firstName || user.name?.split(' ')[0] || '',
                lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
                image: user.image,
                provider: 'google',
                googleId: user.id,
              }
            })
          } else if (!existingCustomer.googleId) {
            // Vincular cuenta existente con Google
            await prisma.customer.update({
              where: { id: existingCustomer.id },
              data: {
                googleId: user.id,
                provider: 'google',
                image: user.image,
              }
            })
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.provider = token.provider as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log('User signed in:', { user: user.email, provider: account?.provider })
    },
  },
}

declare module 'next-auth' {
  interface User {
    firstName?: string
    lastName?: string
    provider?: string
    googleId?: string
  }

  interface Session {
    user: {
      id: string
      firstName: string
      lastName: string
      provider: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    firstName: string
    lastName: string
    provider: string
  }
}
