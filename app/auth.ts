import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { getUser } from '@/app/lib/data'
import bcrypt from 'bcrypt'

const authenticateLogin = async (
    credentials: Partial<Record<string, unknown>>,
    request: Request
) => {
    const parsedCredentials = z
        .object({
            email: z.string().email(),
            password: z.string().min(6)
        })
        .safeParse(credentials);

    if (parsedCredentials.success) {
        const { email, password: enteredPassword } = parsedCredentials.data;
        const user = await getUser(email);
        if (!user) return null;

        const isPasswordMatched = await bcrypt.compare(enteredPassword, user.password);
        if (isPasswordMatched) return user;
    }

    console.log('Invalid credentials');
    return null;
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            authorize: authenticateLogin //This method expects a User object to be returned for a successful login.
        }),
    ],
});