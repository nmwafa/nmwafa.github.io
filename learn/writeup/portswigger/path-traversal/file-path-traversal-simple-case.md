# File path traversal, simple case

<figure><img src="../../../.gitbook/assets/image (21).png" alt=""><figcaption></figcaption></figure>

Lab pertama untuk kerentanan path traversal masih sangat mudah.

Pertama-tama pastikan ZAP sudah open dan proxy pada browser sudah di set ke lokalhost.

Klik salah satu produk untuk melihat detailnya, kemudian lihat history pada ZAP.

<figure><img src="../../../.gitbook/assets/image (22).png" alt=""><figcaption></figcaption></figure>

Cari request yang mengarah ke gambar, kemudian klik kanan lalu pilih opsi `Open in requester tab` atau bisa juga langsung klik tombol `Ctrl+W` .

<figure><img src="../../../.gitbook/assets/image (23).png" alt=""><figcaption></figcaption></figure>

Sekarang kita berada di tab Requester. untuk menyelesaikan lab ini, ubah parameter filename dengan `../../../etc/passwd` kemudian klik `send` .

<figure><img src="../../../.gitbook/assets/image (24).png" alt=""><figcaption><p>solved!</p></figcaption></figure>
