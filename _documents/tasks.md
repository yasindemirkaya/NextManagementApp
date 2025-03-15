* Projects > View Projects altından Board üzerinden tıklanan projenin detay sayfasında sağ taraftaki sütunda liste halinde gösterim yapılacak.
* Bu kartın en altında View All seçeneği olacak, buna tıklandığında o projenin boardu açılacak ve tasklar board üzerinde detaylı gösterilecek.
* Bu alanda Create Task butonu yer alacak, Create Task formuna yönlendirecek. (Modal olabilir)

<!-- Task Model -->
    - Title (Task adı) (String) (Zorunlu)
    - Description (Task açıklaması) (String) (Zorunlu)
    - Label (Task labelı) (Teknik, tasarım vb..) (Zorunlu değil)
    - AssigneeUser (userId) (Zorunlu değil, unassigned kalabilir. Sonrasında update edilebilir)
    - AssigneeGroup (groupId) (Zorunlu değil, unassigned kalabilir. Sonrasında update edilebilir)
    - Status (String) 
    - Project Id (ID) (Hangi projeye ait bir task olduğunu bilmek için)


<!-- Create Task -->
    - Super Adminler ya da o projenin lead'i olan kişiler task oluşturabilir.
    - Tasklar bireysel olarak bir kişiye ya da bir gruba atanabilir. Çoğul atama yok.
    - Label (Select'ten seçilecek. taskLabelTypes tablosundan getirilecek.)
    - Assignee User (Select'ten singular olarak seçilecek)
    - Assignee Group (Select'ten singular olarak seçilecek)
        NOT: Assignment Type sadece önyüzdeki formdan seçtirilecek, hangi type seçildiyse ona göre user ya da group seçeneği gösterilecek. Yani Create Task endpointine hem Assignee User hem Assignee Group gönderimi olamaz. Tabloda da yalnızca biri dolu olabilir.
    - Status (Default "To Do" olarak atanacak) (Project Statuses gibi static/data altından getirilecek.)
    - Project ID (Selectten seçilen projenin ID si gönderilecek)


<!-- Get Tasks -->
    - Super Adminler tüm projeleri görebildikleri için tüm taskları da görebilir.
    - Eğer task kullanıcının bulunduğu bir projedeyse o kişi o taskı görebilir.
    - Taskı yaratan kişi o taskı görebilir.
    - Standart kullanıcılar sadece kendilerine atanan taskları görebilir. Diğer projelerdeki taskları görüntüleyemez.
    

<!-- Get Task By ID -->
    - View Project sayfasının sağındaki listeden bir taskın üzerine tıklandığında ya da Proje Detay Board'undan bir taska tıklandığında açılan Task Detay modalının içini doldurmak için çağırılacak
