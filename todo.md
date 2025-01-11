* Sidebar.js içindeki descriptionların türkçeleri de eklenmeli


<!-- STATISTICS ENDPOINT -->
* Db'ye statistics collectionı oluşturalım.
    {
        _id: id
        title: 'Users',
        icon: 'faUsers',
        link: '/user-management'
        icon_color: "#ffffff"
        bg_color: "#ffffff" 
    }

* models/Statistics.js oluşturalım.

* Hangi istatistikleri çekmek istiyorsak onun parametresini "true" göndermeliyiz. Şu an elimizde olanların hepsini params olarak ekleyeceğiz.
    * users
    * user-groups
    * user-group-types
    * notifications
    * service logs

* Servise hangileri true gönderildiyse statistics tablosundan gidip önce onların tüm bilgilerini çekelim.
* Sonra ilgili tablolara gidip onların toplam sayılarını alalım.

* En sonunda response içerisinde şunlar olmalı;
    * _id
    * title (Başlık)
    * value (Değer)
    * icon (Gösterilecek olan font awesome ikonunun adı)
    * link (Tıklandığında hangi sayfaya yönlendireceğiz)
    * iconColor (istatistik kartının üzerindeki ikonun rengi)
    * bgColor (istatistik karıtnın üzerinde ikonun arkaplan rengi)


* Her kullanıcı statistics endpointine erişebilmeli.
* Yeni servisler yazıldıkça istatistik servisine ekleme yapılmalıdır
    

