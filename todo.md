* get-notifications servisi yazılacak. Kullanıcılar kendilerine atılan bildirimleri bu servis ile çekecek.
    > Type: 0 = Sadece personel notificationları getirir
    > Type: 1 = Sadece group notificationları getirir
    > Type: 2 = Tüm notificationları getirir

* get-my-notifications servisi yazılacak. Bu servis yöneticilerin diğer kullanıcılara ya da gruplara attığı bildirimleri getirecek.
    > Type: 0 = Yöneticilerin gönderdikleri personal notificationları getirir
    > Type: 1 = Yöneticilerin gönderdikleri group notificationları getirir
    > Type: 0 = Yöneticilerin gönderdikleri tüm notificationları getirir
        > Bu sayede yöneticiler attıkları bildirimlerin okunup okunmadığını, hangi tarihte atıldığını vb öğrenebilir.

* get-notification-count servisi yazılacak. 
    > Bu servis loggedInUserId ile çalışacak ve personalNotifications ve groupNotification collectionlarında kişinin ID'si ile oluşturulmuş notificationların toplamının sayısını dönecek.







Servis responselarına GUID eklenmesi.

GUID ile servis request responselarının sorgulanabileceği bir endpoint yapısının kurulması.

Form validationlarının merkezileştirilmesi