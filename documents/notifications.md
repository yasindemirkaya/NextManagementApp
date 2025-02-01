* Menü ismi: Notifications
* Alt menü isimleri
    - Create Notification (Super Admin ve Admin)
    - My Notifications (Herkes görebilir)


<!-- Create Notification -->
    - Super Adminler herkese bildirim atabilir.
    - Adminler sadece standart kullanıcılara bildirim atabilir.
    - Adminler kendi oluşturmadıkları gruplara bildirim atamazlar.
    - Grup liderleri admin ya da super admin olmasalar bile bildirim atabilirler. Ancak sadece kendi gruplarına grup bildirimi atabilirler. Bireysel bildirim atamazlar.

    - Formun üzerinde seçenek olacak, Personal Notification ya da Group Notification olarak seçilecek.
        > Group Notification
            * Title (Bildirimin başlığı)
            * Description (Bildirimin içeriği)
            * Type (Acil, Duyuru gibi)
            * Created By (Bildirim kim tarafından oluşturuldu)
            * Group (Bildirim userGroups tablosundan hangi gruba gidecek) (Birden fazla kullanıcı grubu seçilirse groupNotifications tablosunda her kullanıcı grubu için ayrı kayıt atılacak.)
            * Date (createdAt harici kullanıcılar bildirimin içine tarih eklemek isterlerse required olmayan alan)
            * isSeen (Default değer false olacak, grup lideri okundu olarak işaretleyince değer true'ya dönecek)

        > Personal Notification
            * Title (Bildirimin başlığı)
            * Description (Bildirimin içeriği)
            * Type (Acil, Duyuru gibi)
            * Created By (Bildirim kim tarafından oluşturuldu)
            * User (Bildirim users tablosundan hangi kullanıcıya atılacak) (Birden fazla kullanıcı seçilirse personalNotifications tablosunda her kullanıcı için ayrı kayıt atılacak.)
            * Date (createdAt harici kullanıcılar bildirimin içine tarih eklemek isterlerse required olmayan alan)
            * isSeen (Default değer false olacak, kişi okundu olarak işaretleyince değer true'ya dönecek)

            - Bildirimler gönderilirken "X kişiye ya da X gruba bildirim göndermek istediğinize emin misiniz?" şeklinde Sweet alert çıkararak onay alınacak.

<!-- Get Notifications -->
    - Kullanıcı "My Notifications" sayfasına girdiğinde 2 bölüm olacak.
        > Personal Notifications ve Group Notifications. Hangisine tıklarsa onun endppinti loggedInUser.id ile istek atacak ve o kişiyle ilgili bildirimleri getirecek.
    - getGroupNotifications ve getPersonalNotifications şeklinde iki endpoint yazılacak.
    - Bu servislere filtre eklenecek. Filtre type değerine göre (Duyuru, Acil gibi) ya da Okundu Okunmadı durumuna göre bildirimleri dönecek.
    - Serviste aynı zamanda page ve limit olacak.
    - Daha önce "Okundu" olarak işaretlenen bildirimler bu servislerden dönmeye devam edecek. Önyüzde okunduğunu gösterecek şekilde tasarım yapılacak.

<!-- Delete Notification -->
    - Bildirimin sahibi "My Notifications" sayfasından açtığı bildirimleri silebilecek.
    - Yöneticiler "My Notifications" sayfasını iki bölüm haline görecek. Hem kendi yarattıkları bildirimler hem de onlara gönderilen bildirimler.

<!-- Update Personal Notification -->
    - Kullanıcı bireysel olarak ona atılan bildirimleri okuduysa "Okundu" olarak işaretleyerek statusu güncelleyecek. 
    - Grup Bildirimlerinde "Okundu" seçeneğini sadece "Group Leader" görebilecek. O "Okundu" olarak işaretledikten sonra diğer kullanıcılar "Grup lideriniz tarafından okundu" şeklinde bir ifade görecek.

<!-- Get Notification Count -->
    - Kullanıcıya sadece isSeen değeri false olan yani okunmamış olan bildirimlerinin sayısını dönecek bir servis yazılacak.
    - Bu servis headerdaki notification ikonunun üzerine bildirim sayısını koymak için anasayfaya girildiğinde kullanılacak.