// Kullanıcının kendini mi düzenlediğini yoksa bir başka profili mi düzenlediğini tespit etmek için kullanılan helper
export const isSelf = (userId, otherId) => {
    if (userId === otherId) {
        return true
    } else {
        return false
    }
}