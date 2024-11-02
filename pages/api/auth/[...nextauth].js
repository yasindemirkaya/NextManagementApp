import axios from "/utils/axios"
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export default NextAuth({
    providers: [
        Credentials({
            async authorize(credentials) {
                try {
                    if (credentials.type === 'signin') {
                        // Giriş işlemi için gerekli kodlar burada olacak
                        const response = await axios.post('/public/login', {
                            email: credentials.email,
                            password: credentials.password,
                        })

                        if (response.message == 'Success') {
                            return {
                                id: response.user.id,
                                email: response.user.email,
                                first_name: response.user.first_name,
                                last_name: response.user.last_name,
                                token: response.token,
                            }
                        } else {
                            return null
                        }
                    } else if (credentials.type === 'signup') {
                        // Kayıt işlemi için gerekli kodlar burada olacak
                        const response = await axios.post('/public/register', {
                            email: credentials.email,
                            password: credentials.password,
                            username: credentials.username
                        })
                        if (response.message == 'Success') {
                            return {
                                name: response.data
                            }
                        } else {
                            return null
                        }
                    } else {
                        return null
                    }
                } catch (error) {
                    console.error('Error fetching user:', error)
                    return null
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.first_name = user.first_name;
                token.last_name = user.last_name;
                token.token = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                id: token.id,
                email: token.email,
                first_name: token.first_name,
                last_name: token.last_name,
            };
            session.token = token.token;
            return session;
        },
    }
})