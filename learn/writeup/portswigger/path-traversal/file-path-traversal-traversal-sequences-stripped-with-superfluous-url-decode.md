# File path traversal, traversal sequences stripped with superfluous URL-decode

<figure><img src="../../../.gitbook/assets/image (12).png" alt=""><figcaption></figcaption></figure>

Untuk lab yang ini juga sudah ada filter payload, namun belum cukup baik sehingga memungkinkan untuk di bypass.

langsung saja, klik salah satu produk kemudian cari request untuk gambar produk, open in requester.

<figure><img src="../../../.gitbook/assets/image (14).png" alt=""><figcaption></figcaption></figure>

pada parameter filename, ubah nilainya menjadi `../../../etc/passwd` tetapi di encode dengan URL encode 2x, bisa menggunakan online tool atau fitur bawaan ZAP, hasil ahir payload adalah `..%252F..%252F..%252Fetc%252Fpasswd` .

Kirim request.

<figure><img src="../../../.gitbook/assets/image (15).png" alt=""><figcaption></figcaption></figure>

<figure><img src="../../../.gitbook/assets/image (16).png" alt=""><figcaption><p>solved!</p></figcaption></figure>
