* PROJECTS > MANAGE PROJECT TYPES
    > Project Management sayfası altından Manage Project Types menüsüne gidilecek
    > Burası View Group Types sayfasının aynısı olacak, tablo şeklinde.
    > Varolan proje türlerini güncelleme ve yeni bir proje türü oluşturma.
    > Tür oluşturma sırasında o tür için renk seçilecek, proje boardunda projenin türüne göre renklendirme yapılacak.
    > Proje türleri artık static/data/projects/projectTypes altından değili veritabanından servis ile getirilecek.

    - ENDPOINTS
        > api/private/projects/get-project-types
        > api/private/projects/get-project-type-by-id
        > api/private/projects/create-project-type
        > api/private/projects/update-project-type
        > api/private/projects/delete-project-type

* PROJECTS > VIEW PROJECT > PROJECT DETAIL
    > Sayfanın sol tarafında yer alan güncelleme kartında (form) projenin detayları getirilecek.
    > Sayfanın ortasında yer alan kartta kullanıcı ya da grup yönetimi kısmı olacak
        > Bu alandan project lead değiştirilebilecek
        > Projeye kullanıcı eklenip çıkartılabilecek
        > Projeye kullanıcı grubu eklenip çıkartılabilecek 
    > Sayfanın sağında yer alan karttan bu proje içerisinden task açılabilecek (task kısmı yapıldıktan sonra eklenecek)