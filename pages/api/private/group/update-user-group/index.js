// --------------------------------
// |
// | Service Name: Update User Group By ID
// | Description: Service that allows administrators to update user group details.
// | Parameters: id, group_name, description, type, is_active, group_leader
// | Endpoint: /api/private/user/update-user-group-by-id
// |
// ------------------------------
import sequelize from '@/config/db';
import { verify } from 'jsonwebtoken';
import privateMiddleware from '@/middleware/private/index'

// UserGroup'u ID'ye göre veritabanında bul
const findUserGroupById = async (id) => {
    const query = `SELECT * FROM user_groups WHERE id = ? LIMIT 1`;
    const [results] = await sequelize.query(query, {
        replacements: [id],
    });

    return results[0] || null; // Kullanıcı grubu bulunmazsa null döndür
};

// Kullanıcıyı ID'ye göre veritabanında bul
const findUserById = async (id) => {
    const query = `SELECT * FROM users WHERE id = ? LIMIT 1`;
    const [results] = await sequelize.query(query, {
        replacements: [id],
    });

    return results[0] || null; // Kullanıcı bulunmazsa null döndür
};

// ID'si gönderilen UserGroup'u güncelle
const updateUserGroupById = async (id, updateData) => {
    const fields = [];
    const replacements = [];

    // Güncellenebilir alanları dinamik olarak ekle
    Object.keys(updateData).forEach((key) => {
        if (key !== 'created_by') { // created_by güncellenmesin
            fields.push(`${key} = ?`);
            replacements.push(updateData[key]);
        }
    });

    // ID'yi replacements array'ine ekle
    replacements.push(id);

    const query = `
        UPDATE user_groups 
        SET ${fields.join(', ')}, updatedAt = NOW() 
        WHERE id = ?`;
    const [result] = await sequelize.query(query, { replacements });

    return result; // Değişiklik yapılıp yapılmadığını kontrol et
};

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        try {
            // Token decode et ve kullanıcı bilgilerini al
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = verify(token, process.env.JWT_SECRET);
            const { id: loggedInUserId, role: loggedInUserRole } = decoded;

            // Standard User'lar (role: 0) bu servisi kullanamaz
            if (loggedInUserRole === 0) {
                return res.status(403).json({
                    message: 'You are not authorized to access this service.',
                    code: 0
                });
            }

            // Request body ve id'yi alın
            const { id: requestedGroupId, ...updateData } = req.body;

            if (!requestedGroupId) {
                return res.status(200).json({
                    message: 'Group ID is required.',
                    code: 0
                });
            }

            // Güncellenen grubu bul
            const requestedGroup = await findUserGroupById(requestedGroupId);
            if (!requestedGroup) {
                return res.status(200).json({
                    message: 'Group not found.',
                    code: 0
                });
            }

            // Grubun içerisindeki created_by değerini kullanarak bu grubu kimin yarattığını bul.
            const creatorUser = await findUserById(requestedGroup.created_by);
            if (!creatorUser) {
                return res.status(200).json({
                    message: 'Creator user not found.',
                    code: 0
                });
            }


            // Eğer bu grup bir Super Admin tarafından oluşturulmuşsa, sadece o Super Admin bu grubu güncelleyebilir
            if (creatorUser.role === 2) {
                // Bir Admin, bir Super Admin tarafından oluşturulan bir grubu güncelleyemez.
                if (loggedInUserRole === 1 && creatorUser.role === 2) {
                    return res.status(200).json({
                        message: 'You are not authorized to update this group as it was created by a Super Admin.',
                        code: 0
                    });
                }
                // Eğer loggedInUser bir Super Admin değilse, işlem engellenir
                if (loggedInUserId !== requestedGroup.created_by) {
                    return res.status(200).json({
                        message: 'You are not authorized to update this group.',
                        code: 0
                    });
                }
            }

            // Bir Admin sadece kendi yarattığı grubu düzenleyebilir.
            if (loggedInUserRole === 1 && loggedInUserId !== requestedGroup.created_by) {
                return res.status(200).json({
                    message: 'You are not authorized to update this group as it was not created by you.',
                    code: 0
                });
            }

            // Güncellenen verilerin mevcut grup verileriyle karşılaştırılması
            const noChanges = Object.keys(updateData).every((key) => requestedGroup[key] === updateData[key]);

            if (noChanges) {
                return res.status(200).json({
                    message: 'No changes were made.',
                    code: 0
                });
            }

            // Güncelleme işlemi (updatedBy alanını backend'de belirtiyoruz)
            const result = await updateUserGroupById(requestedGroupId, {
                ...updateData,
                updated_by: loggedInUserId
            });

            if (result.affectedRows === 0) {
                return res.status(200).json({
                    message: 'No changes were made.',
                    code: 0
                });
            }

            return res.status(200).json({
                message: 'Group updated successfully.',
                code: 1
            });
        } catch (error) {
            return res.status(200).json({
                message: 'An error occurred.',
                error: error.message,
                code: 0
            });
        }
    } else {
        // Sadece PUT metodu kabul edilir
        res.setHeader('Allow', ['PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default privateMiddleware(handler);
