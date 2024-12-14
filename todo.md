* CREATE USER GROUP GELİŞTİRMELERİ *
    - Group Type selectinin içinin /get-user-group-types servisinden dönenler ile doldurulması.
    - Grup oluşturan loggedInUser bir Super Admin'se her şey serbest.
    - Grup oluşturan loggedInUser bir Admin ise o zaman getUsers methodundan role=0 ve role=1'ler dönsün.

group-management/user-groups/view-user-groups/[groupId] -> GROUP DETAIL sayfasının yapılması.(Detaylı gösterim için)
components/GroupManagement/EditGroup -> EDIT GROUP componentının yapılması (Delete ve Update için)








* getUsers gibi tekrar tekrar kullanılacak API isteklerini yapan methodların merkezileştirilmesi.