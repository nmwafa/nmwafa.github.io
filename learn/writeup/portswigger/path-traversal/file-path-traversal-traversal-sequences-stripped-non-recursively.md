# File path traversal, traversal sequences stripped non-recursively

<figure><img src="../../../.gitbook/assets/image (29).png" alt=""><figcaption></figcaption></figure>

Untuk lab yang ini sudah menggunakan filter payload path traversal, tapi belum cukup baik jadi masih bisa di bypass.

cara kerja dari filter yang di terapkan adalah menghapus karakter `../` saja untuk relative path. jadi dengan menambahkan karakter dobel masih bisa kita bypass.

untuk menyelesaikan lab ini klik salah satu produk, lihat history di ZAP, kemudian `Open in requester tab`.

masukkan payload `....//....//....//etc/passwd`

<figure><img src="../../../.gitbook/assets/image (31).png" alt=""><figcaption></figcaption></figure>

<figure><img src="../../../.gitbook/assets/image (32).png" alt=""><figcaption><p>solved!</p></figcaption></figure>
