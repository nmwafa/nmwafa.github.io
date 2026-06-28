const terminalBody = document.getElementById('terminal-body');
const output = document.getElementById('output');
const commandInput = document.getElementById('command-input');
const themeToggle = document.getElementById('theme-toggle');
const themeIconDark = document.getElementById('theme-icon-dark');
const themeIconLight = document.getElementById('theme-icon-light');
const fakeCursor = document.getElementById('fake-cursor');
const inputTextDisplay = document.getElementById('input-text-display');

const fullscreenToggle = document.getElementById('fullscreen-toggle');
const fsIconExpand = document.getElementById('fs-icon-expand');
const fsIconCompress = document.getElementById('fs-icon-compress');

const blogPosts = {
    '1': { title: 'Lagi browsing ketemu CAPTCHA? Awas palsu!!!', url: 'https://medium.com/@nmwafa/lagi-browsing-ketemu-captcha-awas-palsu-c90586326b86' },
    '2': { title: 'Kenalan dengan GNS3', url: 'https://medium.com/@nmwafa/kenalan-dengan-gns3-29c227e07d0d' },
    '3': { title: 'Hardening Web Server di Linux Ubuntu', url: 'https://medium.com/@nmwafa/hardening-web-server-di-linux-ubuntu-66c7803d3d7e' },
    '4': { title: 'Apa itu Fork bomb?', url: 'https://nmwafa.medium.com/apa-itu-fork-bomb-27a2a4d0ffe9' },
    '5': { title: 'HTB Skills Assessment — SQL Injection Fundamentals', url: 'https://medium.com/@nmwafa/htb-skills-assessment-sql-injection-fundamentals-4584dc7568a5' },
    '6': { title: 'Mengenal kerentanan desinkronisasi HTTP', url: 'https://nmwafa.medium.com/mengenal-kerentanan-desinkronisasi-http-7d59abef382b' },
    '7': { title: 'Pengenalan SELinux', url: 'https://nmwafa.medium.com/pengenalan-selinux-4e97fb4eab0b' }
};

const projects = [
    { name: 'Recon & Pillage', description: 'Automation script for subdomain search, technology detection, and categorizing based on status code, URL, and technology.', url: 'https://github.com/nmwafa/recon-pillage' },
    { name: 'ask', description: 'a lightweight, AI-powered Bash script designed for Linux systems. It integrates the OpenRouter API directly into your terminal to act as an expert Linux assistant.' , url: 'https://github.com/nmwafa/ask' }
];

const commands = {
    help: () => {
        return `
            <p class="mb-2">Available commands:</p>
            <ul class="list-inside list-disc">
                <li><span class="text-light-green dark:text-dark-green">whoami</span>       - Show information about me</li>
                <li><span class="text-light-green dark:text-dark-green">projects</span>     - See the list of projects</li>
                <li><span class="text-light-green dark:text-dark-green">blog</span>         - List of blog articles</li>
                <li><span class="text-light-green dark:text-dark-green">cert</span>         - See the certificate and letter of appreciation</li>
                <li><span class="text-light-green dark:text-dark-green">tools</span>        - List of ready-to-use web-based tools</li>
                <li><span class="text-light-green dark:text-dark-green">notes</span>        - Some of my notes</li>
                <li><span class="text-light-green dark:text-dark-green">contact</span>      - Show contact information</li>
                <li><span class="text-light-green dark:text-dark-green">clear</span>        - Clean the terminal screen</li>
                <li><span class="text-light-green dark:text-dark-green">welcome</span>      - Show the welcome message</li>
            </ul>
        `;
    },
    whoami: () => {
        return `
            <p>Wafa is a cybersecurity specialist who is passionate about web application security and linux system administration.</p>
            <p>He is dedicated to developing his skills and consistently keeping up with the latest trends in this area.</p>
            <p>Occasionally, he also contributes by helping secure systems for educational institutions and other organizations.</p>
        `;
    },
    projects: () => {
        let projectList = '<p class="mb-2">This is a project that I created:</p>';
        projects.forEach(p => {
            projectList += `
                <div class="mb-2">
                    <p class="text-light-cyan dark:text-dark-cyan font-bold">${p.name}</p>
                    <p class="pl-4"> ${p.description} <a href="${p.url}" target="_blank" class="underline">See project</a></p>
                </div>
            `;
        });
        return projectList;
    },
    blog: (args) => {
        if (args.length === 0 || args[0] === 'list') {
            let postList = '<p class="mb-2">Article in Indonesian. Use the command \'blog read [id]\' to read (e.g., blog read 1):</p>';
            Object.entries(blogPosts).forEach(([id, post]) => {
                postList += `<p><span class="text-light-cyan dark:text-dark-cyan">[${id}]</span> ${post.title} </p>`;
            });
            return postList;
        }
        if (args[0] === 'read' && args[1]) {
            const post = blogPosts[args[1]];
            if (post) {
                window.open(post.url, '_blank');
                return '';
            }
            return `<p class="text-light-red dark:text-dark-red">Article with ID '${args[1]}' not found!</p>`;
        }
        return `<p class="text-light-red dark:text-dark-red">Invalid command! Use 'blog list' or 'blog read [id]'</p>`;
    },
    cert: () => {
        window.open('https://drive.google.com/drive/folders/1LydeHP-hpuWUZEipSZV-B0h8dJloc89W?usp=sharing', '_blank');
        return '';
    },
    tools: () => {
        window.open('tools', '_self');
        return '';
    },
    notes: () => {
        window.open('notes', '_self');
        return '';
    },
    cheatsheets: () => {
        window.open('cheatsheets', '_self');
        return '';
    },
    contact: () => {
        return `
            <p>Let's connect...</p>
            <ul>
                <li>* Email: <a href="mailto:me@maswafa.my.id" class="underline text-light-blue dark:text-dark-blue">me@maswafa.my.id</a></li>
                <li>* GitHub: <a href="https://github.com/nmwafa" target="_blank" class="underline text-light-blue dark:text-dark-blue">nmwafa</a></li>
                <li>* LinkedIn: <a href="https://www.linkedin.com/in/nmwafa" target="_blank" class="underline text-light-blue dark:text-dark-blue">nmwafa</a></li>
            </ul>
        `;
    },
    clear: () => {
        output.innerHTML = '';
        return '';
    },
    welcome: () => {
        return getWelcomeMessage();
    },
    id: () => {
        return 'uid=0(root) gid=0(root) groups=0(root)';
    },
};

// --- Logika Terminal ---
commandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !commandInput.disabled) {
        commandInput.disabled = true;
        const fullCommand = commandInput.value.trim();
        
        // Selalu buat dan tampilkan baris prompt baru (meskipun input kosong)
        const promptLine = document.createElement('div');
        promptLine.innerHTML = `
            <div class="flex">
                <div class="flex-shrink-0 mr-2">
                    <span class="text-light-green dark:text-dark-green">root@localhost</span><span class="text-light-fg dark:text-dark-fg">:</span><span class="text-light-blue dark:text-dark-blue">~</span><span class="text-light-fg dark:text-dark-fg">#</span>
                </div>
                <div class="flex-grow break-all">${fullCommand}</div>
            </div>`;
        output.appendChild(promptLine);
        
        // Reset input
        commandInput.value = '';
        inputTextDisplay.textContent = '';

        // Eksekusi pencarian perintah hanya jika ada teks
        if (fullCommand) {
            const [command, ...args] = fullCommand.split(' ');

            const resultDiv = document.createElement('div');
            output.appendChild(resultDiv);

            if (commands[command]) {
                const result = commands[command](args);
                resultDiv.innerHTML = result;
            } else {
                resultDiv.innerHTML = `<p class="text-light-red dark:text-dark-red">${command}: command not found!<br>Type 'help' to see the list of commands</p>`;
            }
        }
                            
        terminalBody.scrollTop = terminalBody.scrollHeight;
        commandInput.disabled = false;
        commandInput.focus();
    }
});

// Sinkronkan teks dari input yang tersembunyi ke tampilan visual
commandInput.addEventListener('input', () => {
    if (inputTextDisplay) {
        inputTextDisplay.textContent = commandInput.value;
    }
});

// --- Tema ---
const setTheme = (theme) => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        themeIconLight.classList.remove('hidden');
        themeIconDark.classList.add('hidden');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        themeIconDark.classList.remove('hidden');
        themeIconLight.classList.add('hidden');
        localStorage.setItem('theme', 'light');
    }
};

themeToggle.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// --- Logika Fullscreen (Cross-Browser) ---
function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
        // Masuk Fullscreen
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        }
    } else {
        // Keluar Fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
    }
}

fullscreenToggle.addEventListener('click', toggleFullscreen);

// Update icon saat status fullscreen berubah (termasuk jika user tekan ESC)
function updateFullscreenIcons() {
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    if (isFullscreen) {
        fsIconExpand.classList.add('hidden');
        fsIconCompress.classList.remove('hidden');
    } else {
        fsIconExpand.classList.remove('hidden');
        fsIconCompress.classList.add('hidden');
    }
}

document.addEventListener('fullscreenchange', updateFullscreenIcons);
document.addEventListener('webkitfullscreenchange', updateFullscreenIcons);
document.addEventListener('mozfullscreenchange', updateFullscreenIcons);
document.addEventListener('MSFullscreenChange', updateFullscreenIcons);

// --- Inisialisasi ---
function getWelcomeMessage() {
    return `
        <p class="text-2xl font-bold text-light-green dark:text-dark-green mb-4">Welcome to the Interactive Portfolio!</p>
        <p>Type <span class="text-light-cyan dark:text-dark-cyan">'help'</span> to see the list of available commands</p>
        <br>
    `;
}
        
function initialize() {
    const preferredTheme = localStorage.getItem('theme');
    setTheme(preferredTheme || 'dark');
    output.innerHTML = getWelcomeMessage();
    // Saat terminal diklik di mana saja, fokuskan ke input
    terminalBody.addEventListener('click', (e) => {
        // Hindari re-focus jika yang diklik adalah link
        if (e.target.tagName !== 'A') {
            commandInput.focus();
        }
    });
    commandInput.focus();
}
initialize();
