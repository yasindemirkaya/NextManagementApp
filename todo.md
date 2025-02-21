* /project-management sayfasının kodunun yazılması


* DEMANDS > MANAGE DEMAND TYPES
    > Demands sayfası altından Manage Demand Types menüsüne gidilecek.
    > Burası View Group Types sayfasının aynısı olacak.
    > Varolan talep türlerini güncelleme ve yeni talep türü oluşturma.
    > Talep türleri artık static/data/demands/demandTypes sayfası altından değil, veritabanından servis ile getirilecek.

    - ENDPOINTS
        > api/private/demands/get-demand-types
        > api/private/demands/get-demand-type-by-id
        > api/private/demands/create-demand-type
        > api/private/demands/update-demand-type
        > api/private/demands/delete-demand-type

    > DemandType modeli yazılmalı
    > Db'ye demandTypes diye tablo açılmalı


* PROJECTS > MANAGE PROJECT TYPES
    > Project Management sayfası altından Manage Project Types menüsüne gidilecek
    > Burası View Group Types sayfasının aynısı olacak, tablo şeklinde.
    > Varolan proje türlerini güncelleme ve yeni bir proje türü oluşturma.
    > Tür oluşturma sırasında o tür için renk seçilecek, proje boardunda projenin türüne göre renklendirme yapılacak.
    > Proje türleri artık static/data/projects/projectTypes altından değili veritabanından servis ile getirilecek.

    - ENDPOINTS
        > api/private/demands/get-project-types
        > api/private/demands/get-project-type-by-id
        > api/private/demands/create-project-type
        > api/private/demands/update-project-type
        > api/private/demands/delete-project-type

* PROJECTS > VIEW PROJECT > PROJECT DETAIL
    > Sayfanın sol tarafında yer alan güncelleme kartında (form) projenin detayları getirilecek.
    > Sayfanın ortasında yer alan kartta kullanıcı ya da grup yönetimi kısmı olacak
        > Bu alandan project lead değiştirilebilecek
        > Projeye kullanıcı eklenip çıkartılabilecek
        > Projeye kullanıcı grubu eklenip çıkartılabilecek 
    > Sayfanın sağında yer alan karttan bu proje içerisinden task açılabilecek (task kısmı yapıldıktan sonra eklenecek)