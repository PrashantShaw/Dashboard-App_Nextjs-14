import type { NextAuthConfig, Session } from 'next-auth';
import { NextRequest } from 'next/server';

type ProtectedRoutesCallbackParams = {
    request: NextRequest;
    auth: Session | null;
}

const protectedRoutesCallback = ({ auth, request: { nextUrl } }: ProtectedRoutesCallbackParams) => {
    const isLoggedIn = !!auth?.user;
    const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')

    if (isOnDashboard) {
        if (isLoggedIn) return true; // true: stay on the current page
        return false; // false: Redirect unauthenticated users to login page
    } else if (isLoggedIn) {
        const dashboardUrl = new URL('/dashboard', nextUrl)
        return Response.redirect(dashboardUrl);
    }
    return true // true: stay on the current page
}

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/login', //the user will be redirected to this app's login page, rather than the NextAuth.js default page.
    },
    callbacks: {
        authorized: protectedRoutesCallback, // Invoked when a user needs authorization, using Middleware.
    },
    providers: [], // will be populated from @/app/auth.ts
};