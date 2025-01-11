<!-- 
*********************************
*
*
* APP RULES
*
*
********************************* 
-->

<!-- * PROFILE PAGE RULES * -->
* Super Admin her tür kullanıcının her bilgisini güncelleme yetkisine sahiptir. 
* Normal Adminler diğer kullanıcıların bilgileri üzerinde güncelleme yapamaz ancak her kullanıcının bilgilerine erişebilir.
* Her kullanıcı kendi bilgilerini güncelleyebilir.

<!-- * USER MANAGEMENT > VIEW USER RULES * -->
* Normal kullanıcılar bu alana erişemez. Sidebarda bu özellik normal kullanıcılar için görünmez hale getirilmiştir.
* Super Adminler KIRMIZI badge ile gösterilir.
* Adminler SARI badge ile gösterilir.
* Normal kullanıcılar GRİ badge ile gösteirlir.
* Super Adminler kullanıcı tablosunda diğer Super Adminleri görebilir.
* Adminler kullanıcı tablosunda Super Adminleri göremez!

<!-- * SIDEBAR RULES * -->
* static/data/components/sidebar.js dosyasında bulunan menülerde yer alan "permission" parametresi menüleri hangi rollerin görebileceğini belirtir.
* permission 2 ise o menüyü sadece Super Admin görebilir.
* permission 1 ise o menüyü Super Admin ve Adminler görebilir.

<!-- * REGISTER (SIGNUP) RULES * -->
* Register servisi ile kayıt olan kullanıcıların hepsi default olarak role: 0 standard user şeklinde kayıt edilir.
* Register servisi üzerinden oluşturulan kayıtlar ile hiçbir kullanıcı Super Admin ya da Admin olamaz.
* Super Admin kullanıcısı sistem tarafından kişilere verilir.
* Super Admin uygulama içerisinden kullanıcı oluşturarak Admin ve Standard User hesapları açabilir

<!-- * UPDATE USER RULES * -->
* Hiçbir kullanıcı kendi hesabının rolünü değiştiremez.
* Super Admin olan bir kendisinden başka kimse güncelleyemez. 
* Super Admin bile olsa bir başka Super Admin profilini güncelleyemez.
* Super Adminler, Admin ve Standard User profillerini güncelleyebilir.
* Adminler, Standard User profillerini güncelleyebilir.
* Standard Userlar sadece kendi profillerini güncelleyebilir.
* Super Adminler bir başka hesabı güncellerken rollerini değiştirip istediği rolü verebilir.
* Adminler bir başka hesabı güncellerken rollerini değiştirebilir ancak bir admin bir başka kullanıcıyı Super Admin yapamaz.

<!-- * USER GROUP RULES * -->
* Bir Super Admin'in yarattığı kullanıcı grubunu kimse silemez ya da güncelleyemez. Sadece kendisi yapabilir.
* Bir Admin'in yarattığı kullanıcı grubu bir Super Admin tarafından silinebilir ya da güncellenebilir.
* Bir Admin'in yarattığı kullanıcı grubu bir başka Admin tarafından silinemez ya da güncellenemez. Sadece kendisi yapabilir ya da bir Super Admin yapabilir.
* Standart bir kullanıcı sadece kendi içerisinde bulunduğu kullanıcı gruplarını görüntüleyebilir. 
* Bir Super Admin kullanıcı grubu oluştururken Group Members kısmında tüm kullanıcıları görüp o gruba ekleyebilir.
* Bir Admin kullanıcı grubu oluştururken Super Admin'leri listede göremez. Sadece kendisi gibi Adminleri ve Standard User'ları görebilir.
* Standard User'lar kullanıcı grubu oluşturamaz.

<!-- * USER GROUP TYPE RULES * -->
* Kullanıcı grubu tiplerini Super Adminler tanımlar. Yani create servisini sadece role (2) olanlar kullanabilir.
* Kullanıcı grubu tiplerini Super Adminler görebilir. Yani get servisini sadece role (2) olanlar kullanabilir.
* Kullanıcı grubu tiplerini Super Adminler silebilir. 
* Kullanıcı grubu tiplerini Super Adminler update edebilir.
* User Group Types olarak tasarlanmış olsa da her türden group tipi bu alanda yaratılacaktır. (İzinliler Grubu, Frontend Grubu, Yöneticiler Grubu, Emlak Grubu vb..)

<!-- * NOTIFICATION RULES * -->
* Super Adminler herkese ve her gruba bildirim atabilir.
* Adminler sadece standart kullanıcılara bildirim atabilir.
* Adminler kendi oluşturmadıkları gruplara bildirim atamazlar.
* Grup liderleri admin ya da super admin olmasalar bile bildirim atabilirler. Ancak sadece kendi gruplarına grup bildirimi atabilirler. Bireysel bildirim atamazlar. O kişi grup üyeleri olsa bile!
* Kullanıcı bireysel olarak kendisine atılmış olan notificationı update etme (Okundu yapma) hakkına sahiptir.
* Eğer bir bildirim bir gruba atılmışsa o bildirim sadece grup lideri update edebilir (Okundu yapabilir).
* Bildirimleri sadece bildirim sahipleri silebilir. Ancak Super Adminler tüm bildirimleri silebilir.
* Super Adminler tüm bildirimleri görebilir, Adminler sadece kendi oluşturdukları ve kendilerine atılan bildirimleri görebilir.
* Notification Types: REMINDER, WARNING, INFO, FEEDBACK, TASK ASSIGNMENT, CRITICAL


<!-- * SERVICE LOGS * -->
* Super Adminler tüm servis loglarını inceleyebilir.
* Her servisin response kısmında "guid" bulunur.
* Her bir guid bir servis logunu temsil eder.
* Settings/Service Logs kısmından response'tan kopyalanan guid yapıştırılıp log tablosundaki detaylar çekilebilir



<!-- * STATISTICS * -->
* Hangi kullanıcı tipinin hangi istatistik türünü görüp göremeyeceği sidebar.js'teki permission değeri ile aynıdır.
* Super Adminler tüm istatistiklere erişebilir
* Adminler servis loglarını göremez. 
* Standart kullanıcılar group types ve service loglarını göremez