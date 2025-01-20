* Menü ismi: Demands
* Alt menü isimleri
    - Create Demands (Standard User görebilir, form)
    - My Demands (Herkes görebilir, tablo)


<!-- Create Demand -->
    - Standard User'lar hesaplarını oluşturan Admin ya da Super Admin'lere talepte bulunur.
    - Kullanıcının hesabını oluşturan kişi (createdBy) bir Admin ise talep önce o admine, onun onayından sonra bir Super Admin'e gider.
    - Kullanıcının hesabını oluşturan kişi bir Super Admin ise direkt olarak talep onayı o Super Admin'e gider.
    
    - Create Demand sayfası bir formdan oluşacak. 
        * Title (Talebin başlığı. (Talep türleri içinden select ile seçilecek. Kullanıcı text yazmayacak))
        * Description (Kullanıcı textarea'dan talebinin açıklamasını girecek)
        * Date (Talep ile ilgili tarih seçilecek. Talep türüne göre Start Date - End Date olacak (İzin başlangıç - bitiş gibi.))

    - Kullanıcıdan yukarıdaki 3 alan alınacak.
    - Bu üç alana ek olarak request atılırken backendde aşağıdaki parametreler de eklenecek;
        * Status = Talebin durumu:
            Admin onayında (0) 
            Super Admin onayında (1)
            Kabul edildi (2) 
            Reddedildi (3)
        * Admin Response:
            String
    - Status parametresi talep yaratılırken duruma göre 0 ya da 1 gönderilecek.
    - Talep yaratılırken Admin Response parametresi boş bir şekilde gönderilecek.


<!-- Get Demands -->
    - Standard user'lar için oluşturdukları talepler servisten getirilecek.
    - Tabloda bu talepler ve durumları gösterilecek.

    - Admin ve Super Admin'ler için Standard User'lardan gelen talepler servisten getirilecek.
    - Tabloda standard user'lardan gelen talepler ve durumları gösterilecek.
    - Admin ve Super Admin'ler taleplerin üzerine tıklayarak güncelleme yapabilecek.

<!-- Get Demand By ID -->
    - Admin ve Super Admin'lerin tabloda bir talebe tıkladığında tek bir talebin bilgilerini çekmek için servis

<!-- Update Demands -->
    - Admin ve Super Admin'ler tablodaki talebin üzerine tıkladığında bir modal açılır.
    - Açılan modalda talebi onayla ya da reddet seçenekleri ve altında bir textarea yer alır.
    - Kabul veya ret açıklamasını yönetici girer ve servise Status ve Admin Response değerleri güncellenerek o talep için update isteği atılır.


<!-- Get Demands Count -->
    - Admin ve Super Admin'lerin dashboard'unda notifications gibi yer alan talep ikonunun üzerinde kendilerine gelen taleplerin sayısını göstermek için yazılacak olan servis
            
        