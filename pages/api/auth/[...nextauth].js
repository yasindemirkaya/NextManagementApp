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
                        console.log(response)

                        if (response.message == 'Success') {
                            return {
                                user: response.user,
                                message: response.message,
                                token: response.token
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
})