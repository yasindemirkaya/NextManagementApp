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