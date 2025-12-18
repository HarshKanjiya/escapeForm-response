import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, account, profile }) {
            // Add Google user ID to the token
            if (account && profile) {
                token.googleId = profile.sub;
            }
            return token;
        },
        async session({ session, token }) {
            // Add Google user ID to the session
            if (session.user) {
                (session.user as any).googleId = token.googleId;
            }
            return session;
        },
    },
})

export { handler as GET, handler as POST }
