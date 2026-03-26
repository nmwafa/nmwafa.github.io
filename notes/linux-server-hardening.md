<h1 align="center">Linux Server Hardening</h1>

### Selalu update
```
sudo apt update && sudo apt upgrade -y
```

### Keamanan akses dan SSH
- Ubah *port*: `sed -i "s/#Port 22/Port 23456/" /etc/ssh/sshd_config`
  - Cek *listening port*, pastikan *port* SSH sudah berubah: `ss -tunlp | grep ssh`
  - Jika belum, kemungkinan sistem pakai *Socket Activation*. Jalankan perintah: `sudo systemctl status ssh.socket`
  - Jika statusnya *Active*, maka konfigurasi di *sshd_config* akan diabaikan karena *systemd* "memaksa" port 22 tetap berjalan
  - Beritahu *systemd* untuk pindah *port*. Jalankan perintah edit ini: `sudo systemctl edit ssh.socket`
  - Tambahkan/edit baris berikut:
  ```
  [Socket]
  ListenStream=
  ListenStream=23456
  ```
  - `ListenStream=` yang kosong pertama kali itu untuk menghapus *port* default 22
  - Muat ulang daemon dan restart socket:
  ```
  sudo systemctl daemon-reload
  sudo systemctl restart ssh.socket
  sudo systemctl restart ssh
  ```
- Jangan izinkan login dengan user root: `sed -i "s/PermitRootLogin yes/PermitRootLogin no/" /etc/ssh/sshd_config`
- Putus koneksi otomatis setelah tidak ada aktivitas: `sed -i "s/#ClientAliveInterval 0/ClientAliveInterval 300/"` (300 detik x 3)

### Manajemen user & hak akses
- Hapus user/grup tidak terpakai. Cek di file `/etc/passwd` dan `/etc/group`
- Selalu gunakan `sudo` untuk tugas administratif, bukan langsung sebagai user root
- Pastikan tidak ada user dengan *password* kosong. Cek di file `/etc/shadow`
