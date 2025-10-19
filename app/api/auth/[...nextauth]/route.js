import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin@techandthecity.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check against environment variables
        if (
          credentials.username === process.env.ADMIN_USER &&
          credentials.password === process.env.ADMIN_PASS
        ) {
          return {
            id: 1,
            name: "Admin",
            email: process.env.ADMIN_USER,
          };
        }
        
        // Return null if authentication fails
        return null;
      },
    }),
  ],
  
  // Custom pages
  pages: {
    signIn: "/admin-TC25", // Your custom login page
  },
  
  // Callbacks
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
  
  // Session configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Secret for JWT encryption
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

