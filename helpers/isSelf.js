import { jwtDecode } from "jwt-decode"
import { isTokenExpiredClient } from "./tokenVerifier"

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