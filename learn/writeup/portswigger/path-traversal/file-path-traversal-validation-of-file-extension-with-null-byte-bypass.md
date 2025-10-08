# File path traversal, validation of file extension with null byte bypass

<figure><img src="../../../.gitbook/assets/image (33).png" alt=""><figcaption></figcaption></figure>

lab yang satu ini sudah di validasi untuk ekstensi file nya.

tapi, disini masih bisa di bypass dengan karakter null byte `%00` , yaitu karakter kontrol yang bernilai kosong. di beberapa kasus ditulis dengan `\0`, `\000`, `\0x00` dll. (Sumber: [Wikipedia](https://id.wikipedia.org/wiki/Karakter_null))

dalam hal ini digunakan untuk bypass validasi ekstensi file.

seperti biasa, cari request gambar lalu kirim ke requester tab.

<figure><img src="../../../.gitbook/assets/image (34).png" alt=""><figcaption></figcaption></figure>

ubah nilai parameter filename dengan `../../../etc/passwd%00.png` , kirim request.

<figure><img src="../../../.gitbook/assets/image (35).png" alt=""><figcaption></figcaption></figure>

<figure><img src="../../../.gitbook/assets/image (36).png" alt=""><figcaption><p>solved!</p></figcaption></figure>
