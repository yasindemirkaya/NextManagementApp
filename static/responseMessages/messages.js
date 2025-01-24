const responseMessages = {
    // COMMON
    common: {
        en: {
            errorOccured: 'An error occured.',
            methodNotAllowed: 'Method not allowed.',
            invalidCredentials: 'Invalid credentials. Please check your email or password.',
            noPermission: 'You do not have permission to access this resource.',
            invalidToken: 'Invalid token, please log in again.',
            noChanges: 'No changes were made.'
        },
        tr: {
            errorOccured: 'Bir sorun oluştu.',
            methodNotAllowed: 'Yöntem kabul edilmedi.',
            invalidCredentials: 'Geçersiz bilgiler. Lütfen e-posta adresinizi veya şifrenizi kontrol edin.',
            noPermission: 'Bu kaynağa erişim izniniz yok.',
            invalidToken: 'Geçersiz token, lütfen giriş yapın.',
            noChanges: 'Hiçbir değişiklik yapılmadı.'
        }
    },
    // LOGIN
    login: {
        en: {
            success: 'Successfully logged in. Redirecting to dashboard...',
            userNotFound: 'User not found',
        },
        tr: {
            success: 'Giriş başarılı. Panele yönlendiriliyorsunuz...',
            userNotFound: 'Kullanıcı bulunamadı',
        }
    },
    // REGISTER
    register: {
        en: {
            success: 'User registered successfully',
            emailAlreadyInUse: 'Email already in use',
            mobileAlreadyInUse: 'Mobile number already in use',
            allFieldsRequired: 'All fields are required',
        },
        tr: {
            success: 'Kullanıcı başarıyla kaydedildi',
            emailAlreadyInUse: 'E-posta adresi zaten kullanımda',
            mobileAlreadyInUse: 'Mobil numara zaten kullanımda',
            allFieldsRequired: 'Tüm alanlar gereklidir',
        }
    },
    // USERS
    users: {
        en: {
            success: 'Users successfully fetched.',
            failedToFetch: 'Failed to fetch users from the database.',
        },
        tr: {
            success: 'Kullanıcıla başarıyla getirildi.',
            failedToFetch: 'Kullanıcılar veritabanından getirilemedi.',
        }
    },
    // USER
    user: {
        // GET USER
        get: {
            en: {
                success: 'User data successfully fetched.',
                notFound: 'User not found.',
            },
            tr: {
                success: 'Kullanıcı verisi başarıyla getirildi.',
                notFound: 'Kullanıcı bulunamadı.',
            }
        },
        // UPDATE USER
        update: {
            en: {
                success: 'User data successfully updated',
                alreadyExist: 'Email or mobile number already in use.'
            },
            tr: {
                success: 'Kullanıcı verisi başarıyla güncellendi.',
                alreadyExist: 'Bu e-posta adresi veya telefon numarası zaten kullanımda.'
            }
        },
        // UPDATE USER BY ID
        updateById: {
            en: {
                success: 'User updated successfully.',
                userIdRequired: 'User ID is required.',
                notAuthorized: 'You are not authorized to update this user.',
                failedToUpdate: 'Failed to update user.'
            },
            tr: {
                success: 'Kullanıcı başarıyla güncellendi.',
                userIdRequired: 'Kullanıcı ID gereklidir.',
                notAuthorized: 'Bu kullanıcıyı güncelleme yetkiniz yok.',
                failedToUpdate: 'Kullanıcı güncellenemedi.'
            }
        },
        // DELETE USER
        delete: {
            en: {
                success: 'User deleted successfully.',
                userIdRequired: 'User ID is required.',
                notAuthorized: 'You are not authorized to delete this user.',
                failedToDelete: 'Failed to delete user.',
                notFound: 'User not found or already deleted.'
            },
            tr: {
                success: 'Kullanıcı başarıyla silindi.',
                userIdRequired: 'Kullanıcı ID gereklidir.',
                notAuthorized: 'Bu kullanıcıyı silme yetkiniz yok.',
                failedToDelete: 'Kullanıcı silinemedi.',
                notFound: 'Kullanıcı bulunamadı veya zaten silinmiş.'
            }
        },
        // DELETE USER BY ID
        deleteById: {
            en: {
                success: 'User account deleted successfully.',
                userIdRequired: 'User ID is required.',
                notAuthorized: 'You are not authorized to delete this user.',
                failedToDelete: 'Failed to delete user.',
                notFound: 'User not found or already deleted.',
                adminPermission: 'Admins can only delete standard user accounts.'
            },
            tr: {
                success: 'Kullanıcı hesabı başarıyla silindi.',
                userIdRequired: 'Kullanıcı ID gereklidir.',
                notAuthorized: 'Bu kullanıcıyı silme yetkiniz yok.',
                failedToDelete: 'Kullanıcı silinemedi.',
                notFound: 'Kullanıcı bulunamadı veya zaten silinmiş.'
            }
        },
        // CREATE USER
        createUser: {
            en: {
                success: 'User successfully created.',
                emailOrMobileInUse: 'Email or mobile number already in use.',
                allFieldsRequired: 'All fields are required.',
                noPermission: 'You do not have permission to create a user.'
            },
            tr: {
                success: 'Kullanıcı başarıyla oluşturuldu.',
                emailOrMobileInUse: 'E-posta adresi veya telefon numarası zaten kullanımda.',
                allFieldsRequired: 'Tüm alanlar gereklidir.',
                noPermission: 'Kullanıcı oluşturma yetkiniz yok.'
            }
        },
        // CHANGE PASSWORD
        changePassword: {
            en: {
                success: 'Password changed successfully.',
                invalidPassword: 'Invalid password.',
                allFieldsRequired: 'Please provide all required fields.',
                noPermission: 'You do not have permission to change this user\'s password.',
                passwordsDoNotMatch: 'New password and confirm password do not match.',
                userNotFound: 'User not found.',
                currentIncorrect: 'Current password is incorrect.',
                cannotBeSame: 'New password cannot be the same as the current password.',
                failedToUpdate: 'Failed to update password.',
                provideAllFields: 'Please provide all required fields.',
                notAuthorized: 'You are not authorized to change passwords of other admins or super admins.',
                notAuthorized2: 'You are not authorized to change another super admin’s password.',
            },
            tr: {
                success: 'Şifre başarıyla değiştirildi.',
                invalidPassword: 'Geçersiz şifre.',
                allFieldsRequired: 'Lütfen tüm gerekli alanları doldurun.',
                noPermission: 'Bu kullanıcının şifresini değiştirme yetkiniz yok.',
                passwordsDoNotMatch: 'Yeni şifre ve onay şifresi eşleşmiyor.',
                userNotFound: 'Kullanıcı bulunamadı.',
                currentIncorrect: 'Mevcut şifre yanlış.',
                cannotBeSame: 'Yeni şifre mevcut şifreyle aynı olamaz.',
                failedToUpdate: 'Şifre güncellenemedi.',
                provideAllFields: 'Lütfen tüm gerekli alanları doldurun.',
                notAuthorized: 'Diğer yönetici veya süper yöneticilerin şifrelerini değiştirme yetkiniz yok.',
                notAuthorized2: 'Başka bir süper yöneticinin şifresini değiştirme yetkiniz yok.',
            }
        },
    },
    // USER GROUP TYPES
    userGroupTypes: {
        // CREATE USER GROUP TYPE
        create: {
            en: {
                success: 'User group type successfully created.',
                noPermission: 'You do not have permission to create a user group type.',
                nameRequired: 'Type name is required.',
                alreadyExist: 'A group type with this name is already exists.',
                createdByNotFound: 'Created by user not found.'
            },
            tr: {
                success: 'Kullanıcı grup türü başarıyla oluşturuldu.',
                noPermission: 'Kullanıcı grup türü oluşturma yetkiniz yok.',
                nameRequired: 'Tip adı gereklidir.',
                alreadyExist: 'Bu isimde bir grup türü zaten mevcut.',
                createdByNotFound: 'Oluşturan kullanıcı bulunamadı.'
            }
        },
        // DELETE USER GROUP TYPE
        delete: {
            en: {
                success: 'User group type successfully deleted.',
                groupTypeIdRequired: 'Group type ID is required.',
                groupTypeNotFound: 'User group type not found.'
            },
            tr: {
                success: 'Kullanıcı grup türü başarıyla silindi.',
                groupTypeIdRequired: 'Grup türü ID gereklidir.',
                groupTypeNotFound: 'Kullanıcı grup türü bulunamadı.'
            }
        },
        // GET USER GROUP TYPES
        get: {
            en: {
                success: 'User group types successfully fetched.',
                failedToFetch: 'Failed to fetch user group types from the database.'
            },
            tr: {
                success: 'Kullanıcı grup tipleri başarıyla getirildi.',
                failedToFetch: 'Kullanıcı grup tipleri veritabanından getirilemedi.'
            }
        },
        // GET USER GROUP TYPE BY ID
        getById: {
            en: {
                success: 'User group type successfully fetched.',
                groupTypeIdRequired: 'Group type ID is required.',
                notFound: 'Group type not found.'
            },
            tr: {
                success: 'Kullanıcı grup türü başarıyla getirildi.',
                groupTypeIdRequired: 'Grup türü ID gereklidir.',
                notFound: 'Grup türü bulunamadı.'
            }
        },
        // UPDATE USER GROUP TYPE
        update: {
            en: {
                success: 'User group type successfully updated.',
                idRequired: 'Group type ID is required.',
                failedToUpdate: 'Failed to update user group type.',
                groupNotFound: 'Group type not found.',
                userNotFound: 'User not found.'
            },
            tr: {
                success: 'Kullanıcı grup türü başarıyla güncellendi.',
                idRequired: 'Grup türü ID gereklidir.',
                failedToUpdate: 'Kullanıcı grup türü güncellenemedi.',
                notFound: 'Grup türü bulunamadı.',
                userNotFound: 'Kullanıcı bulunamadı.'
            }
        }
    },
    // GROUPS
    groups: {
        en: {
            success: 'Groups successfully fetched.',
            failedToFetch: 'Failed to fetch groups from the database.',
            notAllowed: 'You are not allowed to use "group_leader" or "created_by" parameters.',
        },
        tr: {
            success: 'Gruplar başarıyla getirildi.',
            failedToFetch: 'Gruplar veritabanından getirilemedi.',
            notAllowed: '"group_leader" veya "created_by" parametrelerini kullanma yetkiniz yok.',
        }
    },
    // GROUP
    group: {
        // GET GROUP
        get: {
            en: {
                success: 'Group successfully fetched.',
                notFound: 'Group not found.',
            },
            tr: {
                success: 'Grup başarıyla getirildi.',
                notFound: 'Grup bulunamadı.',
            }
        },
        // UPDATE GROUP
        update: {
            en: {
                success: 'Group updated successfully.',
                idRequired: 'Group ID is required.',
                notFound: 'Group not found.',
                creatorNotFound: 'Creator user not found.',
                superAdminPermission: 'You are not authorized to update this group as it was created by a Super Admin.',
                selfPermission: 'You are not authorized to update this group as it was not created by you.'
            },
            tr: {
                success: 'Grup başarıyla güncellendi.',
                idRequired: 'Grup ID gereklidir.',
                notFound: 'Grup bulunamadı.',
                creatorNotFound: 'Oluşturan kullanıcı bulunamadı.',
                superAdminPermission: 'Bir Süper Admin tarafından oluşturulan bir grubu güncellemek için yetkiniz yok.',
                selfPermission: 'Bu grubu güncellemek için yetkiniz yok çünkü siz oluşturmadınız.'
            }
        },
        // CREATE GROUP
        create: {
            en: {
                success: 'Group successfully created.',
                requiredParams: 'Group name, type, group leader, and active status are required.',
                minMembers: 'A group must have at least 2 members.'
            },
            tr: {
                success: 'Grup başarıyla oluşturuldu.',
                requiredParams: 'Grup adı, tipi, grup lideri ve aktif durumu gereklidir.',
                minMembers: 'Bir grupta en az 2 üye olmalıdır.'
            }
        },
        // DELETE GROUP
        delete: {
            en: {
                success: 'Group deleted successfully.',
                groupIdRequired: 'Group ID is required.',
                notAuthorized: 'You are not authorized to delete this group.',
                failedToDelete: 'Failed to delete group.',
                notFound: 'Group not found or already deleted.',
                adminPermission: 'Admins can only delete groups they created.'
            },
            tr: {
                success: 'Grup başarıyla silindi.',
                groupIdRequired: 'Grup ID gereklidir.',
                notAuthorized: 'Bu grubu silme yetkiniz yok.',
                failedToDelete: 'Grup silinemedi.',
                notFound: 'Grup bulunamadı veya zaten silinmiş.',
                adminPermission: 'Yöneticiler sadece kendi oluşturdukları grupları silebilir.'
            }
        }
    },
    // NOTIFICATIONS
    notifications: {
        // GET NOTIFICATIONS
        get: {
            en: {
                success: 'Notifications successfully fetched.',
                notFound: 'No notifications found.',
            },
            tr: {
                success: 'Bildirimler başarıyla getirildi.',
                notFound: 'Hiçbir bildirim bulunamadı.',
            }
        },
        // GET NOTIFICATION BY ID
        getById: {
            en: {
                success: 'Notification successfully fetched.',
                notFound: 'Notification not found.',
                createdByNotFound: 'Created by user not found.'
            },
            tr: {
                success: 'Bildirim başarıyla getirildi.',
                notFound: 'Bildirim bulunamadı.',
                createdByNotFound: 'Oluşturan kullanıcı bulunamadı.'
            }
        },
        // GET NOTIFICATION COUNT
        getCount: {
            en: {
                success: 'Notification count successfully fetched.',
            },
            tr: {
                success: 'Bildirim sayısı başarıyla getirildi.',
            }
        },
        // GET MY NOTIFICATIONS
        getMy: {
            en: {
                success: 'Notifications retrieved successfully',
                notFound: 'No notifications found.'
            },
            tr: {
                success: 'Bildirimler başarıyla getirildi.',
                notFound: 'Hiçbir bildirim bulunamadı.'
            }
        },
        // CREATE PERSONAL NOTIFICATION
        createPersonal: {
            en: {
                success: 'Personal notification(s) successfully created.',
                allFieldsRequired: 'All fields are required.',
                invalidId: 'One or more user IDs are invalid.'
            },
            tr: {
                success: 'Kişisel bildirim(ler) başarıyla oluşturuldu.',
                allFieldsRequired: 'Tüm alanlar gereklidir.',
                invalidId: 'Bir veya daha fazla kullanıcı ID\'si geçersiz.'
            }
        },
        // CREATE GROUP NOTIFICATION
        createGroup: {
            en: {
                success: 'Group notification(s) successfully created.',
                allFieldsRequired: 'All fields are required.',
                invalidId: 'One or more group IDs are invalid.'
            },
            tr: {
                success: 'Grup bildirim(ler) başarıyla oluşturuldu.',
                allFieldsRequired: 'Tüm alanlar gereklidir.',
                invalidId: 'Bir veya daha fazla grup ID\'si geçersiz.'
            }
        },
        // UPDATE NOTIFICATION
        update: {
            en: {
                success: 'Notification updated successfully.',
                seenSuccess: 'Notification marked as seen successfully.',
                idRequired: 'Notification ID and Type is required.',
                notFound: 'Notification not found.',
                groupNotFound: 'Group not found.',
                noPermission: 'You do not have permission to update this notification. Only your group leader can update this notification.',
                invalidType: 'Invalid type value.'
            },
            tr: {
                success: 'Bildirim başarıyla güncellendi.',
                seenSuccess: 'Bildirim başarıyla görüldü olarak işaretlendi.',
                idRequired: 'Bildirim ID ve Tür gereklidir.',
                notFound: 'Bildirim bulunamadı.',
                groupNotFound: 'Grup bulunamadı.',
                noPermission: 'Bu bildirimi güncelleme yetkiniz yok. Sadece grubunuzun lideri bu bildirimi güncelleyebilir.',
                invalidType: 'Geçersiz tür değeri.'
            }
        },
        // DELETE NOTIFICATION
        delete: {
            en: {
                success: 'Notification deleted successfully.',
                idRequired: 'Notification ID is required.',
                notFound: 'Notification not found.',
                notAuthorized: 'You can only delete your own notification.'
            },
            tr: {
                success: 'Bildirim başarıyla silindi.',
                idRequired: 'Bildirim ID gereklidir.',
                notFound: 'Bildirim bulunamadı.',
                notAuthorized: 'Sadece kendi bildiriminizi silebilirsiniz.'
            }
        }
    },
    // SERVICE LOGS
    serviceLogs: {
        en: {
            success: 'Service logs successfully fetched.',
            guidRequired: 'GUID is required.',
            notFound: 'No log found with the provided GUID.',
            dateFormat: 'Both startDate and endDate are required in yyyy-mm-dd format.',
            noLogs: 'No logs found with the provided data.',
        },
        tr: {
            success: 'Servis logları başarıyla getirildi.',
            guidRequired: 'GUID gereklidir.',
            notFound: 'Sağlanan GUID ile hiçbir log bulunamadı.',
            dateFormat: 'Başlangıç ve bitiş tarihleri yyyy-mm-dd formatında olmalıdır.',
            noLogs: 'Sağlanan veriler ile hiçbir log bulunamadı.',
        }
    },
    // STATISTICS
    statistics: {
        dashboard: {
            en: {
                success: 'Statistics successfully fetched.',
                failedToFetch: 'Failed to fetch statistics from the database.'
            },
            tr: {
                success: 'İstatistikler başarıyla getirildi.',
                failedToFetch: 'İstatistikler veritabanından getirilemedi.'
            }
        }
    },
    // USER SETTINGS
    userSettings: {
        // GET USER SETTINGS
        get: {
            en: {
                success: 'User settings fetched successfully.',
                notFound: 'User settings could not be found.'
            },
            tr: {
                success: 'Kullanıcı ayarları başarıyla getirildi.',
                notFound: "Kullanıcı ayarları bulunamadı."
            }
        },
        // CREATE OR UPDATE USER SETTINGS
        create: {
            en: {
                success: 'User settings created/updated successfully.',
                missingFields: "Language or Theme is required."
            },
            tr: {
                success: 'Kullanıcı ayarları başarıyla oluşturuldu/güncellendi',
                notFound: "Kullanıcı ayarları bulunamadı.",
                missingFields: "Language ya da Theme parametrelerinden biri zorunludur."
            }
        }
    },
    demands: {
        create: {
            en: {
                success: 'Demand successfully created.',
                allFieldsRequired: 'All fields are required.'
            },
            tr: {
                success: 'Talep başarıyla oluşturuldu.',
                allFieldsRequired: 'Tüm alanların girilmesi zorunludur.'
            }
        }
    }
}

export default responseMessages;
