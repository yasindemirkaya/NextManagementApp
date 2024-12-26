Anasayfa dashboard için kullanılabilecek kartların eklenmesi

Servis responselarına GUID eklenmesi.

GUID ile servis request responselarının sorgulanabileceği bir endpoint yapısının kurulması.



Yukarıdaki servise aşağıdaki işlemlerin yapılması gerekmektedir.
1. Servisten dönen created_by parametresindeki ID alınarak users collectionından bu ID'nin kime ait olduğu bulunmalı ve created_by değerinde o kişinin first_name ve last_name'i gönderilmelidir.
2. Servisten dönen date parametresi "YYYY-MM-DD" formatına dönüştürülerek response verilmelidir.
3. Servisten dönen createdAt parametresi "YYYY-MM-DD" formatına dönüştürülerek response verilmelidir.

Şu an tarihler servisten 2024-12-25T17:57:42.316Z şeklinde dönüyor. Bunları "YYYY-MM-DD" yapmak için helpers/dateFormatter.js diye bir method yaz. 