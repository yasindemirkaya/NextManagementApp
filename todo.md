* public/get-user-group-types
* private/create-user-group-type
* private/delete-user-group-type
* private/update-user-group-type

* User Group Detail sayfasının yapılması (Detaylı gösterim için)
* Edit User Group sayfasının yapılması (Delete ve Update için)

* CREATE USER GROUP GELİŞTİRMELERİ *
    - Grup oluşturan loggedInUser bir Super Admin'se her şey serbest.
    - Grup oluşturan loggedInUser bir Admin ise o zaman getUsers methodundan role=0 ve role=1'ler dönsün.

* getUsers gibi tekrar tekrar kullanılacak API isteklerini yapan methodların merkezileştirilmesi.