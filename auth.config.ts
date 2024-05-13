import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
    pages: {
        // https://nextjs.org/learn/dashboard-app/adding-authentication#adding-the-pages-option
        signIn: '/login',
    },
    callbacks: {
        authorized: ({ auth, request: { nextUrl } }) => {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
            // console.log('isOnDashboard :: ', isOnDashboard)
            // console.log('isLoggedIn :: ', isLoggedIn)
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true
        },
    },
    providers: [], // Add providers with an empty array for now
};