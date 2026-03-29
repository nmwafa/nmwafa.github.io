<h1 align="center">Linux Server Hardening</h1>

### Update & Patch Management
- Update Repositori & Package: `sudo apt update && sudo apt upgrade -y`
- Pastikan kernel versi terbaru. Cek: `uname -r`

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

### Keamanan jaringan
- Tutup semua port, kecuali yang dibutuhkan. Cek port terbuka dengan: `ss -tunlp` atau `netstat -tunlp`
- Aktifkan UFW: `sudo systemctl enable --now ufw`. Hanya izinkan koneksi masuk ke port yang dibutuhkan
  - Proteksi dasar SSH: `sudo ufw limit ssh` -> tolak IP yang coba login lebih dari 6x dalam 30 detik
- Pasang iptables: `sudo apt install iptables`
  - Tolak koneksi berlebih untuk cegah DoS di port 80,443:
    ```
    sudo iptables -I INPUT 1 -p tcp -m multiport --dports 80,443 -m connlimit --connlimit-above 20 --connlimit-mask 32 -j DROP
    ```
  - Izinkan koneksi loopback & yang sudah *established*:
    ```
    sudo iptables -A INPUT -i lo -j ACCEPT
    sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
    ```
  - Izinkan akses standar:
    ```
    sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
    sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
    sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
    ```
  - Tolak yang lain: `sudo iptables -P INPUT DROP`
  - Lihat *rules* standar: `sudo iptables -L -n`
  - Lihat *rules* detail statistik: `sudo iptables -L -n -v`
  - Lihat *rules* nomor baris: `sudo iptables -L --line-numbers`
  - Lihat *rules* format skrip: `sudo iptables -S`
- Proteksi tambahan dengan fail2ban (proteksi *bruteforce* dengan blokir IP): `sudo apt install fail2ban`
  - Buat salinan agar tidak tertimpa saat update: `sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local`
  - Edit file `jail.local`:
    ```
    [sshd]
    enabled = true
    port = ssh
    bantime = 1d
    findtime = 5m
    maxretry = 3
    backend = systemd -> jika pakai distro terbaru
    ```
  - Jika pakai ufw, tambahkan: `banaction = ufw` di bagian `[DEFAULT]`
  - Jika port SSH sudah diganti, sesuaikan di `/etc/services`
  - Cek status: `fail2ban-client status sshd`
- Matikan service tidak perlu. Cek: `systemctl list-unit-files --state=enabled`

### Log & Audit
- Lacak user yang login saat ini: `who -H` -> membaca file `/var/log/utmp`
- Lacak pengguna yang sebelumnya pernah login: `last -R` -> membaca file `/var/log/wtmp`
- Lacak upaya kegagalan login ke sistem: `lastb` -> membaca file `/var/log/btmp`
- Pakai `lynis` untuk audit keamanan sistem: `lynis audit system`

### Pasang malware scanner
- maldet
  ```
  wget  http://www.rfxn.com/downloads/maldetect-current.tar.gz
  tar xzf maldetect-current.tar.gz
  cd maldetect-*
  ./install.sh
  nano /usr/local/maldetect/conf.maldet
  quarantine_hits="1"
  quarantine_clean="1"
  maldet -u
  maldet -a /var/www/html/
  ```
- clamAV
  ```
  sudo apt install clamav clamav-daemon
  sudo freshclam
  sudo clamscan -r /
  ```

### Aktifkan SELinux
- Cek status: `sestatus`
- Jika belum, install: `sudo apt update && sudo apt install policycoreutils selinux-utils selinux-basics`
- Aktifkan di Bootloader: `sudo selinux-activate`
- Set ke mode *permissive* dulu sebelum reboot: `sudo selinux-config-enforcing permissive`
- Lihat mode saat ini: `getenforce`
- Ubah mode di file `/etc/selinux/config` jadi `SELINUX=enforcing`
