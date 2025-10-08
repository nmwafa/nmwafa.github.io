# File path traversal, validation of start of path

<figure><img src="../../../.gitbook/assets/image (17).png" alt=""><figcaption></figcaption></figure>

di lab ini ada validasi bahwa nilai parameter filename harus di awali dengan `/var/www/images/` jadi tidak bisa langsung ke `/etc/passwd` .

cari request gambar produk lalu open in requester tab.

<figure><img src="../../../.gitbook/assets/image (18).png" alt=""><figcaption></figcaption></figure>

sekarang kita ubah nilai parameter filename menjadi `/var/www/images/../../../etc/passwd` karena di depan dilakukan validasi harus dari path `/var/www/images/` baru setelah itu mundur dengan relative path.

kirim request.

<figure><img src="../../../.gitbook/assets/image (19).png" alt=""><figcaption></figcaption></figure>

<figure><img src="../../../.gitbook/assets/image (20).png" alt=""><figcaption><p>solved!</p></figcaption></figure>
