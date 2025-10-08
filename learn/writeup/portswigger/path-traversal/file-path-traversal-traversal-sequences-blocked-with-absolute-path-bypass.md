# File path traversal, traversal sequences blocked with absolute path bypass

<figure><img src="../../../.gitbook/assets/image (25).png" alt=""><figcaption></figcaption></figure>

Untuk lab ini menggunakan payload yang lebih pendek dari lab sebelumnya.

klik salah satu produk, kemudian cek history yang meminta request gambar pada ZAP.

<figure><img src="../../../.gitbook/assets/image (26).png" alt=""><figcaption></figcaption></figure>

Klik kanan `Open in requester tab` atau `Ctrl+W`.&#x20;

Pada parameter `filename` masukkan payload `/etc/passwd` lalu klik send.

<figure><img src="../../../.gitbook/assets/image (27).png" alt=""><figcaption></figcaption></figure>

<figure><img src="../../../.gitbook/assets/image (28).png" alt=""><figcaption><p>solved!</p></figcaption></figure>
