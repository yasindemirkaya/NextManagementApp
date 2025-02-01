* Menü ismi: Project Management
* Alt Menü isimleri:
    - Create New Project
    - View Projects

<!-- Project Model -->
    - Title (Proje adı) (String)
    - Description (Proje açıklaması) (String)
    - Type (Proje türü) (String)
    - Start Date (Date)
    - End Date (Date)
    - Project Lead (userId)
    - Status (String)
    - Assignment Type (String)
    - AssigneeUser (Array)
    - AssigneeGroup (Array)

<!-- Create Project -->
    - Super Adminler ve Adminler yeni bir proje oluşturabilir.
    - Proje bireysel olarak kişilere ya da direkt olarak bir kullanıcı grubuna atanabilir.
    
    - Create Project sayfası bir formdan oluşacak.
        * Title: Projenin başlığı. String olarak kullanıcı tarafından girilecek. Zorunlu.
        * Description: Proje açıklaması. String olarak kullanıcı tarafından girilecek. Zorunlu.
        * Type: Projenin türü static/data/projectTypes dosyasından gelen listeden Select içerisinden seçilecek. Seçilen tür String olarak tabloda tutulacak. Zorunlu.
        * Start Date: Datepicker'dan seçilen proje başlangıç tarihi. (Zorunlu)
        * End Date: Datepicker'dan seçilen proje bitiş tarihi. (Kullanıcı deadline girmek isterse görünür olacak. Zorunlu bir alan değil.)
        * Project Lead: Proje yöneticisi. Kullanıcıların olduğu Select'ten seçilen kişinin userId'si tabloda tutulacak.
        * Status: Proje Durumu. static/data/projectStatuses dosyasından gelen listeden Select içerisinden seçilecek. Seçilen türl Strimng olarak tabloda tutulacak. (Bir proje yaratılırken bu değer default olarak "0: To Do" olacak)
        * Assignment Type: String. 0 1 ya da 2 değerlerini alacak.
            > 0: Individual User (Tek bir kullanıcıya atanan proje.)
            > 1: Multiple Users (Birden fazla kullanıcıya atanan proje. Bu seçenek seçilirse o zaman kullanıcı seçmek için formda liste açılacak.)
            > 2: User Group (Bir kullanıcı grubuna atanan proje.)
        * AssigneeUser: AssignmentType 0 ya da 1 seçilirse o zaman seçilen kullanıcı ya da kullanıcıların userId'leri burada bir array olarak tutulacak. (Eğer individal user seçeneği seçilirse o zaman tek bir kullanıcı ID'si barındıran tek elemanlı bir array olacak.)
        * AssigneeGroup: Assignment Type 2 seçilirse seçilen grup ya da grupların ID'leri burada tutulacak. (Bir proje birden fazla gruba atanabilir.)

<!-- Get Projects -->
    - Super Adminler için tüm projeler getirilecek.
    - Adminler için Super Admin'lerin açtığı projeler hariç tüm projeler getirilecek.
    - Standart kullanıcılar için sadece atandıkları projeler getirilecek.
    - Jira trello vb bir board olacak ve burada projeler bulundukları status durumuna göre ilgili sütunda belirecek.

<!-- Get Project By ID -->
    - View Projects sayfasındaki boardda yer alan bir projenin üzerine tıklandığında açılacak olan sayfada proje detayları gösterilecek. Bu detaylar bu servisten gelecek.
    - Servis Assignment Type değerine göre AssigneeUser ya da AssigneeGroup alanlarında yer alan Array'lerin içinden ID'leri alacak ve projedeki ilgili kullanıcı ya da kullanıcı gruplarına üye kullanıcıları liste halinde getirecek.

<!-- Update Project -->
    - Proje detay sayfasında yer alan Düzenle butonu ile açılan formda proje güncellenebilecek.
    - View Project sayfasında yer alan boardda proje bir sütundan diğerine sürüklendiğinde (To Do, In Progress gibi) bu servis çağırılacak ve projenin Status değerini güncelleyecek.
    - Daha önce End Date verilmemiş bir projeye güncelleme yapılarak sonradan Deadline girilebilecek.
    - Projeye sonradan kullanıcı dahil olabilecek, var olan kullanıcılar çıkarılabilecek. Aynı işlem grup ve gruplar için de yapılabilecek.
    - Proje lideri değiştirilebilecek.

<!-- Delete Project -->
    - Projeyi tamamen silen servis

