import { jwtDecode } from "jwt-decode"
import { isTokenExpiredClient } from "./tokenVerifier"

export const isSuperAdmin = (token) => {
    if (token && !isTokenExpiredClient(token)) {
        const decoded = jwtDecode(token)

        if (decoded.role == 2) {
            return true
        } else {
            return false
        }
    }
}

export const isAdmin = (token) => {
    if (token && !isTokenExpiredClient(token)) {
        const decoded = jwtDecode(token)

        if (decoded.role == 1) {
            return true
        } else {
            return false
        }
    }
}

export const isStandardUser = (token) => {
    if (token && !isTokenExpiredClient(token)) {
        const decoded = jwtDecode(token)

        if (decoded.role == 0) {
            return true
        } else {
            return false
        }
    }
}

// Eğer kullanıcı profil componentında kendini görüyorsa diye kontrol edebilmek için helper
export const isSelf = (token, otherId) => {
    if (token && !isTokenExpiredClient(token)) {
        const decoded = jwtDecode(token)
        const ownId = decoded.id

        if (ownId === otherId) {
            return true
        } else {
            return false
        }
    }
}