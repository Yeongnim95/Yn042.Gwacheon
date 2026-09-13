const COPY_ICON = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="8" y="8" width="11" height="11" rx="2"></rect>
        <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"></path>
    </svg>`;
const INSTALL_COMMANDS = {
    mac: 'curl -fsSL https://raw.githubusercontent.com/scoynim/bible/main/install.sh | sh',
    windows: 'irm https://raw.githubusercontent.com/scoynim/bible/main/install.ps1 | iex',
    linux: 'curl -fsSL https://raw.githubusercontent.com/scoynim/bible/main/install.sh | sh'
};
const COPY_COMMANDS = [
    { command: 'v "太1:1"', title: ['中文經文', '중문 성경 구절'], description: ['複製單節中文經文', '중문 성경 한 절을 복사합니다'] },
    { command: 'v "太1:2-4、6 創2:1"', title: ['多段經文', '여러 성경 구절'], description: ['用空格串接書卷與範圍', '공백으로 여러 범위를 이어 복사합니다'] },
    { command: 'v "태1:1"', title: ['韓文經文', '한글 성경 구절'], description: ['使用韓文書卷簡寫複製', '한글 책 약어로 복사합니다'] }
];
const READ_COMMANDS = [
    { command: 'v -n "太10"', title: ['查看中文整章', '중문 장 보기'], description: ['只顯示，不修改剪貼簿', '터미널에만 표시하고 클립보드는 바꾸지 않습니다'] },
    { command: 'v -n "태10"', title: ['查看韓文整章', '한글 장 보기'], description: ['支援韓文書卷簡寫', '한글 책 약어를 지원합니다'] },
    { command: 'v -n "mat10 kr/cn"', title: ['查看中韓雙語', '한중 대조 보기'], description: ['每節韓文在前、中文在後', '각 절마다 한글 다음에 중문을 표시합니다'] }
];
const OTHER_COMMANDS = [
    { command: 'v -b', title: ['書卷簡寫表', '책 약어표'], description: ['查看中文、韓文、英文簡寫', '중문·한글·영문 약어를 확인합니다'] },
    { command: 'v -h', title: ['所有指令', '전체 명령어'], description: ['查看完整說明與語言代號', '전체 사용법과 언어 코드를 확인합니다'] },
    { command: 'v --version', title: ['版本資訊', '버전 정보'], description: ['確認目前安裝版本', '현재 설치된 버전을 확인합니다'] }
];
const TEXT = {
    zh: {
        badge: '離線中韓聖經 CLI',
        title: '在終端機閱讀與複製經文',
        intro: 'scoynim/bible 將網站的聖經資料與複製格式帶進終端機。安裝後可離線使用，不需要開啟瀏覽器，也不會呼叫 AI 或遠端伺服器。',
        support: '支援 macOS、Windows PowerShell 與 Linux',
        installTitle: '安裝',
        installDesc: '請先安裝 Node.js 20 以上版本，再選擇你的作業系統。',
        mac: 'macOS', windows: 'Windows PowerShell', linux: 'Linux',
        copy: '複製指令', copied: '已複製',
        npmLabel: '也可直接使用 npm',
        releaseNote: '發布提醒：一行安裝網址會在 scoynim/bible GitHub 儲存庫與 @scoynim/bible npm 套件正式發布後生效。',
        copySection: '複製經文',
        readSection: '查看整章',
        otherSection: '查詢與說明',
        formatTitle: '顯示格式',
        formatDesc: '排列方式與 scoynim.dev 網頁一致；雙語固定為韓文在前、中文在後。',
        terminalLabel: '終端機預覽',
        requirement: '需要 Node.js 20+',
        offline: '安裝後可離線使用'
    },
    ko: {
        badge: '오프라인 한중 성경 CLI',
        title: '터미널에서 성경을 읽고 복사하세요',
        intro: 'scoynim/bible은 웹사이트의 성경 데이터와 복사 형식을 터미널로 가져옵니다. 설치 후에는 브라우저, AI, 원격 서버 없이 오프라인으로 사용할 수 있습니다.',
        support: 'macOS, Windows PowerShell, Linux 지원',
        installTitle: '설치',
        installDesc: 'Node.js 20 이상을 먼저 설치한 뒤 운영체제를 선택하세요.',
        mac: 'macOS', windows: 'Windows PowerShell', linux: 'Linux',
        copy: '명령어 복사', copied: '복사됨',
        npmLabel: 'npm으로 직접 설치',
        releaseNote: '배포 안내: 한 줄 설치 주소는 scoynim/bible GitHub 저장소와 @scoynim/bible npm 패키지가 정식 배포된 뒤 사용할 수 있습니다.',
        copySection: '성경 구절 복사',
        readSection: '한 장 보기',
        otherSection: '조회와 도움말',
        formatTitle: '표시 형식',
        formatDesc: 'scoynim.dev 웹 형식과 같으며, 이중 언어는 항상 한글 다음에 중문을 표시합니다.',
        terminalLabel: '터미널 미리보기',
        requirement: 'Node.js 20+ 필요',
        offline: '설치 후 오프라인 사용'
    }
};
let activeLanguage = 'zh';
let activePlatform = 'mac';
let mountedRoot = null;
function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
function commandRows(items, t) {
    const languageIndex = activeLanguage === 'ko' ? 1 : 0;
    return items.map(item => `
        <article class="terminal-bible-command-row">
            <div class="terminal-bible-command-copy">
                <code>${escapeHtml(item.command)}</code>
                <button type="button" class="terminal-bible-copy-icon" data-copy="${escapeHtml(item.command)}" aria-label="${escapeHtml(t.copy)}" title="${escapeHtml(t.copy)}">${COPY_ICON}</button>
            </div>
            <div class="terminal-bible-command-text">
                <strong>${escapeHtml(item.title[languageIndex])}</strong>
                <span>${escapeHtml(item.description[languageIndex])}</span>
            </div>
        </article>`).join('');
}
function render() {
    if (!mountedRoot) return;
    const t = TEXT[activeLanguage] || TEXT.zh;
    const installCommand = INSTALL_COMMANDS[activePlatform];
    mountedRoot.innerHTML = `
        <div class="terminal-bible-page">
            <header class="terminal-bible-header">
                <div class="terminal-bible-mark" aria-hidden="true">
                    <span>&gt;_</span>
                </div>
                <div class="terminal-bible-heading">
                    <span class="terminal-bible-badge">${escapeHtml(t.badge)}</span>
                    <h1>scoynim/bible</h1>
                    <p>${escapeHtml(t.title)}</p>
                </div>
            </header>
            <p class="terminal-bible-intro">${escapeHtml(t.intro)}</p>
            <div class="terminal-bible-facts" aria-label="${escapeHtml(t.support)}">
                <span>${escapeHtml(t.support)}</span>
                <span>${escapeHtml(t.requirement)}</span>
                <span>${escapeHtml(t.offline)}</span>
            </div>
            <section class="terminal-bible-install" aria-labelledby="terminalBibleInstallTitle">
                <div class="terminal-bible-section-heading">
                    <div>
                        <h2 id="terminalBibleInstallTitle">${escapeHtml(t.installTitle)}</h2>
                        <p>${escapeHtml(t.installDesc)}</p>
                    </div>
                </div>
                <div class="terminal-bible-platforms" role="tablist" aria-label="${escapeHtml(t.support)}">
                    ${['mac', 'windows', 'linux'].map(platform => `
                        <button type="button" role="tab" data-platform="${platform}" aria-selected="${activePlatform === platform}" class="${activePlatform === platform ? 'active' : ''}">${escapeHtml(t[platform])}</button>`).join('')}
                </div>
                <div class="terminal-bible-install-command">
                    <span class="terminal-bible-prompt" aria-hidden="true">$</span>
                    <code>${escapeHtml(installCommand)}</code>
                    <button type="button" class="terminal-bible-copy-button" data-copy="${escapeHtml(installCommand)}">${COPY_ICON}<span>${escapeHtml(t.copy)}</span></button>
                </div>
                <div class="terminal-bible-npm-row">
                    <span>${escapeHtml(t.npmLabel)}</span>
                    <code>npm install --global @scoynim/bible</code>
                    <button type="button" class="terminal-bible-copy-icon" data-copy="npm install --global @scoynim/bible" aria-label="${escapeHtml(t.copy)}" title="${escapeHtml(t.copy)}">${COPY_ICON}</button>
                </div>
                <p class="terminal-bible-release-note">${escapeHtml(t.releaseNote)}</p>
            </section>
            <div class="terminal-bible-reference-grid">
                <section class="terminal-bible-reference" aria-labelledby="terminalBibleCopyTitle">
                    <h2 id="terminalBibleCopyTitle">${escapeHtml(t.copySection)}</h2>
                    ${commandRows(COPY_COMMANDS, t)}
                </section>
                <section class="terminal-bible-reference" aria-labelledby="terminalBibleReadTitle">
                    <h2 id="terminalBibleReadTitle">${escapeHtml(t.readSection)}</h2>
                    ${commandRows(READ_COMMANDS, t)}
                </section>
            </div>
            <section class="terminal-bible-reference terminal-bible-reference-other" aria-labelledby="terminalBibleOtherTitle">
                <h2 id="terminalBibleOtherTitle">${escapeHtml(t.otherSection)}</h2>
                <div class="terminal-bible-other-grid">${commandRows(OTHER_COMMANDS, t)}</div>
            </section>
            <section class="terminal-bible-preview" aria-labelledby="terminalBibleFormatTitle">
                <div class="terminal-bible-preview-heading">
                    <div>
                        <span>${escapeHtml(t.terminalLabel)}</span>
                        <h2 id="terminalBibleFormatTitle">${escapeHtml(t.formatTitle)}</h2>
                    </div>
                    <p>${escapeHtml(t.formatDesc)}</p>
                </div>
                <pre><code><span class="terminal-bible-preview-prompt">$</span> v -n "mat1 kr/cn"
마태복음 1장
馬太福音 第1章
耶穌基督的家譜
1
아브라함과 다윗의 자손 예수 그리스도의 세계라
亞伯拉罕的後裔，大衛的子孫，耶穌基督的家譜：</code></pre>
            </section>
        </div>`;
    bindEvents();
}
async function copyText(button, value) {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(value);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = value;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
        }
        button.classList.add('copied');
        const label = button.querySelector('span');
        const previous = label?.textContent;
        if (label) label.textContent = TEXT[activeLanguage].copied;
        window.setTimeout(() => {
            button.classList.remove('copied');
            if (label) label.textContent = previous;
        }, 1400);
    } catch (error) {
        console.error('Unable to copy terminal command:', error);
    }
}
function bindEvents() {
    mountedRoot.querySelectorAll('[data-platform]').forEach(button => {
        button.addEventListener('click', () => {
            activePlatform = button.dataset.platform;
            render();
        });
    });
    mountedRoot.querySelectorAll('[data-copy]').forEach(button => {
        button.addEventListener('click', () => copyText(button, button.dataset.copy));
    });
}
export function mountTerminalBible({ root, language = 'zh' }) {
    mountedRoot = root;
    activeLanguage = language === 'ko' ? 'ko' : 'zh';
    render();
    window.updateTerminalBibleLanguage = (nextLanguage) => {
        activeLanguage = nextLanguage === 'ko' ? 'ko' : 'zh';
        render();
    };
}