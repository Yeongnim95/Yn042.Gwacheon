// --- APP VERSION ---
const APP_VERSION = '20260923131410';
window.__APP_VERSION__ = APP_VERSION;
function getInitialLanguage() {
    const saved = localStorage.getItem('app_lang');
    if (saved === 'ko' || saved === 'zh') return saved;
    const systemLangs = navigator.languages?.length ? navigator.languages : [navigator.language || 'ko'];
    for (const lang of systemLangs) {
        const normalized = String(lang || '').toLowerCase();
        if (normalized.startsWith('zh')) return 'zh';
        if (normalized.startsWith('ko')) return 'ko';
    }
    return 'ko';
}
let currentLang = getInitialLanguage();
// --- 日期自動更新功能 ---
function getTodayDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function updateDateInput() {
    const dateInput = document.getElementById('recordDate');
    if (dateInput) {
        dateInput.value = getTodayDateString();
    }
    const offlineDateInput = document.getElementById('offlineRecordDate');
    if (offlineDateInput) {
        offlineDateInput.value = getTodayDateString();
    }
}
// --- 每天0點自動重新整理並更新日期功能 ---
function setupMidnightRefresh() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    setTimeout(() => {
        // 0點時自動重新整理頁面
        location.reload();
    }, msUntilMidnight);
    console.log(`Auto-refresh scheduled in ${Math.round(msUntilMidnight / 1000 / 60)} minutes (at midnight).`);
}
setupMidnightRefresh();
// 監聽頁面可見性變化，當使用者重新回到頁面時更新日期
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        updateDateInput();
        console.log('Page visible, date updated to:', getTodayDateString());
    }
});
const i18n = {
    ko: {
        appTitle: "전도 관리 시스템",
        // 主選單
        menuHome: "홈", menuNotifications: "알림", menuFaith: "나의 신앙",
        devBadge: "개발 중",
        // 首頁
        homeSubtitle: "복음의 열매를 기록하고 관리하세요",
        homeCardBible: "성경", homeCardBibleDesc: "말씀을 읽고 복사하세요",
        copyrightMain: "Yeongnim 개인 소유",
        // 首頁第二頁
        homeFeatBibleTitle: "읽기", homeFeatBibleDesc: "말씀을 읽고, 묵상하고,\n마음에 새기는 시간",
        homeFeatAutoTitle: "에이전트 관리", homeFeatAutoDesc: "신앙 생활을 체계적으로\n관리하고 성장하는 도구",
        // 今日默想
        dailyVerseLabel: "오늘의 묵상", scrollHint: "아래로 스크롤",
        // 我的信仰
        btnDailyFaith: "매일 신앙 기록", btnFaithChart: "신앙 기록 차트",
        headerDailyFaith: "매일 신앙 기록", headerFaithChart: "신앙 기록 차트",
        txtDailyFaithDesc: "이 페이지에서 매일의 신앙 생활을 기록할 수 있습니다.",
        txtFaithChartDesc: "이 페이지에서 신앙 기록의 통계 차트를 볼 수 있습니다.",
        // AI代理管理
        menuFaithAuto: "에이전트 관리",
        // 書籍
        menuBooks: "서적", btnBible: "성경", btnLordsPrayer: "주기도문", btnVerseCloze: "성경 빈칸 게임", btnTerminalBible: "터미널 성경",
        txtOldTestament: "구약성경 / 舊約聖經", txtNewTestament: "신약성경 / 新約聖經",
        txtBibleBack: "뒤로",
        bibleCollectionTitle: "즐겨찾기",
        bibleFavoritesTitle: "좋아하는 구절",
        bibleAnalysesTitle: "분석 저장",
        bibleCloudLogin: "클라우드 로그인 저장",
        bibleCloudDataManage: "자료 관리",
        bibleCloudLastSync: "동기화 시간",
        bibleCloudNeverSynced: "아직 동기화 없음",
        bibleCloudLogout: "로그아웃",
        bibleCloudGoogle: "Google Drive",
        bibleCloudOneDrive: "OneDrive",
        bibleSyncLocal: "로컬 저장",
        bibleSyncReady: "준비 동기화",
        bibleSyncSyncing: "동기화 중",
        bibleSyncConnected: "클라우드 연결됨",
        bibleSyncDisconnected: "클라우드 연결 끊김",
        bibleCloudConnectFail: "Google Drive 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        bibleSyncChoiceConflictTitle: "동기화 방법 선택",
        bibleSyncChoiceConflictDesc: "이 기기와 Google Drive에 모두 저장된 컬렉션이 있습니다. 어떤 방식으로 동기화할까요?",
        bibleSyncChoiceLocalOnlyTitle: "이 기기의 컬렉션 업로드",
        bibleSyncChoiceLocalOnlyDesc: "Google Drive에는 아직 컬렉션이 없습니다. 이 기기의 컬렉션을 클라우드에 저장할까요?",
        bibleSyncChoiceCloudOnlyTitle: "클라우드 컬렉션 다운로드",
        bibleSyncChoiceCloudOnlyDesc: "Google Drive에 저장된 컬렉션이 있습니다. 이 기기로 가져올까요?",
        bibleSyncChoiceMerge: "합쳐서 동기화",
        bibleSyncChoiceUseCloud: "클라우드 사용",
        bibleSyncChoiceUseLocal: "이 기기 업로드",
        bibleSyncChoiceDownloadCloud: "클라우드 가져오기",
        bibleSyncChoiceLater: "나중에",
        bibleFavoritesEmpty: "좋아하는 구절이 없습니다.",
        bibleAnalysesEmpty: "저장된 분석이 없습니다.",
        bibleCollectionEdit: "편집",
        bibleCollectionDone: "완료",
        bibleFavoriteNoteAdd: "묵상 추가",
        bibleFavoriteNoteDelete: "묵상 삭제",
        bibleFavoriteNotePlaceholder: "이 구절에 대한 묵상이나 적용을 적어보세요...",
        bibleFavoriteNoteSave: "저장",
        bibleFavoriteNoteCancel: "취소",
        // 설정
        menuSettings: "설정",
        settingsHeader: "설정",
        settingsLanguageSection: "언어",
        settingsLanguageTitle: "표시 언어",
        settingsLanguageDesc: "웹사이트에 표시할 언어를 선택하세요",
        settingsLanguageKo: "한국어",
        settingsLanguageZh: "中文",
        settingsLanguageKoPreview: "한국어로 보기",
        settingsLanguageZhPreview: "중국어 번체로 보기",
        settingsFontSection: "글꼴",
        settingsAboutSection: "정보",
        settingsSerifTitle: "명조체 패키지",
        settingsSerifDesc: "성경 본문에 사용할 명조체 글꼴 (수동 설치)",
        settingsStatusLabel: "상태",
        settingsSizeLabel: "크기",
        settingsVersionLabel: "버전",
        settingsAppVersionLabel: "웹사이트 버전",
        settingsStatusNotInstalled: "미설치",
        settingsStatusInstalled: "설치됨",
        settingsStatusInstalling: "설치 중",
        settingsBtnInstall: "설치",
        settingsBtnUninstall: "제거",
        settingsBtnReinstall: "재설치",
        settingsBtnUpdate: "업데이트",
        settingsUpdateAvailable: "새 버전 사용 가능",
        settingsFontPickerTitle: "성경 글꼴 선택",
        settingsFontPickerDesc: "성경 본문 및 주기도문에 사용될 글꼴을 선택하세요",
        settingsFontSans: "고딕체",
        settingsFontSerif: "명조체",
        settingsFontSansPreview: "말씀을 또렷하게 읽기",
        settingsFontSerifPreview: "태초에 하나님이 천지를 창조하시니라",
        settingsFontSerifLocked: "※ 명조체 패키지 설치 필요",
        settingsSerifWarning: "※ 이 패키지를 다운로드하면 웹사이트 초기 로딩 속도가 느려질 수 있습니다.",
        settingsConfirmUninstall: "명조체 패키지를 제거하시겠습니까? 다음 사용 시 다시 다운로드가 필요합니다.",
        settingsInstallStart: "다운로드 시작",
        settingsInstallCss: "CSS 다운로드 중",
        settingsInstallParse: "글꼴 목록 분석 중",
        settingsInstallDownload: "글꼴 다운로드",
        settingsInstallActivate: "활성화 중",
        settingsInstallDone: "완료",
        settingsInstallFailed: "설치 실패",
        serifNotInstalledHint: "먼저 설정 페이지에서 명조체 패키지를 설치하세요"
    },
    zh: {
        appTitle: "傳道整理系統",
        // 主選單
        menuHome: "首頁", menuNotifications: "通知", menuFaith: "我的信仰",
        devBadge: "開發中",
        // 首頁
        homeSubtitle: "記錄並管理福音的果子",
        homeCardBible: "聖經", homeCardBibleDesc: "閱讀並複製經文",
        copyrightMain: "Yeongnim個人所有",
        // 首頁第二頁
        homeFeatBibleTitle: "閱讀", homeFeatBibleDesc: "閱讀、默想，\n將話語刻在心中",
        homeFeatAutoTitle: "AI代理管理", homeFeatAutoDesc: "系統化管理信仰生活，\n持續成長的工具",
        // 今日默想
        dailyVerseLabel: "今日默想", scrollHint: "向下滾動",
        // 我的信仰
        btnDailyFaith: "每日信仰記錄", btnFaithChart: "信仰記錄圖",
        headerDailyFaith: "每日信仰記錄", headerFaithChart: "信仰記錄圖",
        txtDailyFaithDesc: "在此頁面記錄每日的信仰生活。",
        txtFaithChartDesc: "在此頁面查看信仰記錄的統計圖表。",
        // AI代理管理
        menuFaithAuto: "AI代理管理",
        // 書籍
        menuBooks: "書籍", btnBible: "聖經", btnLordsPrayer: "主祈禱文", btnVerseCloze: "經文填空遊戲", btnTerminalBible: "終端版本聖經",
        txtOldTestament: "구약성경 / 舊約聖經", txtNewTestament: "신약성경 / 新約聖經",
        txtBibleBack: "返回",
        bibleCollectionTitle: "收藏",
        bibleFavoritesTitle: "喜愛經文",
        bibleAnalysesTitle: "分析收藏",
        bibleCloudLogin: "雲端登入儲存",
        bibleCloudDataManage: "資料管理",
        bibleCloudLastSync: "同步時間",
        bibleCloudNeverSynced: "尚未同步",
        bibleCloudLogout: "登出",
        bibleCloudGoogle: "Google Drive",
        bibleCloudOneDrive: "OneDrive",
        bibleSyncLocal: "本地儲存",
        bibleSyncReady: "準備同步",
        bibleSyncSyncing: "同步中",
        bibleSyncConnected: "雲端已連線",
        bibleSyncDisconnected: "雲端斷連",
        bibleCloudConnectFail: "Google Drive 連線失敗，請稍後再試。",
        bibleSyncChoiceConflictTitle: "選擇同步方式",
        bibleSyncChoiceConflictDesc: "這台裝置和 Google Drive 都有收藏資料，請選擇要怎麼同步。",
        bibleSyncChoiceLocalOnlyTitle: "上傳這台裝置的收藏",
        bibleSyncChoiceLocalOnlyDesc: "Google Drive 還沒有收藏資料，要把這台裝置的收藏存到雲端嗎？",
        bibleSyncChoiceCloudOnlyTitle: "下載雲端收藏",
        bibleSyncChoiceCloudOnlyDesc: "Google Drive 已經有收藏資料，要下載到這台裝置嗎？",
        bibleSyncChoiceMerge: "合併同步",
        bibleSyncChoiceUseCloud: "使用雲端",
        bibleSyncChoiceUseLocal: "上傳本機",
        bibleSyncChoiceDownloadCloud: "下載雲端",
        bibleSyncChoiceLater: "稍後再說",
        bibleFavoritesEmpty: "尚未加入喜愛經文。",
        bibleAnalysesEmpty: "尚未儲存分析。",
        bibleCollectionEdit: "編輯",
        bibleCollectionDone: "完成",
        bibleFavoriteNoteAdd: "加入心得",
        bibleFavoriteNoteDelete: "刪除心得",
        bibleFavoriteNotePlaceholder: "寫下這節經文的心得或實踐...",
        bibleFavoriteNoteSave: "儲存",
        bibleFavoriteNoteCancel: "取消",
        // 設定
        menuSettings: "設定",
        settingsHeader: "設定",
        settingsLanguageSection: "語言",
        settingsLanguageTitle: "顯示語言",
        settingsLanguageDesc: "選擇網站顯示語言",
        settingsLanguageKo: "한국어",
        settingsLanguageZh: "中文",
        settingsLanguageKoPreview: "以韓文顯示",
        settingsLanguageZhPreview: "以繁體中文顯示",
        settingsFontSection: "字體",
        settingsAboutSection: "關於",
        settingsSerifTitle: "宋體字包",
        settingsSerifDesc: "聖經本文使用的宋體字（手動安裝）",
        settingsStatusLabel: "狀態",
        settingsSizeLabel: "容量",
        settingsVersionLabel: "版本",
        settingsAppVersionLabel: "網站版本",
        settingsStatusNotInstalled: "未安裝",
        settingsStatusInstalled: "已安裝",
        settingsStatusInstalling: "安裝中",
        settingsBtnInstall: "安裝",
        settingsBtnUninstall: "移除",
        settingsBtnReinstall: "重新安裝",
        settingsBtnUpdate: "更新",
        settingsUpdateAvailable: "有新版本",
        settingsFontPickerTitle: "聖經字體選擇",
        settingsFontPickerDesc: "選擇聖經本文及主禱文使用的字體",
        settingsFontSans: "黑體",
        settingsFontSerif: "宋體",
        settingsFontSansPreview: "清楚俐落地閱讀經文",
        settingsFontSerifPreview: "起初，神創造天地",
        settingsFontSerifLocked: "※ 需先安裝宋體字包",
        settingsSerifWarning: "※ 下載此字體包後，網頁初次載入速度可能會變慢。",
        settingsConfirmUninstall: "確定要移除宋體字包嗎？下次使用時需重新下載。",
        settingsInstallStart: "開始下載",
        settingsInstallCss: "下載 CSS 中",
        settingsInstallParse: "解析字型清單",
        settingsInstallDownload: "下載字型",
        settingsInstallActivate: "啟用中",
        settingsInstallDone: "完成",
        settingsInstallFailed: "安裝失敗",
        serifNotInstalledHint: "請先到設定頁安裝宋體字包"
    }
};
// Shared Bible AI endpoint. Contact-management AI has been removed.
const AI_WORKER_URL = 'https://gemini-proxy.may90613may90613.workers.dev';
async function fetchAiWorker(prompt) {
    return fetch(AI_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    });
}
function getAllBibleBooks() {
    return [...bibleBooks.oldTestament, ...bibleBooks.newTestament];
}
function getBibleChapterPath(book, chapter) {
    return `/bible/${book.id}${chapter}`;
}
function parseBibleChapterPath(pathname = window.location.pathname) {
    const path = String(pathname).replace(/^\//, '').replace(/\/$/, '');
    if (!path.startsWith('bible/')) return null;
    const slug = path.slice('bible/'.length).toLowerCase();
    const booksByIdLength = getAllBibleBooks().sort((a, b) => b.id.length - a.id.length);
    for (const book of booksByIdLength) {
        if (!slug.startsWith(book.id)) continue;
        const chapterText = slug.slice(book.id.length);
        if (!/^\d+$/.test(chapterText)) continue;
        const chapter = Number(chapterText);
        if (chapter >= 1 && chapter <= book.chapters) {
            return { book, chapter };
        }
    }
    return null;
}
function getPageFromPath() {
    const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
    if (path) {
        if (parseBibleChapterPath(window.location.pathname)) return 'bible';
        const reverseMap = {
            'home': 'home',
            'notifications': 'notifications',
            'bible': 'bible',
            'faith-auto': 'faithAuto',
            'faith-chart': 'faith-chart',
            'daily-faith': 'daily-faith',
            'lords-prayer': 'lords-prayer',
            'verse-cloze': 'verse-cloze',
            'terminal-bible': 'terminal-bible',
            'settings': 'settings'
        };
        if (reverseMap[path]) return reverseMap[path];
    }
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash) {
        const reverseMap = {
            'home': 'home', 'notifications': 'notifications', 'bible': 'bible',
            'faith-auto': 'faithAuto', 'faith-chart': 'faith-chart',
            'daily-faith': 'daily-faith', 'lords-prayer': 'lords-prayer',
            'verse-cloze': 'verse-cloze',
            'terminal-bible': 'terminal-bible',
            'settings': 'settings'
        };
        const page = reverseMap[hash];
        if (page) {
            const pathMap = {
                'home': '/', 'notifications': '/notifications', 'bible': '/bible',
                'faithAuto': '/faith-auto', 'faith-chart': '/faith-chart',
                'daily-faith': '/daily-faith', 'lords-prayer': '/lords-prayer',
                'verse-cloze': '/verse-cloze',
                'terminal-bible': '/terminal-bible',
                'settings': '/settings'
            };
            history.replaceState(null, '', pathMap[page] || '/');
            return page;
        }
    }
    return 'home';
}
// 監聽瀏覽器上一頁/下一頁
window.addEventListener('popstate', () => {
    const bibleSection = document.getElementById('bibleSection');
    const bibleContentView = document.getElementById('bibleContentView');
    if (bibleSection?.classList.contains('active-section') && bibleContentView?.classList.contains('show')) {
        window.closeBibleContent({ fromHistory: true });
        return;
    }
    closeTransientBiblePanels();
    const page = getPageFromPath();
    if (page) {
        switchPage(page);
    }
});
function closeTransientBiblePanels() {
    document.getElementById('bibleSearchPreview')?.classList.remove('show');
    document.getElementById('bibleSearchPanel')?.classList.remove('show');
    document.getElementById('bibleSearchOverlay')?.classList.remove('show');
    document.getElementById('biblePartialCopyModal')?.classList.remove('show');
    window.closeBibleDisplayPanel?.();
    window.closeNotificationPanel?.();
    closeBibleChaptersPopover?.();
    syncUiScrollLock();
}
function isUiScrollLockNeeded() {
    return Boolean(
        document.querySelector('.bible-collection-list.show') ||
        document.getElementById('aiPanel')?.classList.contains('show') ||
        document.getElementById('bibleSearchPanel')?.classList.contains('show') ||
        document.getElementById('bibleDisplayPanel')?.classList.contains('show') ||
        document.getElementById('notificationPanel')?.classList.contains('show')
    );
}
let uiScrollLockY = 0;
function syncUiScrollLock() {
    const shouldLock = isUiScrollLockNeeded();
    const isLocked = document.body?.classList.contains('ui-scroll-locked');
    if (shouldLock && !isLocked) {
        uiScrollLockY = window.scrollY || document.documentElement.scrollTop || 0;
        document.body?.style.setProperty('--ui-scroll-lock-top', `${-uiScrollLockY}px`);
    }
    document.documentElement.classList.toggle('ui-scroll-locked', shouldLock);
    document.body?.classList.toggle('ui-scroll-locked', shouldLock);
    if (!shouldLock && isLocked) {
        document.body?.style.removeProperty('--ui-scroll-lock-top');
        window.scrollTo({ top: uiScrollLockY, left: 0, behavior: 'auto' });
    }
}
function focusWithoutPageScroll(element) {
    if (!element) return;
    const scrollRoot = document.scrollingElement;
    const scrollLeft = scrollRoot?.scrollLeft ?? window.scrollX;
    const scrollTop = scrollRoot?.scrollTop ?? window.scrollY;
    try {
        element.focus({ preventScroll: true });
    } catch (error) {
        element.focus();
    }
    if (scrollRoot) {
        scrollRoot.scrollLeft = scrollLeft;
        scrollRoot.scrollTop = scrollTop;
    } else {
        window.scrollTo(scrollLeft, scrollTop);
    }
}
const UI_SCROLL_SURFACE_SELECTOR = [
    '.ai-panel-result-item .result-text', '.ai-panel-body', '.ai-panel-result', '.bible-search-body',
    '.bible-search-preview-body', '.bible-display-body',
    '.bible-collection-panel-body', '.notification-panel-body'
].join(',');
let uiTouchStartY = 0;
function getUiScrollSurfaces(target) {
    const surfaces = [];
    let element = target instanceof Element ? target : target?.parentElement;
    while (element && element !== document.body) {
        if (element.matches?.(UI_SCROLL_SURFACE_SELECTOR)) surfaces.push(element);
        element = element.parentElement;
    }
    return surfaces;
}
function canUiSurfaceScroll(surface, direction) {
    if (!surface || surface.scrollHeight <= surface.clientHeight + 1) return false;
    if (direction < 0) return surface.scrollTop > 0;
    if (direction > 0) {
        return surface.scrollTop + surface.clientHeight < surface.scrollHeight - 1;
    }
    return true;
}
document.addEventListener('touchstart', (event) => {
    if (!document.body?.classList.contains('ui-scroll-locked')) return;
    uiTouchStartY = event.touches?.[0]?.clientY || 0;
}, { passive: true, capture: true });
document.addEventListener('touchmove', (event) => {
    if (!document.body?.classList.contains('ui-scroll-locked')) return;
    const currentY = event.touches?.[0]?.clientY || uiTouchStartY;
    const scrollDirection = currentY < uiTouchStartY ? 1 : -1;
    const surfaces = getUiScrollSurfaces(event.target);
    if (surfaces.some(surface => canUiSurfaceScroll(surface, scrollDirection))) return;
    event.preventDefault();
}, { passive: false });
document.addEventListener('wheel', (event) => {
    if (!document.body?.classList.contains('ui-scroll-locked')) return;
    const surfaces = getUiScrollSurfaces(event.target);
    if (surfaces.some(surface => canUiSurfaceScroll(surface, Math.sign(event.deltaY)))) return;
    event.preventDefault();
}, { passive: false });
window.onload = function() {
    applyBibleDisplayPreferences();
    document.querySelectorAll('input[name="settingsLanguageMode"]').forEach(input => {
        input.checked = input.value === currentLang;
    });
    initMainMenuSubmenus();
    // 處理 404.html SPA 路由轉址（?p=bible → /bible）
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPage = urlParams.get('p');
    if (redirectPage) {
        const pathMap = {
            'bible': '/bible', 'faith-auto': '/faith-auto',
            'faith-chart': '/faith-chart', 'daily-faith': '/daily-faith',
            'lords-prayer': '/lords-prayer',
            'verse-cloze': '/verse-cloze',
            'terminal-bible': '/terminal-bible',
            'notifications': '/notifications',
            'settings': '/settings',
            'home': '/'
        };
        const cleanPath = /^bible\/[a-z0-9]+\d+$/i.test(redirectPage)
            ? `/${redirectPage.toLowerCase()}`
            : (pathMap[redirectPage] || '/');
        history.replaceState(null, '', cleanPath);
    }
    // 讀取 URL path（支援 clean URL + 舊版 hash 相容）
    const currentPage = getPageFromPath();
    if (currentPage && currentPage !== 'home') {
        switchPage(currentPage);
    } else {
        switchPage('home');
    }
    applyLanguage();
    initBackToTop();
    initNotificationCenter();
    checkForAppUpdates();
    setInterval(checkForAppUpdates, 2 * 60 * 1000);
};
const PAGE_LOAD_VERSION = APP_VERSION;
const UPDATE_RELOAD_KEY = 'app_update_reload_version';
async function checkForAppUpdates() {
    try {
        const res = await fetch(`/app.js?_v=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) return;
        const source = await res.text();
        const match = source.match(/const\s+APP_VERSION\s*=\s*['"]([^'"]+)['"]/);
        if (!match) return;
        const remoteVersion = match[1];
        if (remoteVersion && remoteVersion !== PAGE_LOAD_VERSION) {
            if (sessionStorage.getItem(UPDATE_RELOAD_KEY) === remoteVersion) return;
            sessionStorage.setItem(UPDATE_RELOAD_KEY, remoteVersion);
            window.location.reload();
        }
    } catch (err) {
        console.warn('App update check failed:', err);
    }
}
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) checkForAppUpdates();
});
window.setLanguage = (lang) => {
    if (lang !== 'ko' && lang !== 'zh') lang = 'ko';
    currentLang = lang;
    localStorage.setItem('app_lang', lang); // 永久儲存語言設定
    document.querySelectorAll('input[name="settingsLanguageMode"]').forEach(input => {
        input.checked = input.value === currentLang;
    });
    applyLanguage();
};
const navIconSvg = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-5h5v5"/></svg>',
    bell: '<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>',
    circuit: '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="8" height="8" rx="2"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.6 2.6M16.4 16.4 19 19M19 5l-2.6 2.6M7.6 16.4 5 19"/></svg>',
    book: '<svg viewBox="0 0 24 24"><path d="M4.5 5.5c2.2-.9 4.6-.6 7.5 1.1v12.2c-2.7-1.6-5.1-2-7.5-1.1z"/><path d="M19.5 5.5c-2.2-.9-4.6-.6-7.5 1.1v12.2c2.7-1.6 5.1-2 7.5-1.1z"/><path d="M12 6.6v12.2"/></svg>',
    pen: '<svg viewBox="0 0 24 24"><path d="M4 20h13"/><path d="M14.8 4.2 19.8 9.2"/><path d="M17.9 6.1 8.2 15.8 4.8 17l1.2-3.4 9.7-9.7z"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.4M12 18.8v2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M2.8 12h2.4M18.8 12h2.4M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/><path d="M8.8 3.7 7.7 6.1M16.3 17.9l-1.1 2.4M3.7 15.2l2.4 1.1M17.9 7.7l2.4 1.1M3.7 8.8l2.4-1.1M17.9 16.3l2.4-1.1M8.8 20.3l-1.1-2.4M16.3 6.1l-1.1-2.4"/></svg>'
};
function getCurrentNavIconName() {
    const activeSection = document.querySelector('.page-section.active-section');
    const sectionId = activeSection?.id || 'homeSection';
    if (sectionId === 'homeSection') return 'home';
    if (sectionId === 'notificationsSection') return 'bell';
    if (sectionId === 'faithAutoSection') return 'circuit';
    if (sectionId === 'bibleSection' || sectionId === 'lordsPrayerSection' || sectionId === 'verseClozeSection' || sectionId === 'terminalBibleSection') return 'book';
    if (sectionId === 'dailyFaithSection' || sectionId === 'faithChartSection') return 'pen';
    if (sectionId === 'settingsSection') return 'settings';
    return 'home';
}
function updateCurrentNavIcon() {
    const iconEl = document.getElementById('current-page-icon');
    if (!iconEl) return;
    iconEl.innerHTML = navIconSvg[getCurrentNavIconName()] || navIconSvg.home;
}
function applyLanguage() {
    const t = i18n[currentLang];
    document.documentElement.lang = currentLang === 'zh' ? 'zh-Hant' : 'ko';
    document.querySelectorAll('input[name="settingsLanguageMode"]').forEach(input => {
        input.checked = input.value === currentLang;
    });
    const map = {
        'txt-app-title': t.appTitle,
        // 主選單
        'menu-home-title': t.menuHome, 'menu-notifications-title': t.menuNotifications, 'menu-faith-auto-title': t.menuFaithAuto,
        'menu-settings-title': t.menuSettings,
        // 設定頁面
        'txt-settings-header': t.settingsHeader,
        'txt-settings-language-section': t.settingsLanguageSection,
        'txt-settings-language-title': t.settingsLanguageTitle,
        'txt-settings-language-desc': t.settingsLanguageDesc,
        'txt-settings-language-ko': t.settingsLanguageKo,
        'txt-settings-language-zh': t.settingsLanguageZh,
        'txt-settings-language-ko-preview': t.settingsLanguageKoPreview,
        'txt-settings-language-zh-preview': t.settingsLanguageZhPreview,
        'txt-settings-font-section': t.settingsFontSection,
        'txt-settings-about-section': t.settingsAboutSection,
        'txt-settings-serif-title': t.settingsSerifTitle,
        'txt-settings-serif-desc': t.settingsSerifDesc,
        'txt-settings-serif-status-label': t.settingsStatusLabel,
        'txt-settings-serif-size-label': t.settingsSizeLabel,
        'txt-settings-serif-version-label': t.settingsVersionLabel,
        'txt-settings-version-label': t.settingsAppVersionLabel,
        'txt-settings-font-picker-title': t.settingsFontPickerTitle,
        'txt-settings-font-picker-desc': t.settingsFontPickerDesc,
        'txt-settings-font-sans': t.settingsFontSans,
        'txt-settings-font-serif': t.settingsFontSerif,
        'txt-settings-font-sans-preview': t.settingsFontSansPreview,
        'txt-settings-font-serif-preview': t.settingsFontSerifPreview,
        'txt-settings-font-serif-locked': t.settingsFontSerifLocked,
        'txt-settings-serif-warning': t.settingsSerifWarning,
        'menu-books-title': t.menuBooks,
        // 首頁
        'home-subtitle': t.homeSubtitle,
        'home-card-bible': t.homeCardBible, 'home-card-bible-desc': t.homeCardBibleDesc,
        // 我的信仰
        'btn-daily-faith': t.btnDailyFaith, 'btn-faith-chart': t.btnFaithChart,
        'txt-daily-faith-header': t.headerDailyFaith, 'txt-faith-chart-header': t.headerFaithChart,
        'txt-daily-faith-desc': t.txtDailyFaithDesc, 'txt-faith-chart-desc': t.txtFaithChartDesc,
        // 書籍
        'btn-bible': t.btnBible,
        'btn-lords-prayer': t.btnLordsPrayer,
        'btn-verse-cloze': t.btnVerseCloze,
        'btn-terminal-bible': t.btnTerminalBible,
        'txt-old-testament': t.txtOldTestament, 'txt-new-testament': t.txtNewTestament,
        'txt-bible-back': t.txtBibleBack,
        'txt-bible-collection-title': t.bibleCollectionTitle,
        'txt-bible-cloud-login': t.bibleCloudLogin,
        'txt-bible-data-manage': t.bibleCloudDataManage,
        'txt-bible-cloud-logout': t.bibleCloudLogout,
        'txt-bible-cloud-google': t.bibleCloudGoogle,
        'txt-bible-cloud-onedrive': t.bibleCloudOneDrive,
        'txt-bible-favorites-title': t.bibleFavoritesTitle,
        'txt-bible-analyses-title': t.bibleAnalysesTitle,
        'txt-bible-collection-edit': bibleCollectionEditMode ? t.bibleCollectionDone : t.bibleCollectionEdit
    };
    for (const [id, text] of Object.entries(map)) {
        const el = document.getElementById(id);
        if(el) {
            el.textContent = text;
        }
    }
    // 更新開發中徽章
    const devBadge = document.querySelector('.dev-badge');
    if (devBadge) devBadge.textContent = t.devBadge;
    // 更新當前頁面標題
    const pageTitleEl = document.getElementById('current-page-title');
    const activeSection = document.querySelector('.page-section.active-section');
    if (pageTitleEl && activeSection) {
        const sectionId = activeSection.id;
        if (sectionId === 'homeSection') pageTitleEl.textContent = t.menuHome;
        else if (sectionId === 'notificationsSection') pageTitleEl.textContent = t.menuNotifications;
        else if (sectionId === 'dailyFaithSection') pageTitleEl.textContent = t.btnDailyFaith;
        else if (sectionId === 'faithChartSection') pageTitleEl.textContent = t.btnFaithChart;
        else if (sectionId === 'bibleSection') pageTitleEl.textContent = t.btnBible;
        else if (sectionId === 'lordsPrayerSection') pageTitleEl.textContent = t.btnLordsPrayer;
        else if (sectionId === 'verseClozeSection') pageTitleEl.textContent = t.btnVerseCloze;
        else if (sectionId === 'terminalBibleSection') pageTitleEl.textContent = t.btnTerminalBible;
        else if (sectionId === 'faithAutoSection') pageTitleEl.textContent = currentLang === 'ko' ? '에이전트 관리' : 'AI代理管理';
        else if (sectionId === 'settingsSection') pageTitleEl.textContent = t.settingsHeader;
        updateCurrentNavIcon();
    }
    // 首頁第二頁翻譯
    const featBibleTitle = document.getElementById('home-feat-bible-title');
    const featBibleDesc = document.getElementById('home-feat-bible-desc');
    const featAutoTitle = document.getElementById('home-feat-auto-title');
    const featAutoDesc = document.getElementById('home-feat-auto-desc');
    if (featBibleTitle) featBibleTitle.textContent = t.homeFeatBibleTitle;
    if (featBibleDesc) featBibleDesc.innerHTML = t.homeFeatBibleDesc.replace(/\n/g, '<br>');
    if (featAutoTitle) featAutoTitle.textContent = t.homeFeatAutoTitle;
    if (featAutoDesc) featAutoDesc.innerHTML = t.homeFeatAutoDesc.replace(/\n/g, '<br>');
    // AI 面板語言更新
    const aiTitle = document.getElementById('aiPanelTitle');
    const aiNote = document.getElementById('aiPanelNote');
    const aiInput = document.getElementById('aiPanelInput');
    if (aiTitle) aiTitle.textContent = currentLang === 'ko' ? 'AI 도우미' : 'AI 助手';
    if (aiNote) aiNote.innerHTML = currentLang === 'ko'
        ? '이동: <b>cd 계1</b> / <b>계1:5 가요</b> | 복사: <b>cp 창1:1</b> / <b>cp 주기도문</b>'
        : '跳轉: <b>cd 啟1</b> / <b>到 啟1:5</b> | 複製: <b>cp 創1:1</b> / <b>cp 主祈禱文</b>';
    if (aiInput) aiInput.placeholder = currentLang === 'ko' ? 'cd 계1 / 계1:5 가요 / cp 창1:1 / cp 주기도문' : 'cd 啟1 / 到 啟1:5 / cp 創1:1 / cp 主祈禱文';
    // 首頁第一頁標題和經文也更新
    if (document.getElementById('homeSection').classList.contains('active-section')) {
        initDailyVerse();
    }
    // 如果在首頁，重新載入天氣（更新語言）
    if (document.getElementById('homeSection').classList.contains('active-section')) {
    }
    renderBibleCollections();
    renderBibleDisplayPanel();
    renderNotificationCenter();
    renderNotificationPage();
    window.updateTerminalBibleLanguage?.(currentLang);
}
let activeNavPanel = null;
let navPanelLayoutFrame = null;
let navPanelResizeObserver = null;
function prepareNavPanels() {
    ['menuDropdown', 'aiPanel', 'bibleSearchPanel', 'bibleDisplayPanel', 'notificationPanel'].forEach(id => {
        const panel = document.getElementById(id);
        if (panel && panel.parentElement !== document.body) {
            document.body.appendChild(panel);
        }
    });
}
function clampNavPanelPosition(value, min, max) {
    return Math.min(Math.max(value, min), Math.max(min, max));
}
function resetNavPanelVisual(panel) {
    if (!panel) return;
    panel.classList.remove('show');
}
function getNavPanelGeometry(panel, mode) {
    const nav = document.querySelector('nav');
    if (!nav || !panel) return null;
    const navRect = nav.getBoundingClientRect();
    const leftIslandRect = nav.querySelector('.nav-left')?.getBoundingClientRect() || navRect;
    const rightIslandRect = nav.querySelector('.settings-group')?.getBoundingClientRect() || navRect;
    const viewportWidth = document.documentElement.clientWidth;
    const safeInset = window.matchMedia('(max-width: 480px)').matches ? 8 : 12;
    const availableWidth = Math.max(1, viewportWidth - safeInset * 2);
    let width;
    let left;
    if (mode === 'menu') {
        width = Math.min(286, Math.max(238, leftIslandRect.width), availableWidth);
        left = clampNavPanelPosition(
            leftIslandRect.left,
            safeInset,
            viewportWidth - safeInset - width
        );
    } else if (mode === 'ai' || mode === 'display' || mode === 'notification') {
        width = Math.min(430, availableWidth);
        left = clampNavPanelPosition(
            rightIslandRect.right - width,
            safeInset,
            viewportWidth - safeInset - width
        );
    } else {
        width = Math.min(920, Math.max(320, navRect.width), availableWidth);
        left = clampNavPanelPosition(
            navRect.left + (navRect.width - width) / 2,
            safeInset,
            viewportWidth - safeInset - width
        );
    }
    return {
        top: Math.round(navRect.bottom + 8),
        left: Math.round(left),
        width: Math.round(width)
    };
}
function positionNavPanel(panel, mode) {
    const geometry = getNavPanelGeometry(panel, mode);
    if (!geometry) return;
    panel.style.setProperty('--nav-panel-top', `${geometry.top}px`);
    panel.style.setProperty('--nav-panel-left', `${geometry.left}px`);
    panel.style.setProperty('--nav-panel-width', `${geometry.width}px`);
}
function refreshNavPanelLayout() {
    if (!activeNavPanel?.panel?.classList.contains('show')) return;
    positionNavPanel(activeNavPanel.panel, activeNavPanel.mode);
}
function scheduleNavPanelLayoutRefresh(activeOnly = false) {
    if (activeOnly && !activeNavPanel?.panel?.classList.contains('show')) return;
    if (navPanelLayoutFrame) return;
    navPanelLayoutFrame = requestAnimationFrame(() => {
        navPanelLayoutFrame = null;
        refreshNavPanelLayout();
    });
}
function observeNavPanel(panel) {
    navPanelResizeObserver?.disconnect();
    if (!window.ResizeObserver || !panel) return;
    navPanelResizeObserver = new ResizeObserver(() => {
        if (activeNavPanel?.panel === panel && panel.classList.contains('show')) {
            scheduleNavPanelLayoutRefresh(true);
        }
    });
    navPanelResizeObserver.observe(panel);
}
function closeOtherNavPanels(exceptId) {
    const menu = document.getElementById('menuDropdown');
    const ai = document.getElementById('aiPanel');
    const search = document.getElementById('bibleSearchPanel');
    const display = document.getElementById('bibleDisplayPanel');
    const notification = document.getElementById('notificationPanel');
    if (exceptId !== 'menuDropdown') {
        resetNavPanelVisual(menu);
        document.querySelector('.menu-toggle')?.classList.remove('open');
        document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
        closeFloatingMainSubmenu();
    }
    if (exceptId !== 'aiPanel') {
        resetNavPanelVisual(ai);
        document.getElementById('aiPanelOverlay')?.classList.remove('show');
        document.querySelector('.nav-ai-btn')?.setAttribute('aria-expanded', 'false');
    }
    if (exceptId !== 'bibleSearchPanel') {
        resetNavPanelVisual(search);
        document.getElementById('bibleSearchOverlay')?.classList.remove('show');
        document.getElementById('bibleSearchPreview')?.classList.remove('show');
        document.getElementById('navBibleSearchBtn')?.setAttribute('aria-expanded', 'false');
    }
    if (exceptId !== 'bibleDisplayPanel') {
        resetNavPanelVisual(display);
        document.getElementById('bibleDisplayOverlay')?.classList.remove('show');
        document.getElementById('navBibleDisplayBtn')?.setAttribute('aria-expanded', 'false');
    }
    if (exceptId !== 'notificationPanel') {
        resetNavPanelVisual(notification);
        document.getElementById('notificationPanelOverlay')?.classList.remove('show');
        document.getElementById('navNotificationBtn')?.setAttribute('aria-expanded', 'false');
    }
    if (activeNavPanel?.panel?.id !== exceptId) {
        activeNavPanel = null;
        navPanelResizeObserver?.disconnect();
    }
    syncUiScrollLock();
}
function setNavPanelState(panel, trigger, mode, open) {
    if (!panel || !trigger) return;
    prepareNavPanels();
    if (open) {
        closeOtherNavPanels(panel.id);
        activeNavPanel = { panel, trigger, mode };
        positionNavPanel(panel, mode);
        panel.classList.add('show');
        trigger.setAttribute('aria-expanded', 'true');
        observeNavPanel(panel);
        syncUiScrollLock();
        return;
    }
    trigger.setAttribute('aria-expanded', 'false');
    resetNavPanelVisual(panel);
    if (activeNavPanel?.panel === panel) {
        activeNavPanel = null;
        navPanelResizeObserver?.disconnect();
    }
    syncUiScrollLock();
}
prepareNavPanels();
window.addEventListener('resize', () => scheduleNavPanelLayoutRefresh(false));
window.addEventListener('scroll', () => scheduleNavPanelLayoutRefresh(true), { passive: true });
window.toggleMenu = () => {
    const dropdown = document.getElementById('menuDropdown');
    const toggle = document.querySelector('.menu-toggle');
    const shouldOpen = !dropdown.classList.contains('show');
    toggle.classList.toggle('open', shouldOpen);
    setNavPanelState(dropdown, toggle, 'menu', shouldOpen);
    if (!shouldOpen) {
        closeFloatingMainSubmenu();
    }
};
const desktopMainMenuQuery = window.matchMedia('(min-width: 701px)');
let floatingMainSubmenuHideTimer = null;
let floatingMainSubmenuState = null;
function closeFloatingMainSubmenu() {
    if (floatingMainSubmenuState) {
        const { category, submenu } = floatingMainSubmenuState;
        category?.classList.remove('submenu-active');
        submenu.classList.remove('submenu-floating', 'submenu-measuring');
        submenu.style.removeProperty('--submenu-top');
        submenu.style.removeProperty('--submenu-left');
        category?.appendChild(submenu);
        floatingMainSubmenuState = null;
    }
    document.querySelectorAll('.menu-category.submenu-active').forEach(category => {
        category.classList.remove('submenu-active');
    });
    document.querySelectorAll('.menu-submenu.submenu-floating').forEach(submenu => {
        submenu.classList.remove('submenu-floating', 'submenu-measuring');
        submenu.style.removeProperty('--submenu-top');
        submenu.style.removeProperty('--submenu-left');
    });
}
function scheduleCloseFloatingMainSubmenu() {
    clearTimeout(floatingMainSubmenuHideTimer);
    floatingMainSubmenuHideTimer = setTimeout(closeFloatingMainSubmenu, 120);
}
function showFloatingMainSubmenu(categoryEl) {
    if (!desktopMainMenuQuery.matches) return;
    const dropdown = document.getElementById('menuDropdown');
    const submenu = categoryEl?.querySelector(':scope > .menu-submenu');
    if (!dropdown?.classList.contains('show') || !submenu) return;
    clearTimeout(floatingMainSubmenuHideTimer);
    closeFloatingMainSubmenu();
    const dropdownRect = dropdown.getBoundingClientRect();
    const categoryRect = categoryEl.getBoundingClientRect();
    const gap = 2;
    submenu.style.setProperty('--submenu-top', '0px');
    submenu.style.setProperty('--submenu-left', '0px');
    submenu.classList.add('submenu-floating', 'submenu-measuring');
    document.body.appendChild(submenu);
    floatingMainSubmenuState = { category: categoryEl, submenu };
    const submenuRect = submenu.getBoundingClientRect();
    const maxTop = Math.max(12, window.innerHeight - submenuRect.height - 12);
    const top = Math.min(Math.max(categoryRect.top, 12), maxTop);
    let left = Math.round(dropdownRect.right + gap);
    if (left + submenuRect.width > window.innerWidth - 12) {
        left = Math.max(Math.round(dropdownRect.left), window.innerWidth - submenuRect.width - 12);
    }
    submenu.style.setProperty('--submenu-top', `${top}px`);
    submenu.style.setProperty('--submenu-left', `${left}px`);
    categoryEl.classList.add('submenu-active');
    submenu.classList.remove('submenu-measuring');
}
function initMainMenuSubmenus() {
    document.querySelectorAll('.menu-category').forEach(category => {
        if (category.dataset.submenuBound === '1') return;
        const submenu = category.querySelector(':scope > .menu-submenu');
        if (!submenu) return;
        category.dataset.submenuBound = '1';
        category.addEventListener('pointerenter', () => showFloatingMainSubmenu(category));
        category.addEventListener('pointerleave', scheduleCloseFloatingMainSubmenu);
        submenu.addEventListener('pointerenter', () => clearTimeout(floatingMainSubmenuHideTimer));
        submenu.addEventListener('pointerleave', scheduleCloseFloatingMainSubmenu);
    });
}
desktopMainMenuQuery.addEventListener?.('change', closeFloatingMainSubmenu);
window.addEventListener('resize', closeFloatingMainSubmenu);
document.addEventListener('DOMContentLoaded', initMainMenuSubmenus);
// 點擊其他地方關閉選單
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('menuDropdown');
    const toggle = document.querySelector('.menu-toggle');
    const activeSubmenu = floatingMainSubmenuState?.submenu;
    if (!toggle.contains(e.target) && !dropdown.contains(e.target) && !activeSubmenu?.contains(e.target)) {
        toggle.classList.remove('open');
        setNavPanelState(dropdown, toggle, 'menu', false);
        closeFloatingMainSubmenu();
    }
});
let verseClozeFeaturePromise = null;
let terminalBibleFeaturePromise = null;
function loadVerseClozeStylesheet() {
    const existing = document.getElementById('verseClozeStylesheet');
    if (existing?.dataset.loaded === 'true') return Promise.resolve();
    if (existing) {
        return new Promise((resolve, reject) => {
            existing.addEventListener('load', resolve, { once: true });
            existing.addEventListener('error', reject, { once: true });
        });
    }
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.id = 'verseClozeStylesheet';
        link.rel = 'stylesheet';
        link.href = `/verse-cloze.css?v=${encodeURIComponent(APP_VERSION)}`;
        link.addEventListener('load', () => {
            link.dataset.loaded = 'true';
            resolve();
        }, { once: true });
        link.addEventListener('error', reject, { once: true });
        document.head.appendChild(link);
    });
}
async function loadVerseClozeFeature() {
    const root = document.getElementById('verseClozeRoot');
    if (!root) return;
    if (root.dataset.mounted === 'true') return;
    if (verseClozeFeaturePromise) return verseClozeFeaturePromise;
    root.setAttribute('aria-busy', 'true');
    verseClozeFeaturePromise = Promise.all([
        loadVerseClozeStylesheet(),
        import(`/verse-cloze.js?v=${encodeURIComponent(APP_VERSION)}`)
    ]).then(([, feature]) => {
        feature.mountVerseCloze({
            root,
            books: bibleBooks,
            fetchChapter: fetchBibleChapter
        });
        root.dataset.mounted = 'true';
        root.setAttribute('aria-busy', 'false');
    }).catch((error) => {
        console.error('Failed to load verse cloze feature:', error);
        verseClozeFeaturePromise = null;
        root.setAttribute('aria-busy', 'false');
        root.innerHTML = `
            <div class="verse-cloze-load-error" role="alert">
                <strong>經文填空遊戲暫時無法載入</strong>
                <button type="button" onclick="window.retryVerseClozeLoad()">重新載入</button>
            </div>`;
    });
    return verseClozeFeaturePromise;
}
window.retryVerseClozeLoad = () => {
    verseClozeFeaturePromise = null;
    return loadVerseClozeFeature();
};
function loadTerminalBibleStylesheet() {
    const existing = document.getElementById('terminalBibleStylesheet');
    if (existing?.dataset.loaded === 'true') return Promise.resolve();
    if (existing) {
        return new Promise((resolve, reject) => {
            existing.addEventListener('load', resolve, { once: true });
            existing.addEventListener('error', reject, { once: true });
        });
    }
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.id = 'terminalBibleStylesheet';
        link.rel = 'stylesheet';
        link.href = `/terminal-bible.css?v=${encodeURIComponent(APP_VERSION)}`;
        link.addEventListener('load', () => {
            link.dataset.loaded = 'true';
            resolve();
        }, { once: true });
        link.addEventListener('error', reject, { once: true });
        document.head.appendChild(link);
    });
}
async function loadTerminalBibleFeature() {
    const root = document.getElementById('terminalBibleRoot');
    if (!root) return;
    if (root.dataset.mounted === 'true') {
        window.updateTerminalBibleLanguage?.(currentLang);
        return;
    }
    if (terminalBibleFeaturePromise) return terminalBibleFeaturePromise;
    root.setAttribute('aria-busy', 'true');
    terminalBibleFeaturePromise = Promise.all([
        loadTerminalBibleStylesheet(),
        import(`/terminal-bible.js?v=${encodeURIComponent(APP_VERSION)}`)
    ]).then(([, feature]) => {
        feature.mountTerminalBible({ root, language: currentLang });
        root.dataset.mounted = 'true';
        root.setAttribute('aria-busy', 'false');
    }).catch((error) => {
        console.error('Failed to load terminal Bible page:', error);
        terminalBibleFeaturePromise = null;
        root.setAttribute('aria-busy', 'false');
        root.innerHTML = '<div class="terminal-bible-load-error" role="alert">終端版本聖經暫時無法載入</div>';
    });
    return terminalBibleFeaturePromise;
}
window.switchPage = (page) => {
    const t = i18n[currentLang];
    const bibleRoute = page === 'bible' ? parseBibleChapterPath() : null;
    document.body.classList.toggle('bible-active', page === 'bible');
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    // 關閉選單
    const menuDropdown = document.getElementById('menuDropdown');
    const menuToggle = document.querySelector('.menu-toggle');
    menuToggle.classList.remove('open');
    setNavPanelState(menuDropdown, menuToggle, 'menu', false);
    closeFloatingMainSubmenu();
    // 更新 URL（clean URL，無 #）
    const pathMap = {
        'home': '/',
        'notifications': '/notifications',
        'bible': '/bible',
        'verse-cloze': '/verse-cloze',
        'terminal-bible': '/terminal-bible',
        'lords-prayer': '/lords-prayer',
        'faithAuto': '/faith-auto',
        'faith-chart': '/faith-chart',
        'daily-faith': '/daily-faith',
        'settings': '/settings'
    };
    const newPath = bibleRoute
        ? getBibleChapterPath(bibleRoute.book, bibleRoute.chapter)
        : (pathMap[page] || '/');
    if (window.location.pathname !== newPath) {
        history.pushState(null, '', newPath);
    }
    // 更新當前頁面標題
    const pageTitleEl = document.getElementById('current-page-title');
    // 根據頁面自動展開對應的子選單
    document.querySelectorAll('.menu-category').forEach(c => c.classList.remove('open'));
    // 聖經搜尋按鈕只在聖經頁顯示
    document.getElementById('navBibleSearchBtn')?.classList.remove('show');
    document.getElementById('navBibleDisplayBtn')?.classList.remove('show');
    if (page !== 'bible') {
        closeBibleChaptersPopover();
        window.closeBibleDisplayPanel?.();
    }
    // 退出複製模式
    if (typeof window.exitCopyMode === 'function') {
        window.exitCopyMode();
    }
    // 離開首頁時清理
    if (page !== 'home') {
        cleanupDailyVerse();
    }
    if (page === 'home') {
        document.getElementById('homeSection').classList.add('active-section');
        pageTitleEl.textContent = currentLang === 'ko' ? '홈' : '首頁';
        // 載入天氣
        // 初始化今日默想
        initDailyVerse();
    } else if (page === 'notifications') {
        document.getElementById('notificationsSection').classList.add('active-section');
        document.getElementById('menu-category-notifications')?.classList.add('open');
        pageTitleEl.textContent = t.menuNotifications;
        renderNotificationPage();
        void refreshNotificationItems();
    } else if (page === 'daily-faith') {
        const section = document.getElementById('dailyFaithSection');
        if (!section) return window.switchPage('home');
        section.classList.add('active-section');
        document.getElementById('btn-daily-faith')?.classList.add('active');
        document.getElementById('menu-category-faith')?.classList.add('open');
        pageTitleEl.textContent = t.btnDailyFaith;
    } else if (page === 'faithAuto') {
        document.getElementById('faithAutoSection').classList.add('active-section');
        document.getElementById('menu-category-faith-auto').classList.add('open');
        pageTitleEl.textContent = currentLang === 'ko' ? '에이전트 관리' : 'AI代理管理';
    } else if (page === 'faith-chart') {
        const section = document.getElementById('faithChartSection');
        if (!section) return window.switchPage('home');
        section.classList.add('active-section');
        document.getElementById('btn-faith-chart')?.classList.add('active');
        document.getElementById('menu-category-faith')?.classList.add('open');
        pageTitleEl.textContent = t.btnFaithChart;
    } else if (page === 'bible') {
        if (getBibleFontMode() === 'serif' && isSerifPackInstalled()) loadSerifFontStylesheet();
        else if (getBibleFontMode() === 'serif') applyBibleFontPreference('sans'); // 偏好不一致時 fallback
        document.getElementById('bibleSection').classList.add('active-section');
        document.getElementById('btn-bible').classList.add('active');
        document.getElementById('menu-category-books').classList.add('open');
        pageTitleEl.textContent = t.btnBible;
        // 重置聖經頁面到書卷列表
        document.getElementById('bibleBooksList').style.display = 'block';
        document.getElementById('bibleContentView').classList.remove('show');
        bibleChapterHistoryActive = false;
        // 顯示導覽列聖經搜尋按鈕
        document.getElementById('navBibleSearchBtn')?.classList.add('show');
        document.getElementById('navBibleDisplayBtn')?.classList.add('show');
        if (bibleRoute) {
            setTimeout(() => {
                selectBibleBook(bibleRoute.book);
                openBibleChapter(bibleRoute.book, bibleRoute.chapter, { fromRoute: true });
            }, 0);
        }
    } else if (page === 'verse-cloze') {
        const section = document.getElementById('verseClozeSection');
        if (!section) return window.switchPage('home');
        section.classList.add('active-section');
        document.getElementById('btn-verse-cloze')?.classList.add('active');
        document.getElementById('menu-category-books')?.classList.add('open');
        pageTitleEl.textContent = t.btnVerseCloze;
        void loadVerseClozeFeature();
    } else if (page === 'terminal-bible') {
        const section = document.getElementById('terminalBibleSection');
        if (!section) return window.switchPage('home');
        section.classList.add('active-section');
        document.getElementById('btn-terminal-bible')?.classList.add('active');
        document.getElementById('menu-category-books')?.classList.add('open');
        pageTitleEl.textContent = t.btnTerminalBible;
        void loadTerminalBibleFeature();
    } else if (page === 'lords-prayer') {
        if (getBibleFontMode() === 'serif' && isSerifPackInstalled()) loadSerifFontStylesheet();
        document.getElementById('lordsPrayerSection').classList.add('active-section');
        document.getElementById('btn-lords-prayer')?.classList.add('active');
        document.getElementById('menu-category-books').classList.add('open');
        pageTitleEl.textContent = t.btnLordsPrayer;
        renderLordsPrayer();
    } else if (page === 'settings') {
        document.getElementById('settingsSection').classList.add('active-section');
        document.getElementById('menu-category-settings')?.classList.add('open');
        pageTitleEl.textContent = t.settingsHeader;
        renderSettingsPage();
    }
    updateCurrentNavIcon();
    setTimeout(() => window.refreshBackToTop?.(), 0);
};
// 切換子選單
window.toggleSubMenu = (category) => {
    const categoryEl = document.getElementById(`menu-category-${category}`);
    if (categoryEl) {
        categoryEl.classList.toggle('open');
    }
};
// ===== 每日經文系統（首爾時間 UTC+9） =====
const DAILY_VERSE_KEY = 'daily_verse_cache';
const DAILY_VERSE_HISTORY_KEY = 'daily_verse_history';
const DAILY_VERSE_HISTORY_DAYS = 150;
const DAILY_VERSE_ROTATION_EPOCH = '2026-01-01';
const DAILY_VERSE_ROTATION_OFFSET = 17;
const DAILY_VERSE_INDEX_URL = '/daily-verse-index.json';
let dailyVerseIndexPromise = null;
const DAILY_VERSE_INDEX_ITEMS = [{"bookId":"1ch","chapter":1,"verse":29,"ko":"이스마엘의 세계는 이러하니 그 맏아들은 느바욧이요 다음은 게달과 앗브엘과 밉삼과","zh":"以實瑪利的兒子記在下面：以實瑪利的長子是尼拜約，其次是基達、押德別、米比衫、"},{"bookId":"1ch","chapter":5,"verse":13,"ko":"그 족속 형제에는 미가엘과 므술람과 세바와 요래와 야간과 시아와 에벨 일곱 명이니","zh":"他們族弟兄是米迦勒、米書蘭、示巴、約賴、雅干、細亞、希伯，共七人。"},{"bookId":"1ch","chapter":8,"verse":23,"ko":"압돈과 시그리와 하난과","zh":"亞伯頓、細基利、哈難、"},{"bookId":"1ch","chapter":12,"verse":35,"ko":"단 자손 중에서 싸움을 잘하는 자가 이만 팔천육백 명이요","zh":"但支派，能擺陣的有二萬八千六百人。"},{"bookId":"1ch","chapter":19,"verse":9,"ko":"암몬 자손은 나와서 성문 앞에 진 치고 도우러 온 여러 왕은 따로 들에 있더라","zh":"亞捫人出來在城門前擺陣，所來的諸王另在郊野擺陣。"},{"bookId":"1ch","chapter":25,"verse":27,"ko":"스무째는 엘리아다니 그 아들과 형제와 십이 인이요","zh":"第二十是以利亞他；他和他兒子並弟兄共十二人。"},{"bookId":"1co","chapter":2,"verse":5,"ko":"너희 믿음이 사람의 지혜에 있지 아니하고 다만 하나님의 능력에 있게 하려 하였노라","zh":"叫你們的信不在乎人的智慧，只在乎神的大能。"},{"bookId":"1co","chapter":9,"verse":16,"ko":"내가 복음을 전할지라도 자랑할 것이 없음은 내가 부득불 할 일임이라 만일 복음을 전하지 아니하면 내게 화가 있을 것임이로라","zh":"我傳福音原沒有可誇的，因為我是不得已的。若不傳福音，我便有禍了。"},{"bookId":"1co","chapter":14,"verse":35,"ko":"만일 무엇을 배우려거든 집에서 자기 남편에게 물을지니 여자가 교회에서 말하는 것은 부끄러운 것임이라","zh":"她們若要學甚麼，可以在家裏問自己的丈夫，因為婦女在會中說話原是可恥的。"},{"bookId":"1jn","chapter":4,"verse":7,"ko":"사랑하는 자들아 우리가 서로 사랑하자 사랑은 하나님께 속한 것이니 사랑하는 자마다 하나님께로 나서 하나님을 알고","zh":"親愛的弟兄啊，我們應當彼此相愛，因為愛是從神來的。凡有愛心的，都是由神而生，並且認識神。"},{"bookId":"1ki","chapter":3,"verse":25,"ko":"왕이 이르되 산 아들을 둘에 나눠 반은 이에게 주고 반은 저에게 주라","zh":"王說：「將活孩子劈成兩半，一半給那婦人，一半給這婦人。」"},{"bookId":"1ki","chapter":8,"verse":13,"ko":"내가 참으로 주를 위하여 계실 전을 건축하였사오니 주께서 영원히 거하실 처소로소이다 하고","zh":"我已經建造殿宇作你的居所， 為你永遠的住處。"},{"bookId":"1ki","chapter":12,"verse":4,"ko":"왕의 부친이 우리의 멍에를 무겁게 하였으나 왕은 이제 왕의 부친이 우리에게 시킨 고역과 메운 무거운 멍에를 가볍게 하소서 그리하시면 우리가 왕을 섬기겠나이다","zh":"「你父親使我們負重軛，做苦工，現在求你使我們做的苦工、負的重軛輕鬆些，我們就事奉你。」"},{"bookId":"1ki","chapter":16,"verse":29,"ko":"유다 왕 아사 제삼십팔년에 오므리의 아들 아합이 이스라엘 왕이 되니라 오므리의 아들 아합이 사마리아에서 이십이 년을 이스라엘을 다스리니라","zh":"猶大王亞撒三十八年，暗利的兒子亞哈登基作了以色列王。暗利的兒子亞哈在撒馬利亞作以色列王二十二年。"},{"bookId":"1ki","chapter":21,"verse":18,"ko":"너는 일어나 내려가서 사마리아에 거하는 이스라엘 왕 아합을 만나라 저가 나봇의 포도원을 취하러 그리로 내려갔나니","zh":"「你起來，去見住撒馬利亞的以色列王亞哈，他下去要得拿伯的葡萄園，現今正在那園裏。"},{"bookId":"1pe","chapter":5,"verse":2,"ko":"너희 중에 있는 하나님의 양 무리를 치되 부득이함으로 하지 말고 오직 하나님의 뜻을 좇아 자원함으로 하며 더러운 이를 위하여 하지 말고 오직 즐거운 뜻으로 하며","zh":"務要牧養在你們中間神的群羊，按著神旨意照管他們；不是出於勉強，乃是出於甘心；也不是因為貪財，乃是出於樂意；"},{"bookId":"1sa","chapter":7,"verse":5,"ko":"사무엘이 가로되 온 이스라엘은 미스바로 모이라 내가 너희를 위하여 여호와께 기도하리라 하매","zh":"撒母耳說：「要使以色列眾人聚集在米斯巴，我好為你們禱告耶和華。」"},{"bookId":"1sa","chapter":14,"verse":6,"ko":"요나단이 자기 병기 든 소년에게 이르되 우리가 이 할례 없는 자들의 부대에게로 건너가자 여호와께서 우리를 위하여 일하실까 하노라 여호와의 구원은 사람의 많고 적음에 달리지 아니하였느니라","zh":"約拿單對拿兵器的少年人說：「我們不如過到未受割禮人的防營那裏去，或者耶和華為我們施展能力；因為耶和華使人得勝，不在乎人多人少。」"},{"bookId":"1sa","chapter":17,"verse":53,"ko":"이스라엘 자손이 블레셋 사람을 쫓다가 돌아와서 그들의 진을 노략하였고","zh":"以色列人追趕非利士人回來，就奪了他們的營盤。"},{"bookId":"1sa","chapter":23,"verse":18,"ko":"두 사람이 여호와 앞에서 언약하고 다윗은 수풀에 거하고 요나단은 자기 집으로 돌아가니라","zh":"於是二人在耶和華面前立約。大衛仍住在樹林裏，約拿單回家去了。"},{"bookId":"1sa","chapter":30,"verse":9,"ko":"이에 다윗과 그와 함께 한 육백 명이 가서 브솔 시내에 이르러는 뒤 떨어진 자를 거기 머물렀으되","zh":"於是，大衛和跟隨他的六百人來到比梭溪；有不能前去的就留在那裏。"},{"bookId":"1ti","chapter":3,"verse":3,"ko":"술을 즐기지 아니하며 구타하지 아니하며 오직 관용하며 다투지 아니하며 돈을 사랑치 아니하며","zh":"不因酒滋事，不打人，只要溫和，不爭競，不貪財；"},{"bookId":"2ch","chapter":5,"verse":8,"ko":"그룹들이 궤 처소 위에서 날개를 펴서 궤와 그 채를 덮었는데","zh":"基路伯張著翅膀在約櫃之上，遮掩約櫃和抬櫃的槓。"},{"bookId":"2ch","chapter":11,"verse":20,"ko":"그 후에 압살롬의 딸 마아가에게 장가들었더니 저가 아비야와 앗대와 시사와 슬로밋을 낳았더라","zh":"後來又娶押沙龍的女兒瑪迦，從她生了亞比雅、亞太、細撒、示羅密。"},{"bookId":"2ch","chapter":20,"verse":4,"ko":"유다 사람이 여호와께 도우심을 구하려 하여 유다 모든 성읍에서 모여와서 여호와께 간구하더라","zh":"於是猶大人聚會，求耶和華幫助。猶大各城都有人出來尋求耶和華。"},{"bookId":"2ch","chapter":26,"verse":16,"ko":"저가 강성하여지매 그 마음이 교만하여 악을 행하여 그 하나님 여호와께 범죄하되 곧 여호와의 전에 들어가서 향단에 분향하려 한지라","zh":"他既強盛，就心高氣傲，以致行事邪僻，干犯耶和華－他的神，進耶和華的殿，要在香壇上燒香。"},{"bookId":"2ch","chapter":32,"verse":32,"ko":"히스기야의 남은 행적과 그 모든 선한 일이 아모스의 아들 선지자 이사야의 묵시책과 유다와 이스라엘 열왕기에 기록되니라","zh":"希西家其餘的事和他的善行都寫在亞摩斯的兒子先知以賽亞的默示書上和猶大、以色列的諸王記上。"},{"bookId":"2co","chapter":3,"verse":7,"ko":"돌에 써서 새긴 죽게 하는 의문의 직분도 영광이 있어 이스라엘 자손들이 모세의 얼굴의 없어질 영광을 인하여 그 얼굴을 주목하지 못하였거든","zh":"那用字刻在石頭上屬死的職事尚且有榮光，甚至以色列人因摩西面上的榮光，不能定睛看他的臉；這榮光原是漸漸退去的，"},{"bookId":"2co","chapter":11,"verse":16,"ko":"내가 다시 말하노니 누구든지 나를 어리석은 자로 여기지 말라 만일 그러하더라도 나로 조금 자랑하게 어리석은 자로 받으라","zh":"我再說，人不可把我看作愚妄的。縱然如此，也要把我當作愚妄人接納，叫我可以略略自誇。"},{"bookId":"2ki","chapter":4,"verse":23,"ko":"그 남편이 가로되 초하루도 아니요 안식일도 아니어늘 그대가 오늘날 어찌하여 저에게 나아가고자 하느뇨 여인이 가로되 평안이니이다","zh":"丈夫說：「今日不是月朔，也不是安息日，你為何要去見他呢？」婦人說：「平安無事。」"},{"bookId":"2ki","chapter":9,"verse":27,"ko":"유다 왕 아하시야가 이를 보고 동산 정자 길로 도망하니 예후가 쫓아가며 이르되 저도 병거 가운데서 죽이라 하매 이블르암 가까운 구르 비탈에서 치니 저가 므깃도까지 도망하여 거기서 죽은지라","zh":"猶大王亞哈謝見這光景，就從園亭之路逃跑。耶戶追趕他，說：「把這人也殺在車上。」到了靠近以伯蓮的姑珥坡上擊傷了他。他逃到米吉多，就死在那裏。"},{"bookId":"2ki","chapter":15,"verse":15,"ko":"살룸의 남은 사적과 그 모반한 일은 이스라엘 왕 역대지략에 기록되니라","zh":"沙龍其餘的事和他背叛的情形都寫在以色列諸王記上。"},{"bookId":"2ki","chapter":19,"verse":36,"ko":"앗수르 왕 산헤립이 떠나 돌아가서 니느웨에 거하더니","zh":"亞述王西拿基立就拔營回去，住在尼尼微。"},{"bookId":"2pe","chapter":1,"verse":2,"ko":"하나님과 우리 주 예수를 앎으로 은혜와 평강이 너희에게 더욱 많을지어다","zh":"願恩惠、平安，因你們認識神和我們主耶穌，多多地加給你們。"},{"bookId":"2sa","chapter":4,"verse":2,"ko":"사울의 아들 이스보셋에게 군장 두 사람이 있으니 하나의 이름은 바아나요 하나의 이름은 레갑이라 베냐민 족속 브에롯 사람 림몬의 아들들이더라 브에롯도 베냐민 지파에 속하였으니","zh":"掃羅的兒子伊施波設有兩個軍長，一名巴拿，一名利甲，是便雅憫支派、比錄人臨門的兒子。比錄也屬便雅憫。"},{"bookId":"2sa","chapter":11,"verse":20,"ko":"혹시 왕이 노하여 네게 말씀하기를 너희가 어찌하여 성에 그처럼 가까이 가서 싸웠느냐 저희가 성 위에서 쏠 줄을 알지 못하였느냐","zh":"王若發怒，問你說：『你們打仗為甚麼挨近城牆呢？豈不知敵人必從城上射箭嗎？"},{"bookId":"2sa","chapter":16,"verse":11,"ko":"또 아비새와 모든 신복에게 이르되 내 몸에서 난 아들도 내 생명을 해하려 하거든 하물며 이 베냐민 사람이랴 여호와께서 저에게 명하신 것이니 저로 저주하게 버려두라","zh":"大衛又對亞比篩和眾臣僕說：「我親生的兒子尚且尋索我的性命，何況這便雅憫人呢？由他咒罵吧！因為這是耶和華吩咐他的。"},{"bookId":"2sa","chapter":21,"verse":14,"ko":"사울과 그 아들 요나단의 뼈와 함께 베냐민 땅 셀라에서 그 아비 기스의 묘에 장사하되 모두 왕의 명대로 좇아 행하니라 그 후에야 하나님이 그 땅을 위하여 기도를 들으시니라","zh":"將掃羅和他兒子約拿單的骸骨葬在便雅憫的洗拉，在掃羅父親基士的墳墓裏；眾人行了王所吩咐的。此後神垂聽國民所求的。"},{"bookId":"2th","chapter":3,"verse":5,"ko":"주께서 너희 마음을 인도하여 하나님의 사랑과 그리스도의 인내에 들어가게 하시기를 원하노라","zh":"願主引導你們的心，叫你們愛神，並學基督的忍耐！"},{"bookId":"act","chapter":2,"verse":22,"ko":"이스라엘 사람들아 이 말을 들으라 너희도 아는 바에 하나님께서 나사렛 예수로 큰 권능과 기사와 표적을 너희 가운데서 베푸사 너희 앞에서 그를 증거하셨느니라","zh":"「以色列人哪，請聽我的話：神藉著拿撒勒人耶穌在你們中間施行異能、奇事、神蹟，將他證明出來，這是你們自己知道的。"},{"bookId":"act","chapter":7,"verse":14,"ko":"요셉이 보내어 그 부친 야곱과 온 친족 일흔다섯 사람을 청하였더니","zh":"約瑟就打發弟兄請父親雅各和全家七十五個人都來。"},{"bookId":"act","chapter":10,"verse":29,"ko":"부름을 사양치 아니하고 왔노라 묻노니 무슨 일로 나를 불렀느뇨","zh":"所以我被請的時候，就不推辭而來。現在請問：你們叫我來有甚麼意思呢？」"},{"bookId":"act","chapter":15,"verse":5,"ko":"바리새파 중에 믿는 어떤 사람들이 일어나 말하되 이방인에게 할례주고 모세의 율법을 지키라 명하는 것이 마땅하다 하니라","zh":"惟有幾個信徒， 是法利賽教門的人，起來說：「必須給外邦人行割禮，吩咐他們遵守摩西的律法。」"},{"bookId":"act","chapter":19,"verse":20,"ko":"이와 같이 주의 말씀이 힘이 있어 흥왕하여 세력을 얻으니라","zh":"主的道大大興旺，而且得勝，就是這樣。"},{"bookId":"act","chapter":23,"verse":28,"ko":"유대인들이 무슨 일로 그를 송사하는지 알고자 하여 저희 공회로 데리고 내려갔더니","zh":"因要知道他們告他的緣故，我就帶他下到他們的公會去，"},{"bookId":"act","chapter":28,"verse":21,"ko":"저희가 가로되 우리가 유대에서 네게 대한 편지도 받은 일이 없고 또 형제 중 누가 와서 네게 대하여 좋지 못한 것을 고하든지 이야기한 일도 없느니라","zh":"他們說：「我們並沒有接著從猶太來論你的信，也沒有弟兄到這裏來報給我們說你有甚麼不好處。"},{"bookId":"col","chapter":1,"verse":2,"ko":"골로새에 있는 성도들 곧 그리스도 안에서 신실한 형제들에게 편지하노니 우리 아버지 하나님으로부터 은혜와 평강이 너희에게 있을지어다","zh":"寫信給歌羅西的聖徒，在基督裏有忠心的弟兄。願恩惠、平安從神我們的父歸與你們！"},{"bookId":"dan","chapter":2,"verse":45,"ko":"왕이 사람의 손으로 아니하고 산에서 뜨인 돌이 철과 놋과 진흙과 은과 금을 부숴뜨린 것을 보신 것은 크신 하나님이 장래 일을 왕께 알게 하신 것이라 이 꿈이 참되고 이 해석이 확실하니이다","zh":"你既看見非人手鑿出來的一塊石頭從山而出，打碎金、銀、銅、鐵、泥，那就是至大的神把後來必有的事給王指明。這夢準是這樣，這講解也是確實的。」"},{"bookId":"dan","chapter":7,"verse":28,"ko":"그 말이 이에 그친지라 나 다니엘은 중심이 번민하였으며 내 낯 빛이 변하였으나 내가 이 일을 마음에 감추었느니라","zh":"那事至此完畢。至於我－但以理，心中甚是驚惶，臉色也改變了，卻將那事存記在心。"},{"bookId":"deu","chapter":1,"verse":24,"ko":"그들이 앞으로 가서 산지에 올라 에스골 골짜기에 이르러 그곳을 정탐하고","zh":"於是他們起身上山地去，到以實各谷，窺探那地。"},{"bookId":"deu","chapter":5,"verse":26,"ko":"무릇 육신을 가진 자가 우리처럼 사시는 하나님의 음성이 불 가운데서 발함을 듣고 생존한 자가 누구니이까","zh":"凡屬血氣的，曾有何人聽見永生神的聲音從火中出來，像我們聽見還能存活呢？"},{"bookId":"deu","chapter":11,"verse":28,"ko":"너희가 만일 내가 오늘날 너희에게 명하는 도에서 돌이켜 떠나 너희 하나님 여호와의 명령을 듣지 아니하고 본래 알지 못하던 다른 신들을 좇으면 저주를 받으리라","zh":"你們若不聽從耶和華－你們神的誡命，偏離我今日所吩咐你們的道，去事奉你們素來所不認識的別神，就必受禍。"},{"bookId":"deu","chapter":18,"verse":17,"ko":"여호와께서 이르시되 그들의 말이 옳도다","zh":"耶和華就對我說：『他們所說的是。"},{"bookId":"deu","chapter":25,"verse":11,"ko":"두 사람이 서로 싸울 때에 한 사람의 아내가 그 남편을 그 치는 자의 손에서 구하려 하여 가까이 가서 손을 벌려 그 사람의 음낭을 잡거든","zh":"「若有二人爭鬥，這人的妻近前來，要救她丈夫脫離那打她丈夫之人的手，抓住那人的下體，"},{"bookId":"deu","chapter":30,"verse":15,"ko":"보라 내가 오늘날 생명과 복과 사망과 화를 네 앞에 두었나니","zh":"「看哪，我今日將生與福，死與禍，陳明在你面前。"},{"bookId":"ecc","chapter":2,"verse":11,"ko":"그 후에 본즉 내 손으로 한 모든 일과 수고한 모든 수고가 다 헛되어 바람을 잡으려는 것이며 해 아래서 무익한 것이로다","zh":"後來，我察看我手所經營的一切事和我勞碌所成的功。誰知都是虛空，都是捕風；在日光之下毫無益處。"},{"bookId":"ecc","chapter":10,"verse":10,"ko":"무딘 철 연장 날을 갈지 아니하면 힘이 더 드느니라 오직 지혜는 성공하기에 유익하니라","zh":"鐵器鈍了，若不將刃磨快，就必多費氣力； 但得智慧指教，便有益處。"},{"bookId":"eph","chapter":5,"verse":25,"ko":"남편들아 아내 사랑하기를 그리스도께서 교회를 사랑하시고 위하여 자신을 주심 같이 하라","zh":"你們作丈夫的，要愛你們的妻子，正如基督愛教會，為教會捨己。"},{"bookId":"est","chapter":8,"verse":16,"ko":"유다인에게는 영광과 즐거움과 기쁨과 존귀함이 있는지라","zh":"猶大人有光榮，歡喜快樂而得尊貴。"},{"bookId":"exo","chapter":5,"verse":21,"ko":"그들에게 이르되 너희가 우리로 바로의 눈과 그 신하의 눈에 미운 물건이 되게 하고 그들의 손에 칼을 주어 우리를 죽이게 하는도다 여호와는 너희를 감찰하시고 판단하시기를 원하노라","zh":"就向他們說：「願耶和華鑒察你們，施行判斷；因你們使我們在法老和他臣僕面前有了臭名，把刀遞在他們手中殺我們。」"},{"bookId":"exo","chapter":11,"verse":4,"ko":"모세가 바로에게 이르되 여호와께서 이같이 말씀하시기를 밤중에 내가 애굽 가운데로 들어가리니","zh":"摩西說：「耶和華這樣說：『約到半夜，我必出去巡行埃及遍地。"},{"bookId":"exo","chapter":16,"verse":20,"ko":"그들이 모세의 말을 청종치 아니하고 더러는 아침까지 두었더니 벌레가 생기고 냄새가 난지라 모세가 그들에게 노하니라","zh":"然而他們不聽摩西的話，內中有留到早晨的，就生蟲變臭了；摩西便向他們發怒。"},{"bookId":"exo","chapter":22,"verse":14,"ko":"만일 이웃에게 빌어온 것이 그 임자가 함께 있지 아니할 때에 상하거나 죽으면 반드시 배상하려니와","zh":"「人若向鄰舍借甚麼，所借的或受傷，或死，本主沒有同在一處，借的人總要賠還；"},{"bookId":"exo","chapter":27,"verse":12,"ko":"뜰의 옆 곧 서편에 광 오십 규빗의 포장을 치되 그 기둥이 열이요 받침이 열이며","zh":"院子的西面當有帷子，寬五十肘，帷子的柱子十根，帶卯的座十個。"},{"bookId":"exo","chapter":32,"verse":3,"ko":"모든 백성이 그 귀에서 금고리를 빼어 아론에게로 가져 오매","zh":"百姓就都摘下他們耳上的金環，拿來給亞倫。"},{"bookId":"exo","chapter":36,"verse":32,"ko":"성막 저편 널판을 위하여 다섯이요 성막 뒤 곧 서편 널판을 위하여 다섯이며","zh":"為帳幕那面的板做五閂，又為帳幕後面的板做五閂，"},{"bookId":"ezk","chapter":1,"verse":12,"ko":"신이 어느 편으로 가려면 그 생물들이 그대로 가되 돌이키지 아니하고 일제히 앞으로 곧게 행하며","zh":"他們俱各直往前行。靈往哪裏去，他們就往那裏去，行走並不轉身。"},{"bookId":"ezk","chapter":9,"verse":11,"ko":"가는 베옷을 입고 허리에 먹 그릇을 찬 사람이 복명하여 가로되 주께서 내게 명하신 대로 내가 준행하였나이다 하더라","zh":"那穿細麻衣、腰間帶著墨盒子的人將這事回覆說：「我已經照你所吩咐的行了。」"},{"bookId":"ezk","chapter":16,"verse":28,"ko":"네가 음욕이 차지 아니하여 또 앗수르 사람과 행음하고 그들과 행음하고도 오히려 부족히 여겨","zh":"你因貪色無厭，又與亞述人行淫，與他們行淫之後，仍不滿意，"},{"bookId":"ezk","chapter":21,"verse":7,"ko":"그들이 네게 묻기를 네가 어찌하여 탄식하느냐 하거든 대답하기를 소문을 인함이라 재앙이 오나니 각 마음이 녹으며 모든 손이 약하여지며 각 영이 쇠하며 모든 무릎이 물과 같이 약하리라 보라 재앙이 오나니 정녕 이루리라 나 주 여호와의 말이니라 하라","zh":"他們問你說：『為何歎息呢？』你就說：『因為有風聲、災禍要來。人心都必消化，手都發軟，精神衰敗，膝弱如水。看哪，這災禍臨近，必然成就。這是主耶和華說的。』」"},{"bookId":"ezk","chapter":26,"verse":8,"ko":"그가 들에 있는 너의 딸들을 칼로 죽이고 너를 치려고 운제를 세우며 토성을 쌓으며 방패를 갖출 것이며","zh":"他必用刀劍殺滅屬你城邑的居民，也必造臺築壘舉盾牌攻擊你。"},{"bookId":"ezk","chapter":32,"verse":17,"ko":"제십이년 어느 달 십오일에 여호와의 말씀이 내게 임하여 가라사대","zh":"十二年十二月十五日，耶和華的話臨到我說："},{"bookId":"ezk","chapter":37,"verse":25,"ko":"내가 내 종 야곱에게 준 땅 곧 그 열조가 거하던 땅에 그들이 거하되 그들과 그 자자손손이 영원히 거기 거할 것이요 내 종 다윗이 영원히 그 왕이 되리라","zh":"他們必住在我賜給我僕人雅各的地上，就是你們列祖所住之地。他們和他們的子孫，並子孫的子孫，都永遠住在那裏。我的僕人大衛必作他們的王，直到永遠。"},{"bookId":"ezk","chapter":43,"verse":9,"ko":"이제는 그들이 그 음란과 그 왕들의 시체를 내게서 멀리 제하여 버려야 할 것이라 그리하면 내가 영원토록 그들의 가운데 거하리라","zh":"現在他們當從我面前遠除邪淫和他們君王的屍首，我就住在他們中間直到永遠。"},{"bookId":"ezr","chapter":1,"verse":1,"ko":"바사 왕 고레스 원년에 여호와께서 예레미야의 입으로 하신 말씀을 응하게 하시려고 바사 왕 고레스의 마음을 감동시키시매 저가 온 나라에 공포도 하고 조서도 내려 가로되","zh":"波斯王塞魯士元年，耶和華為要應驗藉耶利米口所說的話，就激動波斯王塞魯士的心，使他下詔通告全國說："},{"bookId":"ezr","chapter":7,"verse":1,"ko":"이 일 후 바사 왕 아닥사스다가 위에 있을 때에 에스라라 하는 자가 있으니라 저는 스라야의 아들이요 아사랴의 손자요 힐기야의 증손이요","zh":"這事以後，波斯王亞達薛西年間，有個以斯拉，他是西萊雅的兒子，西萊雅是亞撒利雅的兒子，亞撒利雅是希勒家的兒子，"},{"bookId":"gal","chapter":2,"verse":11,"ko":"게바가 안디옥에 이르렀을 때에 책망할 일이 있기로 내가 저를 면책하였노라","zh":"後來，磯法到了安提阿；因他有可責之處，我就當面抵擋他。"},{"bookId":"gen","chapter":2,"verse":12,"ko":"그 땅의 금은 정금이요 그곳에는 베델리엄과 호마노도 있으며","zh":"並且那地的金子是好的；在那裏又有珍珠和紅瑪瑙。"},{"bookId":"gen","chapter":8,"verse":17,"ko":"너와 함께 한 모든 혈육 있는 생물 곧 새와 육축과 땅에 기는 모든 것을 다 이끌어내라 이것들이 땅에서 생육하고 땅에서 번성하리라 하시매","zh":"在你那裏凡有血肉的活物，就是飛鳥、牲畜，和一切爬在地上的昆蟲，都要帶出來，叫牠在地上多多滋生，大大興旺。」"},{"bookId":"gen","chapter":14,"verse":21,"ko":"소돔 왕이 아브람에게 이르되 사람은 내게 보내고 물품은 네가 취하라","zh":"所多瑪王對亞伯蘭說：「你把人口給我，財物你自己拿去吧！」"},{"bookId":"gen","chapter":21,"verse":1,"ko":"여호와께서 그 말씀대로 사라를 권고하셨고 여호와께서 그 말씀대로 사라에게 행하셨으므로","zh":"耶和華按著先前的話眷顧撒拉，便照他所說的給撒拉成就。"},{"bookId":"gen","chapter":25,"verse":15,"ko":"하닷과 데마와 여둘과 나비스와 게드마니","zh":"哈大、提瑪、伊突、拿非施、基底瑪。"},{"bookId":"gen","chapter":29,"verse":35,"ko":"그가 또 잉태하여 아들을 낳고 가로되 내가 이제는 여호와를 찬송하리로다 하고 이로 인하여 그가 그 이름을 유다라 하였고 그의 생산이 멈추었더라","zh":"她又懷孕生子，說：「這回我要讚美耶和華」，因此給他起名叫猶大。這才停了生育。"},{"bookId":"gen","chapter":34,"verse":7,"ko":"야곱의 아들들은 들에서 이를 듣고 돌아와서 사람 사람이 근심하고 심히 노하였으니 이는 세겜이 야곱의 딸을 강간하여 이스라엘에게 부끄러운 일 곧 행치 못할 일을 행하였음이더라","zh":"雅各的兒子們聽見這事，就從田野回來，人人忿恨，十分惱怒；因示劍在以色列家做了醜事，與雅各的女兒行淫，這本是不該做的事。"},{"bookId":"gen","chapter":38,"verse":25,"ko":"여인이 끌려 나갈 때에 보내어 시부에게 이르되 이 물건 임자로 말미암아 잉태하였나이다 청컨대 보소서 이 도장과 그 끈과 지팡이가 뉘 것이니이까 한지라","zh":"她瑪被拉出來的時候便打發人去見她公公，對他說：「這些東西是誰的，我就是從誰懷的孕。請你認一認，這印和帶子並杖都是誰的？」"},{"bookId":"gen","chapter":43,"verse":12,"ko":"너희 손에 돈을 배나 가지고 너희 자루 아구에 도로 넣여 온 그 돈을 다시 가지고 가라 혹 차착이 있었을까 두렵도다","zh":"又要手裏加倍地帶銀子，並將歸還在你們口袋內的銀子仍帶在手裏；那或者是錯了。"},{"bookId":"gen","chapter":48,"verse":9,"ko":"요셉이 그 아비에게 고하되 이는 하나님이 여기서 내게 주신 아들들이니이다 아비가 가로되 그들을 이끌어 내 앞으로 나아오라 내가 그들에게 축복하리라","zh":"約瑟對他父親說：「這是神在這裏賜給我的兒子。」以色列說：「請你領他們到我跟前，我要給他們祝福。」"},{"bookId":"hag","chapter":2,"verse":14,"ko":"이에 학개가 대답하여 가로되 여호와의 말씀에 내 앞에서 이 백성이 그러하고 이 나라가 그러하고 그 손의 모든 일도 그러하고 그들이 거기서 드리는 것도 부정하니라","zh":"於是哈該說：「耶和華說：這民這國，在我面前也是如此；他們手下的各樣工作都是如此；他們在壇上所獻的也是如此。」"},{"bookId":"heb","chapter":9,"verse":6,"ko":"이 모든 것을 이같이 예비하였으니 제사장들이 항상 첫 장막에 들어가 섬기는 예를 행하고","zh":"這些物件既如此預備齊了，眾祭司就常進頭一層帳幕，行拜神的禮。"},{"bookId":"hos","chapter":1,"verse":2,"ko":"여호와께서 비로소 호세아로 말씀하시니라 여호와께서 호세아에게 이르시되 너는 가서 음란한 아내를 취하여 음란한 자식들을 낳으라 이 나라가 여호와를 떠나 크게 행음함이니라","zh":"耶和華初次與何西阿說話，對他說：「你去娶淫婦為妻，也收那從淫亂所生的兒女；因為這地大行淫亂，離棄耶和華。」"},{"bookId":"hos","chapter":12,"verse":1,"ko":"에브라임은 바람을 먹으며 동풍을 따라가서 날마다 거짓과 포학을 더하며 앗수르와 계약을 맺고 기름을 애굽에 보내도다","zh":"以法蓮吃風，且追趕東風， 時常增添虛謊和強暴， 與亞述立約，把油送到埃及。"},{"bookId":"isa","chapter":6,"verse":9,"ko":"여호와께서 가라사대 가서 이 백성에게 이르기를 너희가 듣기는 들어도 깨닫지 못할 것이요 보기는 보아도 알지 못하리라 하여","zh":"他說：「你去告訴這百姓說： 你們聽是要聽見，卻不明白； 看是要看見，卻不曉得。"},{"bookId":"isa","chapter":14,"verse":7,"ko":"이제는 온 땅이 평안하고 정온하니 무리가 소리질러 노래하는도다","zh":"現在全地得安息，享平靜； 人皆發聲歡呼。"},{"bookId":"isa","chapter":23,"verse":15,"ko":"그 날부터 두로가 한 왕의 연한 같이 칠십 년을 잊어버림이 되었다가 칠십 년이 필한 후에 두로는 기생 노래의 뜻 같이 될 것이라","zh":"到那時，泰爾必被忘記七十年，照著一王的年日。七十年後，泰爾的景況必像妓女所唱的歌："},{"bookId":"isa","chapter":30,"verse":32,"ko":"여호와께서 예정하신 몽둥이를 앗수르 위에 더하실 때마다 소고를 치며 수금을 탈 것이며 그는 전쟁 때에 팔을 들어 그들을 치시리라","zh":"耶和華必將命定的杖加在他身上；每打一下，人必擊鼓彈琴。打仗的時候，耶和華必掄起手來，與他交戰。"},{"bookId":"isa","chapter":38,"verse":16,"ko":"주여 사람의 사는 것이 이에 있고 내 심령의 생명도 온전히 거기 있사오니 원컨대 나를 치료하시며 나를 살려주옵소서","zh":"主啊，人得存活乃在乎此。 我靈存活也全在此。 所以求你使我痊癒，仍然存活。"},{"bookId":"isa","chapter":45,"verse":2,"ko":"내가 네 앞서 가서 험한 곳을 평탄케 하며 놋문을 쳐서 부수며 쇠빗장을 꺾고","zh":"我必在你前面行， 修平崎嶇之地。 我必打破銅門， 砍斷鐵閂。"},{"bookId":"isa","chapter":53,"verse":9,"ko":"그는 강포를 행치 아니하였고 그 입에 궤사가 없었으나 그 무덤이 악인과 함께 되었으며 그 묘실이 부자와 함께 되었도다","zh":"他雖然未行強暴， 口中也沒有詭詐， 人還使他與惡人同埋； 誰知死的時候與財主同葬。"},{"bookId":"isa","chapter":63,"verse":11,"ko":"백성이 옛적 모세의 날을 추억하여 가로되 백성과 양 무리의 목자를 바다에서 올라오게 하신 자가 이제 어디 계시뇨 그들 중에 성신을 두신 자가 이제 어디 계시뇨","zh":"那時，他們想起古時的日子－ 摩西和他百姓，說： 將百姓和牧養他全群的人 從海裏領上來的在哪裏呢？ 將他的聖靈降在他們中間的在哪裏呢？"},{"bookId":"jas","chapter":5,"verse":3,"ko":"너희 금과 은은 녹이 슬었으니 이 녹이 너희에게 증거가 되며 불 같이 너희 살을 먹으리라 너희가 말세에 재물을 쌓았도다","zh":"你們的金銀都長了銹；那銹要證明你們的不是，又要吃你們的肉，如同火燒。你們在這末世只知積攢錢財。"},{"bookId":"jdg","chapter":5,"verse":26,"ko":"손으로 장막 말뚝을 잡으며 오른손에 장인의 방망이를 들고 그 방망이로 시스라를 쳐서 머리를 뚫되 곧 살쩍을 꿰뚫었도다","zh":"雅億左手拿著帳棚的橛子， 右手拿著匠人的錘子， 擊打西西拉， 打傷他的頭， 把他的鬢角打破穿通。"},{"bookId":"jdg","chapter":9,"verse":52,"ko":"아비멜렉이 망대 앞에 이르러서 치며 망대의 문에 가까이 나아가서 그것을 불사르려 하더니","zh":"亞比米勒到了樓前攻打，挨近樓門，要用火焚燒。"},{"bookId":"jdg","chapter":16,"verse":14,"ko":"들릴라가 바디로 그 머리털을 단단히 짜고 그에게 이르되 삼손이여 블레셋 사람이 당신에게 미쳤느니라 하니 삼손이 잠을 깨어 직조틀의 바디와 위선을 다 빼어내니라","zh":"於是大利拉將他的髮綹與緯線同織，用橛子釘住，對他說：「參孫哪，非利士人拿你來了！」參孫從睡中醒來，將機上的橛子和緯線一齊都拔出來了。"},{"bookId":"jdg","chapter":21,"verse":20,"ko":"베냐민 자손에게 명하여 가로되 가서 포도원에 숨어","zh":"就吩咐便雅憫人說：「你們去，在葡萄園中埋伏。"},{"bookId":"jer","chapter":6,"verse":9,"ko":"만군의 여호와께서 이같이 말씀하시되 포도를 땀 같이 그들이 이스라엘의 남은 자를 말갛게 주우리라 너는 포도 따는 자처럼 네 손을 광주리에 자주자주 놀리라 하시나니","zh":"萬軍之耶和華曾如此說： 敵人必擄盡以色列剩下的民， 如同摘淨葡萄一樣。 你要像摘葡萄的人摘了又摘，回手放在筐子裏。"},{"bookId":"jer","chapter":12,"verse":6,"ko":"네 형제와 아비의 집이라도 너를 속이며 네 뒤에서 크게 외치나니 그들이 네게 좋은 말을 할지라도 너는 믿지 말지니라","zh":"因為連你弟兄和你父家都用奸詐待你。 他們也在你後邊大聲喊叫， 雖向你說好話， 你也不要信他們。"},{"bookId":"jer","chapter":19,"verse":5,"ko":"또 그들이 바알을 위하여 산당을 건축하고 자기 아들들을 바알에게 번제로 불살라 드렸나니 이는 내가 명하거나 뜻한 바가 아니니라","zh":"又建築巴力的邱壇，好在火中焚燒自己的兒子，作為燔祭獻給巴力。這不是我所吩咐的，不是我所提說的，也不是我心所起的意。"},{"bookId":"jer","chapter":25,"verse":35,"ko":"목자들은 도망할 수 없겠고 양떼의 인도자들은 도피할 수 없으리로다","zh":"牧人無路逃跑； 群眾的頭目也無法逃脫。"},{"bookId":"jer","chapter":31,"verse":35,"ko":"나 여호와는 해를 낮의 빛으로 주었고 달과 별들을 밤의 빛으로 규정하였고 바다를 격동시켜 그 파도로 소리치게 하나니 내 이름은 만군의 여호와니라 내가 말하노라","zh":"那使太陽白日發光， 使星月有定例，黑夜發亮， 又攪動大海，使海中波浪匉訇的， 萬軍之耶和華是他的名。 他如此說："},{"bookId":"jer","chapter":37,"verse":13,"ko":"베냐민 문에 이른즉 하나냐의 손자요 셀레먀의 아들인 이리야라 이름하는 문지기의 두목이 선지자 예레미야를 붙잡아 가로되 네가 갈대아인에게 항복하려 하는도다","zh":"他到了便雅憫門那裏，有守門官名叫伊利雅，是哈拿尼亞的孫子、示利米雅的兒子，他就拿住先知耶利米，說：「你是投降迦勒底人哪！」"},{"bookId":"jer","chapter":46,"verse":1,"ko":"열국에 대하여 선지자 예레미아에 임한 여호와의 말씀이라","zh":"耶和華論列國的話臨到先知耶利米。"},{"bookId":"jer","chapter":50,"verse":37,"ko":"칼이 그들의 말들과 병거들과 그들 중에 있는 잡족의 위에 임하리니 그들이 부녀 같이 될 것이며 칼이 보물 위에 임하리니 그것이 노략될 것이요","zh":"有刀劍臨到她的馬匹、車輛， 和其中雜族的人民； 他們必像婦女一樣。 有刀劍臨到她的寶物， 就被搶奪。"},{"bookId":"jhn","chapter":1,"verse":50,"ko":"예수께서 대답하여 가라사대 내가 너를 무화과나무 아래서 보았다 하므로 믿느냐 이보다 더 큰 일을 보리라","zh":"耶穌對他說：「因為我說『在無花果樹底下看見你』，你就信嗎？你將要看見比這更大的事」；"},{"bookId":"jhn","chapter":5,"verse":41,"ko":"나는 사람에게 영광을 취하지 아니하노라","zh":"「我不受從人來的榮耀。"},{"bookId":"jhn","chapter":8,"verse":28,"ko":"이에 예수께서 가라사대 너희는 인자를 든 후에 내가 그인 줄을 알고 또 내가 스스로 아무 것도 하지 아니하고 오직 아버지께서 가르치신 대로 이런 것을 말하는 줄도 알리라","zh":"所以耶穌說：「你們舉起人子以後，必知道我是基督，並且知道我沒有一件事是憑著自己做的。我說這些話乃是照著父所教訓我的。"},{"bookId":"jhn","chapter":11,"verse":44,"ko":"죽은 자가 수족을 베로 동인 채로 나오는데 그 얼굴은 수건에 싸였더라 예수께서 가라사대 풀어 놓아 다니게 하라 하시니라","zh":"那死人就出來了，手腳裹著布，臉上包著手巾。耶穌對他們說：「解開，叫他走！」"},{"bookId":"jhn","chapter":15,"verse":25,"ko":"그러나 이는 저희 율법에 기록된 바 저희가 연고 없이 나를 미워하였다 한 말을 응하게 하려 함이니라","zh":"這要應驗他們律法上所寫的話，說：『他們無故地恨我。』"},{"bookId":"jhn","chapter":20,"verse":14,"ko":"이 말을 하고 뒤로 돌이켜 예수의 서신 것을 보나 예수신 줄 알지 못하더라","zh":"說了這話，就轉過身來，看見耶穌站在那裏，卻不知道是耶穌。"},{"bookId":"job","chapter":6,"verse":8,"ko":"하나님이 나의 구하는 것을 얻게 하시며 나의 사모하는 것 주시기를 내가 원하나니","zh":"惟願我得著所求的， 願神賜我所切望的；"},{"bookId":"job","chapter":12,"verse":19,"ko":"제사장들을 벌거벗겨 끌어 가시고 권력이 있는 자를 넘어뜨리시며","zh":"他把祭司剝衣擄去， 又使有能的人傾敗。"},{"bookId":"job","chapter":19,"verse":9,"ko":"나의 영광을 벗기시며 나의 면류관을 머리에서 취하시고","zh":"他剝去我的榮光， 摘去我頭上的冠冕。"},{"bookId":"job","chapter":25,"verse":4,"ko":"그런즉 하나님 앞에서 사람이 어찌 의롭다 하며 부녀에게서 난 자가 어찌 깨끗하다 하랴","zh":"這樣在神面前，人怎能稱義？ 婦人所生的怎能潔淨？"},{"bookId":"job","chapter":31,"verse":38,"ko":"언제 내 토지가 부르짖어 나를 책망하며 그 이랑이 일시에 울었던가","zh":"我若奪取田地，這地向我喊冤， 犂溝一同哭泣；"},{"bookId":"job","chapter":37,"verse":17,"ko":"남풍으로 하여 땅이 고요할 때에 네 의복이 따뜻한 까닭을 네가 아느냐","zh":"南風使地寂靜， 你的衣服就如火熱，你知道嗎？"},{"bookId":"jol","chapter":1,"verse":8,"ko":"너희는 애곡하기를 처녀가 어렸을 때에 약혼한 남편을 인하여 굵은 베로 동이고 애곡함 같이 할지어다","zh":"我的民哪，你當哀號，像處女腰束麻布， 為幼年的丈夫哀號。"},{"bookId":"jos","chapter":3,"verse":2,"ko":"삼 일 후에 유사들이 진중으로 두루 다니며","zh":"過了三天，官長走遍營中，"},{"bookId":"jos","chapter":9,"verse":17,"ko":"이스라엘 자손이 진행하여 제삼일에 그들의 여러 성읍에 이르렀으니 그 성읍은 기브온과 그비라와 브에롯과 기럇여아림이라","zh":"以色列人起行，第三天到了他們的城邑，就是基遍、基非拉、比錄、基列‧耶琳。"},{"bookId":"jos","chapter":15,"verse":10,"ko":"또 바알라에서부터 서편으로 돌이켜 세일 산에 이르러 여아림 산 곧 그살론 곁 북편에 이르고 또 벧 세메스로 내려가서 딤나로 지나고","zh":"又從巴拉往西繞到西珥山，接連到耶琳山的北邊（耶琳就是基撒崙）；又下到伯‧示麥過亭納，"},{"bookId":"jos","chapter":20,"verse":1,"ko":"여호와께서 여호수아에게 일러 가라사대","zh":"耶和華曉諭約書亞說："},{"bookId":"jud","chapter":1,"verse":23,"ko":"또 어떤 자를 불에서 끌어내어 구원하라 또 어떤 자를 그 육체로 더럽힌 옷이라도 싫어하여 두려움으로 긍휼히 여기라","zh":"有些人你們要從火中搶出來，搭救他們；有些人你們要存懼怕的心憐憫他們，連那被情慾沾染的衣服也當厭惡。"},{"bookId":"lev","chapter":1,"verse":1,"ko":"여호와께서 회막에서 모세를 부르시고 그에게 일러 가라사대","zh":"耶和華從會幕中呼叫摩西，對他說："},{"bookId":"lev","chapter":7,"verse":26,"ko":"너희의 사는 모든 곳에서 무슨 피든지 새나 짐승의 피를 먹지말라","zh":"在你們一切的住處，無論是雀鳥的血是野獸的血，你們都不可吃。"},{"bookId":"lev","chapter":13,"verse":12,"ko":"제사장의 보기에 문둥병이 그 피부에 크게 발하였으되 그 환자의 머리부터 발까지 퍼졌거든","zh":"大痲瘋若在皮上四外發散，長滿了患災病人的皮，據祭司察看，從頭到腳無處不有，"},{"bookId":"lev","chapter":16,"verse":20,"ko":"그 지성소와 회막과 단을 위하여 속죄하기를 마친 후에 산 염소를 드리되","zh":"「亞倫為聖所和會幕並壇獻完了贖罪祭，就要把那隻活著的公山羊奉上。"},{"bookId":"lev","chapter":22,"verse":10,"ko":"외국인은 성물을 먹지 못할 것이며 제사장의 객이나 품꾼은 다 성물을 먹지 못할 것이니라","zh":"「凡外人不可吃聖物；寄居在祭司家的，或是雇工人，都不可吃聖物；"},{"bookId":"lev","chapter":26,"verse":12,"ko":"나는 너희 중에 행하여 너희 하나님이 되고 너희는 나의 백성이 될 것이니라","zh":"我要在你們中間行走；我要作你們的神，你們要作我的子民。"},{"bookId":"luk","chapter":2,"verse":11,"ko":"오늘날 다윗의 동네에 너희를 위하여 구주가 나셨으니 곧 그리스도 주시니라","zh":"因今天在大衛的城裏，為你們生了救主，就是主基督。"},{"bookId":"luk","chapter":5,"verse":36,"ko":"또 비유하여 이르시되 새 옷에서 한 조각을 찢어 낡은 옷에 붙이는 자가 없나니 만일 그렇게 하면 새 옷을 찢을 뿐이요 또 새 옷에서 찢은 조각이 낡은 것에 합하지 아니하리라","zh":"耶穌又設一個比喻，對他們說：「沒有人把新衣服撕下一塊來補在舊衣服上；若是這樣，就把新的撕破了，並且所撕下來的那塊新的和舊的也不相稱。"},{"bookId":"luk","chapter":8,"verse":55,"ko":"그 영이 돌아와 아이가 곧 일어나거늘 예수께서 먹을 것을 주라 명하신대","zh":"她的靈魂便回來，她就立刻起來了。耶穌吩咐給她東西吃。"},{"bookId":"luk","chapter":11,"verse":52,"ko":"화 있을진저 너희 율법사여 너희가 지식의 열쇠를 가져 가고 너희도 들어가지 않고 또 들어가고자 하는 자도 막았느니라 하시니라","zh":"你們律法師有禍了！因為你們把知識的鑰匙奪了去，自己不進去，正要進去的人你們也阻擋他們。」"},{"bookId":"luk","chapter":15,"verse":26,"ko":"한 종을 불러 이 무슨 일인가 물은대","zh":"便叫過一個僕人來，問是甚麼事。"},{"bookId":"luk","chapter":19,"verse":42,"ko":"가라사대 너도 오늘날 평화에 관한 일을 알았더면 좋을 뻔하였거니와 지금 네 눈에 숨기웠도다","zh":"說：「巴不得你在這日子知道關係你平安的事；無奈這事現在是隱藏的，叫你的眼看不出來。"},{"bookId":"luk","chapter":22,"verse":69,"ko":"그러나 이제 후로는 인자가 하나님의 권능의 우편에 앉아 있으리라 하시니","zh":"從今以後，人子要坐在神權能的右邊。」"},{"bookId":"mal","chapter":3,"verse":16,"ko":"그 때에 여호와를 경외하는 자들이 피차에 말하매 여호와께서 그것을 분명히 들으시고 여호와를 경외하는 자와 그 이름을 존중히 생각하는 자를 위하여 여호와 앞에 있는 기념책에 기록하셨느니라","zh":"那時，敬畏耶和華的彼此談論，耶和華側耳而聽，且有紀念冊在他面前，記錄那敬畏耶和華、思念他名的人。"},{"bookId":"mat","chapter":6,"verse":12,"ko":"우리가 우리에게 죄 지은 자를 사하여 준 것 같이 우리 죄를 사하여 주옵시고","zh":"免我們的債， 如同我們免了人的債。"},{"bookId":"mat","chapter":10,"verse":34,"ko":"내가 세상에 화평을 주러 온 줄로 생각지 말라 화평이 아니요 검을 주러 왔노라","zh":"「你們不要想我來是叫地上太平；我來並不是叫地上太平，乃是叫地上動刀兵。"},{"bookId":"mat","chapter":14,"verse":11,"ko":"그 머리를 소반에 담아다가 그 여아에게 주니 그가 제 어미에게 가져 가니라","zh":"把頭放在盤子裏，拿來給了女子；女子拿去給她母親。"},{"bookId":"mat","chapter":19,"verse":5,"ko":"말씀하시기를 이러므로 사람이 그 부모를 떠나서 아내에게 합하여 그 둘이 한 몸이 될지니라 하신 것을 읽지 못하였느냐","zh":"並且說：『因此，人要離開父母，與妻子連合，二人成為一體。』這經你們沒有念過嗎？"},{"bookId":"mat","chapter":23,"verse":6,"ko":"잔치의 상석과 회당의 상좌와","zh":"喜愛筵席上的首座，會堂裏的高位，"},{"bookId":"mat","chapter":26,"verse":28,"ko":"이것은 죄 사함을 얻게 하려고 많은 사람을 위하여 흘리는 바 나의 피 곧 언약의 피니라","zh":"因為這是我立約的血，為多人流出來，使罪得赦。"},{"bookId":"mic","chapter":2,"verse":9,"ko":"내 백성의 부녀들을 너희가 그 즐거운 집에서 쫓아내고 그 어린 자녀에게서 나의 영광을 영영히 빼앗는도다","zh":"你們將我民中的婦人從安樂家中趕出， 又將我的榮耀從她們的小孩子盡行奪去。"},{"bookId":"mrk","chapter":3,"verse":4,"ko":"저희에게 이르시되 안식일에 선을 행하는 것과 악을 행하는 것, 생명을 구하는 것과 죽이는 것, 어느 것이 옳으냐 하시니 저희가 잠잠하거늘","zh":"又問眾人說：「在安息日行善行惡，救命害命，哪樣是可以的呢？」他們都不作聲。"},{"bookId":"mrk","chapter":6,"verse":43,"ko":"남은 떡 조각과 물고기를 열두 바구니에 차게 거두었으며","zh":"門徒就把碎餅碎魚收拾起來，裝滿了十二個籃子。"},{"bookId":"mrk","chapter":10,"verse":21,"ko":"예수께서 그를 보시고 사랑하사 가라사대 네게 오히려 한 가지 부족한 것이 있으니 가서 네 있는 것을 다 팔아 가난한 자들을 주라 그리하면 하늘에서 보화가 네게 있으리라 그리고 와서 나를 좇으라 하시니","zh":"耶穌看著他，就愛他，對他說：「你還缺少一件：去變賣你所有的，分給窮人，就必有財寶在天上；你還要來跟從我。」"},{"bookId":"mrk","chapter":14,"verse":13,"ko":"예수께서 제자 중에 둘을 보내시며 가라사대 성내로 들어가라 그리하면 물 한 동이를 가지고 가는 사람을 만나리니 그를 따라가서","zh":"耶穌就打發兩個門徒，對他們說：「你們進城去，必有人拿著一瓶水迎面而來，你們就跟著他。"},{"bookId":"nam","chapter":3,"verse":4,"ko":"이는 마술의 주인된 아리따운 기생이 음행을 많이 함을 인함이라 그가 그 음행으로 열국을 미혹하고 그 마술로 여러 족속을 미혹하느니라","zh":"都因那美貌的妓女多有淫行， 慣行邪術，藉淫行誘惑列國， 用邪術誘惑多族。"},{"bookId":"neh","chapter":7,"verse":18,"ko":"아도니감 자손이 육백육십칠 명이요","zh":"亞多尼干的子孫六百六十七名；"},{"bookId":"neh","chapter":11,"verse":7,"ko":"베냐민 자손은 살루니 저는 므술람의 아들이요 요엣의 손자요 브다야의 증손이요 골라야의 현손이요 마아세야의 오대손이요 이디엘의 육대손이요 여사야의 칠대손이며","zh":"便雅憫人中有米書蘭的兒子撒路。米書蘭是約葉的兒子；約葉是毗大雅的兒子；毗大雅是哥賴雅的兒子；哥賴雅是瑪西雅的兒子；瑪西雅是以鐵的兒子；以鐵是耶篩亞的兒子。"},{"bookId":"num","chapter":2,"verse":24,"ko":"에브라임 진에 속한 계수함을 입은 군대의 총계가 십만 팔천일백 명이라 그들은 제삼대로 진행할지니라","zh":"凡屬以法蓮營、按著軍隊被數的，共有十萬零八千一百名，要作第三隊往前行。"},{"bookId":"num","chapter":6,"verse":22,"ko":"여호와께서 모세에게 일러 가라사대","zh":"耶和華曉諭摩西說："},{"bookId":"num","chapter":10,"verse":14,"ko":"수두로 유다 자손 진 기에 속한 자들이 그 군대대로 진행하였으니 유다 군대는 암미나답의 아들 나손이 영솔하였고","zh":"按著軍隊首先往前行的是猶大營的纛。統領軍隊的是亞米拿達的兒子拿順。"},{"bookId":"num","chapter":15,"verse":6,"ko":"수양이면 소제로 고운 가루 한 에바 십분지 이에 기름 한 힌의 삼분지 일을 섞어 예비하고","zh":"為公綿羊預備細麵伊法十分之二，並油一欣三分之一，調和作素祭，"},{"bookId":"num","chapter":20,"verse":5,"ko":"너희가 어찌하여 우리를 애굽에서 나오게 하여 이 악한 곳으로 인도하였느냐 이곳에는 파종할 곳이 없고 무화과도 없고 포도도 없고 석류도 없고 마실 물도 없도다","zh":"你們為何逼著我們出埃及、領我們到這壞地方呢？這地方不好撒種，也沒有無花果樹、葡萄樹、石榴樹，又沒有水喝。」"},{"bookId":"num","chapter":25,"verse":2,"ko":"그 여자들이 그 신들에게 제사할 때에 백성을 청하매 백성이 먹고 그들의 신들에게 절하므로","zh":"因為這女子叫百姓來，一同給她們的神獻祭，百姓就吃她們的祭物，跪拜她們的神。"},{"bookId":"num","chapter":29,"verse":22,"ko":"또 수염소 하나를 속죄제로 드릴지니 상번제와 그 소제와 그 전제 외에니라","zh":"又要獻一隻公山羊為贖罪祭。這是在常獻的燔祭和同獻的素祭並同獻的奠祭以外。"},{"bookId":"num","chapter":33,"verse":33,"ko":"홀하깃갓에서 발행하여 욧바다에 진 쳤고","zh":"從曷‧哈及甲起行，安營在約巴他。"},{"bookId":"php","chapter":1,"verse":12,"ko":"형제들아 나의 당한 일이 도리어 복음의 진보가 된 줄을 너희가 알기를 원하노라","zh":"弟兄們，我願意你們知道，我所遭遇的事更是叫福音興旺，"},{"bookId":"pro","chapter":3,"verse":10,"ko":"그리하면 네 창고가 가득히 차고 네 즙틀에 새 포도즙이 넘치리라","zh":"這樣，你的倉房必充滿有餘； 你的酒醡有新酒盈溢。"},{"bookId":"pro","chapter":8,"verse":20,"ko":"나는 의로운 길로 행하며 공평한 길 가운데로 다니나니","zh":"我在公義的道上走， 在公平的路中行，"},{"bookId":"pro","chapter":14,"verse":7,"ko":"너는 미련한 자의 앞을 떠나라 그 입술에 지식 있음을 보지 못함이니라","zh":"到愚昧人面前， 不見他嘴中有知識。"},{"bookId":"pro","chapter":19,"verse":11,"ko":"노하기를 더디하는 것이 사람의 슬기요 허물을 용서하는 것이 자기의 영광이니라","zh":"人有見識就不輕易發怒； 寬恕人的過失便是自己的榮耀。"},{"bookId":"pro","chapter":24,"verse":16,"ko":"대저 의인은 일곱 번 넘어질지라도 다시 일어나려니와 악인은 재앙으로 인하여 엎드러지느니라","zh":"因為，義人雖七次跌倒，仍必興起； 惡人卻被禍患傾倒。"},{"bookId":"pro","chapter":30,"verse":3,"ko":"나는 지혜를 배우지 못하였고 또 거룩하신 자를 아는 지식이 없거니와","zh":"我沒有學好智慧， 也不認識至聖者。"},{"bookId":"psa","chapter":9,"verse":17,"ko":"악인이 음부로 돌아감이여 하나님을 잊어버린 모든 열방이 그리 하리로다","zh":"惡人，就是忘記神的外邦人， 都必歸到陰間。"},{"bookId":"psa","chapter":21,"verse":4,"ko":"저가 생명을 구하매 주께서 주셨으니 곧 영영한 장수로소이다","zh":"他向你求壽，你便賜給他， 就是日子長久，直到永遠。"},{"bookId":"psa","chapter":31,"verse":21,"ko":"여호와를 찬송할지어다 견고한 성에서 그 기이한 인자를 내게 보이셨음이로다","zh":"耶和華是應當稱頌的， 因為他在堅固城裏向我施展奇妙的慈愛。"},{"bookId":"psa","chapter":38,"verse":19,"ko":"내 원수가 활발하며 강하고 무리하게 나를 미워하는 자가 무수하오며","zh":"但我的仇敵又活潑又強壯， 無理恨我的增多了。"},{"bookId":"psa","chapter":50,"verse":1,"ko":"[아삽의 시] 전능하신 자 하나님 여호와께서 말씀하사 해 돋는 데서부터 지는 데까지 세상을 부르셨도다","zh":"大能者神－耶和華已經發言招呼天下， 從日出之地到日落之處。"},{"bookId":"psa","chapter":61,"verse":7,"ko":"저가 영원히 하나님 앞에 거하리니 인자와 진리를 예비하사 저를 보호하소서","zh":"他必永遠坐在神面前； 願你預備慈愛和誠實保佑他！"},{"bookId":"psa","chapter":71,"verse":9,"ko":"나를 늙은 때에 버리지 마시며 내 힘이 쇠약한 때에 떠나지 마소서","zh":"我年老的時候，求你不要丟棄我！ 我力氣衰弱的時候，求你不要離棄我！"},{"bookId":"psa","chapter":78,"verse":32,"ko":"그럴지라도 저희가 오히려 범죄하여 그의 기사를 믿지 아니하였으므로","zh":"雖是這樣，他們仍舊犯罪， 不信他奇妙的作為。"},{"bookId":"psa","chapter":87,"verse":1,"ko":"[고라 자손의 시 곧 노래] 그 기지가 성산에 있음이여","zh":"耶和華所立的根基在聖山上。"},{"bookId":"psa","chapter":95,"verse":7,"ko":"대저 저는 우리 하나님이시요 우리는 그의 기르시는 백성이며 그 손의 양이라 너희가 오늘날 그 음성을 듣기를 원하노라","zh":"因為他是我們的神； 我們是他草場的羊，是他手下的民。 惟願你們今天聽他的話："},{"bookId":"psa","chapter":105,"verse":14,"ko":"사람이 그들을 해하기를 용납지 아니하시고 그들의 연고로 열왕을 꾸짖어","zh":"他不容甚麼人欺負他們， 為他們的緣故責備君王，"},{"bookId":"psa","chapter":109,"verse":22,"ko":"나는 가난하고 궁핍하여 중심이 상함이니이다","zh":"因為我困苦窮乏， 內心受傷。"},{"bookId":"psa","chapter":119,"verse":38,"ko":"주를 경외케 하는 주의 말씀을 주의 종에게 세우소서","zh":"你向敬畏你的人所應許的話， 求你向僕人堅定！"},{"bookId":"psa","chapter":122,"verse":4,"ko":"지파들 곧 여호와의 이름에 감사하려고 이스라엘의 전례대로 그리로 올라가는도다","zh":"眾支派，就是耶和華的支派，上那裏去， 按以色列的常例稱讚耶和華的名。"},{"bookId":"psa","chapter":139,"verse":13,"ko":"주께서 내 장부를 지으시며 나의 모태에서 나를 조직하셨나이다","zh":"我的肺腑是你所造的； 我在母腹中，你已覆庇我。"},{"bookId":"rev","chapter":1,"verse":9,"ko":"나 요한은 너희 형제요 예수의 환난과 나라와 참음에 동참하는 자라 하나님의 말씀과 예수의 증거를 인하여 밧모라 하는 섬에 있었더니","zh":"我－約翰就是你們的弟兄，和你們在耶穌的患難、國度、忍耐裏一同有分，為神的道，並為給耶穌作的見證，曾在那名叫拔摩的海島上。"},{"bookId":"rev","chapter":10,"verse":2,"ko":"그 손에 펴 놓인 작은 책을 들고 그 오른발은 바다를 밟고 왼발은 땅을 밟고","zh":"他手裏拿著小書卷，是展開的。他右腳踏海，左腳踏地，"},{"bookId":"rev","chapter":19,"verse":3,"ko":"두번째 가로되 할렐루야 하더니 그 연기가 세세토록 올라가더라","zh":"又說： 哈利路亞！ 燒淫婦的煙往上冒， 直到永永遠遠。"},{"bookId":"rom","chapter":3,"verse":15,"ko":"그 발은 피 흘리는데 빠른지라","zh":"殺人流血， 他們的腳飛跑，"},{"bookId":"rom","chapter":9,"verse":8,"ko":"곧 육신의 자녀가 하나님의 자녀가 아니라 오직 약속의 자녀가 씨로 여기심을 받느니라","zh":"這就是說，肉身所生的兒女不是神的兒女，惟獨那應許的兒女才算是後裔。"},{"bookId":"rom","chapter":15,"verse":17,"ko":"그러므로 내가 그리스도 예수 안에서 하나님의 일에 대하여 자랑하는 것이 있거니와","zh":"所以論到神的事，我在基督耶穌裏有可誇的。"},{"bookId":"sng","chapter":2,"verse":14,"ko":"바위 틈 낭떠러지 은밀한 속에 있는 나의 비둘기야 나로 네 얼굴을 보게 하라 네 소리를 듣게 하라 네 소리는 부드럽고 네 얼굴은 아름답구나","zh":"我的鴿子啊，你在磐石穴中， 在陡巖的隱密處。 求你容我得見你的面貌， 得聽你的聲音； 因為你的聲音柔和， 你的面貌秀美。"},{"bookId":"zec","chapter":2,"verse":5,"ko":"여호와의 말씀에 내가 그 사면에서 불 성곽이 되며 그 가운데서 영광이 되리라","zh":"耶和華說：我要作耶路撒冷四圍的火城，並要作其中的榮耀。」"},{"bookId":"zec","chapter":13,"verse":2,"ko":"만군의 여호와가 말하노라 그 날에 내가 우상의 이름을 이 땅에서 끊어서 기억도 되지 못하게 할 것이며 거짓 선지자와 더러운 사귀를 이 땅에서 떠나게 할 것이라","zh":"萬軍之耶和華說：「那日，我必從地上除滅偶像的名，不再被人記念；也必使這地不再有假先知與污穢的靈。"},{"bookId":"1ch","chapter":2,"verse":29,"ko":"아비술의 아내의 이름은 아비하일이라 저가 그로 말미암아 아반과 몰릿을 낳았으며","zh":"亞比述的妻名叫亞比孩，亞比孩給他生了亞辦和摩利。"},{"bookId":"1ch","chapter":6,"verse":41,"ko":"말기야는 에드니의 아들이요 에드니는 세라의 아들이요","zh":"瑪基雅是伊特尼的兒子；伊特尼是謝拉的兒子；謝拉是亞大雅的兒子；"},{"bookId":"1ch","chapter":9,"verse":37,"ko":"그돌과 아히오와 스가랴와 미글롯이며","zh":"基多、亞希約、撒迦利雅、米基羅。"},{"bookId":"1ch","chapter":15,"verse":18,"ko":"그 다음으로 형제 스가랴와 벤과 야아시엘과 스미라못과 여히엘과 운니와 엘리압과 브나야와 마아세야와 맛디디야와 엘리블레후와 믹네야와 문지기 오벧에돔과 여이엘을 세우니","zh":"其次還有他們的弟兄撒迦利雅、便雅薛、示米拉末、耶歇、烏尼、以利押、比拿雅、瑪西雅、瑪他提雅、以利斐利戶、彌克尼雅，並守門的俄別‧以東和耶利。"},{"bookId":"1ch","chapter":22,"verse":6,"ko":"다윗이 그 아들 솔로몬을 불러 이스라엘 하나님 여호와를 위하여 전을 건축하기를 부탁하여","zh":"大衛召了他兒子所羅門來，囑咐他給耶和華－以色列的神建造殿宇，"},{"bookId":"1ch","chapter":27,"verse":18,"ko":"유다의 관장은 다윗의 형 엘리후요 잇사갈의 관장은 미가엘의 아들 오므리요","zh":"管猶大人的是大衛的一個哥哥以利戶；管以薩迦人的是米迦勒的兒子暗利；"},{"bookId":"1co","chapter":4,"verse":20,"ko":"하나님의 나라는 말에 있지 아니하고 오직 능력에 있음이라","zh":"因為神的國不在乎言語，乃在乎權能。"},{"bookId":"1co","chapter":11,"verse":10,"ko":"이러므로 여자는 천사들을 인하여 권세 아래 있는 표를 그 머리 위에 둘지니라","zh":"因此，女人為天使的緣故，應當在頭上有服權柄的記號。"},{"bookId":"1co","chapter":15,"verse":49,"ko":"우리가 흙에 속한 자의 형상을 입은 것 같이 또한 하늘에 속한 자의 형상을 입으리라","zh":"我們既有屬土的形狀，將來也必有屬天的形狀。"},{"bookId":"1ki","chapter":1,"verse":19,"ko":"저가 수소와 살진 송아지와 양을 많이 잡고 왕의 모든 아들과 제사장 아비아달과 군대장관 요압을 청하였으나 왕의 종 솔로몬은 청치 아니하였나이다","zh":"他宰了許多牛羊、肥犢，請了王的眾子和祭司亞比亞他，並元帥約押；惟獨王的僕人所羅門，他沒有請。"},{"bookId":"1ki","chapter":5,"verse":17,"ko":"이에 왕이 영을 내려 크고 귀한 돌을 떠다가 다듬어서 전의 기초석으로 놓게 하매","zh":"王下令，人就鑿出又大又寶貴的石頭來，用以立殿的根基。"},{"bookId":"1ki","chapter":9,"verse":1,"ko":"솔로몬이 여호와의 전과 왕궁 건축하기를 마치며 자기의 무릇 이루기를 원하던 일이 마친 때에","zh":"所羅門建造耶和華殿和王宮，並一切所願意建造的都完畢了，"},{"bookId":"1ki","chapter":13,"verse":25,"ko":"지나가는 사람들이 길에 버린 시체와 그 시체 곁에 선 사자를 보고 그 늙은 선지자가 사는 성읍에 와서 말한지라","zh":"有人從那裏經過，看見屍身倒在路上，獅子站在屍身旁邊，就來到老先知所住的城裏述說這事。"},{"bookId":"1ki","chapter":18,"verse":25,"ko":"엘리야가 바알의 선지자들에게 이르되 너희는 많으니 먼저 한 송아지를 택하여 잡고 너희 신의 이름을 부르라 그러나 불을 놓지 말라","zh":"以利亞對巴力的先知說：「你們既是人多，當先挑選一隻牛犢，預備好了，就求告你們神的名，卻不要點火。」"},{"bookId":"1ki","chapter":22,"verse":43,"ko":"여호사밧이 그 부친 아사의 모든 길로 행하며 돌이켜 떠나지 아니하고 여호와 보시기에 정직히 행하였으나 산당은 폐하지 아니하였으므로 백성이 오히려 산당에서 제사를 드리며 분향하였더라","zh":"約沙法行他父親亞撒所行的道，不偏離左右，行耶和華眼中看為正的事；只是邱壇還沒有廢去，百姓仍在那裏獻祭燒香。"},{"bookId":"1sa","chapter":2,"verse":14,"ko":"그것으로 남비에나 솥에나 큰 솥에나 가마에 찔러 넣어서 갈고리에 걸려 나오는 것은 제사장이 자기 것으로 취하되 실로에서 무릇 그곳에 온 이스라엘 사람에게 이같이 할 뿐 아니라","zh":"將叉子往罐裏，或鼎裏，或釜裏，或鍋裏一插，插上來的肉，祭司都取了去。凡上到示羅的以色列人，他們都是這樣看待。"},{"bookId":"1sa","chapter":9,"verse":20,"ko":"사흘 전에 잃은 네 암나귀들을 염려하지 말라 찾았느니라 온 이스라엘의 사모하는 자가 누구냐 너와 네 아비의 온 집이 아니냐","zh":"至於你前三日所丟的那幾頭驢，你心裏不必掛念，已經找著了。以色列眾人所仰慕的是誰呢？不是仰慕你和你父的全家嗎？」"},{"bookId":"1sa","chapter":15,"verse":8,"ko":"아말렉 사람의 왕 아각을 사로잡고 칼날로 그 모든 백성을 진멸하였으되","zh":"生擒了亞瑪力王亞甲，用刀殺盡亞瑪力的眾民。"},{"bookId":"1sa","chapter":19,"verse":19,"ko":"혹이 사울에게 고하여 가로되 다윗이 라마 나욧에 있더이다 하매","zh":"有人告訴掃羅，說大衛在拉瑪的拿約。"},{"bookId":"1sa","chapter":25,"verse":21,"ko":"다윗이 이미 말하기를 내가 이 자의 소유물을 광야에서 지켜 그 모든 것을 하나도 손실이 없게 한 것이 진실로 허사라 그가 악으로 나의 선을 갚는도다","zh":"大衛曾說：「我在曠野為那人看守所有的，以致他一樣不失落，實在是徒然了！他向我以惡報善。"},{"bookId":"1th","chapter":2,"verse":10,"ko":"우리가 너희 믿는 자들을 향하여 어떻게 거룩하고 옳고 흠 없이 행한 것에 대하여 너희가 증인이요 하나님도 그러하시도다","zh":"我們向你們信主的人，是何等聖潔、公義、無可指摘，有你們作見證，也有神作見證。"},{"bookId":"1ti","chapter":5,"verse":25,"ko":"이와 같이 선행도 밝히 드러나고 그렇지 아니한 것도 숨길 수 없느니라","zh":"這樣，善行也有明顯的，那不明顯的也不能隱藏。"},{"bookId":"2ch","chapter":7,"verse":6,"ko":"때에 제사장들은 직분대로 모셔 서고 레위 사람도 여호와의 악기를 가지고 섰으니 이 악기는 전에 다윗 왕이 레위 사람으로 여호와를 찬송하려고 만들어서 여호와의 인자하심이 영원함을 감사케 하던 것이라 제사장은 무리 앞에서 나팔을 불고 온 이스라엘은 섰더라","zh":"祭司侍立，各供其職；利未人也拿著耶和華的樂器，就是大衛王造出來、藉利未人頌讚耶和華的。（他的慈愛永遠長存！）祭司在眾人面前吹號，以色列人都站立。"},{"bookId":"2ch","chapter":14,"verse":13,"ko":"아사와 그 좇는 자가 구스 사람을 쫓아 그랄까지 이르매 이에 구스 사람이 엎드러지고 살아 남은 자가 없었으니 이는 여호와 앞에서와 그 군대 앞에서 패망하였음이라 노략한 물건이 심히 많았더라","zh":"亞撒和跟隨他的軍兵追趕他們，直到基拉耳。古實人被殺的甚多，不能再強盛，因為敗在耶和華與他軍兵面前。猶大人就奪了許多財物，"},{"bookId":"2ch","chapter":22,"verse":1,"ko":"예루살렘 거민이 여호람의 말째 아들 아하시야로 위를 이어 왕을 삼았으니 이는 전에 아라비아 사람과 함께 와서 영을 치던 부대가 그의 모든 형을 죽였음이라 그러므로 유다 왕 여호람의 아들 아하시야가 왕이 되었더라","zh":"耶路撒冷的居民立約蘭的小兒子亞哈謝接續他作王；因為跟隨阿拉伯人來攻營的軍兵曾殺了亞哈謝的眾兄長。這樣，猶大王約蘭的兒子亞哈謝作了王。"},{"bookId":"2ch","chapter":29,"verse":11,"ko":"내 아들들아 이제는 게으르지 말라 여호와께서 이미 너희를 택하사 그 앞에 서서 수종들어 섬기며 분향하게 하셨느니라","zh":"我的眾子啊，現在不要懈怠；因為耶和華揀選你們站在他面前事奉他，與他燒香。」"},{"bookId":"2ch","chapter":34,"verse":28,"ko":"그러므로 내가 너로 너의 열조에게 돌아가서 평안히 묘실로 들어가게 하리니 내가 이곳과 그 거민에게 내리는 모든 재앙을 네가 눈으로 보지 못하리라 하셨느니라 사자들이 왕에게 복명하니라","zh":"我必使你平平安安地歸到墳墓，到你列祖那裏，我要降與這地和其上居民的一切災禍，你也不致親眼看見。』」他們就回覆王去了。"},{"bookId":"2co","chapter":6,"verse":4,"ko":"오직 모든 일에 하나님의 일꾼으로 자천하여 많이 견디는 것과 환난과 궁핍과 곤란과","zh":"反倒在各樣的事上表明自己是神的用人，就如在許多的忍耐、患難、窮乏、困苦、"},{"bookId":"2jn","chapter":1,"verse":3,"ko":"은혜와 긍휼과 평강이 하나님 아버지와 아버지의 아들 예수 그리스도께로부터 진리와 사랑 가운데서 우리와 함께 있으리라","zh":"恩惠、憐憫、平安從父神和他兒子耶穌基督在真理和愛心上必常與我們同在！"},{"bookId":"2ki","chapter":6,"verse":6,"ko":"하나님의 사람이 가로되 어디 빠졌느냐 하매 그곳을 보이는지라 엘리사가 나무가지를 베어 물에 던져서 도끼로 떠오르게 하고","zh":"神人問說：「掉在哪裏了？」他將那地方指給以利沙看。以利沙砍了一根木頭，拋在水裏，斧頭就漂上來了。"},{"bookId":"2ki","chapter":11,"verse":8,"ko":"너희는 각각 손에 병기를 잡고 왕을 호위하며 무릇 너희 반열을 침범하는 자는 죽이고 왕의 출입할 때에 시위할지니라","zh":"各人手拿兵器，四圍護衛王。凡擅入你們班次的必當治死，王出入的時候，你們當跟隨他。」"},{"bookId":"2ki","chapter":17,"verse":11,"ko":"또 여호와께서 저희 앞에서 물리치신 이방 사람 같이 그곳 모든 산당에서 분향하며 또 악을 행하여 여호와를 격노케 하였으며","zh":"在邱壇上燒香，效法耶和華在他們面前趕出的外邦人所行的，又行惡事惹動耶和華的怒氣；"},{"bookId":"2ki","chapter":22,"verse":6,"ko":"곧 목수와 건축자와 미장이에게 주게 하고 또 재목과 다듬은 돌을 사서 그 전을 수리하게 하라 하니라","zh":"就是轉交木匠和工人，並瓦匠，又買木料和鑿成的石頭修理殿宇，"},{"bookId":"2pe","chapter":3,"verse":13,"ko":"우리는 그의 약속대로 의의 거하는 바 새 하늘과 새 땅을 바라보도다","zh":"但我們照他的應許，盼望新天新地，有義居在其中。"},{"bookId":"2sa","chapter":6,"verse":19,"ko":"모든 백성 곧 온 이스라엘 무리의 무론 남녀하고 떡 한 개와 고기 한 조각과 건포도떡 한 덩이씩 나눠주매 모든 백성이 각기 집으로 돌아가니라","zh":"並且分給以色列眾人，無論男女，每人一個餅，一塊肉，一個葡萄餅；眾人就各回各家去了。"},{"bookId":"2sa","chapter":13,"verse":16,"ko":"다말이 가로되 가치 아니하다 나를 쫓아 보내는 이 큰 악은 아까 내게 행한 그 악보다 더하다 하되 암논이 듣지 아니하고","zh":"她瑪說：「不要這樣！你趕出我去的這罪比你才行的更重！」但暗嫩不肯聽她的話，"},{"bookId":"2sa","chapter":18,"verse":13,"ko":"아무 일도 왕 앞에는 숨길 수 없나니 내가 만일 거역하여 그 생명을 해하였다면 당신도 나를 대적하였으리이다","zh":"我若妄為害了他的性命，就是你自己也必與我為敵（原來，無論何事都瞞不過王。）」"},{"bookId":"2sa","chapter":22,"verse":46,"ko":"이방인들이 쇠미하여 그 견고한 곳에서 떨며 나오리로다","zh":"外邦人要衰殘， 戰戰兢兢地出他們的營寨。"},{"bookId":"2ti","chapter":2,"verse":23,"ko":"어리석고 무식한 변론을 버리라 이에서 다툼이 나는 줄 앎이라","zh":"惟有那愚拙無學問的辯論，總要棄絕，因為知道這等事是起爭競的。"},{"bookId":"act","chapter":4,"verse":3,"ko":"저희를 잡으매 날이 이미 저문 고로 이튿날까지 가두었으나","zh":"於是下手拿住他們；因為天已經晚了，就把他們押到第二天。"},{"bookId":"act","chapter":8,"verse":8,"ko":"그 성에 큰 기쁨이 있더라","zh":"在那城裏，就大有歡喜。"},{"bookId":"act","chapter":12,"verse":5,"ko":"이에 베드로는 옥에 갇혔고 교회는 그를 위하여 간절히 하나님께 빌더라","zh":"於是彼得被囚在監裏；教會卻為他切切地禱告神。"},{"bookId":"act","chapter":16,"verse":19,"ko":"종의 주인들은 자기 이익의 소망이 끊어진 것을 보고 바울과 실라를 잡아가지고 저자로 관원들에게 끌어 갔다가","zh":"使女的主人們見得利的指望沒有了，便揪住保羅和西拉，拉他們到市上去見首領；"}];
// 一次性清除舊版快取
const VERSE_CACHE_VERSION = '2026.05.31.v2';
if (localStorage.getItem('verse_cache_version') !== VERSE_CACHE_VERSION) {
    localStorage.removeItem(DAILY_VERSE_KEY);
    localStorage.setItem('verse_cache_version', VERSE_CACHE_VERSION);
}
// 取得今日種子（首爾時間 UTC+9，所有裝置統一）
function getDailySeed() {
    const now = new Date();
    const seoulTime = new Date(now.getTime() + (now.getTimezoneOffset() + 540) * 60000);
    return seoulTime.getFullYear() * 10000 + (seoulTime.getMonth() + 1) * 100 + seoulTime.getDate();
}
function seededRandom(seed) {
    // Mulberry32 - 確定性PRNG，所有裝置結果一致
    seed = (seed | 0) + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function getDayNumberFromDateString(dateString) {
    const [year, month, day] = String(dateString).split('-').map(Number);
    return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        const remainder = a % b;
        a = b;
        b = remainder;
    }
    return a || 1;
}
function getDailyVerseRotationStep(poolLength) {
    if (poolLength <= 1) return 1;
    const preferredSteps = [149, 137, 127, 113, 109, 101, 97, 89, 83, 79, 73, 67, 61, 53, 47, 43, 41, 37];
    const preferred = preferredSteps.find(step => step < poolLength && gcd(step, poolLength) === 1);
    if (preferred) return preferred;
    for (let step = poolLength - 1; step > 1; step--) {
        if (gcd(step, poolLength) === 1) return step;
    }
    return 1;
}
function getVerseHistory() {
    try {
        const data = JSON.parse(localStorage.getItem(DAILY_VERSE_HISTORY_KEY) || '[]');
        const now = Date.now();
        const historyWindow = DAILY_VERSE_HISTORY_DAYS * 24 * 60 * 60 * 1000;
        return data.filter(item => (now - item.timestamp) < historyWindow);
    } catch (e) { return []; }
}
function recordVerseUsed(verseKey) {
    const history = getVerseHistory().filter(item => item.key !== verseKey);
    history.push({ key: verseKey, timestamp: Date.now() });
    localStorage.setItem(DAILY_VERSE_HISTORY_KEY, JSON.stringify(history));
}
function getDailyVerse() {
    const todaySeed = getDailySeed();
    const cached = localStorage.getItem(DAILY_VERSE_KEY);
    if (cached) {
        try {
            const cacheData = JSON.parse(cached);
            if (cacheData.seed === todaySeed && cacheData.version === VERSE_CACHE_VERSION && cacheData.source === 'embedded-daily-index') return cacheData;
        } catch(e) {}
    }
    const indexedResult = selectDailyVerseFromPool(DAILY_VERSE_INDEX_ITEMS, todaySeed, 'embedded-daily-index');
    if (indexedResult) {
        localStorage.setItem(DAILY_VERSE_KEY, JSON.stringify(indexedResult));
        return indexedResult;
    }
    // 每日默想經文池（固定清單，涵蓋常用章節）
    const versePool = [
        {"ko":"창세기 1:1","zh":"創世記 1:1","textKo":"태초에 하나님이 천지를 창조하시니라","textZh":"起初，神創造天地。"},
        {"ko":"창세기 12:2","zh":"創世記 12:2","textKo":"내가 너로 큰 민족을 이루고 네게 복을 주어 네 이름을 창대케 하리니 너는 복의 근원이 될지라","textZh":"我必叫你成為大國。我必賜福給你，叫你的名為大；你也要叫別人得福。"},
        {"ko":"창세기 15:6","zh":"創世記 15:6","textKo":"아브람이 여호와를 믿으니 여호와께서 이를 그의 의로 여기시고","textZh":"亞伯蘭信耶和華，耶和華就以此為他的義。"},
        {"ko":"창세기 22:14","zh":"創世記 22:14","textKo":"아브라함이 그 땅 이름을 여호와이레라 하였으므로 오늘까지 사람들이 이르기를 여호와의 산에서 준비되리라 하더라","textZh":"亞伯拉罕給那地方起名叫「耶和華以勒」，直到今日人還說：「在耶和華的山上必有預備。」"},
        {"ko":"출애굽기 14:14","zh":"出埃及記 14:14","textKo":"여호와께서 너희를 위하여 싸우시리니 너희는 가만히 있을지니라","textZh":"耶和華必為你們爭戰；你們只管靜默，不要作聲。」"},
        {"ko":"출애굽기 15:2","zh":"出埃及記 15:2","textKo":"여호와는 나의 힘이요 노래시며 나의 구원이시로다 그는 나의 하나님이시니 내가 그를 찬송할 것이요 내 아비의 하나님이시니 내가 그를 높이리로다","textZh":"耶和華是我的力量，我的詩歌， 也成了我的拯救。 這是我的神，我要讚美他， 是我父親的神，我要尊崇他。"},
        {"ko":"출애굽기 20:12","zh":"出埃及記 20:12","textKo":"네 부모를 공경하라 그리하면 너의 하나님 나 여호와가 네게 준 땅에서 네 생명이 길리라","textZh":"「當孝敬父母，使你的日子在耶和華－你神所賜你的地上得以長久。"},
        {"ko":"민수기 6:24","zh":"民數記 6:24","textKo":"여호와는 네게 복을 주시고 너를 지키시기를 원하며","textZh":"『願耶和華賜福給你，保護你。"},
        {"ko":"민수기 6:25","zh":"民數記 6:25","textKo":"여호와는 그 얼굴로 네게 비취사 은혜 베푸시기를 원하며","textZh":"願耶和華使他的臉光照你，賜恩給你。"},
        {"ko":"신명기 6:5","zh":"申命記 6:5","textKo":"너는 마음을 다하고 성품을 다하고 힘을 다하여 네 하나님 여호와를 사랑하라","textZh":"你要盡心、盡性、盡力愛耶和華－你的神。"},
        {"ko":"신명기 31:6","zh":"申命記 31:6","textKo":"너는 마음을 강하게 하고 담대히 하라 그들을 두려워 말라 그들 앞에서 떨지 말라 이는 네 하나님 여호와 그가 너와 함께 행하실 것임이라 반드시 너를 떠나지 아니하시며 버리지 아니하시리라 하고","textZh":"你們當剛強壯膽，不要害怕，也不要畏懼他們，因為耶和華－你的神和你同去。他必不撇下你，也不丟棄你。」"},
        {"ko":"여호수아 1:9","zh":"約書亞記 1:9","textKo":"내가 네게 명한 것이 아니냐 마음을 강하게 하고 담대히 하라 두려워 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라 하시니라","textZh":"我豈沒有吩咐你嗎？你當剛強壯膽！不要懼怕，也不要驚惶；因為你無論往哪裏去，耶和華－你的神必與你同在。」"},
        {"ko":"룻기 1:16","zh":"路得記 1:16","textKo":"룻이 가로되 나로 어머니를 떠나며 어머니를 따르지 말고 돌아가라 강권하지 마옵소서 어머니께서 가시는 곳에 나도 가고 어머니께서 유숙하시는 곳에서 나도 유숙하겠나이다 어머니의 백성이 나의 백성이 되고 어머니의 하나님이 나의 하나님이 되시리니","textZh":"路得說：「不要催我回去不跟隨你。你往哪裏去，我也往那裏去；你在哪裏住宿，我也在那裏住宿；你的國就是我的國，你的神就是我的神。"},
        {"ko":"사무엘상 16:7","zh":"撒母耳記上 16:7","textKo":"여호와께서 사무엘에게 이르시되 그 용모와 신장을 보지 말라 내가 이미 그를 버렸노라 나의 보는 것은 사람과 같지 아니하니 사람은 외모를 보거니와 나 여호와는 중심을 보느니라","textZh":"耶和華卻對撒母耳說：「不要看他的外貌和他身材高大，我不揀選他。因為，耶和華不像人看人：人是看外貌；耶和華是看內心。」"},
        {"ko":"사무엘하 22:31","zh":"撒母耳記下 22:31","textKo":"하나님의 도는 완전하고 여호와의 말씀은 정미하니 저는 자기에게 피하는 모든 자에게 방패시로다","textZh":"至於神，他的道是完全的； 耶和華的話是煉淨的。 凡投靠他的，他便作他們的盾牌。"},
        {"ko":"열왕기상 8:61","zh":"列王紀上 8:61","textKo":"그런즉 너희 마음을 우리 하나님 여호와와 화합하여 완전케 하여 오늘날과 같이 그 법도를 행하며 그 계명을 지킬지어다","textZh":"所以你們當向耶和華－我們的神存誠實的心，遵行他的律例，謹守他的誡命，至終如今日一樣。」"},
        {"ko":"역대하 7:14","zh":"歷代志下 7:14","textKo":"내 이름으로 일컫는 내 백성이 그 악한 길에서 떠나 스스로 겸비하고 기도하여 내 얼굴을 구하면 내가 하늘에서 듣고 그 죄를 사하고 그 땅을 고칠지라","textZh":"這稱為我名下的子民，若是自卑、禱告，尋求我的面，轉離他們的惡行，我必從天上垂聽，赦免他們的罪，醫治他們的地。"},
        {"ko":"느헤미야 8:10","zh":"尼希米記 8:10","textKo":"느헤미야가 또 이르기를 너희는 가서 살찐 것을 먹고 단 것을 마시되 예비치 못한 자에게는 너희가 나누어 주라 이 날은 우리 주의 성일이니 근심하지 말라 여호와를 기뻐하는 것이 너희의 힘이니라 하고","textZh":"又對他們說：「你們去吃肥美的，喝甘甜的，有不能預備的就分給他，因為今日是我們主的聖日。你們不要憂愁，因靠耶和華而得的喜樂是你們的力量。」"},
        {"ko":"욥기 1:21","zh":"約伯記 1:21","textKo":"가로되 내가 모태에서 적신이 나왔사온즉 또한 적신이 그리로 돌아가올지라 주신 자도 여호와시요 취하신 자도 여호와시오니 여호와의 이름이 찬송을 받으실지니이다 하고","textZh":"說：「我赤身出於母胎，也必赤身歸回；賞賜的是耶和華，收取的也是耶和華。耶和華的名是應當稱頌的。」"},
        {"ko":"욥기 19:25","zh":"約伯記 19:25","textKo":"내가 알기에는 나의 구속자가 살아 계시니 후일에 그가 땅 위에 서실 것이라","textZh":"我知道我的救贖主活著， 末了必站立在地上。"},
        {"ko":"시편 1:2","zh":"詩篇 1:2","textKo":"오직 여호와의 율법을 즐거워하여 그 율법을 주야로 묵상하는 자로다","textZh":"惟喜愛耶和華的律法， 晝夜思想， 這人便為有福！"},
        {"ko":"시편 16:8","zh":"詩篇 16:8","textKo":"내가 여호와를 항상 내 앞에 모심이여 그가 내 우편에 계시므로 내가 요동치 아니하리로다","textZh":"我將耶和華常擺在我面前， 因他在我右邊，我便不致搖動。"},
        {"ko":"시편 19:14","zh":"詩篇 19:14","textKo":"나의 반석이시요 나의 구속자이신 여호와여 내 입의 말과 마음의 묵상이 주의 앞에 열납되기를 원하나이다","textZh":"耶和華－我的磐石，我的救贖主啊， 願我口中的言語、心裏的意念在你面前蒙悅納。"},
        {"ko":"시편 23:1","zh":"詩篇 23:1","textKo":"[다윗의 시] 여호와는 나의 목자시니 내가 부족함이 없으리로다","textZh":"耶和華是我的牧者， 我必不致缺乏。"},
        {"ko":"시편 27:1","zh":"詩篇 27:1","textKo":"[다윗의 시] 여호와는 나의 빛이요 나의 구원이시니 내가 누구를 두려워하리요 여호와는 내 생명의 능력이시니 내가 누구를 무서워하리요","textZh":"耶和華是我的亮光，是我的拯救， 我還怕誰呢？ 耶和華是我性命的保障， 我還懼誰呢？"},
        {"ko":"시편 34:8","zh":"詩篇 34:8","textKo":"너희는 여호와의 선하심을 맛보아 알지어다 그에게 피하는 자는 복이 있도다","textZh":"你們要嘗嘗主恩的滋味，便知道他是美善； 投靠他的人有福了！"},
        {"ko":"시편 37:5","zh":"詩篇 37:5","textKo":"너의 길을 여호와께 맡기라 저를 의지하면 저가 이루시고","textZh":"當將你的事交託耶和華， 並倚靠他，他就必成全。"},
        {"ko":"시편 46:1","zh":"詩篇 46:1","textKo":"[고라 자손의 시, 영장으로 알라못에 맞춘 노래] 하나님은 우리의 피난처시요 힘이시니 환난 중에 만날 큰 도움이시라","textZh":"神是我們的避難所，是我們的力量， 是我們在患難中隨時的幫助。"},
        {"ko":"시편 51:10","zh":"詩篇 51:10","textKo":"하나님이여 내 속에 정한 마음을 창조하시고 내 안에 정직한 영을 새롭게 하소서","textZh":"神啊，求你為我造清潔的心， 使我裏面重新有正直的靈。"},
        {"ko":"시편 55:22","zh":"詩篇 55:22","textKo":"네 짐을 여호와께 맡겨 버리라 너를 붙드시고 의인의 요동함을 영영히 허락지 아니하시리로다","textZh":"你要把你的重擔卸給耶和華， 他必撫養你； 他永不叫義人動搖。"},
        {"ko":"시편 73:26","zh":"詩篇 73:26","textKo":"내 육체와 마음은 쇠잔하나 하나님은 내 마음의 반석이시요 영원한 분깃이시라","textZh":"我的肉體和我的心腸衰殘； 但神是我心裏的力量， 又是我的福分，直到永遠。"},
        {"ko":"시편 91:1","zh":"詩篇 91:1","textKo":"지존자의 은밀한 곳에 거하는 자는 전능하신 자의 그늘 아래 거하리로다","textZh":"住在至高者隱密處的， 必住在全能者的蔭下。"},
        {"ko":"시편 100:5","zh":"詩篇 100:5","textKo":"대저 여호와는 선하시니 그 인자하심이 영원하고 그 성실하심이 대대로 미치리로다","textZh":"因為耶和華本為善。 他的慈愛存到永遠； 他的信實直到萬代。"},
        {"ko":"시편 103:2","zh":"詩篇 103:2","textKo":"내 영혼아 여호와를 송축하며 그 모든 은택을 잊지 말지어다","textZh":"我的心哪，你要稱頌耶和華！ 不可忘記他的一切恩惠！"},
        {"ko":"시편 119:105","zh":"詩篇 119:105","textKo":"주의 말씀은 내 발에 등이요 내 길에 빛이니이다","textZh":"你的話是我腳前的燈， 是我路上的光。"},
        {"ko":"시편 121:1","zh":"詩篇 121:1","textKo":"[성전에 올라가는 노래] 내가 산을 향하여 눈을 들리라 나의 도움이 어디서 올꼬","textZh":"我要向山舉目； 我的幫助從何而來？"},
        {"ko":"시편 127:1","zh":"詩篇 127:1","textKo":"[솔로몬의 시 곧 성전에 올라가는 노래] 여호와께서 집을 세우지 아니하시면 세우는 자의 수고가 헛되며 여호와께서 성을 지키지 아니하시면 파수꾼의 경성함이 허사로다","textZh":"若不是耶和華建造房屋， 建造的人就枉然勞力； 若不是耶和華看守城池， 看守的人就枉然警醒。"},
        {"ko":"시편 139:14","zh":"詩篇 139:14","textKo":"내가 주께 감사하옴은 나를 지으심이 신묘막측하심이라 주의 행사가 기이함을 내 영혼이 잘 아나이다","textZh":"我要稱謝你，因我受造，奇妙可畏； 你的作為奇妙，這是我心深知道的。"},
        {"ko":"잠언 3:5","zh":"箴言 3:5","textKo":"너는 마음을 다하여 여호와를 의뢰하고 네 명철을 의지하지 말라","textZh":"你要專心仰賴耶和華， 不可倚靠自己的聰明，"},
        {"ko":"잠언 4:23","zh":"箴言 4:23","textKo":"무릇 지킬만한 것보다 더욱 네 마음을 지키라 생명의 근원이 이에서 남이니라","textZh":"你要保守你心，勝過保守一切， 因為一生的果效是由心發出。"},
        {"ko":"잠언 9:10","zh":"箴言 9:10","textKo":"여호와를 경외하는 것이 지혜의 근본이요 거룩하신 자를 아는 것이 명철이니라","textZh":"敬畏耶和華是智慧的開端； 認識至聖者便是聰明。"},
        {"ko":"잠언 16:9","zh":"箴言 16:9","textKo":"사람이 마음으로 자기의 길을 계획할지라도 그 걸음을 인도하는 자는 여호와시니라","textZh":"人心籌算自己的道路； 惟耶和華指引他的腳步。"},
        {"ko":"잠언 17:17","zh":"箴言 17:17","textKo":"친구는 사랑이 끊이지 아니하고 형제는 위급한 때까지 위하여 났느니라","textZh":"朋友乃時常親愛， 弟兄為患難而生。"},
        {"ko":"잠언 18:10","zh":"箴言 18:10","textKo":"여호와의 이름은 견고한 망대라 의인은 그리로 달려가서 안전함을 얻느니라","textZh":"耶和華的名是堅固臺； 義人奔入便得安穩。"},
        {"ko":"전도서 3:11","zh":"傳道書 3:11","textKo":"하나님이 모든 것을 지으시되 때를 따라 아름답게 하셨고 또 사람에게 영원을 사모하는 마음을 주셨느니라 그러나 하나님의 하시는 일의 시종을 사람으로 측량할 수 없게 하셨도다","textZh":"神造萬物，各按其時成為美好，又將永生安置在世人心裏。然而神從始至終的作為，人不能參透。"},
        {"ko":"이사야 9:6","zh":"以賽亞書 9:6","textKo":"이는 한 아기가 우리에게 났고 한 아들을 우리에게 주신바 되었는데 그 어깨에는 정사를 메었고 그 이름은 기묘자라, 모사라, 전능하신 하나님이라, 영존하시는 아버지라, 평강의 왕이라 할 것임이라","textZh":"因有一嬰孩為我們而生； 有一子賜給我們。 政權必擔在他的肩頭上； 他名稱為「奇妙策士、全能的神、永在的父、和平的君」。"},
        {"ko":"이사야 26:3","zh":"以賽亞書 26:3","textKo":"주께서 심지가 견고한 자를 평강에 평강으로 지키시리니 이는 그가 주를 의뢰함이니이다","textZh":"堅心倚賴你的， 你必保守他十分平安， 因為他倚靠你。"},
        {"ko":"이사야 40:31","zh":"以賽亞書 40:31","textKo":"오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리의 날개치며 올라감 같을 것이요 달음박질하여도 곤비치 아니하겠고 걸어가도 피곤치 아니하리로다","textZh":"但那等候耶和華的必重新得力。 他們必如鷹展翅上騰； 他們奔跑卻不困倦， 行走卻不疲乏。"},
        {"ko":"이사야 41:10","zh":"以賽亞書 41:10","textKo":"두려워 말라 내가 너와 함께 함이니라 놀라지 말라 나는 네 하나님이 됨이니라 내가 너를 굳세게 하리라 참으로 너를 도와주리라 참으로 나의 의로운 오른손으로 너를 붙들리라","textZh":"你不要害怕，因為我與你同在； 不要驚惶，因為我是你的神。 我必堅固你，我必幫助你； 我必用我公義的右手扶持你。"},
        {"ko":"이사야 43:2","zh":"以賽亞書 43:2","textKo":"네가 물 가운데로 지날 때에 내가 함께할 것이라 강을 건널 때에 물이 너를 침몰치 못할 것이며 네가 불 가운데로 행할 때에 타지도 아니할 것이요 불꽃이 너를 사르지도 못하리니","textZh":"你從水中經過，我必與你同在； 你過江河，水必不漫過你； 你從火中行過，必不被燒， 火焰也不著在你身上。"},
        {"ko":"이사야 53:5","zh":"以賽亞書 53:5","textKo":"그가 찔림은 우리의 허물을 인함이요 그가 상함은 우리의 죄악을 인함이라 그가 징계를 받음으로 우리가 평화를 누리고 그가 채찍에 맞음으로 우리가 나음을 입었도다","textZh":"哪知他為我們的過犯受害， 為我們的罪孽壓傷。 因他受的刑罰，我們得平安； 因他受的鞭傷，我們得醫治。"},
        {"ko":"이사야 55:8","zh":"以賽亞書 55:8","textKo":"여호와의 말씀에 내 생각은 너희 생각과 다르며 내 길은 너희 길과 달라서","textZh":"耶和華說：我的意念非同你們的意念； 我的道路非同你們的道路。"},
        {"ko":"예레미야 29:11","zh":"耶利米書 29:11","textKo":"나 여호와가 말하노라 너희를 향한 나의 생각은 내가 아나니 재앙이 아니라 곧 평안이요 너희 장래에 소망을 주려하는 생각이라","textZh":"耶和華說：我知道我向你們所懷的意念是賜平安的意念，不是降災禍的意念，要叫你們末後有指望。"},
        {"ko":"예레미야 31:3","zh":"耶利米書 31:3","textKo":"나 여호와가 옛적에 이스라엘에게 나타나 이르기를 내가 무궁한 사랑으로 너를 사랑하는 고로 인자함으로 너를 인도하였다 하였노라","textZh":"古時耶和華向以色列顯現，說： 我以永遠的愛愛你， 因此我以慈愛吸引你。"},
        {"ko":"예레미야애가 3:22","zh":"耶利米哀歌 3:22","textKo":"여호와의 자비와 긍휼이 무궁하시므로 우리가 진멸되지 아니함이니이다","textZh":"我們不致消滅， 是出於耶和華諸般的慈愛； 是因他的憐憫不致斷絕。"},
        {"ko":"에스겔 36:26","zh":"以西結書 36:26","textKo":"또 새 영을 너희 속에 두고 새 마음을 너희에게 주되 너희 육신에서 굳은 마음을 제하고 부드러운 마음을 줄 것이며","textZh":"我也要賜給你們一個新心，將新靈放在你們裏面，又從你們的肉體中除掉石心，賜給你們肉心。"},
        {"ko":"다니엘 6:10","zh":"但以理書 6:10","textKo":"다니엘이 이 조서에 어인이 찍힌 것을 알고도 자기 집에 돌아가서는 그 방의 예루살렘으로 향하여 열린 창에서 전에 행하던 대로 하루 세 번씩 무릎을 꿇고 기도하며 그 하나님께 감사하였더라","textZh":"但以理知道這禁令蓋了玉璽，就到自己家裏（他樓上的窗戶開向耶路撒冷），一日三次，雙膝跪在他神面前，禱告感謝，與素常一樣。"},
        {"ko":"호세아 6:3","zh":"何西阿書 6:3","textKo":"그러므로 우리가 여호와를 알자 힘써 여호와를 알자 그의 나오심은 새벽 빛 같이 일정하니 비와 같이, 땅을 적시는 늦은 비와 같이 우리에게 임하시리라 하리라","textZh":"我們務要認識耶和華， 竭力追求認識他。 他出現確如晨光； 他必臨到我們像甘雨， 像滋潤田地的春雨。"},
        {"ko":"요엘 2:13","zh":"約珥書 2:13","textKo":"너희는 옷을 찢지 말고 마음을 찢고 너희 하나님 여호와께로 돌아올지어다 그는 은혜로우시며 자비로우시며 노하기를 더디하시며 인애가 크시사 뜻을 돌이켜 재앙을 내리지 아니하시나니","textZh":"你們要撕裂心腸， 不撕裂衣服。 歸向耶和華－你們的神； 因為他有恩典，有憐憫， 不輕易發怒， 有豐盛的慈愛， 並且後悔不降所說的災。"},
        {"ko":"미가 6:8","zh":"彌迦書 6:8","textKo":"사람아 주께서 선한 것이 무엇임을 네게 보이셨나니 여호와께서 네게 구하시는 것이 오직 공의를 행하며 인자를 사랑하며 겸손히 네 하나님과 함께 행하는 것이 아니냐","textZh":"世人哪，耶和華已指示你何為善。 他向你所要的是甚麼呢？ 只要你行公義，好憐憫， 存謙卑的心，與你的神同行。"},
        {"ko":"나훔 1:7","zh":"那鴻書 1:7","textKo":"여호와는 선하시며 환난 날에 산성이시라 그는 자기에게 의뢰하는 자들을 아시느니라","textZh":"耶和華本為善， 在患難的日子為人的保障， 並且認得那些投靠他的人。"},
        {"ko":"하박국 3:17","zh":"哈巴谷書 3:17","textKo":"비록 무화과나무가 무성치 못하며 포도나무에 열매가 없으며 감람나무에 소출이 없으며 밭에 식물이 없으며 우리에 양이 없으며 외양간에 소가 없을지라도","textZh":"雖然無花果樹不發旺， 葡萄樹不結果， 橄欖樹也不效力， 田地不出糧食， 圈中絕了羊， 棚內也沒有牛；"},
        {"ko":"스바냐 3:17","zh":"西番雅書 3:17","textKo":"너의 하나님 여호와가 너의 가운데 계시니 그는 구원을 베푸실 전능자시라 그가 너로 인하여 기쁨을 이기지 못하여 하시며 너를 잠잠히 사랑하시며 너로 인하여 즐거이 부르며 기뻐하시리라 하리라","textZh":"耶和華－你的神是施行拯救、 大有能力的主。 他在你中間必因你歡欣喜樂， 默然愛你，且因你喜樂而歡呼。"},
        {"ko":"스가랴 4:6","zh":"撒迦利亞書 4:6","textKo":"그가 내게 일러 가로되 여호와께서 스룹바벨에게 하신 말씀이 이러하니라 만군의 여호와께서 말씀하시되 이는 힘으로 되지 아니하며 능으로 되지 아니하고 오직 나의 신으로 되느니라","textZh":"他對我說：「這是耶和華指示所羅巴伯的。萬軍之耶和華說：不是倚靠勢力，不是倚靠才能，乃是倚靠我的靈方能成事。"},
        {"ko":"말라기 3:10","zh":"瑪拉基書 3:10","textKo":"만군의 여호와가 이르노라 너희의 온전한 십일조를 창고에 들여 나의 집에 양식이 있게 하고 그것으로 나를 시험하여 내가 하늘 문을 열고 너희에게 복을 쌓을 곳이 없도록 붓지 아니하나 보라","textZh":"萬軍之耶和華說：你們要將當納的十分之一全然送入倉庫，使我家有糧，以此試試我，是否為你們敞開天上的窗戶，傾福與你們，甚至無處可容。"},
        {"ko":"마태복음 5:16","zh":"馬太福音 5:16","textKo":"이같이 너희 빛을 사람 앞에 비취게 하여 저희로 너희 착한 행실을 보고 하늘에 계신 너희 아버지께 영광을 돌리게 하라","textZh":"你們的光也當這樣照在人前，叫他們看見你們的好行為，便將榮耀歸給你們在天上的父。」"},
        {"ko":"마태복음 6:33","zh":"馬太福音 6:33","textKo":"너희는 먼저 그의 나라와 그의 의를 구하라 그리하면 이 모든 것을 너희에게 더하시리라","textZh":"你們要先求他的國和他的義，這些東西都要加給你們了。"},
        {"ko":"마태복음 7:7","zh":"馬太福音 7:7","textKo":"¹구하라 그러면 ²너희에게 주실 것이요 찾으라 그러면 찾을 것이요 문을 두드리라 그러면 너희에게 열릴 것이니","textZh":"「你們祈求，就給你們；尋找，就尋見；叩門，就給你們開門。"},
        {"ko":"마태복음 11:28","zh":"馬太福音 11:28","textKo":"수고하고 무거운 짐진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라","textZh":"凡勞苦擔重擔的人可以到我這裏來，我就使你們得安息。"},
        {"ko":"마태복음 22:37","zh":"馬太福音 22:37","textKo":"예수께서 가라사대 네 마음을 다하고 목숨을 다하고 뜻을 다하여 주 너의 하나님을 사랑하라 하셨으니","textZh":"耶穌對他說：「你要盡心、盡性、盡意愛主－你的神。"},
        {"ko":"마태복음 28:19","zh":"馬太福音 28:19","textKo":"그러므로 너희는 가서 모든 족속으로 제자를 삼아 아버지와 아들과 성령의 이름으로 세례를 주고","textZh":"所以，你們要去，使萬民作我的門徒，奉父、子、聖靈的名給他們施洗 。"},
        {"ko":"마가복음 10:45","zh":"馬可福音 10:45","textKo":"인자의 온 것은 섬김을 받으려 함이 아니라 도리어 섬기려 하고 자기 목숨을 많은 사람의 대속물로 주려 함이니라","textZh":"因為人子來，並不是要受人的服事，乃是要服事人，並且要捨命作多人的贖價。」"},
        {"ko":"누가복음 1:37","zh":"路加福音 1:37","textKo":"대저 하나님의 모든 말씀은 능치 못하심이 없느니라","textZh":"因為，出於神的話，沒有一句不帶能力的。」"},
        {"ko":"누가복음 6:31","zh":"路加福音 6:31","textKo":"남에게 대접을 받고자 하는 대로 너희도 남을 대접하라","textZh":"你們願意人怎樣待你們，你們也要怎樣待人。"},
        {"ko":"누가복음 9:23","zh":"路加福音 9:23","textKo":"또 무리에게 이르시되 아무든지 나를 따라 오려거든 자기를 부인하고 날마다 제 십자가를 지고 나를 좇을 것이니라","textZh":"耶穌又對眾人說：「若有人要跟從我，就當捨己，天天背起他的十字架來跟從我。"},
        {"ko":"누가복음 15:10","zh":"路加福音 15:10","textKo":"내가 너희에게 이르노니 이와 같이 죄인 하나가 회개하면 하나님의 사자들 앞에 기쁨이 되느니라","textZh":"我告訴你們，一個罪人悔改，在神的使者面前也是這樣為他歡喜。」"},
        {"ko":"요한복음 1:14","zh":"約翰福音 1:14","textKo":"말씀이 육신이 되어 우리 가운데 거하시매 우리가 그 영광을 보니 아버지의 독생자의 영광이요 은혜와 진리가 충만하더라","textZh":"道成了肉身，住在我們中間，充充滿滿地有恩典有真理。我們也見過他的榮光，正是父獨生子的榮光。"},
        {"ko":"요한복음 3:16","zh":"約翰福音 3:16","textKo":"하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 저를 믿는 자마다 멸망치 않고 영생을 얻게 하려 하심이니라","textZh":"「神愛世人，甚至將他的獨生子賜給他們，叫一切信他的，不致滅亡，反得永生。"},
        {"ko":"요한복음 8:12","zh":"約翰福音 8:12","textKo":"예수께서 또 일러 가라사대 나는 세상의 빛이니 나를 따르는 자는 어두움에 다니지 아니하고 생명의 빛을 얻으리라","textZh":"耶穌又對眾人說：「我是世界的光。跟從我的，就不在黑暗裏走，必要得著生命的光。」"},
        {"ko":"요한복음 14:6","zh":"約翰福音 14:6","textKo":"예수께서 가라사대 내가 곧 길이요 진리요 생명이니 나로 말미암지 않고는 아버지께로 올 자가 없느니라","textZh":"耶穌說：「我就是道路、真理、生命；若不藉著我，沒有人能到父那裏去。"},
        {"ko":"요한복음 15:5","zh":"約翰福音 15:5","textKo":"나는 포도나무요 너희는 가지니 저가 내 안에, 내가 저 안에 있으면 이 사람은 과실을 많이 맺나니 나를 떠나서는 너희가 아무 것도 할 수 없음이라","textZh":"我是葡萄樹，你們是枝子。常在我裏面的，我也常在他裏面，這人就多結果子；因為離了我，你們就不能做甚麼。"},
        {"ko":"요한복음 16:33","zh":"約翰福音 16:33","textKo":"이것을 너희에게 이름은 너희로 내 안에서 평안을 누리게 하려 함이라 세상에서는 너희가 환난을 당하나 담대하라 내가 세상을 이기었노라 하시니라","textZh":"我將這些事告訴你們，是要叫你們在我裏面有平安。在世上，你們有苦難；但你們可以放心，我已經勝了世界。」"},
        {"ko":"사도행전 1:8","zh":"使徒行傳 1:8","textKo":"오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와 사마리아와 땅 끝까지 이르러 내 증인이 되리라 하시니라","textZh":"但聖靈降臨在你們身上，你們就必得著能力，並要在耶路撒冷、猶太全地，和撒馬利亞，直到地極，作我的見證。」"},
        {"ko":"로마서 5:8","zh":"羅馬書 5:8","textKo":"우리가 아직 죄인 되었을 때에 그리스도께서 우리를 위하여 죽으심으로 하나님께서 우리에게 대한 자기의 사랑을 확증하셨느니라","textZh":"惟有基督在我們還作罪人的時候為我們死，神的愛就在此向我們顯明了。"},
        {"ko":"로마서 8:28","zh":"羅馬書 8:28","textKo":"우리가 알거니와 하나님을 사랑하는 자 곧 그 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라","textZh":"我們曉得萬事都互相效力，叫愛神的人得益處，就是按他旨意被召的人。"},
        {"ko":"로마서 12:2","zh":"羅馬書 12:2","textKo":"너희는 이 세대를 본받지 말고 오직 마음을 새롭게 함으로 변화를 받아 하나님의 선하시고 기뻐하시고 온전하신 뜻이 무엇인지 분별하도록 하라","textZh":"不要效法這個世界，只要心意更新而變化，叫你們察驗何為神的善良、純全、可喜悅的旨意。"},
        {"ko":"고린도전서 10:13","zh":"哥林多前書 10:13","textKo":"사람이 감당할 시험 밖에는 너희에게 당한 것이 없나니 오직 하나님은 미쁘사 너희가 감당치 못할 시험 당함을 허락지 아니하시고 시험 당할 즈음에 또한 피할 길을 내사 너희로 능히 감당하게 하시느니라","textZh":"你們所遇見的試探，無非是人所能受的。神是信實的，必不叫你們受試探過於所能受的；在受試探的時候，總要給你們開一條出路，叫你們能忍受得住。"},
        {"ko":"고린도전서 13:13","zh":"哥林多前書 13:13","textKo":"그런즉 믿음, 소망, 사랑, 이 세가지는 항상 있을 것인데 그 중에 제일은 사랑이라","textZh":"如今常存的有信，有望，有愛這三樣，其中最大的是愛。"},
        {"ko":"고린도후서 5:17","zh":"哥林多後書 5:17","textKo":"그런즉 누구든지 그리스도 안에 있으면 새로운 피조물이라 이전 것은 지나갔으니 보라 새 것이 되었도다","textZh":"若有人在基督裏，他就是新造的人，舊事已過，都變成新的了。"},
        {"ko":"갈라디아서 2:20","zh":"加拉太書 2:20","textKo":"내가 그리스도와 함께 십자가에 못 박혔나니 그런즉 이제는 내가 산 것이 아니요 오직 내 안에 그리스도께서 사신 것이라 이제 내가 육체 가운데 사는 것은 나를 사랑하사 나를 위하여 자기 몸을 버리신 하나님의 아들을 믿는 믿음 안에서 사는 것이라","textZh":"我已經與基督同釘十字架，現在活著的不再是我，乃是基督在我裏面活著；並且我如今在肉身活著，是因信神的兒子而活；他是愛我，為我捨己。"},
        {"ko":"갈라디아서 5:22","zh":"加拉太書 5:22","textKo":"오직 성령의 열매는 사랑과 희락과 화평과 오래 참음과 자비와 양선과 충성과","textZh":"聖靈所結的果子，就是仁愛、喜樂、和平、忍耐、恩慈、良善、信實、"},
        {"ko":"에베소서 2:8","zh":"以弗所書 2:8","textKo":"너희가 그 은혜를 인하여 믿음으로 말미암아 구원을 얻었나니 이것이 너희에게서 난 것이 아니요 하나님의 선물이라","textZh":"你們得救是本乎恩，也因著信；這並不是出於自己，乃是神所賜的；"},
        {"ko":"에베소서 4:32","zh":"以弗所書 4:32","textKo":"서로 인자하게 하며 불쌍히 여기며 서로 용서하기를 하나님이 그리스도 안에서 너희를 용서하심과 같이 하라","textZh":"並要以恩慈相待，存憐憫的心，彼此饒恕，正如神在基督裏饒恕了你們一樣。"},
        {"ko":"에베소서 6:10","zh":"以弗所書 6:10","textKo":"종말로 너희가 주 안에서와 그 힘의 능력으로 강건하여지고","textZh":"我還有末了的話：你們要靠著主，倚賴他的大能大力作剛強的人。"},
        {"ko":"빌립보서 4:6","zh":"腓立比書 4:6","textKo":"아무 것도 염려하지 말고 오직 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라","textZh":"應當一無掛慮，只要凡事藉著禱告、祈求，和感謝，將你們所要的告訴神。"},
        {"ko":"빌립보서 4:13","zh":"腓立比書 4:13","textKo":"내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라","textZh":"我靠著那加給我力量的，凡事都能做。"},
        {"ko":"골로새서 3:23","zh":"歌羅西書 3:23","textKo":"무슨 일을 하든지 마음을 다하여 주께 하듯 하고 사람에게 하듯 하지 말라","textZh":"無論做甚麼，都要從心裏做，像是給主做的，不是給人做的，"},
        {"ko":"데살로니가전서 5:16","zh":"帖撒羅尼迦前書 5:16","textKo":"¹항상 기뻐하라","textZh":"要常常喜樂，"},
        {"ko":"디모데후서 1:7","zh":"提摩太後書 1:7","textKo":"하나님이 우리에게 주신 것은 두려워하는 마음이 아니요 오직 능력과 사랑과 근신하는 마음이니","textZh":"因為神賜給我們，不是膽怯的心，乃是剛強、仁愛、謹守的心。"},
        {"ko":"히브리서 4:12","zh":"希伯來書 4:12","textKo":"하나님의 말씀은 살았고 운동력이 있어 좌우에 날선 어떤 검보다도 예리하여 혼과 영과 및 관절과 골수를 찔러 쪼개기까지 하며 또 마음의 생각과 뜻을 감찰하나니","textZh":"神的道是活潑的，是有功效的，比一切兩刃的劍更快，甚至魂與靈，骨節與骨髓，都能刺入、剖開，連心中的思念和主意都能辨明。"},
        {"ko":"히브리서 11:1","zh":"希伯來書 11:1","textKo":"믿음은 바라는 것들의 실상이요 보지 못하는 것들의 증거니","textZh":"信就是所望之事的實底，是未見之事的確據。"},
        {"ko":"야고보서 1:5","zh":"雅各書 1:5","textKo":"너희 중에 누구든지 지혜가 부족하거든 모든 사람에게 후히 주시고 꾸짖지 아니하시는 하나님께 구하라 그리하면 주시리라","textZh":"你們中間若有缺少智慧的，應當求那厚賜與眾人、也不斥責人的神，主就必賜給他。"},
        {"ko":"베드로전서 5:7","zh":"彼得前書 5:7","textKo":"너희 염려를 다 주께 맡겨 버리라 이는 저가 너희를 권고하심이니라","textZh":"你們要將一切的憂慮卸給神，因為他顧念你們。"},
        {"ko":"요한일서 4:7","zh":"約翰一書 4:7","textKo":"사랑하는 자들아 우리가 서로 사랑하자 사랑은 하나님께 속한 것이니 사랑하는 자마다 하나님께로 나서 하나님을 알고","textZh":"親愛的弟兄啊，我們應當彼此相愛，因為愛是從神來的。凡有愛心的，都是由神而生，並且認識神。"},
        {"ko":"요한계시록 3:20","zh":"啟示錄 3:20","textKo":"볼지어다 내가 문 밖에 서서 두드리노니 누구든지 내 음성을 듣고 문을 열면 내가 그에게로 들어가 그로 더불어 먹고 그는 나로 더불어 먹으리라","textZh":"看哪，我站在門外叩門，若有聽見我聲音就開門的，我要進到他那裏去，我與他，他與我一同坐席。"},
        {"ko":"요한계시록 21:4","zh":"啟示錄 21:4","textKo":"모든 눈물을 그 눈에서 씻기시매 다시 사망이 없고 애통하는 것이나 곡하는 것이나 아픈 것이 다시 있지 아니하리니 처음 것들이 다 지나갔음이러라","textZh":"神要擦去他們一切的眼淚；不再有死亡，也不再有悲哀、哭號、疼痛，因為以前的事都過去了。」"}
    ];
    const todayString = String(todaySeed);
    const todayDateKey = `${todayString.slice(0, 4)}-${todayString.slice(4, 6)}-${todayString.slice(6, 8)}`;
    const daysFromEpoch = getDayNumberFromDateString(todayDateKey) - getDayNumberFromDateString(DAILY_VERSE_ROTATION_EPOCH);
    const rotationStep = getDailyVerseRotationStep(versePool.length);
    const idx = ((daysFromEpoch * rotationStep + DAILY_VERSE_ROTATION_OFFSET) % versePool.length + versePool.length) % versePool.length;
    const v = versePool[idx];
    const result = {
        seed: todaySeed,
        version: VERSE_CACHE_VERSION,
        reference: { ko: v.ko, zh: v.zh },
        text: { ko: v.textKo, zh: v.textZh }
    };
    localStorage.setItem(DAILY_VERSE_KEY, JSON.stringify(result));
    return result;
}
function getBookMetaForDailyVerse(bookId) {
    const allBooks = [
        ...(typeof bibleBooks !== 'undefined' ? bibleBooks.oldTestament : []),
        ...(typeof bibleBooks !== 'undefined' ? bibleBooks.newTestament : [])
    ];
    return allBooks.find(book => book.id === bookId) || { id: bookId, ko: bookId, zh: bookId };
}
function selectDailyVerseFromPool(versePool, todaySeed, source) {
    if (!Array.isArray(versePool) || versePool.length === 0) return null;
    const todayString = String(todaySeed);
    const todayDateKey = `${todayString.slice(0, 4)}-${todayString.slice(4, 6)}-${todayString.slice(6, 8)}`;
    const daysFromEpoch = getDayNumberFromDateString(todayDateKey) - getDayNumberFromDateString(DAILY_VERSE_ROTATION_EPOCH);
    const rotationStep = getDailyVerseRotationStep(versePool.length);
    const idx = ((daysFromEpoch * rotationStep + DAILY_VERSE_ROTATION_OFFSET) % versePool.length + versePool.length) % versePool.length;
    const v = versePool[idx];
    let refKo = v.ko;
    let refZh = v.zh;
    let textKo = v.textKo;
    let textZh = v.textZh;
    if (v.bookId) {
        const book = getBookMetaForDailyVerse(v.bookId);
        refKo = `${book.ko} ${v.chapter}:${v.verse}`;
        refZh = `${book.zh} ${v.chapter}:${v.verse}`;
        textKo = v.ko;
        textZh = v.zh;
    }
    return {
        seed: todaySeed,
        version: VERSE_CACHE_VERSION,
        source,
        reference: { ko: refKo, zh: refZh },
        text: { ko: textKo, zh: textZh }
    };
}
async function getDailyVerseFromIndex() {
    const todaySeed = getDailySeed();
    const cached = localStorage.getItem(DAILY_VERSE_KEY);
    if (cached) {
        try {
            const cacheData = JSON.parse(cached);
            if (cacheData.seed === todaySeed && cacheData.version === VERSE_CACHE_VERSION && cacheData.source === 'daily-index') {
                return cacheData;
            }
        } catch(e) {}
    }
    if (!dailyVerseIndexPromise) {
        dailyVerseIndexPromise = fetch(`${DAILY_VERSE_INDEX_URL}?v=${encodeURIComponent(APP_VERSION)}`)
            .then(res => {
                if (!res.ok) throw new Error('daily verse index unavailable');
                return res.json();
            })
            .catch(error => {
                dailyVerseIndexPromise = null;
                throw error;
            });
    }
    const indexData = await dailyVerseIndexPromise;
    const versePool = (indexData.items || []).map(item => {
        const book = getBookMetaForDailyVerse(item.bookId);
        return {
            ko: `${book.ko} ${item.chapter}:${item.verse}`,
            zh: `${book.zh} ${item.chapter}:${item.verse}`,
            textKo: item.ko,
            textZh: item.zh
        };
    }).filter(item => item.textKo && item.textZh);
    const result = selectDailyVerseFromPool(versePool, todaySeed, 'daily-index');
    if (!result) return getDailyVerse();
    localStorage.setItem(DAILY_VERSE_KEY, JSON.stringify(result));
    return result;
}
function getDailyVerseDefault(seed) {
    return {
        seed: seed,
        reference: { ko: '창세기 1:1', zh: '創世記 1:1' },
        text: { ko: '태초에 하나님이 천지를 창조하시니라', zh: '起初，神創造天地。' }
    };
}
// ===== 站內通知與主畫面 App 通知 =====
const NOTIFICATION_DB_NAME = 'scoynim-notifications';
const NOTIFICATION_DB_VERSION = 1;
const NOTIFICATION_STORE_NAME = 'messages';
const NOTIFICATION_FALLBACK_KEY = 'site_notification_items_v2';
const NOTIFICATION_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
const NOTIFICATION_READ_KEY = 'site_notification_read_v1';
const NOTIFICATION_DELIVERED_KEY = 'site_notification_delivered_v1';
let notificationItems = [];
let notificationTimer = null;
let notificationDbPromise = null;
function getNotificationLabels() {
    return currentLang === 'ko'
        ? {
            title: '알림', close: '닫기', empty: '새 알림이 없습니다.', daily: '오늘의 묵상',
            install: '홈 화면에 추가한 앱에서만 시스템 알림을 받을 수 있습니다.',
            enable: '앱 알림 켜기', enabled: '시스템 알림이 켜져 있습니다.',
            denied: '알림이 차단되었습니다. 기기 설정에서 권한을 변경해 주세요.',
            unavailable: '이 기기에서는 웹 알림을 지원하지 않습니다.', atSix: '매일 오전 6시',
            retention: '최근 30일 알림', markAll: '모두 읽음', read: '읽음', unread: '새 알림',
            appTitle: 'App 알림', viewAll: '모든 알림 보기'
        }
        : {
            title: '通知', close: '關閉', empty: '目前沒有新通知。', daily: '每日默想',
            install: '系統通知僅會在加入主畫面的 App 中啟用。',
            enable: '開啟 App 通知', enabled: '系統通知已開啟。',
            denied: '通知已被封鎖，請到裝置設定中變更權限。',
            unavailable: '此裝置不支援網頁通知。', atSix: '每日早上 6 點',
            retention: '保留最近 30 天', markAll: '全部標記為已讀', read: '已讀', unread: '新通知',
            appTitle: 'App 通知', viewAll: '查看全部通知'
        };
}
function isStandaloneWebApp() {
    return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}
function getLocalNotificationDateKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
function isDailyNotificationAvailable() {
    return new Date().getHours() >= 6;
}
function getLegacyReadNotificationIds() {
    try { return new Set(JSON.parse(localStorage.getItem(NOTIFICATION_READ_KEY) || '[]')); }
    catch (error) { return new Set(); }
}
function readNotificationFallback() {
    try {
        const records = JSON.parse(localStorage.getItem(NOTIFICATION_FALLBACK_KEY) || '[]');
        return Array.isArray(records) ? records : [];
    } catch (error) {
        return [];
    }
}
function writeNotificationFallback(records) {
    try { localStorage.setItem(NOTIFICATION_FALLBACK_KEY, JSON.stringify(records)); } catch (error) {}
}
function openNotificationDatabase() {
    if (!('indexedDB' in window)) return Promise.reject(new Error('IndexedDB unavailable'));
    if (notificationDbPromise) return notificationDbPromise;
    notificationDbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(NOTIFICATION_DB_NAME, NOTIFICATION_DB_VERSION);
        request.onupgradeneeded = () => {
            const db = request.result;
            const store = db.objectStoreNames.contains(NOTIFICATION_STORE_NAME)
                ? request.transaction.objectStore(NOTIFICATION_STORE_NAME)
                : db.createObjectStore(NOTIFICATION_STORE_NAME, { keyPath: 'id' });
            if (!store.indexNames.contains('createdAt')) store.createIndex('createdAt', 'createdAt');
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('Unable to open notification database'));
    });
    return notificationDbPromise;
}
async function getStoredNotifications() {
    try {
        const db = await openNotificationDatabase();
        return await new Promise((resolve, reject) => {
            const request = db.transaction(NOTIFICATION_STORE_NAME, 'readonly')
                .objectStore(NOTIFICATION_STORE_NAME).getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        return readNotificationFallback();
    }
}
async function saveNotificationRecord(record) {
    const normalized = {
        ...record,
        createdAt: Number(record.createdAt) || Date.now(),
        expiresAt: Number(record.expiresAt) || ((Number(record.createdAt) || Date.now()) + NOTIFICATION_RETENTION_MS)
    };
    try {
        const db = await openNotificationDatabase();
        await new Promise((resolve, reject) => {
            const transaction = db.transaction(NOTIFICATION_STORE_NAME, 'readwrite');
            const store = transaction.objectStore(NOTIFICATION_STORE_NAME);
            const request = store.get(normalized.id);
            request.onsuccess = () => {
                const existing = request.result;
                store.put({
                    ...existing,
                    ...normalized,
                    readAt: existing?.readAt || normalized.readAt || null
                });
            };
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
            transaction.onabort = () => reject(transaction.error);
        });
    } catch (error) {
        const records = readNotificationFallback();
        const index = records.findIndex((item) => item.id === normalized.id);
        const existing = index >= 0 ? records[index] : null;
        const next = { ...existing, ...normalized, readAt: existing?.readAt || normalized.readAt || null };
        if (index >= 0) records[index] = next;
        else records.push(next);
        writeNotificationFallback(records);
    }
}
async function cleanupStoredNotifications() {
    const cutoff = Date.now() - NOTIFICATION_RETENTION_MS;
    try {
        const db = await openNotificationDatabase();
        await new Promise((resolve, reject) => {
            const transaction = db.transaction(NOTIFICATION_STORE_NAME, 'readwrite');
            const index = transaction.objectStore(NOTIFICATION_STORE_NAME).index('createdAt');
            const request = index.openCursor(IDBKeyRange.upperBound(cutoff, true));
            request.onsuccess = () => {
                const cursor = request.result;
                if (!cursor) return;
                cursor.delete();
                cursor.continue();
            };
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    } catch (error) {
        writeNotificationFallback(readNotificationFallback().filter((item) => Number(item.createdAt) >= cutoff));
    }
}
async function markNotificationRecordsRead(ids) {
    const uniqueIds = [...new Set(ids)].filter(Boolean);
    if (!uniqueIds.length) return;
    const readAt = Date.now();
    try {
        const db = await openNotificationDatabase();
        await new Promise((resolve, reject) => {
            const transaction = db.transaction(NOTIFICATION_STORE_NAME, 'readwrite');
            const store = transaction.objectStore(NOTIFICATION_STORE_NAME);
            uniqueIds.forEach((id) => {
                const request = store.get(id);
                request.onsuccess = () => {
                    if (request.result && !request.result.readAt) store.put({ ...request.result, readAt });
                };
            });
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    } catch (error) {
        const idSet = new Set(uniqueIds);
        writeNotificationFallback(readNotificationFallback().map((item) => (
            idSet.has(item.id) && !item.readAt ? { ...item, readAt } : item
        )));
    }
}
function localizeNotificationItem(item) {
    let reference = item.reference || '';
    let text = item.text || '';
    if (item.referenceKo || item.referenceZh) {
        if (bibleDisplayMode === 'ko') {
            reference = item.referenceKo || item.referenceZh || '';
            text = item.textKo || item.textZh || '';
        } else if (bibleDisplayMode === 'zh') {
            reference = item.referenceZh || item.referenceKo || '';
            text = item.textZh || item.textKo || '';
        } else {
            reference = [item.referenceKo, item.referenceZh].filter(Boolean).join(' / ');
            text = [item.textKo, item.textZh].filter(Boolean).join('\n');
        }
    }
    return {
        ...item,
        title: currentLang === 'ko' ? (item.titleKo || item.title || getNotificationLabels().daily) : (item.titleZh || item.title || getNotificationLabels().daily),
        reference,
        text,
        time: formatNotificationTime(item)
    };
}
function formatNotificationTime(item) {
    const date = new Date(Number(item.createdAt) || Date.now());
    try {
        return new Intl.DateTimeFormat(currentLang === 'ko' ? 'ko-KR' : 'zh-TW', {
            month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }).format(date);
    } catch (error) {
        return getNotificationLabels().atSix;
    }
}
async function refreshNotificationItems() {
    await cleanupStoredNotifications();
    notificationItems = (await getStoredNotifications())
        .filter((item) => Number(item.createdAt) >= Date.now() - NOTIFICATION_RETENTION_MS)
        .sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
    renderNotificationCenter();
    renderNotificationPage();
}
async function markNotificationsRead(ids = notificationItems.map((item) => item.id)) {
    await markNotificationRecordsRead(ids);
    await refreshNotificationItems();
}
async function buildDailyNotification() {
    if (!isDailyNotificationAvailable()) {
        await refreshNotificationItems();
        return;
    }
    let verse;
    try { verse = await getDailyVerseFromIndex(); }
    catch (error) { verse = getDailyVerse(); }
    const dailyVerse = verse || getDailyVerseDefault(getDailySeed());
    const dateKey = getLocalNotificationDateKey();
    const [year, month, day] = dateKey.split('-').map(Number);
    const createdAt = new Date(year, month - 1, day, 6, 0, 0, 0).getTime();
    const legacyReadIds = getLegacyReadNotificationIds();
    const record = {
        id: `daily-${dateKey}`,
        type: 'daily-verse',
        titleKo: '오늘의 묵상',
        titleZh: '每日默想',
        referenceKo: dailyVerse.reference.ko,
        referenceZh: dailyVerse.reference.zh,
        textKo: dailyVerse.text.ko,
        textZh: dailyVerse.text.zh,
        dateKey,
        createdAt,
        expiresAt: createdAt + NOTIFICATION_RETENTION_MS,
        readAt: legacyReadIds.has(`daily-${dateKey}`) ? Date.now() : null
    };
    await saveNotificationRecord(record);
    await refreshNotificationItems();
    await deliverStandaloneDailyNotification(record);
}
function updateNotificationBadge() {
    const badge = document.getElementById('navNotificationBadge');
    const menuBadge = document.getElementById('menuNotificationBadge');
    const unread = notificationItems.filter((item) => !item.readAt).length;
    [badge, menuBadge].forEach((element) => {
        if (!element) return;
        element.hidden = unread === 0;
        element.textContent = unread > 99 ? '99+' : String(unread);
    });
}
function renderNotificationPermission(status, permissionButton) {
    if (!status || !permissionButton) return;
    const labels = getNotificationLabels();
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    const standalone = isStandaloneWebApp();
    permissionButton.hidden = true;
    if (!supported) status.textContent = labels.unavailable;
    else if (!standalone) status.textContent = labels.install;
    else if (Notification.permission === 'granted') status.textContent = labels.enabled;
    else if (Notification.permission === 'denied') status.textContent = labels.denied;
    else {
        status.textContent = labels.install;
        permissionButton.hidden = false;
        permissionButton.textContent = labels.enable;
    }
}
function getNotificationItemMarkup(item, className, interactive = false) {
    const localized = localizeNotificationItem(item);
    const labels = getNotificationLabels();
    const readState = item.readAt ? 'is-read' : 'is-unread';
    const interaction = interactive
        ? ` role="button" tabindex="0" onclick="window.openNotificationItem('${escapeHtml(item.id)}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.openNotificationItem('${escapeHtml(item.id)}')}"`
        : '';
    return `
        <article class="${className} ${readState}" data-notification-id="${escapeHtml(item.id)}"${interaction}>
            <div class="notification-item-heading">
                <div class="notification-item-title">${escapeHtml(localized.title)}</div>
                <span class="notification-read-state">${item.readAt ? labels.read : labels.unread}</span>
            </div>
            <div class="notification-item-reference">${escapeHtml(localized.reference)}</div>
            <p class="notification-item-text">${escapeHtml(localized.text)}</p>
            <span class="notification-item-time">${escapeHtml(localized.time)}</span>
        </article>`;
}
function renderNotificationCenter() {
    const labels = getNotificationLabels();
    const title = document.getElementById('notificationPanelTitle');
    const close = document.querySelector('.notification-panel-close');
    const status = document.getElementById('notificationAppStatus');
    const permissionButton = document.getElementById('notificationPermissionBtn');
    const list = document.getElementById('notificationList');
    const empty = document.getElementById('notificationEmpty');
    const trigger = document.getElementById('navNotificationBtn');
    if (title) title.textContent = labels.title;
    if (close) close.setAttribute('aria-label', labels.close);
    if (trigger) {
        trigger.title = labels.title;
        trigger.setAttribute('aria-label', labels.title);
    }
    renderNotificationPermission(status, permissionButton);
    if (list && empty) {
        list.innerHTML = notificationItems.slice(0, 5).map((item) => getNotificationItemMarkup(item, 'notification-item')).join('');
        empty.hidden = notificationItems.length > 0;
        empty.textContent = labels.empty;
    }
    const viewAll = document.getElementById('notificationViewAll');
    if (viewAll) viewAll.textContent = labels.viewAll;
    updateNotificationBadge();
}
function renderNotificationPage() {
    const labels = getNotificationLabels();
    const title = document.getElementById('notificationsPageTitle');
    const retention = document.getElementById('notificationsPageRetention');
    const markAll = document.getElementById('notificationsMarkAll');
    const permissionTitle = document.getElementById('notificationsPermissionTitle');
    const list = document.getElementById('notificationPageList');
    const empty = document.getElementById('notificationPageEmpty');
    if (title) title.textContent = labels.title;
    if (retention) retention.textContent = labels.retention;
    if (markAll) {
        markAll.textContent = labels.markAll;
        markAll.disabled = !notificationItems.some((item) => !item.readAt);
    }
    if (permissionTitle) permissionTitle.textContent = labels.appTitle;
    renderNotificationPermission(
        document.getElementById('notificationPageAppStatus'),
        document.getElementById('notificationPagePermissionBtn')
    );
    if (list && empty) {
        list.innerHTML = notificationItems.map((item) => getNotificationItemMarkup(item, 'notifications-page-item', true)).join('');
        empty.hidden = notificationItems.length > 0;
        empty.textContent = labels.empty;
    }
}
async function deliverStandaloneDailyNotification(item) {
    if (!item || !isStandaloneWebApp() || !('Notification' in window) || Notification.permission !== 'granted') return;
    let delivered = [];
    try { delivered = JSON.parse(localStorage.getItem(NOTIFICATION_DELIVERED_KEY) || '[]'); } catch (error) {}
    if (delivered.includes(item.id)) return;
    try {
        const localized = localizeNotificationItem(item);
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(localized.title, {
            body: `${localized.reference}\n${localized.text}`,
            icon: '/android-chrome-192x192.png',
            badge: '/favicon-32x32-2.png',
            tag: item.id,
            data: { url: '/notifications' }
        });
        delivered.push(item.id);
        localStorage.setItem(NOTIFICATION_DELIVERED_KEY, JSON.stringify(delivered.slice(-180)));
    } catch (error) {}
}
window.requestAppNotificationPermission = async () => {
    if (!isStandaloneWebApp() || !('Notification' in window)) return;
    try {
        const permission = await Notification.requestPermission();
        renderNotificationCenter();
        renderNotificationPage();
        if (permission === 'granted') await deliverStandaloneDailyNotification(notificationItems[0]);
    } catch (error) {
        renderNotificationCenter();
        renderNotificationPage();
    }
};
window.openNotificationItem = async (id) => {
    await markNotificationsRead([id]);
};
window.markAllNotificationsRead = async () => {
    await markNotificationsRead();
};
window.openNotificationsPage = () => {
    window.closeNotificationPanel();
    window.switchPage('notifications');
};
window.toggleNotificationPanel = () => {
    const panel = document.getElementById('notificationPanel');
    const trigger = document.getElementById('navNotificationBtn');
    const overlay = document.getElementById('notificationPanelOverlay');
    if (!panel || !trigger) return;
    const shouldOpen = !panel.classList.contains('show');
    overlay?.classList.toggle('show', shouldOpen);
    setNavPanelState(panel, trigger, 'notification', shouldOpen);
    if (shouldOpen) {
        renderNotificationCenter();
        requestAnimationFrame(() => { void markNotificationsRead(); });
    }
};
window.closeNotificationPanel = () => {
    const panel = document.getElementById('notificationPanel');
    const trigger = document.getElementById('navNotificationBtn');
    document.getElementById('notificationPanelOverlay')?.classList.remove('show');
    if (panel && trigger) setNavPanelState(panel, trigger, 'notification', false);
};
async function initNotificationCenter() {
    if ('serviceWorker' in navigator) {
        try { await navigator.serviceWorker.register('/sw.js', { scope: '/' }); } catch (error) {}
    }
    await refreshNotificationItems();
    await buildDailyNotification();
    clearInterval(notificationTimer);
    notificationTimer = window.setInterval(buildDailyNotification, 60 * 1000);
}
// 首頁（不再需要滾動監聽器）
let homeScrollHandler = null;
let homeScrollContainer = null;
let homeRevealRunId = 0;
function initDailyVerse() {
    const slide1 = document.getElementById('dailyVerseSection');
    const labelEl = document.getElementById('dailyVerseLabel');
    const refEl = document.getElementById('dailyVerseReference');
    const textEl = document.getElementById('dailyVerseText');
    const themeColorMeta = document.getElementById('themeColorMeta');
    if (!slide1) return;
    document.body.classList.add('home-active');
    document.documentElement.style.backgroundColor = '#f5f0e8';
    if (themeColorMeta) themeColorMeta.setAttribute('content', '#f5f0e8');
    const renderVerse = (verse) => {
        if (labelEl) labelEl.textContent = currentLang === 'ko' ? '매일묵상' : '每日默想';
        if (refEl) refEl.textContent = currentLang === 'ko' ? verse.reference.ko : verse.reference.zh;
        if (textEl) textEl.textContent = currentLang === 'ko' ? verse.text.ko : verse.text.zh;
    };
    renderVerse(getDailyVerse());
    const homeContainer = document.querySelector('#homeSection .home-container');
    if (homeContainer) homeContainer.scrollTo(0, 0);
    const runId = ++homeRevealRunId;
    const shouldAnimate = !slide1.classList.contains('loaded');
    if (!shouldAnimate) {
        slide1.classList.add('loaded', 'verse-ui-show', 'verse-text-show');
    } else {
        slide1.classList.remove('loaded', 'verse-ui-show', 'verse-text-show', 'verse-show');
        requestAnimationFrame(() => {
            if (runId !== homeRevealRunId) return;
            slide1.classList.add('loaded');
            setTimeout(() => {
                if (runId !== homeRevealRunId) return;
                slide1.classList.add('verse-ui-show');
                setTimeout(() => {
                    if (runId !== homeRevealRunId) return;
                    slide1.classList.add('verse-text-show');
                }, 220);
            }, 220);
        });
    }
    window.refreshBackToTop?.();
    initHomeFeatureAnimations();
}
function setupHomeScrollListener(container) {}
function cleanupDailyVerse() {
    homeRevealRunId++;
    document.body.classList.remove('home-active');
    document.documentElement.style.backgroundColor = '#f5f0e8';
    const themeColorMeta = document.getElementById('themeColorMeta');
    if (themeColorMeta) themeColorMeta.setAttribute('content', '#f5f0e8');
    const slide1 = document.getElementById('dailyVerseSection');
    if (slide1) slide1.classList.remove('loaded', 'verse-ui-show', 'verse-text-show', 'verse-show');
}
function initHomeFeatureAnimations() {
    const features = document.querySelectorAll('.home-feature');
    if (!features.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = Array.from(features).indexOf(entry.target) * 200;
                setTimeout(() => { entry.target.classList.add('visible'); }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    features.forEach(f => observer.observe(f));
}
// (版本檢查已移除)
function scheduleDailyVerseUpdate() {
    const now = new Date();
    const seoulNow = new Date(now.getTime() + (now.getTimezoneOffset() + 540) * 60000);
    const tomorrow = new Date(seoulNow);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 5, 0); // 00:00:05 首爾時間
    const msUntilMidnight = tomorrow.getTime() - seoulNow.getTime();
    setTimeout(() => {
        localStorage.removeItem(DAILY_VERSE_KEY);
        if (document.getElementById('homeSection')?.classList.contains('active-section')) {
            initDailyVerse();
        }
        scheduleDailyVerseUpdate();
    }, msUntilMidnight);
}
scheduleDailyVerseUpdate();
// ===== 聖經功能 =====
// 聖經書卷資料 (韓文/中文名稱, 章數)
const bibleBooks = {
    oldTestament: [
        { id: 'gen', ko: '창세기', zh: '創世記', chapters: 50 },
        { id: 'exo', ko: '출애굽기', zh: '出埃及記', chapters: 40 },
        { id: 'lev', ko: '레위기', zh: '利未記', chapters: 27 },
        { id: 'num', ko: '민수기', zh: '民數記', chapters: 36 },
        { id: 'deu', ko: '신명기', zh: '申命記', chapters: 34 },
        { id: 'jos', ko: '여호수아', zh: '約書亞記', chapters: 24 },
        { id: 'jdg', ko: '사사기', zh: '士師記', chapters: 21 },
        { id: 'rut', ko: '룻기', zh: '路得記', chapters: 4 },
        { id: '1sa', ko: '사무엘상', zh: '撒母耳記上', chapters: 31 },
        { id: '2sa', ko: '사무엘하', zh: '撒母耳記下', chapters: 24 },
        { id: '1ki', ko: '열왕기상', zh: '列王紀上', chapters: 22 },
        { id: '2ki', ko: '열왕기하', zh: '列王紀下', chapters: 25 },
        { id: '1ch', ko: '역대상', zh: '歷代志上', chapters: 29 },
        { id: '2ch', ko: '역대하', zh: '歷代志下', chapters: 36 },
        { id: 'ezr', ko: '에스라', zh: '以斯拉記', chapters: 10 },
        { id: 'neh', ko: '느헤미야', zh: '尼希米記', chapters: 13 },
        { id: 'est', ko: '에스더', zh: '以斯帖記', chapters: 10 },
        { id: 'job', ko: '욥기', zh: '約伯記', chapters: 42 },
        { id: 'psa', ko: '시편', zh: '詩篇', chapters: 150 },
        { id: 'pro', ko: '잠언', zh: '箴言', chapters: 31 },
        { id: 'ecc', ko: '전도서', zh: '傳道書', chapters: 12 },
        { id: 'sng', ko: '아가', zh: '雅歌', chapters: 8 },
        { id: 'isa', ko: '이사야', zh: '以賽亞書', chapters: 66 },
        { id: 'jer', ko: '예레미야', zh: '耶利米書', chapters: 52 },
        { id: 'lam', ko: '예레미야애가', zh: '耶利米哀歌', chapters: 5 },
        { id: 'ezk', ko: '에스겔', zh: '以西結書', chapters: 48 },
        { id: 'dan', ko: '다니엘', zh: '但以理書', chapters: 12 },
        { id: 'hos', ko: '호세아', zh: '何西阿書', chapters: 14 },
        { id: 'jol', ko: '요엘', zh: '約珥書', chapters: 3 },
        { id: 'amo', ko: '아모스', zh: '阿摩司書', chapters: 9 },
        { id: 'oba', ko: '오바댜', zh: '俄巴底亞書', chapters: 1 },
        { id: 'jon', ko: '요나', zh: '約拿書', chapters: 4 },
        { id: 'mic', ko: '미가', zh: '彌迦書', chapters: 7 },
        { id: 'nam', ko: '나훔', zh: '那鴻書', chapters: 3 },
        { id: 'hab', ko: '하박국', zh: '哈巴谷書', chapters: 3 },
        { id: 'zep', ko: '스바냐', zh: '西番雅書', chapters: 3 },
        { id: 'hag', ko: '학개', zh: '哈該書', chapters: 2 },
        { id: 'zec', ko: '스가랴', zh: '撒迦利亞書', chapters: 14 },
        { id: 'mal', ko: '말라기', zh: '瑪拉基書', chapters: 4 }
    ],
    newTestament: [
        { id: 'mat', ko: '마태복음', zh: '馬太福音', chapters: 28 },
        { id: 'mrk', ko: '마가복음', zh: '馬可福音', chapters: 16 },
        { id: 'luk', ko: '누가복음', zh: '路加福音', chapters: 24 },
        { id: 'jhn', ko: '요한복음', zh: '約翰福音', chapters: 21 },
        { id: 'act', ko: '사도행전', zh: '使徒行傳', chapters: 28 },
        { id: 'rom', ko: '로마서', zh: '羅馬書', chapters: 16 },
        { id: '1co', ko: '고린도전서', zh: '哥林多前書', chapters: 16 },
        { id: '2co', ko: '고린도후서', zh: '哥林多後書', chapters: 13 },
        { id: 'gal', ko: '갈라디아서', zh: '加拉太書', chapters: 6 },
        { id: 'eph', ko: '에베소서', zh: '以弗所書', chapters: 6 },
        { id: 'php', ko: '빌립보서', zh: '腓立比書', chapters: 4 },
        { id: 'col', ko: '골로새서', zh: '歌羅西書', chapters: 4 },
        { id: '1th', ko: '데살로니가전서', zh: '帖撒羅尼迦前書', chapters: 5 },
        { id: '2th', ko: '데살로니가후서', zh: '帖撒羅尼迦後書', chapters: 3 },
        { id: '1ti', ko: '디모데전서', zh: '提摩太前書', chapters: 6 },
        { id: '2ti', ko: '디모데후서', zh: '提摩太後書', chapters: 4 },
        { id: 'tit', ko: '디도서', zh: '提多書', chapters: 3 },
        { id: 'phm', ko: '빌레몬서', zh: '腓利門書', chapters: 1 },
        { id: 'heb', ko: '히브리서', zh: '希伯來書', chapters: 13 },
        { id: 'jas', ko: '야고보서', zh: '雅各書', chapters: 5 },
        { id: '1pe', ko: '베드로전서', zh: '彼得前書', chapters: 5 },
        { id: '2pe', ko: '베드로후서', zh: '彼得後書', chapters: 3 },
        { id: '1jn', ko: '요한일서', zh: '約翰一書', chapters: 5 },
        { id: '2jn', ko: '요한이서', zh: '約翰二書', chapters: 1 },
        { id: '3jn', ko: '요한삼서', zh: '約翰三書', chapters: 1 },
        { id: 'jud', ko: '유다서', zh: '猶大書', chapters: 1 },
        { id: 'rev', ko: '요한계시록', zh: '啟示錄', chapters: 22 }
    ]
};
// 聖經經文內容資料庫
// 格式: bibleContent['書卷id']['章數'] = [ {verse: 節數, ko: '韓文', zh: '中文'}, ... ]
// ===== 聖經經文：從 /bible/ JSON 動態載入 =====
// 格式：/bible/{bookId}/{chapter}.json → [{verse:1, zh:'...'}, ...]
const bibleCache = {}; // { 'gen_1': [...], 'rev_3': [...] }
let lordsPrayerCache = null;
let lordsPrayerAudio = null;
let lordsPrayerAudioLang = null;
async function fetchBibleChapter(bookId, chapter) {
    const key = `${bookId}_${chapter}`;
    if (bibleCache[key]) return bibleCache[key];
    try {
        const res = await fetch(`/bible/${bookId}/${chapter}.json?v=${encodeURIComponent(APP_VERSION)}`);
        if (!res.ok) { bibleCache[key] = null; return null; }
        const data = await res.json();
        bibleCache[key] = data;
        return data;
    } catch(e) {
        bibleCache[key] = null;
        return null;
    }
}
async function fetchLordsPrayer() {
    if (lordsPrayerCache) return lordsPrayerCache;
    const res = await fetch(`/prayers/lords-prayer.json?v=${encodeURIComponent(APP_VERSION)}`);
    if (!res.ok) throw new Error(`Failed to load lords-prayer.json: ${res.status}`);
    lordsPrayerCache = await res.json();
    return lordsPrayerCache;
}
function updateLordsPrayerAudioButton() {
    document.querySelectorAll('.prayer-audio-btn').forEach((btn) => {
        const lang = btn.dataset.lang;
        const isPlaying = lordsPrayerAudioLang === lang && lordsPrayerAudio && !lordsPrayerAudio.paused;
        btn.classList.toggle('is-playing', Boolean(isPlaying));
    });
}
window.toggleLordsPrayerAudio = async (lang = 'ko') => {
    lang = lang === 'zh' ? 'zh' : 'ko';
    if (!lordsPrayerAudio || lordsPrayerAudioLang !== lang) {
        if (lordsPrayerAudio) {
            lordsPrayerAudio.pause();
            lordsPrayerAudio.currentTime = 0;
        }
        lordsPrayerAudioLang = lang;
        lordsPrayerAudio = new Audio(`/prayers/lords-prayer-${lang}.mp3?v=${encodeURIComponent(APP_VERSION)}`);
        lordsPrayerAudio.preload = 'none';
        lordsPrayerAudio.addEventListener('ended', updateLordsPrayerAudioButton);
        lordsPrayerAudio.addEventListener('pause', updateLordsPrayerAudioButton);
        lordsPrayerAudio.addEventListener('play', updateLordsPrayerAudioButton);
    }
    try {
        if (lordsPrayerAudio.paused) {
            await lordsPrayerAudio.play();
        } else {
            lordsPrayerAudio.pause();
        }
    } catch (error) {
        console.error('Prayer audio playback failed:', error);
    }
    updateLordsPrayerAudioButton();
};
async function renderLordsPrayer() {
    const content = document.getElementById('lordsPrayerContent');
    const title = document.getElementById('lordsPrayerTitle');
    if (!content) return;
    updateLordsPrayerAudioButton();
    content.innerHTML = '<div class="loading-dots-wrapper"><div class="loading-dots"><span></span><span></span><span></span></div></div>';
    try {
        const data = await fetchLordsPrayer();
        if (title) title.textContent = `${data.titles?.ko || '주기도문'} / ${data.titles?.zh || '主祈禱文'}`;
        const renderLines = (lines = []) => lines
            .map((line) => `<p>${escapeHtml(line)}</p>`)
            .join('');
        const audioButton = (lang, label) => `
            <button class="prayer-audio-btn" type="button" data-lang="${lang}" onclick="window.toggleLordsPrayerAudio('${lang}')" aria-label="${label}">
                <svg class="prayer-audio-icon play" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z"></path>
                </svg>
                <svg class="prayer-audio-icon pause" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 5h3v14H7z"></path>
                    <path d="M14 5h3v14h-3z"></path>
                </svg>
            </button>`;
        content.innerHTML = `
            <section class="prayer-language-card ko">
                ${audioButton('ko', '주기도문朗讀播放')}
                <div class="prayer-language-label">한국어</div>
                <div class="prayer-lines">${renderLines(data.ko)}</div>
            </section>
            <section class="prayer-language-card zh">
                ${audioButton('zh', '主祈禱文朗讀播放')}
                <div class="prayer-language-label">中文</div>
                <div class="prayer-lines">${renderLines(data.zh)}</div>
            </section>
        `;
        updateLordsPrayerAudioButton();
    } catch (error) {
        content.innerHTML = `
            <div class="prayer-error">
                ${currentLang === 'ko' ? '주기도문을 불러오지 못했습니다.' : '無法載入主祈禱文。'}
                <span>${escapeHtml(error.message || String(error))}</span>
            </div>
        `;
    }
}
// 相容舊版 bibleContent 同步存取 — 若快取有資料就回傳，否則回傳 undefined
const bibleContent = new Proxy({}, {
    get(_, bookId) {
        return new Proxy({}, {
            get(_, chapter) {
                const key = `${bookId}_${chapter}`;
                return bibleCache[key] || undefined;
            }
        });
    }
});
// 書卷簡稱對照表
const bookAbbreviations = {
    'gen': { ko: '창', zh: '創' },
    'exo': { ko: '출', zh: '出' },
    'lev': { ko: '레', zh: '利' },
    'num': { ko: '민', zh: '民' },
    'deu': { ko: '신', zh: '申' },
    'jos': { ko: '수', zh: '書' },
    'jdg': { ko: '삿', zh: '士' },
    'rut': { ko: '룻', zh: '得' },
    '1sa': { ko: '삼상', zh: '撒上' },
    '2sa': { ko: '삼하', zh: '撒下' },
    '1ki': { ko: '왕상', zh: '王上' },
    '2ki': { ko: '왕하', zh: '王下' },
    '1ch': { ko: '대상', zh: '代上' },
    '2ch': { ko: '대하', zh: '代下' },
    'ezr': { ko: '스', zh: '拉' },
    'neh': { ko: '느', zh: '尼' },
    'est': { ko: '에', zh: '斯' },
    'job': { ko: '욥', zh: '伯' },
    'psa': { ko: '시', zh: '詩' },
    'pro': { ko: '잠', zh: '箴' },
    'ecc': { ko: '전', zh: '傳' },
    'sng': { ko: '아', zh: '歌' },
    'isa': { ko: '사', zh: '賽' },
    'jer': { ko: '렘', zh: '耶' },
    'lam': { ko: '애', zh: '哀' },
    'ezk': { ko: '겔', zh: '結' },
    'dan': { ko: '단', zh: '但' },
    'hos': { ko: '호', zh: '何' },
    'jol': { ko: '욜', zh: '珥' },
    'amo': { ko: '암', zh: '摩' },
    'oba': { ko: '옵', zh: '俄' },
    'jon': { ko: '욘', zh: '拿' },
    'mic': { ko: '미', zh: '彌' },
    'nam': { ko: '나', zh: '鴻' },
    'hab': { ko: '합', zh: '哈' },
    'zep': { ko: '습', zh: '番' },
    'hag': { ko: '학', zh: '該' },
    'zec': { ko: '슥', zh: '亞' },
    'mal': { ko: '말', zh: '瑪' },
    'mat': { ko: '마', zh: '太' },
    'mrk': { ko: '막', zh: '可' },
    'luk': { ko: '눅', zh: '路' },
    'jhn': { ko: '요', zh: '約' },
    'act': { ko: '행', zh: '徒' },
    'rom': { ko: '롬', zh: '羅' },
    '1co': { ko: '고전', zh: '林前' },
    '2co': { ko: '고후', zh: '林後' },
    'gal': { ko: '갈', zh: '加' },
    'eph': { ko: '엡', zh: '弗' },
    'php': { ko: '빌', zh: '腓' },
    'col': { ko: '골', zh: '西' },
    '1th': { ko: '살전', zh: '帖前' },
    '2th': { ko: '살후', zh: '帖後' },
    '1ti': { ko: '딤전', zh: '提前' },
    '2ti': { ko: '딤후', zh: '提後' },
    'tit': { ko: '딛', zh: '多' },
    'phm': { ko: '몬', zh: '門' },
    'heb': { ko: '히', zh: '來' },
    'jas': { ko: '약', zh: '雅' },
    '1pe': { ko: '벧전', zh: '彼前' },
    '2pe': { ko: '벧후', zh: '彼後' },
    '1jn': { ko: '요일', zh: '約一' },
    '2jn': { ko: '요이', zh: '約二' },
    '3jn': { ko: '요삼', zh: '約三' },
    'jud': { ko: '유', zh: '猶' },
    'rev': { ko: '계', zh: '啟' }
};
let currentBibleBook = null;
let currentBibleChapter = null;
let selectedVerseData = null;
let activeBibleBookButton = null;
let bibleChaptersScrollCloseRaf = 0;
let suppressBibleChaptersScrollCloseUntil = 0;
let bibleChapterHistoryActive = false;
let activeWordStudyVerseElement = null;
const BIBLE_DISPLAY_MODE_KEY = 'bible_display_mode_v1';
const BIBLE_TEXT_STEP_KEY = 'bible_text_step_v1';
const BIBLE_DISPLAY_MODES = new Set(['both', 'ko', 'zh']);
let bibleDisplayMode = 'both';
let bibleTextStep = 0;
function normalizeBibleDisplayMode(value) {
    return BIBLE_DISPLAY_MODES.has(value) ? value : 'both';
}
function normalizeBibleTextStep(value) {
    const step = Number.parseInt(value, 10);
    return Number.isFinite(step) ? Math.max(-2, Math.min(2, step)) : 0;
}
function loadBibleDisplayPreferences() {
    try {
        bibleDisplayMode = normalizeBibleDisplayMode(localStorage.getItem(BIBLE_DISPLAY_MODE_KEY));
        bibleTextStep = normalizeBibleTextStep(localStorage.getItem(BIBLE_TEXT_STEP_KEY));
    } catch (error) {
        bibleDisplayMode = 'both';
        bibleTextStep = 0;
    }
}
function applyBibleDisplayPreferences() {
    loadBibleDisplayPreferences();
    document.body?.setAttribute('data-bible-display-mode', bibleDisplayMode);
    document.body?.setAttribute('data-bible-text-step', String(bibleTextStep));
    renderBibleDisplayPanel();
    updateWordStudyActionBubbleState();
}
function getBibleDisplayLabels() {
    return currentLang === 'ko'
        ? {
            title: '본문 표시', language: '본문 언어', both: '한·중', ko: '한국어', zh: '中文',
            size: '글자 크기', chapters: '장 선택', empty: '먼저 성경 장을 여세요', close: '닫기'
        }
        : {
            title: '經文顯示', language: '經文語言', both: '中韓雙語', ko: '韓文', zh: '中文',
            size: '文字大小', chapters: '選擇章節', empty: '請先開啟一章經文', close: '關閉'
        };
}
function renderBibleDisplayPanel() {
    const panel = document.getElementById('bibleDisplayPanel');
    if (!panel) return;
    const labels = getBibleDisplayLabels();
    const trigger = document.getElementById('navBibleDisplayBtn');
    if (trigger) {
        trigger.title = labels.title;
        trigger.setAttribute('aria-label', labels.title);
    }
    const title = document.getElementById('bibleDisplayPanelTitle');
    const languageLabel = document.getElementById('bibleDisplayLanguageLabel');
    const sizeLabel = document.getElementById('bibleDisplaySizeLabel');
    const chaptersTitle = document.getElementById('bibleDisplayChaptersTitle');
    const empty = document.getElementById('bibleDisplayEmpty');
    const close = panel.querySelector('.bible-display-close');
    if (title) title.textContent = labels.title;
    if (languageLabel) languageLabel.textContent = labels.language;
    if (sizeLabel) sizeLabel.textContent = labels.size;
    if (chaptersTitle) chaptersTitle.textContent = labels.chapters;
    if (empty) empty.textContent = labels.empty;
    if (close) close.setAttribute('aria-label', labels.close);
    panel.querySelectorAll('[data-bible-display-mode]').forEach((button) => {
        const mode = button.dataset.bibleDisplayMode;
        button.textContent = labels[mode] || mode;
        const active = mode === bibleDisplayMode;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
    });
    panel.querySelectorAll('[data-bible-text-step]').forEach((button) => {
        const active = Number(button.dataset.bibleTextStep) === bibleTextStep;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
    });
    const bookName = document.getElementById('bibleDisplayBookName');
    const grid = document.getElementById('bibleDisplayChaptersGrid');
    if (!grid || !empty) return;
    grid.innerHTML = '';
    const contentIsOpen = document.getElementById('bibleContentView')?.classList.contains('show');
    if (!contentIsOpen || !currentBibleBook || !currentBibleChapter) {
        if (bookName) bookName.textContent = '';
        empty.hidden = false;
        return;
    }
    if (bookName) {
        bookName.textContent = currentLang === 'ko' ? currentBibleBook.ko : currentBibleBook.zh;
    }
    empty.hidden = true;
    for (let chapter = 1; chapter <= currentBibleBook.chapters; chapter += 1) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = String(chapter);
        button.classList.toggle('is-current', chapter === currentBibleChapter);
        if (chapter === currentBibleChapter) button.setAttribute('aria-current', 'true');
        button.onclick = () => {
            openBibleChapter(currentBibleBook, chapter);
            window.closeBibleDisplayPanel();
        };
        grid.appendChild(button);
    }
}
window.setBibleDisplayMode = (mode) => {
    bibleDisplayMode = normalizeBibleDisplayMode(mode);
    try { localStorage.setItem(BIBLE_DISPLAY_MODE_KEY, bibleDisplayMode); } catch (error) {}
    document.body?.setAttribute('data-bible-display-mode', bibleDisplayMode);
    clearWordStudyFocus();
    renderBibleDisplayPanel();
    updateWordStudyActionBubbleState();
    void buildDailyNotification();
};
window.setBibleTextStep = (step) => {
    bibleTextStep = normalizeBibleTextStep(step);
    try { localStorage.setItem(BIBLE_TEXT_STEP_KEY, String(bibleTextStep)); } catch (error) {}
    document.body?.setAttribute('data-bible-text-step', String(bibleTextStep));
    renderBibleDisplayPanel();
};
window.toggleBibleDisplayPanel = () => {
    const panel = document.getElementById('bibleDisplayPanel');
    const trigger = document.getElementById('navBibleDisplayBtn');
    if (!panel || !trigger) return;
    const shouldOpen = !panel.classList.contains('show');
    if (shouldOpen) {
        renderBibleDisplayPanel();
        document.getElementById('bibleDisplayOverlay')?.classList.add('show');
    } else {
        document.getElementById('bibleDisplayOverlay')?.classList.remove('show');
    }
    setNavPanelState(panel, trigger, 'display', shouldOpen);
};
window.closeBibleDisplayPanel = () => {
    const panel = document.getElementById('bibleDisplayPanel');
    const trigger = document.getElementById('navBibleDisplayBtn');
    document.getElementById('bibleDisplayOverlay')?.classList.remove('show');
    if (panel && trigger) setNavPanelState(panel, trigger, 'display', false);
};
// 初始化聖經頁面
function initBiblePage() {
    renderBibleBooks('oldTestament', 'oldTestamentBooks');
    renderBibleBooks('newTestament', 'newTestamentBooks');
}
// 渲染書卷列表
function renderBibleBooks(testament, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    bibleBooks[testament].forEach(book => {
        const btn = document.createElement('div');
        btn.className = 'bible-book-btn';
        btn.id = `bible-book-${book.id}`;
        btn.innerHTML = `<span class="zh">${book.zh}</span><span class="ko">${book.ko}</span>`;
        btn.onclick = (event) => {
            event.stopPropagation();
            selectBibleBook(book, event.currentTarget);
        };
        container.appendChild(btn);
    });
}
// 選擇書卷
function selectBibleBook(book, anchorEl = null) {
    // 移除其他書卷的選中狀態
    document.querySelectorAll('.bible-book-btn').forEach(btn => btn.classList.remove('active'));
    // 選中當前書卷
    const currentBtn = anchorEl || document.getElementById(`bible-book-${book.id}`);
    if (currentBtn) currentBtn.classList.add('active');
    activeBibleBookButton = currentBtn;
    if (currentBibleBook?.id !== book.id) currentBibleChapter = null;
    currentBibleBook = book;
    renderBibleDisplayPanel();
    // 顯示章節選擇
    const chaptersContainer = document.getElementById('bibleChaptersContainer');
    const chaptersTitle = document.getElementById('bibleChaptersTitle');
    const chaptersGrid = document.getElementById('bibleChaptersGrid');
    chaptersTitle.innerHTML = `${book.ko} / ${book.zh}`;
    chaptersGrid.innerHTML = '';
    for (let i = 1; i <= book.chapters; i++) {
        const btn = document.createElement('div');
        btn.className = 'bible-chapter-btn';
        btn.textContent = i;
        btn.onclick = (event) => {
            event.stopPropagation();
            openBibleChapter(book, i);
        };
        chaptersGrid.appendChild(btn);
    }
    chaptersContainer.classList.add('show');
    positionBibleChaptersPopover(currentBtn);
}
function positionBibleChaptersPopover(anchorEl = activeBibleBookButton) {
    const chaptersContainer = document.getElementById('bibleChaptersContainer');
    if (!chaptersContainer || !chaptersContainer.classList.contains('show') || !anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const panelWidth = Math.min(380, Math.max(260, viewportWidth - 24));
    let left = rect.left + (rect.width / 2) - (panelWidth / 2);
    left = Math.max(12, Math.min(left, viewportWidth - panelWidth - 12));
    chaptersContainer.style.width = `${panelWidth}px`;
    chaptersContainer.style.left = `${left}px`;
    chaptersContainer.style.top = `${rect.bottom + 10}px`;
    requestAnimationFrame(() => {
        const panelHeight = chaptersContainer.offsetHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        let top = rect.bottom + 10;
        if (spaceBelow < panelHeight + 22 && spaceAbove > spaceBelow) {
            top = Math.max(12, rect.top - panelHeight - 10);
            chaptersContainer.classList.add('above-anchor');
        } else {
            top = Math.min(top, viewportHeight - panelHeight - 12);
            chaptersContainer.classList.remove('above-anchor');
        }
        chaptersContainer.style.top = `${Math.max(12, top)}px`;
    });
}
function closeBibleChaptersPopover({ keepActiveBook = false } = {}) {
    const chaptersContainer = document.getElementById('bibleChaptersContainer');
    if (chaptersContainer) {
        chaptersContainer.classList.remove('show', 'above-anchor');
        chaptersContainer.removeAttribute('style');
    }
    if (!keepActiveBook) {
        document.querySelectorAll('.bible-book-btn').forEach(btn => btn.classList.remove('active'));
        activeBibleBookButton = null;
    }
}
document.addEventListener('click', (event) => {
    const chaptersContainer = document.getElementById('bibleChaptersContainer');
    if (!chaptersContainer || !chaptersContainer.classList.contains('show')) return;
    if (chaptersContainer.contains(event.target) || event.target.closest('.bible-book-btn')) return;
    closeBibleChaptersPopover();
});
function closeBibleChaptersOnPageScroll(event) {
    hideWordStudyActionBubble();
    const chaptersContainer = document.getElementById('bibleChaptersContainer');
    if (!chaptersContainer || !chaptersContainer.classList.contains('show')) return;
    if (event?.target && chaptersContainer.contains(event.target)) return;
    if (Date.now() < suppressBibleChaptersScrollCloseUntil) {
        positionBibleChaptersPopover();
        return;
    }
    if (bibleChaptersScrollCloseRaf) return;
    bibleChaptersScrollCloseRaf = requestAnimationFrame(() => {
        bibleChaptersScrollCloseRaf = 0;
        closeBibleChaptersPopover();
    });
}
window.addEventListener('resize', () => positionBibleChaptersPopover());
document.addEventListener('scroll', closeBibleChaptersOnPageScroll, { passive: true, capture: true });
window.addEventListener('scroll', closeBibleChaptersOnPageScroll, { passive: true });
// 開啟聖經章節
async function openBibleChapter(book, chapter, options = {}) {
    const booksList = document.getElementById('bibleBooksList');
    const contentView = document.getElementById('bibleContentView');
    const contentTitle = document.getElementById('bibleContentTitle');
    const versesContainer = document.getElementById('bibleVerses');
    // 記錄當前章節
    currentBibleChapter = chapter;
    currentBibleBook = book;
    renderBibleDisplayPanel();
    const chapterPath = getBibleChapterPath(book, chapter);
    const chapterState = { bibleChapter: true, bookId: book.id, chapter };
    if (options.fromRoute) {
        history.replaceState(chapterState, '', chapterPath);
        bibleChapterHistoryActive = true;
    } else if (!bibleChapterHistoryActive && document.getElementById('bibleSection')?.classList.contains('active-section')) {
        history.pushState(chapterState, '', chapterPath);
        bibleChapterHistoryActive = true;
    } else if (window.location.pathname !== chapterPath) {
        history.replaceState(chapterState, '', chapterPath);
    }
    // 設定標題
    contentTitle.querySelector('.ko').textContent = `${book.ko} ${chapter}장`;
    contentTitle.querySelector('.zh').textContent = `${book.zh} 第${chapter}章`;
    // 先切換視圖 + 顯示載入動畫
    closeBibleChaptersPopover({ keepActiveBook: true });
    booksList.style.display = 'none';
    contentView.classList.add('show');
    versesContainer.innerHTML = '<div class="loading-dots-wrapper"><div class="loading-dots"><span></span><span></span><span></span></div></div>';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // 從 JSON 載入經文
    const verses = await fetchBibleChapter(book.id, chapter);
    if (verses && verses.length > 0) {
        versesContainer.innerHTML = verses.map((v) => {
            if (v.type === 'heading') {
                return `<div class="bible-section-heading">
                    <span class="heading-ko">${v.ko || ''}</span>
                    <span class="heading-zh">${v.zh || ''}</span>
                </div>`;
            }
            return `<div class="bible-verse"
                     data-verse="${v.verse}"
                     data-ko="${encodeURIComponent(v.ko || '')}"
                     data-zh="${encodeURIComponent(v.zh || '')}"
                     oncontextmenu="window.handleVerseContextMenu(event, this)"
                     ontouchstart="window.handleVerseTouchStart(event, this)"
                     ontouchend="window.handleVerseTouchEnd(event, this)"
                     ontouchmove="window.handleVerseTouchMove(event, this)"
                     onmousedown="window.handleVerseMouseDown(event, this)"
                     onmouseup="window.handleVerseMouseUp(event, this)"
                     onmouseleave="window.handleVerseMouseLeave(event, this)">
                <span class="verse-num">${v.verse}</span>
                ${v.ko ? `<span class="verse-text-ko">${v.ko}</span>` : ''}
                ${v.zh ? `<span class="verse-text-zh">${v.zh}</span>` : ''}
            </div>`;
        }).join('');
    } else {
        versesContainer.innerHTML = `
            <div style="text-align:center; padding:50px; color:#888;">
                <p>이 장의 내용이 아직 추가되지 않았습니다.</p>
                <p>此章節內容尚未添加。</p>
            </div>`;
    }
    // 章節載入後更新回頂按鈕狀態
    if (options.targetVerse != null) {
        setTimeout(() => scrollToBibleVerse(options.targetVerse), 120);
    }
    setTimeout(() => window.refreshBackToTop?.(), 100);
}
function scrollToBibleVerse(verse) {
    const verseText = String(verse);
    const target = [...document.querySelectorAll('#bibleVerses .bible-verse')]
        .find((el) => el.dataset.verse === verseText);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('verse-jump-highlight');
    setTimeout(() => target.classList.remove('verse-jump-highlight'), 1800);
}
// 關閉聖經內容，返回書卷列表
window.closeBibleContent = (options = {}) => {
    const { fromHistory = false } = options;
    const booksList = document.getElementById('bibleBooksList');
    const contentView = document.getElementById('bibleContentView');
    hideWordStudyActionBubble();
    contentView.classList.remove('show');
    booksList.style.display = 'block';
    closeBibleChaptersPopover();
    currentBibleChapter = null;
    currentBibleBook = null;
    renderBibleDisplayPanel();
    bibleChapterHistoryActive = false;
    if (!fromHistory && (history.state?.bibleChapter || /^\/bible\/[a-z0-9]+\d+$/i.test(window.location.pathname))) {
        history.replaceState(null, '', '/bible');
    }
};
// Back-to-top controller: self-contained, no dependency on index.html or style.css.
const BACK_TO_TOP_THRESHOLD = 140;
const BACK_TO_TOP_ID = 'siteBackToTop';
const BACK_TO_TOP_STYLE_ID = 'siteBackToTopStyle';
let backToTopInitialized = false;
let backToTopRaf = 0;
let backToTopObserver = null;
function getDocumentScrollTop() {
    return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}
function getBackToTopScrollTargets() {
    const activeSection = document.querySelector('.page-section.active-section');
    const roots = [
        document.scrollingElement,
        document.documentElement,
        document.body,
        document.querySelector('.container'),
        activeSection
    ].filter(Boolean);
    const selector = [
        '.home-container',
        '.bible-container',
        '.bible-content-view',
        '.bible-verses',
        '.list-container',
        '.ai-panel-result',
        '.bible-search-panel',
        '.bible-search-preview-body'
    ].join(',');
    if (activeSection) roots.push(...activeSection.querySelectorAll(selector));
    return [...new Set(roots)].filter((el) => {
        if (!el || el === document) return false;
        if (el === document.documentElement || el === document.body || el === document.scrollingElement) return true;
        return el.scrollHeight > el.clientHeight + 2;
    });
}
function getBackToTopAmount() {
    const elementTop = getBackToTopScrollTargets()
        .reduce((max, el) => Math.max(max, el.scrollTop || 0), 0);
    return Math.max(getDocumentScrollTop(), elementTop);
}
function setBackToTopVisible() {
    const btn = document.getElementById(BACK_TO_TOP_ID);
    if (!btn) return;
    btn.classList.toggle('is-visible', getBackToTopAmount() > BACK_TO_TOP_THRESHOLD);
}
function scheduleBackToTopRefresh() {
    if (backToTopRaf) return;
    backToTopRaf = requestAnimationFrame(() => {
        backToTopRaf = 0;
        setBackToTopVisible();
    });
}
function injectBackToTopStyle() {
    if (document.getElementById(BACK_TO_TOP_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = BACK_TO_TOP_STYLE_ID;
    style.textContent = `
        #${BACK_TO_TOP_ID} {
            position: fixed;
            right: calc(18px + env(safe-area-inset-right));
            bottom: calc(22px + env(safe-area-inset-bottom));
            width: 46px;
            height: 46px;
            display: grid;
            place-items: center;
            border: 1px solid rgba(255,255,255,0.58);
            border-radius: 999px;
            background: rgba(67, 160, 71, 0.62);
            color: #fff;
            box-shadow: 0 8px 22px rgba(30, 50, 30, 0.18);
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transform: translate3d(0, 10px, 0) scale(0.94);
            transition: opacity .22s ease, visibility .22s ease, transform .22s ease, background .22s ease;
            z-index: 2147483000;
            -webkit-tap-highlight-color: transparent;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
        #${BACK_TO_TOP_ID}.is-visible {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
            transform: translate3d(0, 0, 0) scale(1);
        }
        #${BACK_TO_TOP_ID}:hover {
            background: rgba(46, 125, 50, 0.78);
            transform: translate3d(0, 0, 0) scale(1.06);
        }
        body.home-active #${BACK_TO_TOP_ID} {
            border-color: rgba(255,255,255,0.3);
            background: rgba(46, 125, 50, 0.56);
            box-shadow: 0 8px 22px rgba(30, 50, 30, 0.18);
        }
        body.home-active #${BACK_TO_TOP_ID}:hover {
            background: rgba(46, 125, 50, 0.72);
        }
        #${BACK_TO_TOP_ID} svg {
            width: 23px;
            height: 23px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2.6;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
        @media (prefers-reduced-motion: reduce) {
            #${BACK_TO_TOP_ID} {
                transition: none;
            }
        }
    `;
    document.head.appendChild(style);
}
function createBackToTopButton() {
    const existing = document.getElementById(BACK_TO_TOP_ID);
    if (existing) return existing;
    const btn = document.createElement('button');
    btn.id = BACK_TO_TOP_ID;
    btn.type = 'button';
    btn.setAttribute('aria-label', currentLang === 'ko' ? '맨 위로 이동' : '回到頂端');
    btn.title = currentLang === 'ko' ? '맨 위로 이동' : '回到頂端';
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
    btn.addEventListener('click', () => {
        getBackToTopScrollTargets().forEach((el) => {
            if (el.scrollTop > 0) el.scrollTo({ top: 0, behavior: 'smooth' });
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(scheduleBackToTopRefresh, 260);
    });
    document.body.appendChild(btn);
    return btn;
}
function initBackToTop() {
    injectBackToTopStyle();
    createBackToTopButton();
    if (!backToTopInitialized) {
        window.addEventListener('scroll', scheduleBackToTopRefresh, { passive: true });
        document.addEventListener('scroll', scheduleBackToTopRefresh, { passive: true, capture: true });
        window.addEventListener('resize', scheduleBackToTopRefresh);
        backToTopObserver = new MutationObserver(scheduleBackToTopRefresh);
        backToTopObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
        backToTopInitialized = true;
    }
    scheduleBackToTopRefresh();
}
window.refreshBackToTop = () => {
    if (!backToTopInitialized) initBackToTop();
    scheduleBackToTopRefresh();
};
document.addEventListener('DOMContentLoaded', initBackToTop);
// ===== 新複製模式系統 =====
const LONG_PRESS_DURATION = 300; // 長按時間 300ms（快速觸發）
const COPY_LANG_PREF_KEY = 'copy_lang_preference';
let longPressTimer = null;
let longPressElement = null;
let longPressTriggered = false;
let touchStartX = 0;
let touchStartY = 0;
let isCopyModeActive = false;
let selectedVerses = new Set(); // 存儲選中的經文節數
// 載入語言偏好設定（預設兩個都打勾）
function loadCopyLangPreference() {
    try {
        const zhEl = document.getElementById('copyLangZh');
        const koEl = document.getElementById('copyLangKo');
        if (!zhEl || !koEl) return;
        // 預設兩個都打勾
        zhEl.checked = true;
        koEl.checked = true;
        // 如果有儲存的偏好，則使用儲存的設定
        const saved = localStorage.getItem(COPY_LANG_PREF_KEY);
        if (saved) {
            const pref = JSON.parse(saved);
            // 只有明確設為 false 時才取消勾選
            if (pref.zh === false) zhEl.checked = false;
            if (pref.ko === false) koEl.checked = false;
        }
    } catch (e) {
        // 使用預設值（兩個都打勾）
    }
}
// 儲存語言偏好設定
function saveCopyLangPreference() {
    try {
        const zhEl = document.getElementById('copyLangZh');
        const koEl = document.getElementById('copyLangKo');
        if (!zhEl || !koEl) return;
        const pref = {
            zh: zhEl.checked,
            ko: koEl.checked
        };
        localStorage.setItem(COPY_LANG_PREF_KEY, JSON.stringify(pref));
    } catch (e) {
        // 忽略錯誤
    }
}
// 初始化複製模式
document.addEventListener('DOMContentLoaded', () => {
    loadCopyLangPreference();
    // 監聽語言勾選變化
    const zhEl = document.getElementById('copyLangZh');
    const koEl = document.getElementById('copyLangKo');
    if (zhEl) zhEl.addEventListener('change', saveCopyLangPreference);
    if (koEl) koEl.addEventListener('change', saveCopyLangPreference);
});
// 清除長按狀態
function clearLongPressState() {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }
    if (longPressElement) {
        longPressElement.classList.remove('long-press');
        longPressElement = null;
    }
    longPressTriggered = false;
}
// 觸發長按成功 - 進入複製模式並顯示小圖示
function triggerLongPress(event, element) {
    clearLongPressState();
    longPressTriggered = true;
    showWordStudyAction(event, element);
}
// 顯示複製小圖示
function showCopyFabButton() {
    return;
}
// 隱藏複製小圖示
function hideCopyFabButton() {
    return;
}
// 點擊複製小圖示 - 打開複製面板
window.openCopyModePanel = () => {
    // 確保語言預設都打勾
    const zhEl = document.getElementById('copyLangZh');
    const koEl = document.getElementById('copyLangKo');
    if (zhEl) zhEl.checked = true;
    if (koEl) koEl.checked = true;
    // 顯示複製模式面板
    const panel = document.getElementById('copyModePanel');
    if (panel) panel.classList.add('show');
    // 隱藏複製小圖示
    hideCopyFabButton();
    // 更新選中計數
    updateSelectedCount();
    // 更新面板語言
    updateCopyModePanelLanguage();
};
// 進入複製模式（保留給右鍵使用）
function enterCopyMode(element) {
    clearLongPressState();
}
function getVersePointerPosition(event) {
    const touch = event?.touches?.[0] || event?.changedTouches?.[0];
    if (touch) return { x: touch.clientX, y: touch.clientY };
    return {
        x: event?.clientX || window.innerWidth / 2,
        y: event?.clientY || window.innerHeight / 2
    };
}
function createWordStudyActionBubble() {
    let bubble = document.getElementById('wordStudyActionBubble');
    if (bubble) return bubble;
    bubble = document.createElement('div');
    bubble.id = 'wordStudyActionBubble';
    bubble.className = 'word-study-action-bubble';
    bubble.innerHTML = `
        <button type="button" class="word-study-action-btn favorite" id="wordStudyFavoriteActionBtn" onclick="window.saveFavoriteFromActiveVerse()">
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20.5s-7.2-4.4-8.8-9.2C2.2 8.2 4.3 5 7.6 5c1.9 0 3.3 1 4.4 2.4C13.1 6 14.5 5 16.4 5c3.3 0 5.4 3.2 4.4 6.3C19.2 16.1 12 20.5 12 20.5Z"/>
            </svg>
            <span id="wordStudyFavoriteActionText">${currentLang === 'ko' ? '좋아요' : '喜愛'}</span>
        </button>
        <button type="button" class="word-study-action-btn" id="wordStudyAnalyzeActionBtn" onclick="window.openWordStudyPanel()">
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 19.5V5.75A2.75 2.75 0 0 1 6.75 3H20v15H6.75A2.75 2.75 0 0 0 4 20.75"/>
                <path d="M8 7h8M8 11h6"/>
            </svg>
            <span id="wordStudyAnalyzeActionText">${currentLang === 'ko' ? '분석' : '解析'}</span>
        </button>
    `;
    document.body.appendChild(bubble);
    return bubble;
}
function getFavoriteCollectionIdFromVerseData(data) {
    if (!data) return '';
    return `${data.book?.id || data.bookId}-${data.chapter}-${data.verse}`;
}
function isActiveVerseAlreadyFavorite() {
    const data = getActiveWordStudyVerseData();
    const favoriteId = getFavoriteCollectionIdFromVerseData(data);
    return Boolean(favoriteId && bibleCollections.favorites.some(item => item.id === favoriteId));
}
function updateWordStudyActionBubbleState() {
    const favoriteBtn = document.getElementById('wordStudyFavoriteActionBtn');
    const favoriteText = document.getElementById('wordStudyFavoriteActionText');
    const analyzeBtn = document.getElementById('wordStudyAnalyzeActionBtn');
    const analyzeText = document.getElementById('wordStudyAnalyzeActionText');
    const bubble = document.getElementById('wordStudyActionBubble');
    if (!favoriteBtn || !favoriteText) return;
    const allowAnalysis = bibleDisplayMode === 'both';
    if (analyzeBtn) analyzeBtn.hidden = !allowAnalysis;
    if (analyzeText) analyzeText.textContent = currentLang === 'ko' ? '분석' : '解析';
    bubble?.classList.toggle('favorite-only', !allowAnalysis);
    const alreadyFavorite = isActiveVerseAlreadyFavorite();
    favoriteBtn.disabled = alreadyFavorite;
    favoriteBtn.classList.toggle('is-saved', alreadyFavorite);
    favoriteText.textContent = alreadyFavorite
        ? (currentLang === 'ko' ? '저장됨' : '已加入')
        : (currentLang === 'ko' ? '좋아요' : '喜愛');
}
function hideWordStudyActionBubble() {
    document.getElementById('wordStudyActionBubble')?.classList.remove('show');
}
function clearWordStudyFocus() {
    hideWordStudyActionBubble();
    clearLongPressState();
    document.querySelectorAll('.bible-verses.word-study-focus-active').forEach(container => {
        container.classList.remove('word-study-focus-active');
    });
    document.querySelectorAll('.bible-verse.word-study-target').forEach(verse => {
        verse.classList.remove('word-study-target');
    });
    activeWordStudyVerseElement = null;
}
function setWordStudyFocus(element) {
    document.querySelectorAll('.bible-verse.word-study-target').forEach(verse => {
        verse.classList.remove('word-study-target');
    });
    document.querySelectorAll('.bible-verses.word-study-focus-active').forEach(container => {
        container.classList.remove('word-study-focus-active');
    });
    activeWordStudyVerseElement = element;
    element.classList.add('word-study-target');
    element.closest('.bible-verses')?.classList.add('word-study-focus-active');
}
function showWordStudyAction(event, element) {
    setWordStudyFocus(element);
    const bubble = createWordStudyActionBubble();
    updateWordStudyActionBubbleState();
    const width = bibleDisplayMode === 'both' ? 226 : 118;
    const height = 44;
    const rect = element.getBoundingClientRect();
    const left = Math.max(12, Math.min(rect.right - width - 8, window.innerWidth - width - 12));
    const preferredTop = rect.top + 8;
    const top = Math.max(12, Math.min(preferredTop, window.innerHeight - height - 12));
    bubble.style.left = `${left}px`;
    bubble.style.top = `${top}px`;
    bubble.classList.add('show');
}
document.addEventListener('click', (event) => {
    const bubble = document.getElementById('wordStudyActionBubble');
    if (!bubble?.classList.contains('show')) return;
    if (bubble.contains(event.target) || event.target.closest('.bible-verse')) return;
    clearWordStudyFocus();
});
function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
const BIBLE_COLLECTION_KEY = 'bible_collections_v1';
const GOOGLE_DRIVE_CLIENT_ID = '632214117633-l56kg7o8pbj3frl99r98bnhi316bgsgb.apps.googleusercontent.com';
const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
const GOOGLE_DRIVE_COLLECTION_FILE = 'scoynim-bible-collections.json';
var bibleCollectionEditMode = false;
let bibleCollectionDragState = null;
let bibleFavoritePointerDrag = null;
let bibleFavoriteNoteEditorId = null;
let bibleCollections = {
    favorites: [],
    analyses: [],
    syncProvider: null,
    syncState: 'local'
};
let currentWordStudySavedPayload = null;
let googleIdentityScriptPromise = null;
let googleDriveTokenClient = null;
let googleDriveAccessToken = null;
let googleDriveFileId = null;
let googleDriveSyncTimer = null;
let googleDriveSyncInFlight = false;
let bibleCollectionSuppressCloudSync = false;
function loadBibleCollections() {
    try {
        const saved = JSON.parse(localStorage.getItem(BIBLE_COLLECTION_KEY) || '{}');
        bibleCollections = {
            favorites: Array.isArray(saved.favorites) ? saved.favorites : [],
            analyses: Array.isArray(saved.analyses) ? saved.analyses : [],
            syncProvider: saved.syncProvider || null,
            syncState: saved.syncState || (saved.syncProvider ? 'ready' : 'local'),
            updatedAt: saved.updatedAt || 0,
            lastSyncedAt: saved.lastSyncedAt || 0,
            cloudFileId: saved.cloudFileId || null
        };
        googleDriveFileId = bibleCollections.cloudFileId || null;
        normalizeBibleCollectionItems();
    } catch (e) {
        bibleCollections = { favorites: [], analyses: [], syncProvider: null, syncState: 'local' };
    }
}
function saveBibleCollections() {
    try {
        if (!bibleCollectionSuppressCloudSync) bibleCollections.updatedAt = Date.now();
        localStorage.setItem(BIBLE_COLLECTION_KEY, JSON.stringify(bibleCollections));
        queueBibleCollectionCloudSync();
    } catch (e) {}
}
function queueBibleCollectionCloudSync() {
    if (bibleCollectionSuppressCloudSync) return;
    if (bibleCollections.syncProvider !== 'google' || !googleDriveAccessToken) return;
    window.clearTimeout(googleDriveSyncTimer);
    googleDriveSyncTimer = window.setTimeout(() => {
        syncBibleCollectionsToGoogleDrive().catch(() => {
            bibleCollections.syncState = 'disconnected';
            renderBibleCollections();
        });
    }, 900);
}
function normalizeBibleCollectionItems() {
    bibleCollections.favorites = (bibleCollections.favorites || []).map(item => ({
        ...item,
        notes: Array.isArray(item.notes) ? item.notes : []
    }));
    bibleCollections.analyses = Array.isArray(bibleCollections.analyses) ? bibleCollections.analyses : [];
}
function getBibleCollectionCloudPayload() {
    normalizeBibleCollectionItems();
    return {
        version: 1,
        updatedAt: bibleCollections.updatedAt || Date.now(),
        favorites: bibleCollections.favorites || [],
        analyses: bibleCollections.analyses || []
    };
}
function hasBibleCollectionPayloadData(payload = {}) {
    return Boolean((payload.favorites || []).length || (payload.analyses || []).length);
}
function applyBibleCollectionPayload(payload = {}) {
    bibleCollections.favorites = Array.isArray(payload.favorites) ? payload.favorites : [];
    bibleCollections.analyses = Array.isArray(payload.analyses) ? payload.analyses : [];
    bibleCollections.updatedAt = payload.updatedAt || Date.now();
    normalizeBibleCollectionItems();
}
function mergeFavoriteNotes(localNotes = [], cloudNotes = []) {
    const merged = new Map();
    cloudNotes.forEach(note => {
        if (note?.id) merged.set(note.id, note);
    });
    localNotes.forEach(note => {
        if (note?.id) merged.set(note.id, note);
    });
    return Array.from(merged.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}
function mergeBibleCollectionList(localList = [], cloudList = [], type = 'favorites') {
    const merged = new Map();
    cloudList.forEach(item => {
        if (item?.id) merged.set(item.id, item);
    });
    localList.forEach(item => {
        if (!item?.id) return;
        const cloudItem = merged.get(item.id);
        const next = cloudItem ? { ...cloudItem, ...item } : item;
        if (type === 'favorites') {
            next.notes = mergeFavoriteNotes(item.notes || [], cloudItem?.notes || []);
        }
        merged.set(item.id, next);
    });
    const localIds = new Set(localList.map(item => item?.id).filter(Boolean));
    const localOrdered = localList.map(item => merged.get(item.id)).filter(Boolean);
    const cloudOnly = cloudList.filter(item => item?.id && !localIds.has(item.id)).map(item => merged.get(item.id));
    return [...localOrdered, ...cloudOnly];
}
function mergeBibleCollectionPayload(cloudPayload = {}) {
    const localPayload = getBibleCollectionCloudPayload();
    bibleCollections.favorites = mergeBibleCollectionList(localPayload.favorites, cloudPayload.favorites || [], 'favorites');
    bibleCollections.analyses = mergeBibleCollectionList(localPayload.analyses, cloudPayload.analyses || [], 'analyses');
    bibleCollections.updatedAt = Math.max(localPayload.updatedAt || 0, cloudPayload.updatedAt || 0, Date.now());
    normalizeBibleCollectionItems();
}
function formatBibleCollectionSyncTime(timestamp) {
    const t = i18n[currentLang];
    if (!timestamp) return `${t.bibleCloudLastSync}：${t.bibleCloudNeverSynced}`;
    const locale = currentLang === 'ko' ? 'ko-KR' : 'zh-TW';
    const formatted = new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(timestamp));
    return `${t.bibleCloudLastSync}：${formatted}`;
}
function showBibleSyncChoiceDialog(mode) {
    const t = i18n[currentLang];
    const copy = {
        conflict: {
            title: t.bibleSyncChoiceConflictTitle,
            desc: t.bibleSyncChoiceConflictDesc,
            buttons: [
                { action: 'merge', label: t.bibleSyncChoiceMerge, primary: true },
                { action: 'cloud', label: t.bibleSyncChoiceUseCloud },
                { action: 'local', label: t.bibleSyncChoiceUseLocal },
                { action: 'cancel', label: t.bibleSyncChoiceLater }
            ]
        },
        localOnly: {
            title: t.bibleSyncChoiceLocalOnlyTitle,
            desc: t.bibleSyncChoiceLocalOnlyDesc,
            buttons: [
                { action: 'local', label: t.bibleSyncChoiceUseLocal, primary: true },
                { action: 'cancel', label: t.bibleSyncChoiceLater }
            ]
        },
        cloudOnly: {
            title: t.bibleSyncChoiceCloudOnlyTitle,
            desc: t.bibleSyncChoiceCloudOnlyDesc,
            buttons: [
                { action: 'cloud', label: t.bibleSyncChoiceDownloadCloud, primary: true },
                { action: 'cancel', label: t.bibleSyncChoiceLater }
            ]
        }
    }[mode];
    if (!copy) return Promise.resolve('cancel');
    return new Promise((resolve) => {
        document.querySelectorAll('.bible-sync-choice-overlay').forEach(el => el.remove());
        const overlay = document.createElement('div');
        overlay.className = 'bible-sync-choice-overlay show';
        overlay.innerHTML = `
            <div class="bible-sync-choice-panel" role="dialog" aria-modal="true">
                <div class="bible-sync-choice-title">${escapeHtml(copy.title)}</div>
                <div class="bible-sync-choice-desc">${escapeHtml(copy.desc)}</div>
                <div class="bible-sync-choice-actions">
                    ${copy.buttons.map(btn => `
                        <button type="button" class="${btn.primary ? 'primary' : ''}" data-action="${escapeHtml(btn.action)}">${escapeHtml(btn.label)}</button>
                    `).join('')}
                </div>
            </div>
        `;
        const finish = (action) => {
            overlay.remove();
            resolve(action);
        };
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) finish('cancel');
        });
        overlay.querySelectorAll('button[data-action]').forEach(button => {
            button.addEventListener('click', () => finish(button.dataset.action || 'cancel'));
        });
        document.body.appendChild(overlay);
    });
}
function loadGoogleIdentityScript() {
    if (window.google?.accounts?.oauth2) return Promise.resolve();
    if (googleIdentityScriptPromise) return googleIdentityScriptPromise;
    googleIdentityScriptPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (existing) {
            existing.addEventListener('load', resolve, { once: true });
            existing.addEventListener('error', reject, { once: true });
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
    return googleIdentityScriptPromise;
}
async function requestGoogleDriveAccessToken() {
    await loadGoogleIdentityScript();
    return new Promise((resolve, reject) => {
        googleDriveTokenClient = googleDriveTokenClient || window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_DRIVE_CLIENT_ID,
            scope: GOOGLE_DRIVE_SCOPE,
            prompt: '',
            callback: (response) => {
                if (response?.error) {
                    reject(response);
                    return;
                }
                googleDriveAccessToken = response.access_token;
                resolve(googleDriveAccessToken);
            }
        });
        googleDriveTokenClient.requestAccessToken({ prompt: googleDriveAccessToken ? '' : 'consent' });
    });
}
async function googleDriveFetch(url, options = {}) {
    if (!googleDriveAccessToken) await requestGoogleDriveAccessToken();
    const response = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${googleDriveAccessToken}`,
            ...(options.headers || {})
        }
    });
    if (response.status === 401) {
        googleDriveAccessToken = null;
        await requestGoogleDriveAccessToken();
        return googleDriveFetch(url, options);
    }
    if (!response.ok) {
        const message = await response.text().catch(() => '');
        throw new Error(message || `Google Drive request failed: ${response.status}`);
    }
    return response;
}
async function findGoogleDriveCollectionFile() {
    if (googleDriveFileId) return googleDriveFileId;
    const query = encodeURIComponent(`name='${GOOGLE_DRIVE_COLLECTION_FILE}' and trashed=false`);
    const response = await googleDriveFetch(`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${query}&fields=files(id,name,modifiedTime)&pageSize=1`);
    const data = await response.json();
    googleDriveFileId = data.files?.[0]?.id || null;
    bibleCollections.cloudFileId = googleDriveFileId;
    return googleDriveFileId;
}
async function readGoogleDriveCollectionPayload() {
    const fileId = await findGoogleDriveCollectionFile();
    if (!fileId) return null;
    const response = await googleDriveFetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`);
    return response.json();
}
async function createGoogleDriveCollectionFile(payload) {
    const boundary = `scoynim_${Date.now()}`;
    const metadata = {
        name: GOOGLE_DRIVE_COLLECTION_FILE,
        parents: ['appDataFolder'],
        mimeType: 'application/json'
    };
    const body = [
        `--${boundary}`,
        'Content-Type: application/json; charset=UTF-8',
        '',
        JSON.stringify(metadata),
        `--${boundary}`,
        'Content-Type: application/json; charset=UTF-8',
        '',
        JSON.stringify(payload),
        `--${boundary}--`,
        ''
    ].join('\r\n');
    const response = await googleDriveFetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
        method: 'POST',
        headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
        body
    });
    const data = await response.json();
    googleDriveFileId = data.id;
    bibleCollections.cloudFileId = googleDriveFileId;
    return googleDriveFileId;
}
async function writeGoogleDriveCollectionPayload(payload) {
    const fileId = await findGoogleDriveCollectionFile();
    if (!fileId) {
        await createGoogleDriveCollectionFile(payload);
        return;
    }
    await googleDriveFetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(payload)
    });
}
async function syncBibleCollectionsToGoogleDrive() {
    if (googleDriveSyncInFlight || bibleCollections.syncProvider !== 'google') return;
    googleDriveSyncInFlight = true;
    bibleCollections.syncState = 'syncing';
    renderBibleCollections();
    try {
        const payload = getBibleCollectionCloudPayload();
        await writeGoogleDriveCollectionPayload(payload);
        bibleCollections.syncState = 'connected';
        bibleCollections.cloudFileId = googleDriveFileId;
        bibleCollections.lastSyncedAt = Date.now();
        bibleCollectionSuppressCloudSync = true;
        saveBibleCollections();
        bibleCollectionSuppressCloudSync = false;
        renderBibleCollections();
    } finally {
        googleDriveSyncInFlight = false;
    }
}
async function connectGoogleDriveCollections() {
    const t = i18n[currentLang];
    bibleCollections.syncProvider = 'google';
    bibleCollections.syncState = 'ready';
    renderBibleCollections();
    try {
        await requestGoogleDriveAccessToken();
        bibleCollections.syncState = 'syncing';
        renderBibleCollections();
        const cloudPayload = await readGoogleDriveCollectionPayload();
        const localPayload = getBibleCollectionCloudPayload();
        const hasLocalData = hasBibleCollectionPayloadData(localPayload);
        const hasCloudData = hasBibleCollectionPayloadData(cloudPayload || {});
        let decision = 'merge';
        if (hasLocalData && hasCloudData) {
            decision = await showBibleSyncChoiceDialog('conflict');
        } else if (hasLocalData && !hasCloudData) {
            decision = await showBibleSyncChoiceDialog('localOnly');
        } else if (!hasLocalData && hasCloudData) {
            decision = await showBibleSyncChoiceDialog('cloudOnly');
        }
        if (decision === 'cancel') {
            bibleCollections.syncProvider = null;
            bibleCollections.syncState = 'local';
            bibleCollectionSuppressCloudSync = true;
            saveBibleCollections();
            bibleCollectionSuppressCloudSync = false;
            renderBibleCollections();
            return;
        }
        if (decision === 'cloud' && cloudPayload) {
            applyBibleCollectionPayload(cloudPayload);
        } else if (decision === 'merge' && cloudPayload) {
            mergeBibleCollectionPayload(cloudPayload);
        } else if (decision === 'local') {
            bibleCollections.updatedAt = Date.now();
        }
        bibleCollections.syncProvider = 'google';
        bibleCollections.syncState = 'connected';
        bibleCollections.lastSyncedAt = Date.now();
        bibleCollectionSuppressCloudSync = true;
        saveBibleCollections();
        bibleCollectionSuppressCloudSync = false;
        renderBibleCollections();
        await syncBibleCollectionsToGoogleDrive();
    } catch (error) {
        console.warn('Google Drive collection sync failed:', error);
        bibleCollections.syncProvider = 'google';
        bibleCollections.syncState = 'disconnected';
        bibleCollectionSuppressCloudSync = true;
        saveBibleCollections();
        bibleCollectionSuppressCloudSync = false;
        renderBibleCollections();
        alert(t.bibleCloudConnectFail);
    }
}
function getCollectionRef(data) {
    const abbr = bookAbbreviations[data.book?.id || data.bookId] || { ko: data.bookKo || '', zh: data.bookZh || '' };
    return {
        ko: `${abbr.ko || data.bookKo || ''} ${data.chapter}:${data.verse}`,
        zh: `${abbr.zh || data.bookZh || ''} ${data.chapter}:${data.verse}`
    };
}
function serializeVerseCollectionData(data) {
    const ref = getCollectionRef(data);
    return {
        id: `${data.book?.id || data.bookId}-${data.chapter}-${data.verse}`,
        bookId: data.book?.id || data.bookId,
        bookKo: data.book?.ko || data.bookKo || '',
        bookZh: data.book?.zh || data.bookZh || '',
        chapter: data.chapter,
        verse: data.verse,
        refKo: ref.ko,
        refZh: ref.zh,
        ko: data.ko || '',
        zh: data.zh || '',
        savedAt: Date.now()
    };
}
function moveCollectionItem(type, id, direction) {
    const list = bibleCollections[type];
    const index = list.findIndex(item => item.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= list.length) return;
    const [item] = list.splice(index, 1);
    list.splice(target, 0, item);
    saveBibleCollections();
    renderBibleCollections();
}
function reorderCollectionItem(type, sourceId, targetId) {
    if (sourceId === targetId) return;
    const list = bibleCollections[type];
    const sourceIndex = list.findIndex(item => item.id === sourceId);
    const targetIndex = list.findIndex(item => item.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const [item] = list.splice(sourceIndex, 1);
    list.splice(targetIndex, 0, item);
    saveBibleCollections();
    renderBibleCollections();
}
function removeCollectionItem(type, id) {
    bibleCollections[type] = bibleCollections[type].filter(item => item.id !== id);
    saveBibleCollections();
    renderBibleCollections();
}
function renderCollectionControls(type, item, index, total) {
    if (!bibleCollectionEditMode) return '';
    return `
        <div class="bible-collection-item-actions">
            <button type="button" class="bible-collection-drag-handle" title="${currentLang === 'ko' ? '드래그하여 정렬' : '拖曳排序'}" aria-label="${currentLang === 'ko' ? '정렬' : '排序'}">
                <span></span><span></span><span></span>
            </button>
            <button type="button" class="bible-collection-remove-btn" onclick="window.removeBibleCollectionItem('${type}', '${item.id}')">✕</button>
        </div>
    `;
}
function renderFavoriteNoteEditor(item) {
    if (bibleFavoriteNoteEditorId !== item.id) return '';
    const t = i18n[currentLang];
    return `
        <div class="bible-favorite-note-editor">
            <textarea id="favorite-note-input-${escapeHtml(item.id)}" placeholder="${escapeHtml(t.bibleFavoriteNotePlaceholder)}"></textarea>
            <div class="bible-favorite-note-editor-actions">
                <button type="button" onclick="window.cancelBibleFavoriteNote(event)">${escapeHtml(t.bibleFavoriteNoteCancel)}</button>
                <button type="button" class="primary" onclick="window.saveBibleFavoriteNote(event, '${item.id}')">${escapeHtml(t.bibleFavoriteNoteSave)}</button>
            </div>
        </div>
    `;
}
function renderFavoriteNotes(item) {
    const t = i18n[currentLang];
    const notes = Array.isArray(item.notes) ? item.notes : [];
    if (!notes.length) return '';
    return `
        <div class="bible-favorite-notes">
            ${notes.map(note => `
                <div class="bible-favorite-note">
                    <div class="bible-favorite-note-main">
                        <div class="bible-favorite-note-text">${escapeHtml(note.text || '')}</div>
                        <div class="bible-favorite-note-date">${new Date(note.createdAt || Date.now()).toLocaleDateString()}</div>
                    </div>
                    ${bibleCollectionEditMode ? `
                        <button type="button" class="bible-favorite-note-remove" onclick="window.removeBibleFavoriteNote(event, '${item.id}', '${note.id}')" aria-label="${escapeHtml(t.bibleFavoriteNoteDelete)}" title="${escapeHtml(t.bibleFavoriteNoteDelete)}">✕</button>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
}
function renderBibleCollectionPanelHeader(type) {
    const t = i18n[currentLang];
    const isFavorites = type === 'favorites';
    const title = isFavorites ? t.bibleFavoritesTitle : t.bibleAnalysesTitle;
    const count = isFavorites ? bibleCollections.favorites.length : bibleCollections.analyses.length;
    const editButton = isFavorites ? `
        <button type="button" class="bible-collection-edit-toggle" id="txt-bible-collection-edit" onclick="window.toggleBibleCollectionEditMode(event)">
            ${escapeHtml(bibleCollectionEditMode ? t.bibleCollectionDone : t.bibleCollectionEdit)}
        </button>
    ` : '';
    return `
        <div class="bible-collection-panel-header">
            <div class="bible-collection-panel-title">
                <span>${escapeHtml(title)}</span>
                <span class="bible-collection-count">${count}</span>
            </div>
            <div class="bible-collection-panel-actions">
                ${editButton}
                <button type="button" class="bible-collection-panel-close" onclick="window.closeBibleCollectionPanel()" aria-label="${escapeHtml(currentLang === 'ko' ? '닫기' : '關閉')}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
            </div>
        </div>
    `;
}
function renderFavoriteCollectionItem(item, index, total) {
    const t = i18n[currentLang];
    const noteButton = bibleCollectionEditMode ? '' : `<button type="button" class="bible-favorite-note-add" onclick="window.openBibleFavoriteNote(event, '${item.id}')" title="${escapeHtml(t.bibleFavoriteNoteAdd)}" aria-label="${escapeHtml(t.bibleFavoriteNoteAdd)}"><span>＋</span><span>${escapeHtml(t.bibleFavoriteNoteAdd)}</span></button>`;
    return `
        <article class="bible-collection-item favorite${bibleCollectionEditMode ? ' editing' : ''}" data-collection-type="favorites" data-collection-id="${escapeHtml(item.id)}">
            <div class="bible-collection-item-head">
                <div>
                    <div class="bible-collection-ref">${escapeHtml(item.refKo)} / ${escapeHtml(item.refZh)}</div>
                    <div class="bible-collection-date">${new Date(item.savedAt || Date.now()).toLocaleDateString()}</div>
                </div>
                ${noteButton}
                ${renderCollectionControls('favorites', item, index, total)}
            </div>
            ${item.ko ? `<div class="bible-collection-verse ko">${escapeHtml(item.ko)}</div>` : ''}
            ${item.zh ? `<div class="bible-collection-verse zh">${escapeHtml(item.zh)}</div>` : ''}
            ${renderFavoriteNoteEditor(item)}
            ${renderFavoriteNotes(item)}
        </article>
    `;
}
function renderAnalysisCollectionItem(item, index, total) {
    const pairs = item.analysis?.pairs || [];
    const koHtml = highlightWordStudyText(item.ko || '', pairs, 'ko');
    const zhHtml = highlightWordStudyText(item.zh || '', pairs, 'zh');
    const rows = pairs.slice(0, 8).map((pair, pairIndex) => `
        <div class="word-study-row compact">
            <div class="word-study-row-marker tone-${pairIndex % 6}"></div>
            <div class="word-study-row-main">
                <div class="word-study-pair">
                    <span>${escapeHtml(pair.ko || '-')}</span>
                    <span>${escapeHtml(pair.zh || '-')}</span>
                </div>
                ${pair.label ? `<div class="word-study-label">${escapeHtml(pair.label)}</div>` : ''}
                ${pair.explanation ? `<div class="word-study-explain">${escapeHtml(pair.explanation)}</div>` : ''}
            </div>
        </div>
    `).join('');
    return `
        <article class="bible-collection-item analysis${bibleCollectionEditMode ? ' editing' : ''}" draggable="${bibleCollectionEditMode}" ondragstart="window.startBibleCollectionDrag(event, 'analyses', '${item.id}')" ondragover="window.allowBibleCollectionDrop(event)" ondrop="window.dropBibleCollectionItem(event, 'analyses', '${item.id}')" ondragend="window.endBibleCollectionDrag(event)">
            <div class="bible-collection-item-head">
                <div>
                    <div class="bible-collection-ref">${escapeHtml(item.refKo)} / ${escapeHtml(item.refZh)}</div>
                    <div class="bible-collection-date">${new Date(item.savedAt || Date.now()).toLocaleDateString()}</div>
                </div>
                ${renderCollectionControls('analyses', item, index, total)}
            </div>
            <div class="word-study-verses saved">
                <div class="word-study-verse ko">${koHtml}</div>
                <div class="word-study-verse zh">${zhHtml}</div>
            </div>
            ${rows ? `<div class="word-study-list saved">${rows}</div>` : ''}
        </article>
    `;
}
function renderBibleCollections() {
    const favoritesList = document.getElementById('bibleFavoritesList');
    const analysesList = document.getElementById('bibleAnalysesList');
    const favoritesCount = document.getElementById('bibleFavoritesCount');
    const analysesCount = document.getElementById('bibleAnalysesCount');
    const syncStatus = document.getElementById('bibleCollectionSyncStatus');
    const syncStatusText = document.getElementById('bibleCollectionSyncStatusText');
    const cloudBtn = document.getElementById('bibleCollectionCloudBtn');
    const manageWrap = document.getElementById('bibleCloudManageWrap');
    const syncTime = document.getElementById('bibleCloudSyncTime');
    if (!favoritesList || !analysesList) return;
    const favoritesWasOpen = favoritesList.classList.contains('show');
    const analysesWasOpen = analysesList.classList.contains('show');
    normalizeBibleCollectionItems();
    favoritesCount.textContent = String(bibleCollections.favorites.length);
    analysesCount.textContent = String(bibleCollections.analyses.length);
    const t = i18n[currentLang];
    const hasCloudProvider = Boolean(bibleCollections.syncProvider);
    const syncState = hasCloudProvider ? (bibleCollections.syncState || 'ready') : 'local';
    syncStatus?.classList.remove('local', 'cloud', 'ready', 'syncing', 'connected', 'disconnected');
    syncStatus?.classList.add(hasCloudProvider ? 'cloud' : 'local');
    if (hasCloudProvider) syncStatus?.classList.add(syncState);
    if (syncStatusText) {
        const providerName = bibleCollections.syncProvider === 'google' ? t.bibleCloudGoogle : t.bibleCloudOneDrive;
        const stateLabel = syncState === 'syncing'
            ? t.bibleSyncSyncing
            : syncState === 'connected'
            ? t.bibleSyncConnected
            : syncState === 'disconnected'
                ? t.bibleSyncDisconnected
                : t.bibleSyncReady;
        syncStatusText.textContent = hasCloudProvider ? `${providerName} ${stateLabel}` : t.bibleSyncLocal;
    }
    if (cloudBtn) cloudBtn.style.display = hasCloudProvider ? 'none' : 'inline-flex';
    if (manageWrap) manageWrap.classList.toggle('show', hasCloudProvider);
    if (syncTime) syncTime.textContent = formatBibleCollectionSyncTime(bibleCollections.lastSyncedAt);
    const menuEdit = document.getElementById('txt-bible-collection-edit');
    if (menuEdit) menuEdit.textContent = bibleCollectionEditMode ? t.bibleCollectionDone : t.bibleCollectionEdit;
    document.getElementById('bibleCollectionSection')?.classList.toggle('collection-editing', bibleCollectionEditMode);
    const favoriteContent = bibleCollections.favorites.length
        ? bibleCollections.favorites.map((item, index) => renderFavoriteCollectionItem(item, index, bibleCollections.favorites.length)).join('')
        : `<div class="bible-collection-empty">${t.bibleFavoritesEmpty}</div>`;
    favoritesList.innerHTML = `
        ${renderBibleCollectionPanelHeader('favorites')}
        <div class="bible-collection-panel-body">${favoriteContent}</div>
    `;
    const analysisContent = bibleCollections.analyses.length
        ? bibleCollections.analyses.map((item, index) => renderAnalysisCollectionItem(item, index, bibleCollections.analyses.length)).join('')
        : `<div class="bible-collection-empty">${t.bibleAnalysesEmpty}</div>`;
    analysesList.innerHTML = `
        ${renderBibleCollectionPanelHeader('analyses')}
        <div class="bible-collection-panel-body">${analysisContent}</div>
    `;
    if (favoritesWasOpen || analysesWasOpen) {
        const openList = favoritesWasOpen ? favoritesList : analysesList;
        openList.classList.add('show');
        openList.closest('.bible-collection-card')?.classList.add('expanded-card');
        openList.previousElementSibling?.classList.add('expanded');
        document.getElementById('bibleCollectionSection')?.classList.add('collection-panel-open');
    }
    syncUiScrollLock();
}
window.toggleBibleCollectionPanel = (type) => {
    const targetId = type === 'analyses' ? 'bibleAnalysesList' : 'bibleFavoritesList';
    let list = document.getElementById(targetId);
    if (!list) return;
    const willOpen = !list.classList.contains('show');
    if (type !== 'favorites' && bibleCollectionEditMode) {
        bibleCollectionEditMode = false;
        bibleFavoriteNoteEditorId = null;
        renderBibleCollections();
        list = document.getElementById(targetId);
        if (!list) return;
    }
    ['bibleFavoritesList', 'bibleAnalysesList'].forEach(id => {
        const panel = document.getElementById(id);
        panel?.classList.remove('show');
        panel?.closest('.bible-collection-card')?.classList.remove('expanded-card');
        panel?.previousElementSibling?.classList.remove('expanded');
    });
    document.getElementById('bibleCollectionSection')?.classList.toggle('collection-panel-open', willOpen);
    if (willOpen) {
        list.classList.add('show');
        list.closest('.bible-collection-card')?.classList.add('expanded-card');
        list.previousElementSibling?.classList.add('expanded');
    }
    syncUiScrollLock();
};
window.closeBibleCollectionPanel = () => {
    ['bibleFavoritesList', 'bibleAnalysesList'].forEach(id => {
        const panel = document.getElementById(id);
        panel?.classList.remove('show');
        panel?.closest('.bible-collection-card')?.classList.remove('expanded-card');
        panel?.previousElementSibling?.classList.remove('expanded');
    });
    document.getElementById('bibleCollectionSection')?.classList.remove('collection-panel-open');
    if (bibleCollectionEditMode || bibleFavoriteNoteEditorId) {
        bibleCollectionEditMode = false;
        bibleFavoriteNoteEditorId = null;
        renderBibleCollections();
    }
    syncUiScrollLock();
};
window.moveBibleCollectionItem = (type, id, direction) => moveCollectionItem(type, id, direction);
window.removeBibleCollectionItem = (type, id) => removeCollectionItem(type, id);
window.toggleBibleCollectionEditMode = (event) => {
    event?.stopPropagation();
    bibleCollectionEditMode = !bibleCollectionEditMode;
    bibleFavoriteNoteEditorId = null;
    renderBibleCollections();
};
window.startBibleCollectionDrag = (event, type, id) => {
    if (!bibleCollectionEditMode) {
        event.preventDefault();
        return;
    }
    bibleCollectionDragState = { type, id };
    event.currentTarget.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', id);
};
window.allowBibleCollectionDrop = (event) => {
    if (!bibleCollectionEditMode || !bibleCollectionDragState) return;
    event.preventDefault();
};
window.dropBibleCollectionItem = (event, type, id) => {
    if (!bibleCollectionEditMode || !bibleCollectionDragState || bibleCollectionDragState.type !== type) return;
    event.preventDefault();
    reorderCollectionItem(type, bibleCollectionDragState.id, id);
};
window.endBibleCollectionDrag = (event) => {
    event.currentTarget?.classList.remove('dragging');
    bibleCollectionDragState = null;
};
function getFavoriteDragItems() {
    return [...document.querySelectorAll('#bibleFavoritesList .bible-collection-item.favorite')];
}
function getFavoriteDragPanelBody() {
    return document.querySelector('#bibleFavoritesList .bible-collection-panel-body');
}
function animateFavoriteDragSwap(mutator) {
    const items = getFavoriteDragItems();
    const first = new Map(items.map(item => [item, item.getBoundingClientRect()]));
    mutator();
    getFavoriteDragItems().forEach(item => {
        const before = first.get(item);
        if (!before) return;
        const after = item.getBoundingClientRect();
        const dx = before.left - after.left;
        const dy = before.top - after.top;
        if (!dx && !dy) return;
        item.style.transition = 'none';
        item.style.transform = `translate(${dx}px, ${dy}px)`;
        requestAnimationFrame(() => {
            item.style.transition = '';
            item.style.transform = '';
        });
    });
}
function setFavoriteDragDomOrder() {
    const panelBody = getFavoriteDragPanelBody();
    if (!panelBody) return;
    bibleCollections.favorites
        .map(saved => panelBody.querySelector(`.bible-collection-item.favorite[data-collection-id="${CSS.escape(saved.id)}"]`))
        .filter(Boolean)
        .forEach(el => panelBody.appendChild(el));
}
function moveFavoriteItemToIndex(insertIndex) {
    if (!bibleFavoritePointerDrag?.active) return;
    const sourceId = bibleFavoritePointerDrag.id;
    const list = bibleCollections.favorites;
    const sourceIndex = list.findIndex(item => item.id === sourceId);
    if (sourceIndex < 0) return;
    const boundedIndex = Math.max(0, Math.min(insertIndex, list.length));
    const finalIndex = sourceIndex < boundedIndex ? boundedIndex - 1 : boundedIndex;
    if (sourceIndex === finalIndex) return;
    const [item] = list.splice(sourceIndex, 1);
    list.splice(finalIndex, 0, item);
    animateFavoriteDragSwap(setFavoriteDragDomOrder);
}
function moveFavoriteItemByPointer(clientY) {
    if (!bibleFavoritePointerDrag?.active) return;
    const sourceEl = bibleFavoritePointerDrag.element;
    const sourceId = bibleFavoritePointerDrag.id;
    const list = bibleCollections.favorites;
    let insertIndex = list.length;
    getFavoriteDragItems().forEach(item => {
        if (item === sourceEl) return;
        const targetId = item.dataset.collectionId;
        const targetIndex = list.findIndex(saved => saved.id === targetId);
        if (targetIndex < 0 || targetId === sourceId) return;
        const rect = item.getBoundingClientRect();
        if (clientY < rect.top + rect.height / 2 && insertIndex === list.length) {
            insertIndex = targetIndex;
        }
    });
    moveFavoriteItemToIndex(insertIndex);
}
function clearFavoritePointerDragTimer() {
    if (!bibleFavoritePointerDrag?.timer) return;
    window.clearTimeout(bibleFavoritePointerDrag.timer);
    bibleFavoritePointerDrag.timer = null;
}
function updateFavoriteDragGhost() {
    const dragState = bibleFavoritePointerDrag;
    if (!dragState?.active || !dragState.ghost) return;
    dragState.raf = null;
    const dx = dragState.currentX - dragState.startX;
    const dy = dragState.currentY - dragState.startY;
    dragState.ghost.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
}
function scheduleFavoriteDragGhostUpdate() {
    const dragState = bibleFavoritePointerDrag;
    if (!dragState?.active || dragState.raf) return;
    dragState.raf = requestAnimationFrame(updateFavoriteDragGhost);
}
function runFavoriteDragAutoScroll() {
    const dragState = bibleFavoritePointerDrag;
    if (!dragState?.active || dragState.scrollRaf) return;
    const tick = () => {
        const current = bibleFavoritePointerDrag;
        const panelBody = current?.panelBody;
        if (!current?.active || !panelBody) return;
        const rect = panelBody.getBoundingClientRect();
        const edgeSize = Math.min(92, Math.max(56, rect.height * 0.18));
        let speed = 0;
        if (current.currentY < rect.top + edgeSize) {
            speed = -Math.ceil((1 - Math.max(0, current.currentY - rect.top) / edgeSize) * 18);
        } else if (current.currentY > rect.bottom - edgeSize) {
            speed = Math.ceil((1 - Math.max(0, rect.bottom - current.currentY) / edgeSize) * 18);
        }
        if (speed) {
            panelBody.scrollTop += speed;
            moveFavoriteItemByPointer(current.currentY);
            current.scrollRaf = requestAnimationFrame(tick);
        } else {
            current.scrollRaf = null;
        }
    };
    dragState.scrollRaf = requestAnimationFrame(tick);
}
function activateFavoritePointerDrag(event, item, id) {
    if (!bibleFavoritePointerDrag || bibleFavoritePointerDrag.id !== id) return;
    const rect = item.getBoundingClientRect();
    const ghost = item.cloneNode(true);
    ghost.classList.add('favorite-drag-ghost');
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    ghost.style.left = `${rect.left}px`;
    ghost.style.top = `${rect.top}px`;
    ghost.style.transform = 'translate3d(0, 0, 0)';
    bibleFavoritePointerDrag.active = true;
    bibleFavoritePointerDrag.currentX = event.clientX;
    bibleFavoritePointerDrag.currentY = event.clientY;
    bibleFavoritePointerDrag.panelBody = getFavoriteDragPanelBody();
    bibleFavoritePointerDrag.ghost = ghost;
    item.classList.add('dragging', 'favorite-placeholder');
    document.body.appendChild(ghost);
    document.body?.classList.add('favorite-collection-dragging');
    try {
        item.setPointerCapture?.(event.pointerId);
    } catch (_) {}
}
function startFavoritePointerDrag(event, item) {
    const id = item?.dataset.collectionId;
    if (!id) return;
    const delay = event.pointerType === 'mouse' ? 0 : 260;
    bibleFavoritePointerDrag = {
        id,
        element: item,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        currentX: event.clientX,
        currentY: event.clientY,
        active: false,
        moved: false,
        originalOrder: bibleCollections.favorites.map(saved => saved.id),
        ghost: null,
        panelBody: null,
        raf: null,
        scrollRaf: null,
        timer: null
    };
    if (delay) {
        bibleFavoritePointerDrag.timer = window.setTimeout(() => {
            activateFavoritePointerDrag(event, item, id);
        }, delay);
    } else {
        activateFavoritePointerDrag(event, item, id);
    }
}
function finishFavoritePointerDrag(saveChanges = false) {
    const dragState = bibleFavoritePointerDrag;
    clearFavoritePointerDragTimer();
    if (dragState?.raf) cancelAnimationFrame(dragState.raf);
    if (dragState?.scrollRaf) cancelAnimationFrame(dragState.scrollRaf);
    if (dragState?.active && saveChanges) {
        saveBibleCollections();
    } else if (dragState?.active && Array.isArray(dragState.originalOrder)) {
        const byId = new Map(bibleCollections.favorites.map(item => [item.id, item]));
        bibleCollections.favorites = dragState.originalOrder.map(id => byId.get(id)).filter(Boolean);
        setFavoriteDragDomOrder();
    }
    dragState?.ghost?.remove();
    dragState?.element?.classList.remove('dragging', 'favorite-placeholder');
    document.body?.classList.remove('favorite-collection-dragging');
    bibleFavoritePointerDrag = null;
}
document.addEventListener('pointerdown', (event) => {
    if (!bibleCollectionEditMode) return;
    if (event.button !== undefined && event.button !== 0) return;
    const dragHandle = event.target.closest('.bible-collection-drag-handle');
    if (event.target.closest('button, input, textarea, select, a') && !dragHandle) return;
    const item = event.target.closest('#bibleFavoritesList .bible-collection-item.favorite.editing');
    if (!item) return;
    if (dragHandle) event.preventDefault();
    startFavoritePointerDrag(event, item);
});
document.addEventListener('pointermove', (event) => {
    if (!bibleFavoritePointerDrag) return;
    const dx = Math.abs(event.clientX - bibleFavoritePointerDrag.startX);
    const dy = Math.abs(event.clientY - bibleFavoritePointerDrag.startY);
    if (!bibleFavoritePointerDrag.active && (dx > 10 || dy > 10)) {
        finishFavoritePointerDrag(false);
        return;
    }
    if (!bibleFavoritePointerDrag.active) return;
    event.preventDefault();
    bibleFavoritePointerDrag.currentX = event.clientX;
    bibleFavoritePointerDrag.currentY = event.clientY;
    scheduleFavoriteDragGhostUpdate();
    moveFavoriteItemByPointer(event.clientY);
    runFavoriteDragAutoScroll();
});
document.addEventListener('pointerup', () => {
    finishFavoritePointerDrag(Boolean(bibleFavoritePointerDrag?.active));
});
document.addEventListener('pointercancel', () => {
    finishFavoritePointerDrag(false);
});
window.openBibleFavoriteNote = (event, id) => {
    event?.stopPropagation();
    bibleFavoriteNoteEditorId = bibleFavoriteNoteEditorId === id ? null : id;
    renderBibleCollections();
    requestAnimationFrame(() => {
        document.getElementById(`favorite-note-input-${id}`)?.focus();
    });
};
window.cancelBibleFavoriteNote = (event) => {
    event?.stopPropagation();
    bibleFavoriteNoteEditorId = null;
    renderBibleCollections();
};
window.saveBibleFavoriteNote = (event, id) => {
    event?.stopPropagation();
    const input = document.getElementById(`favorite-note-input-${id}`);
    const text = input?.value.trim();
    if (!text) return;
    const item = bibleCollections.favorites.find(saved => saved.id === id);
    if (!item) return;
    item.notes = Array.isArray(item.notes) ? item.notes : [];
    item.notes.push({
        id: `note-${Date.now()}`,
        text,
        createdAt: Date.now()
    });
    bibleFavoriteNoteEditorId = null;
    saveBibleCollections();
    renderBibleCollections();
};
window.removeBibleFavoriteNote = (event, favoriteId, noteId) => {
    event?.stopPropagation();
    if (!bibleCollectionEditMode) return;
    const item = bibleCollections.favorites.find(saved => saved.id === favoriteId);
    if (!item || !Array.isArray(item.notes)) return;
    item.notes = item.notes.filter(note => note.id !== noteId);
    saveBibleCollections();
    renderBibleCollections();
};
window.toggleBibleCloudMenu = (event) => {
    event?.stopPropagation();
    document.getElementById('bibleCloudMenu')?.classList.toggle('show');
};
window.connectBibleCollection = async (provider = 'google') => {
    document.getElementById('bibleCloudMenu')?.classList.remove('show');
    document.getElementById('bibleCloudManageMenu')?.classList.remove('show');
    if (provider !== 'google') return;
    await connectGoogleDriveCollections();
};
window.toggleBibleCollectionDataMenu = (event) => {
    event?.stopPropagation();
    document.getElementById('bibleCloudManageMenu')?.classList.toggle('show');
};
window.logoutBibleCollectionCloud = (event) => {
    event?.stopPropagation();
    if (googleDriveAccessToken && window.google?.accounts?.oauth2?.revoke) {
        window.google.accounts.oauth2.revoke(googleDriveAccessToken, () => {});
    }
    window.clearTimeout(googleDriveSyncTimer);
    googleDriveAccessToken = null;
    googleDriveFileId = null;
    bibleCollections.syncProvider = null;
    bibleCollections.syncState = 'local';
    bibleCollections.cloudFileId = null;
    document.getElementById('bibleCloudManageMenu')?.classList.remove('show');
    bibleCollectionSuppressCloudSync = true;
    saveBibleCollections();
    bibleCollectionSuppressCloudSync = false;
    renderBibleCollections();
};
document.addEventListener('click', (event) => {
    const menu = document.getElementById('bibleCloudMenu');
    if (!menu?.classList.contains('show')) return;
    if (event.target.closest('.bible-collection-sync')) return;
    menu.classList.remove('show');
});
document.addEventListener('click', (event) => {
    const menu = document.getElementById('bibleCloudManageMenu');
    if (!menu?.classList.contains('show')) return;
    if (event.target.closest('.bible-cloud-manage-wrap')) return;
    menu.classList.remove('show');
});
document.addEventListener('click', (event) => {
    const openPanel = document.querySelector('.bible-collection-list.show');
    if (!openPanel) return;
    if (event.target.closest('.bible-collection-list') || event.target.closest('.bible-collection-card-header')) return;
    window.closeBibleCollectionPanel();
});
window.saveFavoriteFromActiveVerse = () => {
    const data = getActiveWordStudyVerseData();
    if (!data) return;
    const item = serializeVerseCollectionData(data);
    const previous = bibleCollections.favorites.find(saved => saved.id === item.id);
    if (previous?.notes) item.notes = previous.notes;
    bibleCollections.favorites = bibleCollections.favorites.filter(saved => saved.id !== item.id);
    bibleCollections.favorites.unshift(item);
    saveBibleCollections();
    renderBibleCollections();
    showFavoriteHeartAnimation(activeWordStudyVerseElement);
    clearWordStudyFocus();
};
function showFavoriteHeartAnimation(anchorEl) {
    document.querySelectorAll('.favorite-heart-burst').forEach(el => el.remove());
    const burst = document.createElement('div');
    burst.className = 'favorite-heart-burst';
    burst.textContent = currentLang === 'ko' ? '좋아하는 구절에 저장했습니다' : '已加入喜愛';
    if (anchorEl) {
        const rect = anchorEl.getBoundingClientRect();
        burst.style.left = `${Math.max(96, Math.min(rect.left + rect.width / 2, window.innerWidth - 96))}px`;
        burst.style.top = `${Math.max(72, Math.min(rect.top + rect.height / 2, window.innerHeight - 72))}px`;
    }
    document.body.appendChild(burst);
    window.setTimeout(() => burst.remove(), 1400);
}
window.saveCurrentWordStudyAnalysis = () => {
    if (!currentWordStudySavedPayload) return;
    const item = {
        ...currentWordStudySavedPayload,
        id: `analysis-${currentWordStudySavedPayload.bookId}-${currentWordStudySavedPayload.chapter}-${currentWordStudySavedPayload.verse}`,
        savedAt: Date.now()
    };
    bibleCollections.analyses = bibleCollections.analyses.filter(saved => saved.id !== item.id);
    bibleCollections.analyses.unshift(item);
    saveBibleCollections();
    renderBibleCollections();
    alert(currentLang === 'ko' ? '분석을 저장했습니다.' : '已儲存分析。');
};
function createWordStudyPanel() {
    let overlay = document.getElementById('wordStudyOverlay');
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'wordStudyOverlay';
    overlay.className = 'word-study-overlay';
    overlay.innerHTML = `
        <div class="word-study-panel" onclick="event.stopPropagation()">
            <div class="word-study-header">
                <div>
                    <div class="word-study-title">${currentLang === 'ko' ? '성경 원문 흐름 분석' : '聖經經文逐詞解析'}</div>
                    <div class="word-study-ref" id="wordStudyRef"></div>
                </div>
                <button type="button" class="word-study-close" onclick="window.closeWordStudyPanel()">✕</button>
            </div>
            <div class="word-study-body" id="wordStudyBody"></div>
        </div>
    `;
    overlay.addEventListener('click', () => window.closeWordStudyPanel());
    document.body.appendChild(overlay);
    return overlay;
}
window.closeWordStudyPanel = () => {
    document.getElementById('wordStudyOverlay')?.classList.remove('show');
    clearWordStudyFocus();
    currentWordStudySavedPayload = null;
};
function getActiveWordStudyVerseData() {
    const element = activeWordStudyVerseElement;
    if (!element) return null;
    return {
        element,
        verse: element.dataset.verse,
        ko: decodeURIComponent(element.dataset.ko || ''),
        zh: decodeURIComponent(element.dataset.zh || ''),
        book: currentBibleBook,
        chapter: currentBibleChapter
    };
}
function highlightWordStudyText(text, pairs, langKey) {
    let html = escapeHtml(text);
    const seen = new Set();
    const terms = pairs
        .map((pair, index) => ({ term: pair[langKey], index }))
        .filter(({ term }) => term && String(term).trim())
        .map(({ term, index }) => ({ term: String(term).trim(), index }))
        .sort((a, b) => b.term.length - a.term.length);
    for (const { term, index } of terms) {
        const key = `${langKey}:${term}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const safeTerm = escapeHtml(term);
        if (!safeTerm || !html.includes(safeTerm)) continue;
        const cls = `word-study-token tone-${index % 6}`;
        html = html.split(safeTerm).join(`<span class="${cls}">${safeTerm}</span>`);
    }
    return html;
}
function normalizeWordStudyPairs(aiText) {
    const jsonText = aiText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(jsonText);
    const rawPairs = Array.isArray(parsed) ? parsed : (parsed.pairs || []);
    return {
        summary: parsed.summary || '',
        pairs: rawPairs
            .filter((item) => item && (item.ko || item.zh || item.korean || item.chinese))
            .map((item) => ({
                ko: item.ko || item.korean || '',
                zh: item.zh || item.chinese || '',
                label: item.label || item.pos || item.type || '',
                explanation: item.explanation || item.note || item.meaning || ''
            }))
            .slice(0, 24)
    };
}
function renderWordStudyResult(data, analysis) {
    const body = document.getElementById('wordStudyBody');
    const pairs = analysis.pairs || [];
    const koHtml = highlightWordStudyText(data.ko, pairs, 'ko');
    const zhHtml = highlightWordStudyText(data.zh, pairs, 'zh');
    const serialized = serializeVerseCollectionData(data);
    currentWordStudySavedPayload = {
        ...serialized,
        analysis
    };
    const rows = pairs.length
        ? pairs.map((pair, index) => `
            <div class="word-study-row">
                <div class="word-study-row-marker tone-${index % 6}"></div>
                <div class="word-study-row-main">
                    <div class="word-study-pair">
                        <span>${escapeHtml(pair.ko || '-')}</span>
                        <span>${escapeHtml(pair.zh || '-')}</span>
                    </div>
                    ${pair.label ? `<div class="word-study-label">${escapeHtml(pair.label)}</div>` : ''}
                    ${pair.explanation ? `<div class="word-study-explain">${escapeHtml(pair.explanation)}</div>` : ''}
                </div>
            </div>
        `).join('')
        : `<div class="word-study-empty">${currentLang === 'ko' ? '분석 결과가 비어 있습니다.' : '解析結果為空。'}</div>`;
    body.innerHTML = `
        <div class="word-study-verses">
            <div class="word-study-verse ko">${koHtml}</div>
            <div class="word-study-verse zh">${zhHtml}</div>
        </div>
        <div class="word-study-list">${rows}</div>
        <div class="word-study-save-row">
            <button type="button" class="word-study-save-btn" onclick="window.saveCurrentWordStudyAnalysis()">
                ${currentLang === 'ko' ? '분석 저장' : '儲存分析'}
            </button>
        </div>
    `;
}
window.openWordStudyPanel = async () => {
    if (bibleDisplayMode !== 'both') {
        clearWordStudyFocus();
        return;
    }
    const data = getActiveWordStudyVerseData();
    if (!data) return;
    currentWordStudySavedPayload = null;
    hideWordStudyActionBubble();
    const overlay = createWordStudyPanel();
    const body = document.getElementById('wordStudyBody');
    const ref = document.getElementById('wordStudyRef');
    const abbr = bookAbbreviations[data.book?.id] || { ko: '', zh: '' };
    if (ref) ref.textContent = `${abbr.ko} ${data.chapter}:${data.verse} / ${abbr.zh} ${data.chapter}:${data.verse}`;
    if (body) {
        body.innerHTML = `
            <div class="word-study-loading">
                <div class="word-study-spinner"></div>
                <div>${currentLang === 'ko' ? 'AI가 구절을 분석하고 있습니다...' : 'AI 正在解析所選經文...'}</div>
            </div>
        `;
    }
    overlay.classList.add('show');
    const prompt = `你是聖經中韓文逐詞解析助手。請分析以下同一節經文的韓文與中文對應。
請只回傳 JSON，不要 markdown。格式：
{
  "summary": "一句話說明句子核心",
  "pairs": [
    {"ko":"韓文詞或短語","zh":"對應中文詞或短語","label":"詞性或語法功能","explanation":"簡短解釋"}
  ]
}
規則：
- pairs 依照經文出現順序排列。
- ko 與 zh 請盡量使用原經文中實際出現的字詞，方便前端標色。
- 可以用短語，不必逐字硬切，但要有教學價值。
- explanation 使用繁體中文，若需要可補充韓文敬語、時態、連接語尾、名詞角色。
- 最多 16 組。
韓文：${data.ko}
中文：${data.zh}`;
    try {
        const response = await fetchAiWorker(prompt);
        if (!response.ok) throw new Error('API Error');
        const payload = await response.json();
        const aiText = payload.text || payload.response || payload.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const analysis = normalizeWordStudyPairs(aiText);
        renderWordStudyResult(data, analysis);
    } catch (error) {
        if (body) {
            body.innerHTML = `
                <div class="word-study-error">
                    ${currentLang === 'ko' ? '분석에 실패했습니다.' : '解析失敗。'}<br>
                    <span>${escapeHtml(error.message || String(error))}</span>
                </div>
            `;
        }
    }
};
// 退出複製模式
window.exitCopyMode = () => {
    isCopyModeActive = false;
    selectedVerses.clear();
    // 移除所有選中狀態
    document.querySelectorAll('.bible-verse.selected').forEach(el => {
        el.classList.remove('selected');
    });
    // 隱藏複製模式面板
    const panel = document.getElementById('copyModePanel');
    const hint = document.getElementById('copyModeHint');
    const rangeStart = document.getElementById('copyModeRangeStart');
    const rangeEnd = document.getElementById('copyModeRangeEnd');
    if (panel) panel.classList.remove('show');
    if (hint) hint.classList.remove('show');
    // 隱藏複製小圖示
    hideCopyFabButton();
    // 清空範圍輸入
    if (rangeStart) rangeStart.value = '';
    if (rangeEnd) rangeEnd.value = '';
};
// 切換經文選中狀態
function toggleVerseSelection(element) {
    const verse = parseInt(element.dataset.verse);
    if (selectedVerses.has(verse)) {
        selectedVerses.delete(verse);
        element.classList.remove('selected');
    } else {
        selectedVerses.add(verse);
        element.classList.add('selected');
    }
    updateSelectedCount();
}
// 更新選中計數
function updateSelectedCount() {
    const count = selectedVerses.size;
    const countEl = document.getElementById('copyModeSelectedCount');
    if (countEl) countEl.textContent = count;
    // 如果沒有選中任何經文
    if (count === 0) {
        // 禁用反白複製按鈕
        const copySelectedBtn = document.getElementById('copySelectedBtn');
        if (copySelectedBtn) copySelectedBtn.disabled = true;
        // 隱藏複製小圖示並退出複製模式
        hideCopyFabButton();
        isCopyModeActive = false;
        // 如果面板開著，也關閉它
        const panel = document.getElementById('copyModePanel');
        if (panel) panel.classList.remove('show');
    } else {
        // 啟用反白複製按鈕
        const copySelectedBtn = document.getElementById('copySelectedBtn');
        if (copySelectedBtn) copySelectedBtn.disabled = false;
    }
}
// 更新複製模式面板語言
function updateCopyModePanelLanguage() {
    const isKo = currentLang === 'ko';
    const el1 = document.getElementById('copyModePanelTitle');
    const el2 = document.getElementById('copyModeSelectedText');
    const el3 = document.getElementById('copyModeLangTitle');
    const el4 = document.getElementById('copyModeSelectionTitle');
    const el5 = document.getElementById('copySelectedBtnText');
    const el6 = document.getElementById('copyModeRangeTitle');
    const el7 = document.getElementById('copyRangeBtnText');
    const el8 = document.getElementById('copyModeChapterTitle');
    const el9 = document.getElementById('copyChapterBtnText');
    const rangeStart = document.getElementById('copyModeRangeStart');
    const rangeEnd = document.getElementById('copyModeRangeEnd');
    if (el1) el1.textContent = isKo ? '복사 모드' : '複製模式';
    if (el2) el2.innerHTML = isKo
        ? `<span class="copy-mode-selected-count" id="copyModeSelectedCount">${selectedVerses.size}</span>절 선택됨`
        : `已選擇 <span class="copy-mode-selected-count" id="copyModeSelectedCount">${selectedVerses.size}</span> 節經文`;
    if (el3) el3.textContent = isKo ? '📝 언어 선택' : '📝 語言選擇';
    if (el4) el4.textContent = isKo ? '✅ 선택 복사' : '✅ 反白複製';
    if (el5) el5.textContent = isKo ? '선택한 구절 복사' : '複製選取的經文';
    if (el6) el6.textContent = isKo ? '📋 범위 복사' : '📋 範圍複製';
    if (el7) el7.textContent = isKo ? '지정 범위 복사' : '複製指定範圍';
    if (el8) el8.textContent = isKo ? '📖 전체 장 복사' : '📖 全章複製';
    if (el9) el9.textContent = isKo ? '전체 장 복사' : '複製整章經文';
    // 更新範圍輸入框的placeholder
    if (rangeStart) rangeStart.placeholder = isKo ? '시작' : '起';
    if (rangeEnd) rangeEnd.placeholder = isKo ? '끝' : '迄';
}
// 檢查語言選擇是否有效
function validateLangSelection() {
    const zhEl = document.getElementById('copyLangZh');
    const koEl = document.getElementById('copyLangKo');
    if (!zhEl || !koEl) return true; // 元素不存在時預設通過
    const zh = zhEl.checked;
    const ko = koEl.checked;
    if (!zh && !ko) {
        const msg = currentLang === 'ko'
            ? '최소 하나의 언어를 선택해주세요.'
            : '請至少選擇一種語言。';
        alert(msg);
        return false;
    }
    return true;
}
// 獲取選中的語言
function getSelectedLangs() {
    const zhEl = document.getElementById('copyLangZh');
    const koEl = document.getElementById('copyLangKo');
    return {
        zh: zhEl ? zhEl.checked : true,
        ko: koEl ? koEl.checked : true
    };
}
// 複製選取的經文
window.copySelectedVerses = () => {
    if (!validateLangSelection()) return;
    if (selectedVerses.size === 0) {
        const msg = currentLang === 'ko' ? '구절을 선택해주세요.' : '請選擇經文。';
        alert(msg);
        return;
    }
    const langs = getSelectedLangs();
    const sortedVerses = Array.from(selectedVerses).sort((a, b) => a - b);
    const bookId = currentBibleBook.id;
    const chapter = currentBibleChapter;
    const content = bibleContent[bookId][chapter];
    const abbr = bookAbbreviations[bookId];
    let textToCopy = '';
    sortedVerses.forEach(verseNum => {
        const verseData = content.find(v => v.verse === verseNum);
        if (verseData) {
            if (langs.ko && langs.zh) {
                textToCopy += `${abbr.ko} ${chapter}:${verseNum} ${verseData.ko}\n`;
                textToCopy += `${abbr.zh} ${chapter}:${verseNum} ${verseData.zh}\n\n`;
            } else if (langs.ko) {
                textToCopy += `${abbr.ko} ${chapter}:${verseNum} ${verseData.ko}\n`;
            } else if (langs.zh) {
                textToCopy += `${abbr.zh} ${chapter}:${verseNum} ${verseData.zh}\n`;
            }
        }
    });
    copyToClipboard(textToCopy.trim());
};
// 複製指定範圍
window.copyRangeVerses = () => {
    if (!validateLangSelection()) return;
    const startEl = document.getElementById('copyModeRangeStart');
    const endEl = document.getElementById('copyModeRangeEnd');
    if (!startEl || !endEl) return;
    const start = parseInt(startEl.value);
    const end = parseInt(endEl.value);
    if (!start || !end || start > end) {
        const msg = currentLang === 'ko' ? '유효한 범위를 입력해주세요.' : '請輸入有效的範圍。';
        alert(msg);
        return;
    }
    const langs = getSelectedLangs();
    const bookId = currentBibleBook.id;
    const chapter = currentBibleChapter;
    const content = bibleContent[bookId][chapter];
    const abbr = bookAbbreviations[bookId];
    let textToCopy = '';
    for (let v = start; v <= end; v++) {
        const verseData = content.find(item => item.verse === v);
        if (verseData) {
            if (langs.ko && langs.zh) {
                textToCopy += `${abbr.ko} ${chapter}:${v} ${verseData.ko}\n`;
                textToCopy += `${abbr.zh} ${chapter}:${v} ${verseData.zh}\n\n`;
            } else if (langs.ko) {
                textToCopy += `${abbr.ko} ${chapter}:${v} ${verseData.ko}\n`;
            } else if (langs.zh) {
                textToCopy += `${abbr.zh} ${chapter}:${v} ${verseData.zh}\n`;
            }
        }
    }
    if (!textToCopy.trim()) {
        const msg = currentLang === 'ko' ? '해당 범위에 구절이 없습니다.' : '該範圍內沒有經文。';
        alert(msg);
        return;
    }
    copyToClipboard(textToCopy.trim());
};
// 複製整章
window.copyWholeChapter = () => {
    if (!validateLangSelection()) return;
    const langs = getSelectedLangs();
    const bookId = currentBibleBook.id;
    const chapter = currentBibleChapter;
    const content = bibleContent[bookId][chapter];
    const abbr = bookAbbreviations[bookId];
    let textToCopy = '';
    content.forEach(item => {
        if (item.verse) {
            if (langs.ko && langs.zh) {
                textToCopy += `${abbr.ko} ${chapter}:${item.verse} ${item.ko}\n`;
                textToCopy += `${abbr.zh} ${chapter}:${item.verse} ${item.zh}\n\n`;
            } else if (langs.ko) {
                textToCopy += `${abbr.ko} ${chapter}:${item.verse} ${item.ko}\n`;
            } else if (langs.zh) {
                textToCopy += `${abbr.zh} ${chapter}:${item.verse} ${item.zh}\n`;
            }
        }
    });
    copyToClipboard(textToCopy.trim());
};
// 通用複製函數
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const t = i18n[currentLang];
        alert(t.msgCopied || '已複製！');
        window.exitCopyMode();
    }).catch(err => {
        // 備用方法
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        const t = i18n[currentLang];
        alert(t.msgCopied || '已複製！');
        window.exitCopyMode();
    });
}
// ===== AI 助手面板 =====
const AI_PANEL_CACHE_KEY = 'ai_panel_results';
const AI_PANEL_CACHE_DURATION = 60 * 60 * 1000; // 1小時
const BIBLE_FONT_KEY = 'bible_font_mode';
const SERIF_FONT_STYLESHEET_ID = 'serifFontStylesheet';
const SERIF_FONT_STYLESHEET_HREF = `/fonts-serif.css?v=${encodeURIComponent(APP_VERSION)}`;
function getBibleFontMode() {
    return localStorage.getItem(BIBLE_FONT_KEY) === 'serif' ? 'serif' : 'sans';
}
function getBibleFontLabel(mode = getBibleFontMode()) {
    if (currentLang === 'ko') return mode === 'sans' ? '고딕체' : '명조체';
    return mode === 'sans' ? '黑體' : '宋體';
}
function applyBibleFontPreference(mode = getBibleFontMode()) {
    const normalizedMode = mode === 'serif' ? 'serif' : 'sans';
    localStorage.setItem(BIBLE_FONT_KEY, normalizedMode);
    if (document.body) document.body.dataset.bibleFont = normalizedMode;
    return normalizedMode;
}
function loadSerifFontStylesheet() {
    if (document.getElementById(SERIF_FONT_STYLESHEET_ID)) return;
    const link = document.createElement('link');
    link.id = SERIF_FONT_STYLESHEET_ID;
    link.rel = 'stylesheet';
    link.href = SERIF_FONT_STYLESHEET_HREF;
    document.head.appendChild(link);
}
// 首頁載入完成後，瀏覽器閒置時直接載入並解析宋體 CSS
// （只對宋體用戶生效；首頁不會用到 Noto Serif，所以載入後不會影響首頁渲染）
// 在 Safari 上特別重要：Safari 不太理 prefetch，必須真的載 CSS 才會被快取並預先解析
function preloadSerifFontIfPreferred() {
    if (getBibleFontMode() !== 'serif') return;
    // 已安裝才預載；未安裝就不要載（HTML head 注入腳本只在已安裝時才注入）
    try { if (localStorage.getItem('serifPackInstalled') !== '1') return; } catch (e) { return; }
    loadSerifFontStylesheet(); // 直接載入 + 解析；點聖經時 0 延遲
}
const _triggerSerifPreload = () => {
    if (window.requestIdleCallback) {
        requestIdleCallback(preloadSerifFontIfPreferred, { timeout: 3000 });
    } else {
        setTimeout(preloadSerifFontIfPreferred, 1500);
    }
};
if (document.readyState === 'complete') {
    _triggerSerifPreload();
} else {
    window.addEventListener('load', _triggerSerifPreload, { once: true });
}
// ============================================================
// 宋體字包 安裝 / 移除 / 渲染設定頁
// ============================================================
const SERIF_PACK_KEY = 'serifPackInstalled';
const SERIF_PACK_VERSION_KEY = 'serifPackVersion';
let _serifInstallController = null;
function isSerifPackInstalled() {
    try { return localStorage.getItem(SERIF_PACK_KEY) === '1'; }
    catch(e) { return false; }
}
function getInstalledSerifPackVersion() {
    try { return localStorage.getItem(SERIF_PACK_VERSION_KEY) || '-'; }
    catch(e) { return '-'; }
}
// 從 CSS 內容解析出所有 woff2 URL（含相對路徑解析）
function extractWoff2UrlsFromCss(cssText, cssBaseUrl) {
    const re = /url\(\s*['"]?([^'")]+\.woff2)['"]?\s*\)/g;
    const urls = new Set();
    let m;
    while ((m = re.exec(cssText)) !== null) {
        const raw = m[1].trim();
        let absolute;
        try {
            absolute = new URL(raw, cssBaseUrl).href;
        } catch (e) {
            continue;
        }
        urls.add(absolute);
    }
    return [...urls];
}
// 主安裝函數（onProgress: function({percent, message}); 回傳 {success, error}）
async function installSerifPack(onProgress) {
    const t = i18n[currentLang];
    const ctrl = new AbortController();
    _serifInstallController = ctrl;
    try {
        onProgress({ percent: 1, message: t.settingsInstallCss });
        const cssUrl = new URL(SERIF_FONT_STYLESHEET_HREF, location.origin).href;
        const cssRes = await fetch(cssUrl, { signal: ctrl.signal });
        if (!cssRes.ok) throw new Error(`CSS HTTP ${cssRes.status}`);
        const cssText = await cssRes.text();
        onProgress({ percent: 5, message: t.settingsInstallParse });
        const fontUrls = extractWoff2UrlsFromCss(cssText, cssUrl);
        if (fontUrls.length === 0) throw new Error('No fonts found');
        // 並行下載（最多 8 個同時）
        const CONCURRENCY = 8;
        let done = 0;
        const downloadOne = async (url) => {
            try {
                await fetch(url, { signal: ctrl.signal });
            } catch (e) {
                if (e.name === 'AbortError') throw e;
                // 個別失敗不中斷整批
            }
            done++;
            const percent = 5 + (done / fontUrls.length * 92);
            onProgress({
                percent,
                message: `${t.settingsInstallDownload} ${done}/${fontUrls.length}`
            });
        };
        for (let i = 0; i < fontUrls.length; i += CONCURRENCY) {
            if (ctrl.signal.aborted) throw new DOMException('Aborted', 'AbortError');
            const chunk = fontUrls.slice(i, i + CONCURRENCY);
            await Promise.all(chunk.map(downloadOne));
        }
        onProgress({ percent: 98, message: t.settingsInstallActivate });
        loadSerifFontStylesheet(); // 立刻套用，當前頁面也可使用
        try { await document.fonts.ready; } catch (e) {}
        // 寫入安裝旗標
        localStorage.setItem(SERIF_PACK_KEY, '1');
        localStorage.setItem(SERIF_PACK_VERSION_KEY, APP_VERSION);
        onProgress({ percent: 100, message: t.settingsInstallDone });
        return { success: true };
    } catch (err) {
        return { success: false, error: err };
    } finally {
        _serifInstallController = null;
    }
}
function uninstallSerifPack() {
    // 移除 stylesheet
    const link = document.getElementById(SERIF_FONT_STYLESHEET_ID);
    if (link) link.remove();
    // 移除標記
    try {
        localStorage.removeItem(SERIF_PACK_KEY);
        localStorage.removeItem(SERIF_PACK_VERSION_KEY);
    } catch(e) {}
    // 如果目前是宋體模式，強制切回黑體
    if (getBibleFontMode() === 'serif') {
        applyBibleFontPreference('sans');
    }
}
// 設定頁面 UI 渲染
function renderSettingsPage() {
    const t = i18n[currentLang];
    const statusEl = document.getElementById('serifPackStatus');
    const versionEl = document.getElementById('serifPackVersion');
    const actionsEl = document.getElementById('serifPackActions');
    const appVerEl = document.getElementById('aboutAppVersion');
    if (appVerEl) appVerEl.textContent = APP_VERSION;
    if (!statusEl || !actionsEl) return;
    const installed = isSerifPackInstalled();
    if (installed) {
        const installedVer = getInstalledSerifPackVersion();
        const hasUpdate = installedVer !== '-' && installedVer !== APP_VERSION;
        if (hasUpdate) {
            statusEl.innerHTML = `<span class="settings-status-update-available">${t.settingsUpdateAvailable}</span>`;
        } else {
            statusEl.innerHTML = `<span class="settings-status-installed">${t.settingsStatusInstalled}</span>`;
        }
        if (versionEl) versionEl.textContent = installedVer;
        // 平時只顯示移除；有更新時才額外出現更新按鈕
        const updateBtn = hasUpdate
            ? `<button class="settings-btn primary" onclick="window.installSerifPackUI(true)">${t.settingsBtnUpdate}</button>`
            : '';
        actionsEl.innerHTML = `
            ${updateBtn}
            <button class="settings-btn danger" onclick="window.uninstallSerifPackUI()">${t.settingsBtnUninstall}</button>
        `;
    } else {
        statusEl.innerHTML = `<span class="settings-status-not-installed">${t.settingsStatusNotInstalled}</span>`;
        if (versionEl) versionEl.textContent = '-';
        actionsEl.innerHTML = `<button class="settings-btn primary" onclick="window.installSerifPackUI()">${t.settingsBtnInstall}</button>`;
    }
    // 字體選擇器渲染
    renderFontPickerInSettings();
}
function renderFontPickerInSettings() {
    const installed = isSerifPackInstalled();
    const currentMode = getBibleFontMode();
    const sansRadio = document.getElementById('settingsFontSans');
    const serifRadio = document.getElementById('settingsFontSerifRadio');
    const serifOption = document.getElementById('settingsFontSerifOption');
    const lockedHintWrap = document.getElementById('settingsFontLockedHint');
    if (sansRadio) sansRadio.checked = (currentMode === 'sans' || !installed);
    if (serifRadio) {
        serifRadio.checked = (currentMode === 'serif' && installed);
        serifRadio.disabled = !installed;
    }
    if (serifOption) {
        serifOption.classList.toggle('disabled', !installed);
    }
    if (lockedHintWrap) {
        lockedHintWrap.style.display = installed ? 'none' : 'block';
    }
}
// 監聽字體切換 radio
function setupSettingsFontPicker() {
    const sansRadio = document.getElementById('settingsFontSans');
    const serifRadio = document.getElementById('settingsFontSerifRadio');
    if (sansRadio && !sansRadio._bound) {
        sansRadio._bound = true;
        sansRadio.addEventListener('change', () => {
            if (sansRadio.checked) {
                applyBibleFontPreference('sans');
            }
        });
    }
    if (serifRadio && !serifRadio._bound) {
        serifRadio._bound = true;
        serifRadio.addEventListener('change', () => {
            if (!isSerifPackInstalled()) {
                serifRadio.checked = false;
                return;
            }
            if (serifRadio.checked) {
                applyBibleFontPreference('serif');
                loadSerifFontStylesheet();
            }
        });
    }
}
setupSettingsFontPicker();
window.installSerifPackUI = async (isReinstall) => {
    const t = i18n[currentLang];
    const actionsEl = document.getElementById('serifPackActions');
    const progressWrap = document.getElementById('serifProgressWrap');
    const progressFill = document.getElementById('serifProgressFill');
    const progressText = document.getElementById('serifProgressText');
    const statusEl = document.getElementById('serifPackStatus');
    if (actionsEl) actionsEl.innerHTML = `<button class="settings-btn secondary" disabled>${t.settingsStatusInstalling}</button>`;
    if (statusEl) statusEl.innerHTML = `<span class="settings-status-installing">${t.settingsStatusInstalling}</span>`;
    if (progressWrap) progressWrap.style.display = 'block';
    const result = await installSerifPack(({ percent, message }) => {
        if (progressFill) progressFill.style.width = percent + '%';
        if (progressText) progressText.textContent = `${Math.floor(percent)}% — ${message}`;
    });
    if (progressWrap) progressWrap.style.display = 'none';
    if (result.success) {
        renderSettingsPage();
    } else {
        if (statusEl) statusEl.innerHTML = `<span class="settings-status-not-installed">${t.settingsInstallFailed}: ${result.error?.message || ''}</span>`;
        if (actionsEl) actionsEl.innerHTML = `<button class="settings-btn primary" onclick="window.installSerifPackUI()">${t.settingsBtnInstall}</button>`;
    }
};
window.uninstallSerifPackUI = () => {
    const t = i18n[currentLang];
    if (!confirm(t.settingsConfirmUninstall)) return;
    uninstallSerifPack();
    renderSettingsPage();
};
function isBibleFontCommand(query) {
    const normalized = query.trim();
    if (!normalized || normalized.startsWith('@')) return false;
    return /聖經字體|圣经字体|經文字體|经文字体|字體|字体|font|폰트|글꼴|서체|黑體|黑体|宋體|宋体|고딕체|명조체|sans|serif/i.test(normalized);
}
function renderBibleFontOptions() {
    const mode = getBibleFontMode();
    const installed = isSerifPackInstalled();
    const serifSelected = (mode === 'serif' && installed) ? ' selected' : '';
    const sansSelected = (mode === 'sans' || !installed) ? ' selected' : '';
    const serifDisabled = installed ? '' : ' disabled';
    const title = currentLang === 'ko' ? '성경 글꼴 선택' : '選擇聖經字體';
    const hint = currentLang === 'ko'
        ? `현재 성경 본문은 ${getBibleFontLabel(mode)}로 표시됩니다.`
        : `目前聖經正文使用${getBibleFontLabel(mode)}顯示。`;
    const serifTitle = currentLang === 'ko' ? '명조체' : '宋體';
    const sansTitle = currentLang === 'ko' ? '고딕체' : '黑體';
    const serifPreview = currentLang === 'ko' ? '태초에 하나님이 천지를 창조하시니라' : '起初，神創造天地';
    const sansPreview = currentLang === 'ko' ? '말씀을 또렷하게 읽기' : '清楚俐落地閱讀經文';
    // 若宋體未安裝，加上「前往下載字體包」淺藍色提示連結
    const downloadHint = installed ? '' : `
        <div class="ai-panel-font-install-hint" onclick="window.toggleAiPanel(); window.switchPage('settings');">
            <span class="install-hint-icon">⬇</span>
            <span class="install-hint-text">${currentLang === 'ko'
                ? '명조체 패키지가 아직 설치되지 않았습니다. 설정에서 다운로드하기 →'
                : '宋體字包尚未安裝，前往設定下載字體包 →'}</span>
        </div>`;
    return `
        <div class="ai-panel-result-item success ai-panel-font-picker">
            <div class="result-query">${title}</div>
            <div class="result-text">${hint}</div>
            <div class="ai-panel-font-options">
                <button type="button" class="ai-panel-font-choice${serifSelected}${serifDisabled}" data-font-mode="serif" onclick="window.setBibleFontMode('serif')">
                    <span class="ai-panel-font-choice-title">${serifTitle}</span>
                    <span class="ai-panel-font-choice-preview">${serifPreview}</span>
                </button>
                <button type="button" class="ai-panel-font-choice${sansSelected}" data-font-mode="sans" onclick="window.setBibleFontMode('sans')">
                    <span class="ai-panel-font-choice-title">${sansTitle}</span>
                    <span class="ai-panel-font-choice-preview">${sansPreview}</span>
                </button>
            </div>
            ${downloadHint}
        </div>
    `;
}
function showBibleFontOptions(resultContainer) {
    resultContainer.querySelector('.ai-panel-font-picker')?.remove();
    resultContainer.insertAdjacentHTML('afterbegin', renderBibleFontOptions());
}
window.setBibleFontMode = (mode) => {
    const t = i18n[currentLang];
    // 切換到宋體但尚未安裝字體包 → 阻擋並引導到設定頁
    if (mode === 'serif' && !isSerifPackInstalled()) {
        const goSettings = confirm(t.serifNotInstalledHint + '\n\n→ ' + t.menuSettings);
        if (goSettings) {
            window.toggleAiPanel();
            window.switchPage('settings');
        }
        return;
    }
    const appliedMode = applyBibleFontPreference(mode);
    if (appliedMode === 'serif') loadSerifFontStylesheet();
    const resultContainer = document.getElementById('aiPanelResult');
    if (resultContainer) showBibleFontOptions(resultContainer);
    const message = currentLang === 'ko'
        ? `성경 글꼴을 ${getBibleFontLabel(appliedMode)}로 변경했습니다.`
        : `已將聖經字體切換為${getBibleFontLabel(appliedMode)}。`;
    const picker = document.querySelector('.ai-panel-font-picker .result-text');
    if (picker) picker.textContent = message;
};
applyBibleFontPreference();
window.toggleAiPanel = () => {
    const panel = document.getElementById('aiPanel');
    const overlay = document.getElementById('aiPanelOverlay');
    const trigger = document.querySelector('.nav-ai-btn');
    const isOpen = panel.classList.contains('show');
    if (isOpen) {
        overlay.classList.remove('show');
        setNavPanelState(panel, trigger, 'ai', false);
    } else {
        overlay.classList.add('show');
        setNavPanelState(panel, trigger, 'ai', true);
        focusWithoutPageScroll(document.getElementById('aiPanelInput'));
        // 載入快取結果
        loadAiPanelCache();
    }
    syncUiScrollLock();
};
function loadAiPanelCache() {
    try {
        const cached = JSON.parse(localStorage.getItem(AI_PANEL_CACHE_KEY) || '[]');
        const now = Date.now();
        // 過濾掉超過1小時的結果
        const valid = cached.filter(item => (now - item.timestamp) < AI_PANEL_CACHE_DURATION);
        localStorage.setItem(AI_PANEL_CACHE_KEY, JSON.stringify(valid));
        renderAiPanelResults(valid);
    } catch (e) {
        renderAiPanelResults([]);
    }
}
function renderAiPanelResults(results) {
    const container = document.getElementById('aiPanelResult');
    if (!results.length) {
        container.innerHTML = '';
        return;
    }
    const checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg>';
    const searchSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" style="vertical-align:middle;margin-right:4px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
    container.innerHTML = results.map(r => {
        const copiedLabel = r.success && !r.isPreview ? `<div class="result-copied">${checkSvg} ${currentLang === 'ko' ? '복사됨' : '已複製'}</div>` : '';
        return `
        <div class="ai-panel-result-item ${r.success ? 'success' : 'error'}">
            <div class="result-query">${searchSvg}${r.query}</div>
            <div class="result-text">${r.text}</div>
            ${copiedLabel}
            <div class="result-time">${new Date(r.timestamp).toLocaleTimeString()}</div>
        </div>`;
    }).join('');
}
// ===== 聖經經文本地解析器（不依賴 AI API，即時辨識） =====
function buildBookLookup() {
    const lookup = {};
    for (const [id, abbr] of Object.entries(bookAbbreviations)) {
        lookup[abbr.ko] = id;
        lookup[abbr.zh] = id;
    }
    // 加入常見全名
    const allBooks = [...bibleBooks.oldTestament, ...bibleBooks.newTestament];
    allBooks.forEach(b => {
        lookup[b.ko] = b.id;
        lookup[b.zh] = b.id;
    });
    Object.assign(lookup, {
        '約壹': '1jn',
        '約一': '1jn',
        '約翰一書': '1jn',
        '約翰壹書': '1jn',
        '約貳': '2jn',
        '約二': '2jn',
        '約翰二書': '2jn',
        '約翰貳書': '2jn',
        '約參': '3jn',
        '約三': '3jn',
        '約翰三書': '3jn',
        '約翰參書': '3jn'
    });
    // 英文縮寫
    const engMap = {
        'gen':'gen','ge':'gen','gn':'gen','exodus':'exo','exo':'exo','ex':'exo',
        'lev':'lev','le':'lev','lv':'lev','num':'num','nu':'num','nm':'num',
        'deu':'deu','de':'deu','dt':'deu','jos':'jos','josh':'jos',
        'jdg':'jdg','judg':'jdg','rut':'rut','ru':'rut','ruth':'rut',
        '1sa':'1sa','1sam':'1sa','2sa':'2sa','2sam':'2sa',
        '1ki':'1ki','1king':'1ki','1kings':'1ki','2ki':'2ki','2king':'2ki','2kings':'2ki',
        '1ch':'1ch','1chr':'1ch','2ch':'2ch','2chr':'2ch',
        'ezr':'ezr','ezra':'ezr','neh':'neh','est':'est','esther':'est',
        'job':'job','psa':'psa','ps':'psa','psalm':'psa','psalms':'psa',
        'pro':'pro','prov':'pro','proverbs':'pro',
        'ecc':'ecc','eccl':'ecc','sng':'sng','song':'sng','sol':'sng',
        'isa':'isa','is':'isa','isaiah':'isa','jer':'jer','lam':'lam',
        'ezk':'ezk','eze':'ezk','ezek':'ezk','dan':'dan','dn':'dan',
        'hos':'hos','jol':'jol','joel':'jol','amo':'amo','amos':'amo',
        'oba':'oba','obad':'oba','jon':'jon','jonah':'jon',
        'mic':'mic','micah':'mic','nam':'nam','nahum':'nam',
        'hab':'hab','zep':'zep','zeph':'zep','hag':'hag','haggai':'hag',
        'zec':'zec','zech':'zec','mal':'mal','malachi':'mal',
        'mat':'mat','matt':'mat','mt':'mat','mrk':'mrk','mark':'mrk','mk':'mrk',
        'luk':'luk','luke':'luk','lk':'luk','jhn':'jhn','john':'jhn','jn':'jhn',
        'act':'act','acts':'act','rom':'rom','ro':'rom','romans':'rom',
        '1co':'1co','1cor':'1co','2co':'2co','2cor':'2co',
        'gal':'gal','eph':'eph','php':'php','phil':'php',
        'col':'col','1th':'1th','1thess':'1th','2th':'2th','2thess':'2th',
        '1ti':'1ti','1tim':'1ti','2ti':'2ti','2tim':'2ti',
        'tit':'tit','titus':'tit','phm':'phm','philem':'phm',
        'heb':'heb','hebrews':'heb','jas':'jas','james':'jas',
        '1pe':'1pe','1pet':'1pe','2pe':'2pe','2pet':'2pe',
        '1jn':'1jn','1john':'1jn','2jn':'2jn','2john':'2jn','3jn':'3jn','3john':'3jn',
        'jud':'jud','jude':'jud','rev':'rev','revelation':'rev','re':'rev'
    };
    for (const [k, v] of Object.entries(engMap)) lookup[k.toLowerCase()] = v;
    return lookup;
}
function resolveBibleBookId(bookName, bookLookup) {
    if (!bookName) return null;
    const normalized = bookName.trim();
    const direct = bookLookup[normalized] || bookLookup[normalized.toLowerCase()];
    if (direct) return direct;
    const compact = normalized.replace(/\s+/g, '');
    const compactDirect = bookLookup[compact] || bookLookup[compact.toLowerCase()];
    if (compactDirect) return compactDirect;
    const sortedKeys = Object.keys(bookLookup).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
        if (!key) continue;
        const lowerKey = key.toLowerCase();
        const lowerName = normalized.toLowerCase();
        if (normalized.endsWith(key) || normalized.startsWith(key) || lowerName.endsWith(lowerKey) || lowerName.startsWith(lowerKey)) {
            return bookLookup[key];
        }
    }
    return null;
}
function parseBibleNavigationQuery(input) {
    const bookLookup = buildBookLookup();
    const cleanInput = input.trim().replace(/[\/／]+$/g, '').replace(/\s+/g, ' ');
    const englishPrefix = /^(?:cd|to\s+get\s+to|go\s+to|get\s+to|move\s+to|open|to)\s+/i;
    const asianPrefix = /^(?:移動到|移动到|移動至|移动至|移動|移动|移到|前往|打開|打开|開啟|开启|到|去|이동해주세요|이동해줘|이동하세요|이동해요|이동해|이동|가|가자|가세요|가요|가지)\s*/;
    let navText = '';
    if (englishPrefix.test(cleanInput)) {
        navText = cleanInput.replace(englishPrefix, '').trim();
    } else if (asianPrefix.test(cleanInput)) {
        navText = cleanInput.replace(asianPrefix, '').trim();
    } else {
        const suffixMatch = cleanInput.match(/^(.+?)\s*(\d+)(?:\s*[:：]\s*(\d+))?\s*(?:章|장)?\s*(?:으로|로)?\s*(?:移動|移动|移動一下|移动一下|가|가자|가세요|가요|가지|세요|요|이동해주세요|이동해줘|이동하세요|이동해요|이동해|이동)\s*$/);
        if (!suffixMatch) return null;
        navText = `${suffixMatch[1].trim()} ${suffixMatch[2]}${suffixMatch[3] ? `:${suffixMatch[3]}` : ''}`;
    }
    const match = navText.match(/^(.+?)\s*(\d+)(?:\s*[:：]\s*(\d+))?\s*(?:章|장|chapter|chapters|ch)?\s*$/i);
    if (!match) return null;
    const bookName = match[1].trim();
    const chapter = parseInt(match[2], 10);
    const verse = match[3] ? parseInt(match[3], 10) : null;
    const bookId = resolveBibleBookId(bookName, bookLookup);
    if (!bookId || !Number.isFinite(chapter)) return null;
    return { bookId, chapter, verse };
}
function hasNavigationIntentCue(input) {
    return /(?:^|\s)(?:cd|to\s+get\s+to|go\s+to|get\s+to|move\s+to|open|to)(?:\s|$)/i.test(input)
        || /(?:移動到|移动到|移動至|移动至|移動|移动|移到|前往|打開|打开|開啟|开启|到|去)/.test(input)
        || /(?:이동해주세요|이동해줘|이동하세요|이동해요|이동해|이동)/.test(input)
        || /(?:^|\s)(?:가세요|가요|가자|가지|가)(?:\s|$)/.test(input);
}
function parseBibleCopyCommand(input) {
    const match = input.trim().match(/^(?:copy|cp|複製|复制|복사)\s+(.+)$/i);
    if (!match) return null;
    const parsed = parseBibleQuery(match[1].trim());
    return parsed.queries.length > 0 ? parsed : null;
}
function normalizePrayerTarget(input) {
    return input.trim().replace(/[\s'’/／_\-.,，。:：]+/g, '').toLowerCase();
}
function isPrayerTarget(input) {
    const target = normalizePrayerTarget(input);
    const aliases = [
        '主禱文', '主祷文', '主祈禱文', '主祈祷文', '天主經', '天主经',
        '주기도문', 'lordsprayer', 'lordprayer', 'thelordsprayer', 'ourfather'
    ];
    return aliases.some((alias) => {
        const normalizedAlias = normalizePrayerTarget(alias);
        return target === normalizedAlias || target.includes(normalizedAlias);
    });
}
function parsePrayerNavigationQuery(input) {
    const cleanInput = input.trim().replace(/[\/／]+$/g, '').replace(/\s+/g, ' ');
    if (!cleanInput) return null;
    const prefixPatterns = [
        /^(?:cd|to\s+get\s+to|go\s+to|get\s+to|move\s+to|open|to)\s+/i,
        /^(?:移動到|移动到|移動至|移动至|移動|移动|移到|前往|打開|打开|開啟|开启|到|去)\s*/i,
        /^(?:이동해주세요|이동해줘|이동하세요|이동해요|이동해|이동|가|가자|가세요|가요|열어줘|열어|열기)\s*/i,
    ];
    const suffixPattern = /\s*(?:으로|로)?\s*(?:移動|移动|移動一下|移动一下|打開|打开|開啟|开启|이동해주세요|이동해줘|이동하세요|이동해요|이동해|이동|가|가자|가세요|가요|열어줘|열어|열기)\s*$/i;
    let target = cleanInput;
    let hasNavigationIntent = false;
    for (const pattern of prefixPatterns) {
        if (pattern.test(target)) {
            target = target.replace(pattern, '').trim();
            hasNavigationIntent = true;
            break;
        }
    }
    if (suffixPattern.test(target)) {
        target = target.replace(suffixPattern, '').trim();
        hasNavigationIntent = true;
    }
    return hasNavigationIntent && isPrayerTarget(target);
}
function parsePrayerCopyCommand(input) {
    const match = input.trim().match(/^(?:copy|cp|複製|复制|복사)\s+(.+)$/i);
    if (!match) return null;
    const { language, cleanInput } = detectBibleCopyLanguage(match[1]);
    return isPrayerTarget(cleanInput) ? { language } : null;
}
function formatPrayerForCopy(data, language = null) {
    const koTitle = data.titles?.ko || '주기도문';
    const zhTitle = data.titles?.zh || '主祈禱文';
    const targetLanguage = language || (currentLang === 'ko' ? 'ko' : 'zh');
    if (targetLanguage === 'ko') return `${koTitle}\n${(data.ko || []).join('\n')}`;
    if (targetLanguage === 'zh') return `${zhTitle}\n${(data.zh || []).join('\n')}`;
    return `${koTitle}\n${(data.ko || []).join('\n')}\n\n${zhTitle}\n${(data.zh || []).join('\n')}`;
}
function startsBibleReferenceSegment(fragment, bookLookup) {
    const trimmed = fragment.trim();
    if (!trimmed || /^\d/.test(trimmed)) return false;
    const bookName = trimmed.match(/^([^\d:：,、，;；]+)/)?.[1]?.trim() || '';
    return Boolean(resolveBibleBookId(bookName, bookLookup));
}
function markImplicitBibleReferenceBreaks(input, bookLookup) {
    const sortedKeys = [...new Set(Object.keys(bookLookup))]
        .filter(Boolean)
        .sort((a, b) => b.length - a.length);
    return sortedKeys.reduce((text, key) => {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`([0-9０-９,、，])(${escapedKey})(?=\\d)`, 'gi');
        return text.replace(pattern, '$1;$2');
    }, input);
}
function splitBibleReferenceSegments(input, bookLookup) {
    const normalized = markImplicitBibleReferenceBreaks(input, bookLookup)
        .replace(/[；]/g, ';')
        .replace(/\s+/g, ' ')
        .trim();
    const segments = [];
    for (const raw of normalized.split(';')) {
        const trimmed = raw.trim();
        if (!trimmed) continue;
        const pieces = trimmed.split(' ');
        let current = pieces[0] || '';
        for (let i = 1; i < pieces.length; i++) {
            const piece = pieces[i];
            if (startsBibleReferenceSegment(piece, bookLookup)) {
                if (current.trim()) segments.push(current.trim());
                current = piece;
            } else {
                current += ` ${piece}`;
            }
        }
        if (current.trim()) segments.push(current.trim());
    }
    return segments;
}
function detectBibleCopyLanguage(input) {
    let cleanInput = input.trim();
    let language = null;
    const stripPatterns = (patterns) => {
        let matched = false;
        for (const pattern of patterns) {
            if (pattern.test(cleanInput)) {
                cleanInput = cleanInput.replace(pattern, ' ').replace(/\s+/g, ' ').trim();
                matched = true;
            }
        }
        return matched;
    };
    const bothPatterns = [
        /(?:中韓|韓中|中韩|韩中|中文韓文|韓文中文|中文韩文|韩文中文|雙語|双语|兩語|两语|중한|한중|중\s*한|한\s*중|중국어\s*한국어|한국어\s*중국어|cn\s*kr|kr\s*cn|zh\s*ko|ko\s*zh|chinese\s*korean|korean\s*chinese|전부|전체|全部|全|都|다|all|both|양쪽|兩個|两个)\s*$/i,
        /^(?:中韓|韓中|中韩|韩中|中文韓文|韓文中文|中文韩文|韩文中文|雙語|双语|兩語|两语|중한|한중|중\s*한|한\s*중|중국어\s*한국어|한국어\s*중국어|cn\s*kr|kr\s*cn|zh\s*ko|ko\s*zh|chinese\s*korean|korean\s*chinese|전부|전체|全部|全|都|다|all|both|양쪽|兩個|两个)\s*/i,
    ];
    const zhPatterns = [
        /(?:中文|中|중국어|중|cn|zh|chinese)\s*$/i,
        /^(?:中文|中|중국어|중|cn|zh|chinese)\s*/i,
    ];
    const koPatterns = [
        /(?:韓文|韩文|韓|韩|한국어|한|kr|ko|korean)\s*$/i,
        /^(?:韓文|韩文|韓|韩|한국어|한|kr|ko|korean)\s*/i,
    ];
    if (stripPatterns(bothPatterns)) {
        language = 'both';
    } else if (stripPatterns(zhPatterns)) {
        language = 'zh';
    } else if (stripPatterns(koPatterns)) {
        language = 'ko';
    }
    if (!language) {
        const hasKorean = /[\uAC00-\uD7AF]/.test(cleanInput);
        const hasChinese = /[\u4E00-\u9FFF]/.test(cleanInput);
        if (hasKorean && !hasChinese) language = 'ko';
        else if (hasChinese && !hasKorean) language = 'zh';
        else language = currentLang === 'ko' ? 'ko' : 'zh';
    }
    return { language, cleanInput };
}
function parseBibleQuery(input) {
    const bookLookup = buildBookLookup();
    const { language, cleanInput } = detectBibleCopyLanguage(input);
    // 拆分多段引用：分號、；、以及空格+書名開頭
    // 例：啟1:1-2 創1:2-7、9 → ['啟1:1-2', '創1:2-7、9']
    // 例：啟1:1;創1:2 → ['啟1:1', '創1:2']
    const segments = splitBibleReferenceSegments(cleanInput, bookLookup);
    const queries = [];
    let lastBookId = null;
    for (const seg of segments) {
        // 章對章格式：啟5章到7章 / 계 1장 가 7장 / 創1-3章 / 啟5~7
        // 支援關鍵字：到、去、가、세요、까지、~、-
        const chapterRangeMatch = seg.match(/^([^\d]*?)(\d+)\s*(?:章|장)?\s*(?:到|去|가|세요|요|까지|가지|~|-|至)\s*(\d+)\s*(?:章|장)?$/);
        if (chapterRangeMatch) {
            let bookName = chapterRangeMatch[1].trim();
            const startCh = parseInt(chapterRangeMatch[2]);
            const endCh = parseInt(chapterRangeMatch[3]);
            let bookId = bookName ? resolveBibleBookId(bookName, bookLookup) : lastBookId;
            if (!bookId) continue;
            lastBookId = bookId;
            for (let ch = startCh; ch <= endCh; ch++) {
                queries.push({ bookId, chapter: ch, verses: 'all' });
            }
            continue;
        }
        // 純章節格式：啟5章 / 啟5 / 계 1장
        const chapterOnlyMatch = seg.match(/^([^\d]*?)(\d+)\s*(?:章|장)$/);
        if (chapterOnlyMatch) {
            let bookName = chapterOnlyMatch[1].trim();
            const chapter = parseInt(chapterOnlyMatch[2]);
            let bookId = bookName ? resolveBibleBookId(bookName, bookLookup) : lastBookId;
            if (!bookId) continue;
            lastBookId = bookId;
            queries.push({ bookId, chapter, verses: 'all' });
            continue;
        }
        // 標準格式：書卷名 章:節範圍
        const match = seg.match(/^([^\d]*?)(\d+)\s*[:：]\s*(.+)$/);
        if (!match) continue;
        let bookName = match[1].trim();
        const chapter = parseInt(match[2]);
        const verseStr = match[3].trim();
        let bookId = null;
        if (bookName) {
            bookId = resolveBibleBookId(bookName, bookLookup);
        }
        if (!bookId) bookId = lastBookId;
        if (!bookId) continue;
        lastBookId = bookId;
        const verses = [];
        if (/^(all|both|다|전부|전체|全部|全|都)$/i.test(verseStr)) {
            queries.push({ bookId, chapter, verses: 'all' });
            continue;
        }
        const parts = verseStr.replace(/\s*([-~])\s*/g, '$1').split(/[,、，\s]+/);
        for (const part of parts) {
            const rangeMatch = part.trim().match(/^(\d+)\s*[-~]\s*(\d+)$/);
            if (rangeMatch) {
                const start = parseInt(rangeMatch[1]), end = parseInt(rangeMatch[2]);
                for (let i = start; i <= end; i++) verses.push(i);
            } else {
                const num = parseInt(part.trim());
                if (!isNaN(num)) verses.push(num);
            }
        }
        if (verses.length > 0) queries.push({ bookId, chapter, verses });
    }
    return { queries, language };
}
function makeBibleCopyReference(abbr, chapter, verses, lang) {
    const bookPrefix = lang === 'ko' ? `${abbr} ${chapter}` : `${abbr}${chapter}`;
    if (verses.length === 1) return `${bookPrefix}:${verses[0]}`;
    const isContinuous = verses.every((verse, index) => index === 0 || verse === verses[index - 1] + 1);
    const versePart = isContinuous ? `${verses[0]}-${verses[verses.length - 1]}` : verses.join(',');
    return `${bookPrefix}:${versePart}`;
}
function formatBibleCopyBlock({ abbr, chapter, verses, verseRows, lang }) {
    const reference = makeBibleCopyReference(abbr, chapter, verses, lang);
    if (verseRows.length === 1) {
        return `${reference} ${verseRows[0].text}`;
    }
    return [
        reference,
        ...verseRows.map(row => `${row.verse}. ${row.text}`)
    ].join('\n');
}
async function formatBibleResult(parsed) {
    const { queries, language } = parsed;
    const blocks = [];
    let foundCount = 0;
    for (const q of queries) {
        const abbr = bookAbbreviations[q.bookId] || { ko: q.bookId, zh: q.bookId };
        // Fetch chapter data (uses cache if already loaded)
        const chapterData = await fetchBibleChapter(q.bookId, q.chapter);
        if (!chapterData) {
            const allBooks = [...bibleBooks.oldTestament, ...bibleBooks.newTestament];
            const bookInfo = allBooks.find(b => b.id === q.bookId);
            const name = bookInfo ? (currentLang === 'ko' ? bookInfo.ko : bookInfo.zh) : q.bookId;
            blocks.push(`[${name} ${q.chapter}${currentLang === 'ko' ? '장' : '章'} - ${currentLang === 'ko' ? '미수록' : '尚未收錄'}]`);
            continue;
        }
        const verses = q.verses === 'all'
            ? chapterData.filter(v => v.verse).map(v => v.verse)
            : q.verses;
        const verseData = verses
            .map(vNum => {
                const vd = chapterData.find(v => v.verse === vNum);
                return vd ? { verse: vNum, data: vd } : null;
            })
            .filter(Boolean);
        if (verseData.length === 0) continue;
        if (language === 'ko') {
            const rows = verseData.map(item => ({ verse: item.verse, text: item.data.ko || '' }));
            foundCount += rows.length;
            blocks.push(formatBibleCopyBlock({ abbr: abbr.ko, chapter: q.chapter, verses: rows.map(row => row.verse), verseRows: rows, lang: 'ko' }));
        } else if (language === 'zh') {
            const rows = verseData.map(item => ({ verse: item.verse, text: item.data.zh || '' }));
            foundCount += rows.length;
            blocks.push(formatBibleCopyBlock({ abbr: abbr.zh, chapter: q.chapter, verses: rows.map(row => row.verse), verseRows: rows, lang: 'zh' }));
        } else {
            const koRows = verseData.map(item => ({ verse: item.verse, text: item.data.ko || '' }));
            const zhRows = verseData.map(item => ({ verse: item.verse, text: item.data.zh || '' }));
            foundCount += verseData.length;
            blocks.push(formatBibleCopyBlock({ abbr: abbr.ko, chapter: q.chapter, verses: koRows.map(row => row.verse), verseRows: koRows, lang: 'ko' }));
            blocks.push(formatBibleCopyBlock({ abbr: abbr.zh, chapter: q.chapter, verses: zhRows.map(row => row.verse), verseRows: zhRows, lang: 'zh' }));
        }
    }
    return { text: blocks.join('\n\n').trim(), foundCount };
}
function hasSemanticBibleQuestionCue(input) {
    return /(?:聖經|圣经|經文|经文|神的話|神的话|主的話|主的话|道上|查詢|查询|相關|相关|幫我找|帮我找|戰勝|战胜|得勝|得胜|安慰|悔改|信心|禱告|祷告|事奉|懶惰|懒惰|拖延|罪|시험|말씀|성경|관련|찾아|검색|게으름|기도|믿음|회개|위로|죄|이기는|도와|scripture|bible|verse|verses|faith|prayer|sin|lazy|laziness|procrastinat|comfort|repent)/i.test(input);
}
window.aiPanelSearch = async () => {
    const input = document.getElementById('aiPanelInput');
    const sendBtn = document.querySelector('.ai-panel-send');
    const resultContainer = document.getElementById('aiPanelResult');
    const query = input.value.trim();
    if (!query) return;
    if (isBibleFontCommand(query)) {
        showBibleFontOptions(resultContainer);
        input.value = '';
        return;
    }
    // 模式 0-a：Linux 風格移動指令，例如 cd gen1 / cd 계 1 / cd 啟1:5
    const cdNav = parseBibleNavigationQuery(query);
    if (cdNav && /^cd\s+/i.test(query)) {
        const { bookId, chapter, verse } = cdNav;
        const allBooks = [...bibleBooks.oldTestament, ...bibleBooks.newTestament];
        const book = allBooks.find(b => b.id === bookId);
        if (book && chapter >= 1 && chapter <= book.chapters) {
            window.toggleAiPanel();
            window.switchPage('bible');
            setTimeout(() => {
                selectBibleBook(book);
                setTimeout(() => openBibleChapter(book, chapter, { targetVerse: verse }), 300);
            }, 300);
            input.value = '';
            return;
        }
    }
    // 模式 0-b：移動到主祈禱文，例如 移動到主禱文 / 이동 주기도문 / cd lords prayer
    if (parsePrayerNavigationQuery(query)) {
        window.toggleAiPanel();
        window.switchPage('lords-prayer');
        input.value = '';
        return;
    }
    // 模式 0-b：複製主祈禱文，例如 cp 主禱文 / cp 주기도문 / cp lords prayer
    const prayerCopyCommand = parsePrayerCopyCommand(query);
    if (prayerCopyCommand) {
        sendBtn.disabled = true;
        try {
            const prayer = await fetchLordsPrayer();
            const text = formatPrayerForCopy(prayer, prayerCopyCommand.language);
            await navigator.clipboard.writeText(text);
            saveAiPanelResult({ query, text, success: true, timestamp: Date.now() });
            input.value = '';
        } catch (err) {
            saveAiPanelResult({ query, text: '❌ ' + err.message, success: false, timestamp: Date.now() });
        } finally {
            sendBtn.disabled = false;
        }
        return;
    }
    // 模式 0：明確複製指令，例如 copy gen1:1 / cp gen1:1
    const copyCommand = parseBibleCopyCommand(query);
    if (copyCommand) {
        sendBtn.disabled = true;
        try {
            const formatted = await formatBibleResult(copyCommand);
            if (formatted.foundCount === 0) {
                throw new Error(currentLang === 'ko' ? '해당 경문을 찾을 수 없습니다' : '找不到對應的經文');
            }
            await navigator.clipboard.writeText(formatted.text);
            saveAiPanelResult({ query, text: formatted.text, success: true, timestamp: Date.now() });
            input.value = '';
        } catch (err) {
            saveAiPanelResult({ query, text: '❌ ' + err.message, success: false, timestamp: Date.now() });
        } finally {
            sendBtn.disabled = false;
        }
        return;
    }
    // 模式 1：跳轉到聖經章節
    // 「到 啟5章」「去 創1章」「계 1장 가」「to gen 1」「go to rev 3」
    const nav = parseBibleNavigationQuery(query);
    if (nav) {
        const { bookId, chapter, verse } = nav;
        if (bookId) {
            const allBooks = [...bibleBooks.oldTestament, ...bibleBooks.newTestament];
            const book = allBooks.find(b => b.id === bookId);
            if (book && chapter >= 1 && chapter <= book.chapters) {
                // 關閉 AI 面板，切到聖經頁面，打開該章節
                window.toggleAiPanel();
                window.switchPage('bible');
                setTimeout(() => {
                    selectBibleBook(book);
                    setTimeout(() => openBibleChapter(book, chapter, { targetVerse: verse }), 300);
                }, 300);
                input.value = '';
                return;
            }
        }
    }
    // --- 聖經查詢模式（先本地解析，失敗時用 AI 輔助） ---
    sendBtn.disabled = true;
    let loadingEl = null;
    try {
        if (hasNavigationIntentCue(query)) {
            loadingEl = document.createElement('div');
            loadingEl.className = 'ai-panel-loading';
            loadingEl.textContent = currentLang === 'ko' ? 'AI 의도 분석 중...' : 'AI 意圖判斷中...';
            resultContainer.prepend(loadingEl);
            const aiIntent = await parseAiAssistantIntentWithAI(query);
            if (await runAiAssistantIntent(aiIntent, query, input)) return;
            throw new Error(currentLang === 'ko'
                ? '이동할 위치를 인식할 수 없습니다.\n예: 이동 창5장 / 이동해주세요 계1:5 / cd gen5'
                : '無法辨識要移動的位置。\n例：移動 創5章 / 移動到 啟1:5 / cd gen5');
        }
        // 1. 本地 regex 解析
        let parsed = parseBibleQuery(query);
        let formatted = parsed.queries.length > 0 ? await formatBibleResult(parsed) : { text: '', foundCount: 0 };
        // 2. 如果本地解析失敗或沒找到任何節，試 AI 輔助
        if (!parsed.queries.length || formatted.foundCount === 0) {
            loadingEl = document.createElement('div');
            loadingEl.className = 'ai-panel-loading';
            loadingEl.textContent = currentLang === 'ko' ? 'AI 분석 중...' : 'AI 分析中...';
            resultContainer.prepend(loadingEl);
            try {
                const aiIntent = await parseAiAssistantIntentWithAI(query);
                if (await runAiAssistantIntent(aiIntent, query, input)) return;
                if (hasSemanticBibleQuestionCue(query)) {
                    await runSemanticBibleAssistantSearch(query, query, input);
                    return;
                }
                const aiResult = await parseBibleWithAI(query);
                if (aiResult && aiResult.queries && aiResult.queries.length > 0) {
                    parsed = aiResult;
                    formatted = await formatBibleResult(parsed);
                }
            } catch (e) {
                console.warn('AI 解析失敗:', e);
            }
        }
        if (formatted.foundCount === 0) {
            throw new Error(currentLang === 'ko'
                ? '경문 형식을 인식할 수 없습니다.\n예: 창1:1-3 한 / 사1:1;계3:5 중 / 계5장 / 계1장-3장'
                : '無法辨識經文格式\n例：創1:1-3 中 / 賽1:1；啟3:5 韓 / 啟5章 / 啟1章到3章');
        }
        await navigator.clipboard.writeText(formatted.text);
        const cacheItem = { query, text: formatted.text, success: true, timestamp: Date.now() };
        saveAiPanelResult(cacheItem);
        input.value = '';
    } catch (err) {
        const cacheItem = { query, text: err.message, success: false, timestamp: Date.now() };
        saveAiPanelResult(cacheItem);
    } finally {
        if (loadingEl) loadingEl.remove();
        sendBtn.disabled = false;
    }
};
// AI 輔助解析（當本地解析失敗時呼叫）
async function parseBibleWithAI(query) {
    const allBooks = [...bibleBooks.oldTestament, ...bibleBooks.newTestament];
    const bookRef = allBooks.map(b => {
        const abbr = bookAbbreviations[b.id] || {};
        return `${b.id}:${abbr.ko||b.ko}/${abbr.zh||b.zh}`;
    }).join(',');
    const prompt = `解析聖經經文引用，返回純JSON（無markdown）。
書卷ID: ${bookRef}
格式：{"queries":[{"bookId":"gen","chapter":1,"verses":[1,2,3]}],"language":"both"}
或章節: {"bookId":"gen","chapter":1,"verses":"all"}
規則：
- bookId必須用上方ID
- verses是數字陣列；連續範圍展開如1-5→[1,2,3,4,5]
- 整章用"all"
- 章對章範圍展開為多個queries
- 多個引用可用空格、分號、頓號分隔；如果空格後又出現新書卷，要拆成新的query
- language: "ko"=韓文,"zh"=中文,"both"=兩者
- 語言觸發詞：中/中文/중/중국어/cn/zh/chinese→zh; 韓/韓文/한/한국어/kr/ko/korean→ko; 全/全部/都/다/all/both→both
- 沒指定語言時，根據輸入語言判斷
- 支援關鍵字：到/去/까지/가/세요/요/가지/~/-（章對章）
範例：
"創1:1-3 中"→{"queries":[{"bookId":"gen","chapter":1,"verses":[1,2,3]}],"language":"zh"}
"啟5章 韓"→{"queries":[{"bookId":"rev","chapter":5,"verses":"all"}],"language":"ko"}
"啟1章到3章 全"→{"queries":[{"bookId":"rev","chapter":1,"verses":"all"},{"bookId":"rev","chapter":2,"verses":"all"},{"bookId":"rev","chapter":3,"verses":"all"}],"language":"both"}
"창1:1;계3:5 다"→{"queries":[{"bookId":"gen","chapter":1,"verses":[1]},{"bookId":"rev","chapter":3,"verses":[5]}],"language":"both"}
"創1:2-3、6 出2:1 中"→{"queries":[{"bookId":"gen","chapter":1,"verses":[2,3,6]},{"bookId":"exo","chapter":2,"verses":[1]}],"language":"zh"}
無法解析→{"queries":[]}
輸入：${query}`;
    const response = await fetchAiWorker(prompt);
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    const aiText = data.text || data.response || data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = aiText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    return JSON.parse(cleaned);
}
async function parseAiAssistantIntentWithAI(query) {
    const allBooks = [...bibleBooks.oldTestament, ...bibleBooks.newTestament];
    const bookRef = allBooks.map(b => {
        const abbr = bookAbbreviations[b.id] || {};
        return `${b.id}:${abbr.ko || b.ko}/${abbr.zh || b.zh}/${b.ko}/${b.zh}`;
    }).join(',');
    const prompt = `你是網站 AI 助手的指令意圖分類器。請只回傳純 JSON，不要 markdown。
書卷ID: ${bookRef}
可回傳格式：
{"action":"navigate_bible","bookId":"gen","chapter":1,"verse":null}
{"action":"copy_bible","queries":[{"bookId":"gen","chapter":1,"verses":[1]}],"language":"zh"}
{"action":"semantic_bible_search","question":"使用者原始查經問題","language":"zh"}
{"action":"clarify_intent","message":"請問你想複製、移動，還是查詢相關經文？"}
{"action":"open_prayer"}
{"action":"copy_prayer","language":"ko"}
{"action":"unknown"}
規則：
- 判斷使用者真正意圖，不要只看是否有聖經章節。
- 有「移動、移动、到、去、前往、打開、打开、開啟、이동、이동해주세요、이동해、이동해요、가、가요、가세요、go to、move to、open、cd」等語氣時，優先判斷為 navigate_bible 或 open_prayer。
- 有「複製、复制、복사、copy、cp」才判斷為 copy_bible 或 copy_prayer。
- 使用者若是在問聖經含義、屬靈應用、相關經文、罪/美德/操練/安慰/勸勉，或用自然語句請你查經，回 semantic_bible_search。
- 使用者提到聖經但意圖不清楚，不要擅自複製，回 clarify_intent 並用使用者語言反問：要複製、移動，還是查詢相關經文。
- 完全不是聖經、主禱文或信仰經文相關，回 unknown。
- 主禱文/主祈禱文/주기도문/lord's prayer 是 prayer，不是 bible。
- copy_prayer 的 language: 中文語氣→zh；韓文語氣→ko；中韓/雙語/全部/all/both/한중/중한→both；未指定則依輸入語言。
- copy_bible 的 language 同上；cn/zh/chinese→zh，kr/ko/korean→ko。
- verses 是數字陣列；整章用 "all"。
- 無法判斷才回 unknown。
例：
移動 創5章 → {"action":"navigate_bible","bookId":"gen","chapter":5,"verse":null}
이동해주세요 창5장 → {"action":"navigate_bible","bookId":"gen","chapter":5,"verse":null}
啟5章 → {"action":"copy_bible","queries":[{"bookId":"rev","chapter":5,"verses":"all"}],"language":"zh"}
cp gen1:1 kr → {"action":"copy_bible","queries":[{"bookId":"gen","chapter":1,"verses":[1]}],"language":"ko"}
我常常懶惰拖延，請找相關經文幫助我 → {"action":"semantic_bible_search","question":"我常常懶惰拖延，請找相關經文幫助我","language":"zh"}
cp 주기도문 → {"action":"copy_prayer","language":"ko"}
移動到主禱文 → {"action":"open_prayer"}
輸入：${query}`;
    const response = await fetchAiWorker(prompt);
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    const aiText = data.text || data.response || data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = aiText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    return JSON.parse(cleaned);
}
async function runAiAssistantIntent(intent, query, input) {
    if (!intent || intent.action === 'unknown') return false;
    if (intent.action === 'clarify_intent') {
        const fallbackMessage = currentLang === 'ko'
            ? '원하시는 작업이 복사인지, 이동인지, 관련 경문 검색인지 확인해 주세요.\n예: cp 창1:1 / cd 창1:1 / 게으름에 관한 말씀 찾아줘'
            : '我不太確定你想做哪一件事，請確認是要「複製經文」、「移動到章節」，還是「查詢相關經文」。\n例：cp 創1:1 / cd 創1:1 / 查詢懶惰相關經文';
        saveAiPanelResult({
            query,
            text: intent.message || fallbackMessage,
            success: true,
            isPreview: true,
            timestamp: Date.now()
        });
        input.value = '';
        return true;
    }
    if (intent.action === 'semantic_bible_search') {
        await runSemanticBibleAssistantSearch(intent.question || query, query, input, intent.language);
        return true;
    }
    if (intent.action === 'open_prayer') {
        window.toggleAiPanel();
        window.switchPage('lords-prayer');
        input.value = '';
        return true;
    }
    if (intent.action === 'copy_prayer') {
        const prayer = await fetchLordsPrayer();
        const text = formatPrayerForCopy(prayer, intent.language);
        await navigator.clipboard.writeText(text);
        saveAiPanelResult({ query, text, success: true, timestamp: Date.now() });
        input.value = '';
        return true;
    }
    if (intent.action === 'navigate_bible') {
        const allBooks = [...bibleBooks.oldTestament, ...bibleBooks.newTestament];
        const book = allBooks.find(b => b.id === intent.bookId);
        const chapter = parseInt(intent.chapter, 10);
        const verse = intent.verse ? parseInt(intent.verse, 10) : null;
        if (!book || !Number.isFinite(chapter) || chapter < 1 || chapter > book.chapters) return false;
        window.toggleAiPanel();
        window.switchPage('bible');
        setTimeout(() => {
            selectBibleBook(book);
            setTimeout(() => openBibleChapter(book, chapter, { targetVerse: verse }), 300);
        }, 300);
        input.value = '';
        return true;
    }
    if (intent.action === 'copy_bible' && Array.isArray(intent.queries)) {
        const formatted = await formatBibleResult({
            queries: intent.queries,
            language: intent.language || (currentLang === 'ko' ? 'ko' : 'zh')
        });
        if (formatted.foundCount === 0) return false;
        await navigator.clipboard.writeText(formatted.text);
        saveAiPanelResult({ query, text: formatted.text, success: true, timestamp: Date.now() });
        input.value = '';
        return true;
    }
    return false;
}
function detectAssistantResponseLanguage(input) {
    const hasKorean = /[\uAC00-\uD7AF]/.test(input);
    const hasChinese = /[\u4E00-\u9FFF]/.test(input);
    if (hasChinese && !hasKorean) return 'zh';
    if (hasKorean && !hasChinese) return 'ko';
    return currentLang === 'ko' ? 'ko' : 'zh';
}
function normalizeSemanticVerseList(ref, chapterData) {
    if (!ref) return [];
    if (ref.verses === 'all') {
        return chapterData.filter(v => v.verse).map(v => v.verse);
    }
    if (Array.isArray(ref.verses)) {
        return [...new Set(ref.verses.map(v => parseInt(v, 10)).filter(Number.isFinite))].sort((a, b) => a - b);
    }
    if (Number.isFinite(parseInt(ref.verse, 10))) return [parseInt(ref.verse, 10)];
    if (typeof ref.verses === 'string') {
        const verses = [];
        ref.verses.split(/[,、，\s]+/).forEach(part => {
            const range = part.match(/^(\d+)\s*[-~]\s*(\d+)$/);
            if (range) {
                const start = parseInt(range[1], 10);
                const end = parseInt(range[2], 10);
                for (let i = start; i <= end; i++) verses.push(i);
            } else {
                const num = parseInt(part, 10);
                if (Number.isFinite(num)) verses.push(num);
            }
        });
        return [...new Set(verses)].sort((a, b) => a - b);
    }
    return [];
}
async function parseSemanticBibleSearchWithAI(question, preferredLanguage) {
    const allBooks = [...bibleBooks.oldTestament, ...bibleBooks.newTestament];
    const bookRef = allBooks.map(b => `${b.id}:${b.ko}/${b.zh}`).join(',');
    const answerLanguage = preferredLanguage === 'ko' ? '한국어' : '繁體中文';
    const prompt = `你是聖經語意查詢助手。請只處理聖經、主禱文、信仰經文應用相關問題。只回純 JSON，不要 markdown。
書卷ID: ${bookRef}
回傳格式：
{
  "action": "semantic_bible_search",
  "language": "${preferredLanguage}",
  "answer": "用${answerLanguage}只說：找到以下與某主題相關的經文。",
  "references": [
    {"bookId":"jhn","chapter":3,"verses":[3,5,6]}
  ]
}
其他情況：
- 如果完全不是聖經或信仰經文相關，回 {"action":"not_bible","message":"..."}
- 如果意圖只是像章節但不確定要複製、移動或查詢，回 {"action":"clarify_intent","message":"..."}
規則：
1. references 最多 8 組，優先給最相關、最能幫助使用者查考的經文。
2. bookId 必須使用上方書卷ID。
3. verses 可用數字陣列；若要整章可用 "all"，但請避免太長。
4. 不要虛構不存在的章節。
5. 你可以用推理能力尋找相關經文，但不可輸出自己的神學註釋、應用解釋、勸勉心得、原因分析。
6. 使用者若是在問懶惰、拖延、安慰、悔改、信心、愛、禱告、事奉、試探等主題，都屬於 semantic_bible_search。
7. answer 只能是一句導覽，例如「我找到以下與重生相關的經文：」，不要解釋經文含義。
8. references 裡不要放 reason、comment、summary、explanation 等註釋欄位。
使用者問題：${question}`;
    const response = await fetchAiWorker(prompt);
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    const aiText = data.text || data.response || data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = aiText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    return JSON.parse(cleaned);
}
async function formatSemanticBibleAssistantAnswer(analysis, language) {
    const references = Array.isArray(analysis.references) ? analysis.references.slice(0, 8) : [];
    const blocks = [];
    for (const ref of references) {
        const chapter = parseInt(ref.chapter, 10);
        if (!ref.bookId || !Number.isFinite(chapter)) continue;
        const chapterData = await fetchBibleChapter(ref.bookId, chapter);
        if (!chapterData) continue;
        const verses = normalizeSemanticVerseList(ref, chapterData);
        if (!verses.length) continue;
        const verseData = verses
            .map(vNum => {
                const vd = chapterData.find(v => v.verse === vNum);
                return vd ? { verse: vNum, data: vd } : null;
            })
            .filter(Boolean);
        if (!verseData.length) continue;
        const abbr = bookAbbreviations[ref.bookId] || { ko: ref.bookId, zh: ref.bookId };
        const rows = verseData.map(item => ({
            verse: item.verse,
            text: language === 'ko' ? (item.data.ko || item.data.zh || '') : (item.data.zh || item.data.ko || '')
        }));
        const passage = formatBibleCopyBlock({
            abbr: language === 'ko' ? abbr.ko : abbr.zh,
            chapter,
            verses: rows.map(row => row.verse),
            verseRows: rows,
            lang: language
        });
        blocks.push(passage);
    }
    const title = language === 'ko' ? 'AI 성경 검색' : 'AI 聖經查詢';
    const answer = analysis.answer ? `${analysis.answer}\n\n` : '';
    const body = blocks.length
        ? blocks.join('\n\n')
        : (language === 'ko' ? '관련 경문을 찾지 못했습니다.' : '暫時找不到明確相關經文。');
    return `${title}\n\n${answer}${body}`;
}
async function runSemanticBibleAssistantSearch(question, originalQuery, input, languageHint = null) {
    const language = (languageHint === 'ko' || languageHint === 'zh') ? languageHint : detectAssistantResponseLanguage(question);
    const analysis = await parseSemanticBibleSearchWithAI(question, language);
    if (analysis?.action === 'clarify_intent') {
        saveAiPanelResult({
            query: originalQuery,
            text: analysis.message || (language === 'ko'
                ? '복사, 이동, 관련 경문 검색 중 무엇을 원하시나요?'
                : '請問你想複製、移動，還是查詢相關經文？'),
            success: true,
            isPreview: true,
            timestamp: Date.now()
        });
        input.value = '';
        return;
    }
    if (analysis?.action === 'not_bible') {
        saveAiPanelResult({
            query: originalQuery,
            text: analysis.message || (language === 'ko'
                ? '이 AI 도우미는 성경 관련 질문만 도와드릴 수 있습니다.'
                : '這個 AI 助手目前只協助聖經相關問題。'),
            success: false,
            timestamp: Date.now()
        });
        input.value = '';
        return;
    }
    const text = await formatSemanticBibleAssistantAnswer(analysis || {}, language);
    saveAiPanelResult({
        query: originalQuery,
        text,
        success: true,
        isPreview: true,
        timestamp: Date.now()
    });
    input.value = '';
}
function saveAiPanelResult(item) {
    try {
        const cached = JSON.parse(localStorage.getItem(AI_PANEL_CACHE_KEY) || '[]');
        cached.unshift(item);
        // 最多保留20條
        const trimmed = cached.slice(0, 20);
        localStorage.setItem(AI_PANEL_CACHE_KEY, JSON.stringify(trimmed));
        loadAiPanelCache();
    } catch (e) {}
}
// ===== 聖經經文相關 =====
// ===== AI 智能複製功能（複製模式面板用） =====
window.smartCopy = async () => {
    const input = document.getElementById('smartCopyInput');
    const btn = document.getElementById('smartCopyBtn');
    const resultDiv = document.getElementById('smartCopyResult');
    const resultText = document.getElementById('smartCopyResultText');
    const previewDiv = document.getElementById('smartCopyPreview');
    const query = input.value.trim();
    if (!query) {
        input.focus();
        return;
    }
    // 構建書卷對照表（給AI用）
    const allBooks = [...bibleBooks.oldTestament, ...bibleBooks.newTestament];
    const bookRef = allBooks.map(b => {
        const abbr = bookAbbreviations[b.id] || {};
        return `${b.id}: ${b.ko}(${abbr.ko||''}) / ${b.zh}(${abbr.zh||''}) [${b.chapters}章]`;
    }).join('\n');
    // 構建已有 JSON 的書卷清單（用 bibleBooks 的完整列表）
    const allBooksForPrompt = [...bibleBooks.oldTestament, ...bibleBooks.newTestament];
    const prompt = `你是一個聖經經文解析助手。用戶輸入了一段文字，請解析出他想要複製的聖經經文。
書卷ID對照表：
${bookRef}
請務必返回純JSON格式（不要markdown），格式如下：
{
  "queries": [
{ "bookId": "gen", "chapter": 1, "verses": [1,2,3] }
  ],
  "language": "both"
}
規則：
- bookId 必須使用上方對照表中的ID（如 gen, exo, mat, rev 等）
- verses 是數字陣列，如 [1,2,3] 或連續範圍展開如 1-5 → [1,2,3,4,5]
- 用戶可能用縮寫（創、창、Gen）、全名（創世記、창세기）或混合語言
- 如果用戶寫"全部"/"전체"/"all"/"全"/"都"/"다"，verses設為"all"
- 多個引用可能用空格分隔，例如「創1:2-3、6 出2:1」要解析成兩筆 queries
語言判斷規則（language 欄位）：
- "zh" = 只要中文。觸發詞：中文、中、중국어、중、cn、zh、chinese
- "ko" = 只要韓文。觸發詞：韓文、韓、한국어、한、kr、ko、korean
- "both" = 兩種都要。觸發詞：中韓、韓中、雙語、한중、중한、한 중、중 한、全部、全、都、다、all、兩個、양쪽
- 如果沒有任何語言關鍵字，根據用戶主要輸入語言推斷：中文書名輸入→"zh"，韓文書名輸入→"ko"
- 語言關鍵字可能出現在經文引用的前面或後面，甚至用空格或不用空格分隔
輸入格式範例（都要能正確解析）：
- "創1:1-4 中" → gen 1章 1-4節 language=zh
- "창1:1-4 한국어" → gen 1章 1-4節 language=ko
- "創1:1-4 全部" → gen 1章 1-4節 language=both
- "啟1:5中韓" → rev 1章 5節 language=both
- "啟1:5 한 중" → rev 1章 5節 language=both
- "창1:1-4 중" → gen 1章 1-4節 language=zh
- "창1:1-4 다" → gen 1章 1-4節 language=both
- "Gen 1:1-4 all" → gen 1章 1-4節 language=both
- "賽2:4 韓" → isa 2章 4節 language=ko
- "사2:4 중국어" → isa 2章 4節 language=zh
- "創1:2-3、6 出2:1 中" → gen 1章 2,3,6節 + exo 2章 1節 language=zh
- 如果無法解析，返回 { "error": "無法識別的經文格式" }
用戶輸入：${query}`;
    // UI 狀態
    btn.classList.add('loading');
    btn.disabled = true;
    resultDiv.classList.remove('show');
    try {
        const localParsed = parseBibleQuery(query);
        const localFormatted = localParsed.queries.length > 0
            ? await formatBibleResult(localParsed)
            : { text: '', foundCount: 0 };
        if (localFormatted.foundCount > 0) {
            resultDiv.className = 'smart-copy-result show success';
            resultText.textContent = currentLang === 'ko'
                ? `✅ ${localFormatted.foundCount}절 찾았습니다`
                : `✅ 找到 ${localFormatted.foundCount} 節經文`;
            previewDiv.textContent = localFormatted.text.length > 300
                ? localFormatted.text.substring(0, 300) + '...'
                : localFormatted.text;
            await navigator.clipboard.writeText(localFormatted.text);
            resultText.textContent += currentLang === 'ko' ? ' (복사됨!)' : ' (已複製！)';
            input.value = '';
            return;
        }
        const response = await fetchAiWorker(prompt);
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        const aiText = data.text || data.response || data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        // 解析JSON（容錯處理）
        let parsed;
        try {
            const jsonStr = aiText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
            parsed = JSON.parse(jsonStr);
        } catch (e) {
            throw new Error('AI 回應格式錯誤');
        }
        if (parsed.error) {
            throw new Error(parsed.error);
        }
        // 從 JSON 中提取經文（async fetch）
        const lang = parsed.language || 'both';
        let fullText = '';
        let foundCount = 0;
        for (const q of parsed.queries) {
            const chapterData = await fetchBibleChapter(q.bookId, q.chapter);
            if (!chapterData) {
                const bookInfo = allBooks.find(b => b.id === q.bookId);
                const bookName = bookInfo ? (currentLang === 'ko' ? bookInfo.ko : bookInfo.zh) : q.bookId;
                fullText += `[${bookName} ${q.chapter}${currentLang === 'ko' ? '장' : '章'} - ${currentLang === 'ko' ? '미수록' : '尚未收錄'}]\n`;
                continue;
            }
            const abbr = bookAbbreviations[q.bookId] || { ko: q.bookId, zh: q.bookId };
            const verses = q.verses === 'all'
                ? chapterData.filter(v => v.verse).map(v => v.verse)
                : q.verses;
            for (const vNum of verses) {
                const verseData = chapterData.find(v => v.verse === vNum);
                if (!verseData) continue;
                foundCount++;
                if (lang === 'ko') {
                    fullText += `${abbr.ko} ${q.chapter}:${vNum} ${verseData.ko || ''}\n`;
                } else if (lang === 'zh') {
                    fullText += `${abbr.zh} ${q.chapter}:${vNum} ${verseData.zh || ''}\n`;
                } else {
                    fullText += `${abbr.ko} ${q.chapter}:${vNum} ${verseData.ko || ''}\n`;
                    fullText += `${abbr.zh} ${q.chapter}:${vNum} ${verseData.zh || ''}\n\n`;
                }
            }
        }
        fullText = fullText.trim();
        if (foundCount === 0) {
            throw new Error(currentLang === 'ko' ? '해당 경문을 찾을 수 없습니다' : '找不到對應的經文');
        }
        // 顯示預覽
        resultDiv.className = 'smart-copy-result show success';
        resultText.textContent = currentLang === 'ko'
            ? `✅ ${foundCount}절 찾았습니다`
            : `✅ 找到 ${foundCount} 節經文`;
        previewDiv.textContent = fullText.length > 300 ? fullText.substring(0, 300) + '...' : fullText;
        // 複製到剪貼簿
        await navigator.clipboard.writeText(fullText);
        resultText.textContent += currentLang === 'ko' ? ' (복사됨!)' : ' (已複製！)';
    } catch (err) {
        resultDiv.className = 'smart-copy-result show error';
        resultText.textContent = '❌ ' + (err.message || 'Error');
        previewDiv.textContent = '';
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
};
// 複製模式下的觸控追蹤
let copyModeTouchStartX = 0;
let copyModeTouchStartY = 0;
let copyModeTouchMoved = false;
function isBibleVerseInteractionBlocked() {
    return Boolean(
        document.querySelector('.bible-collection-list.show') ||
        document.getElementById('aiPanel')?.classList.contains('show') ||
        document.getElementById('bibleSearchPanel')?.classList.contains('show') ||
        document.getElementById('bibleDisplayPanel')?.classList.contains('show') ||
        document.getElementById('notificationPanel')?.classList.contains('show')
    );
}
// 手機觸控開始
window.handleVerseTouchStart = (event, element) => {
    if (isBibleVerseInteractionBlocked()) {
        clearLongPressState();
        return;
    }
    // 如果已在複製模式，記錄觸控起始位置
    if (isCopyModeActive) {
        copyModeTouchStartX = event.touches[0].clientX;
        copyModeTouchStartY = event.touches[0].clientY;
        copyModeTouchMoved = false;
        return;
    }
    clearLongPressState();
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    longPressElement = element;
    element.classList.add('long-press');
    longPressTimer = setTimeout(() => {
        triggerLongPress(event, element);
    }, LONG_PRESS_DURATION);
};
// 手機觸控結束
window.handleVerseTouchEnd = (event, element) => {
    if (isBibleVerseInteractionBlocked()) {
        clearLongPressState();
        return;
    }
    // 如果在複製模式，處理選取切換（只在沒有滑動時）
    if (isCopyModeActive) {
        if (!copyModeTouchMoved) {
            event.preventDefault();
            toggleVerseSelection(element);
        }
        return;
    }
    if (!longPressTriggered) {
        clearLongPressState();
    }
};
// 手機觸控移動（取消長按）
window.handleVerseTouchMove = (event, element) => {
    if (isBibleVerseInteractionBlocked()) {
        clearLongPressState();
        return;
    }
    // 如果在複製模式，檢測是否滑動
    if (isCopyModeActive) {
        const touch = event.touches[0];
        const moveX = Math.abs(touch.clientX - copyModeTouchStartX);
        const moveY = Math.abs(touch.clientY - copyModeTouchStartY);
        // 移動超過10px視為滑動
        if (moveX > 10 || moveY > 10) {
            copyModeTouchMoved = true;
            clearWordStudyFocus();
        }
        return;
    }
    if (longPressTriggered) {
        const touch = event.touches[0];
        const moveX = Math.abs(touch.clientX - touchStartX);
        const moveY = Math.abs(touch.clientY - touchStartY);
        if (moveX > 10 || moveY > 10) {
            clearWordStudyFocus();
        }
        return;
    }
    if (longPressTimer) {
        const touch = event.touches[0];
        const moveX = Math.abs(touch.clientX - touchStartX);
        const moveY = Math.abs(touch.clientY - touchStartY);
        // 移動超過10px則取消長按
        if (moveX > 10 || moveY > 10) {
            clearWordStudyFocus();
            clearLongPressState();
        }
    }
};
// 電腦滑鼠按下（左鍵長按）
window.handleVerseMouseDown = (event, element) => {
    if (isBibleVerseInteractionBlocked()) {
        clearLongPressState();
        return;
    }
    // 只處理左鍵
    if (event.button !== 0) return;
    // 如果已在複製模式，不需要長按計時
    if (isCopyModeActive) {
        return;
    }
    clearLongPressState();
    longPressElement = element;
    element.classList.add('long-press');
    longPressTimer = setTimeout(() => {
        triggerLongPress(event, element);
    }, LONG_PRESS_DURATION);
};
// 電腦滑鼠放開
window.handleVerseMouseUp = (event, element) => {
    if (isBibleVerseInteractionBlocked()) {
        clearLongPressState();
        return;
    }
    // 如果在複製模式，處理選取切換
    if (isCopyModeActive) {
        event.preventDefault();
        toggleVerseSelection(element);
        return;
    }
    if (!longPressTriggered) {
        clearLongPressState();
    }
};
// 電腦滑鼠離開
window.handleVerseMouseLeave = (event, element) => {
    if (isBibleVerseInteractionBlocked()) {
        clearLongPressState();
        return;
    }
    if (!longPressTriggered && !isCopyModeActive) {
        clearLongPressState();
    }
};
// 電腦右鍵選單 - 也進入複製模式
window.handleVerseContextMenu = (event, element) => {
    event.preventDefault();
    if (isBibleVerseInteractionBlocked()) {
        clearLongPressState();
        return false;
    }
    clearLongPressState();
    showWordStudyAction(event, element);
    return false;
};
// 禁用聖經內容區域的系統右鍵選單
document.addEventListener('DOMContentLoaded', () => {
    const bibleVerses = document.getElementById('bibleVerses');
    const previewBody = document.getElementById('bibleSearchPreviewBody');
    if (bibleVerses) {
        bibleVerses.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.bible-verse')) {
                clearLongPressState();
            }
        });
    }
    if (previewBody) {
        previewBody.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.bible-search-preview-verse')) {
                e.preventDefault();
            }
        });
    }
});
// 關閉部分複製彈窗
window.closePartialCopy = () => {
    document.getElementById('biblePartialCopyModal').classList.remove('show');
};
// 複製選取的文字（部分複製用）
window.copySelectedText = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (!selectedText) {
        const msg = currentLang === 'ko' ? '텍스트를 먼저 선택하세요.' : '請先選取文字。';
        alert(msg);
        return;
    }
    navigator.clipboard.writeText(selectedText).then(() => {
        const t = i18n[currentLang];
        alert(t.msgCopied || '已複製！');
        closePartialCopy();
    }).catch(err => {
        // 備用複製方法
        const textarea = document.createElement('textarea');
        textarea.value = selectedText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        const t = i18n[currentLang];
        alert(t.msgCopied || '已複製！');
        closePartialCopy();
    });
};
// ===== 滑動時退出複製模式 =====
let scrollTouchStartY = 0;
document.addEventListener('touchstart', (e) => {
    scrollTouchStartY = e.touches[0].clientY;
}, { passive: true });
document.addEventListener('touchmove', (e) => {
    const touchMoveY = e.touches[0].clientY;
    const diff = Math.abs(touchMoveY - scrollTouchStartY);
    // 滑動時不自動關閉複製模式，只清除長按狀態
    if (diff > 10) {
        if (!document.getElementById('wordStudyOverlay')?.classList.contains('show')) clearWordStudyFocus();
        else clearLongPressState();
    }
}, { passive: true });
document.addEventListener('scroll', () => {
    if (document.getElementById('wordStudyOverlay')?.classList.contains('show')) return;
    if (document.getElementById('wordStudyActionBubble')?.classList.contains('show') || activeWordStudyVerseElement) {
        clearWordStudyFocus();
    }
}, { passive: true, capture: true });
window.addEventListener('wheel', () => {
    if (document.getElementById('wordStudyOverlay')?.classList.contains('show')) return;
    if (document.getElementById('wordStudyActionBubble')?.classList.contains('show') || activeWordStudyVerseElement) {
        clearWordStudyFocus();
    }
}, { passive: true });
// ===== 聖經搜尋功能 =====
const SEARCH_HISTORY_KEY = 'bible_search_history';
const MAX_HISTORY_ITEMS = 5;
let searchHistory = [];
let bibleSearchIndexCache = null;
let bibleSearchIndexPromise = null;
let bibleSearchPreviewToken = 0;
async function loadBibleSearchIndex() {
    if (bibleSearchIndexCache) return bibleSearchIndexCache;
    if (bibleSearchIndexPromise) return bibleSearchIndexPromise;
    bibleSearchIndexPromise = fetch(`/bible-search-index.json?v=${encodeURIComponent(APP_VERSION)}`)
        .then(res => {
            if (!res.ok) throw new Error('Search index unavailable');
            return res.json();
        })
        .then(data => {
            bibleSearchIndexCache = Array.isArray(data?.items) ? data.items : [];
            return bibleSearchIndexCache;
        })
        .catch(() => {
            bibleSearchIndexCache = [];
            return bibleSearchIndexCache;
        })
        .finally(() => {
            bibleSearchIndexPromise = null;
        });
    return bibleSearchIndexPromise;
}
// 載入搜尋歷史
function loadSearchHistory() {
    try {
        const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
        if (saved) {
            searchHistory = JSON.parse(saved);
        }
    } catch (e) {
        searchHistory = [];
    }
    renderSearchHistory();
}
// 儲存搜尋歷史
function saveSearchHistory() {
    try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
    } catch (e) {}
}
// 新增搜尋歷史
function addSearchHistory(keyword) {
    if (!keyword || keyword.length < 2) return;
    // 移除重複的
    searchHistory = searchHistory.filter(k => k !== keyword);
    // 加到最前面
    searchHistory.unshift(keyword);
    // 保留最多5個
    if (searchHistory.length > MAX_HISTORY_ITEMS) {
        searchHistory = searchHistory.slice(0, MAX_HISTORY_ITEMS);
    }
    saveSearchHistory();
    renderSearchHistory();
}
// 渲染搜尋歷史
function renderSearchHistory() {
    const container = document.getElementById('bibleSearchHistory');
    const section = document.getElementById('bibleSearchHistorySection');
    if (searchHistory.length === 0) {
        section.style.display = 'none';
        return;
    }
    section.style.display = 'block';
    container.innerHTML = searchHistory.map(keyword =>
        `<button class="bible-search-history-item" onclick="window.searchFromHistory('${keyword}')">${keyword}</button>`
    ).join('');
}
// 從歷史搜尋（點擊歷史紀錄直接觸發）
window.searchFromHistory = async (keyword) => {
    const input = document.getElementById('bibleSearchInput');
    input.value = keyword;
    clearTimeout(bibleSearchPreviewDebounce);
    document.getElementById('bibleSearchClear')?.classList.add('show');
    await renderLocalBibleSearchPreview(keyword, { saveHistory: true, immediate: true });
};
// 開啟搜尋面板
window.openBibleSearch = () => {
    const panel = document.getElementById('bibleSearchPanel');
    const trigger = document.getElementById('navBibleSearchBtn');
    document.getElementById('bibleSearchOverlay').classList.add('show');
    setNavPanelState(panel, trigger, 'search', true);
    focusWithoutPageScroll(document.getElementById('bibleSearchInput'));
    syncUiScrollLock();
    // 更新搜尋提示語言
    updateSearchLanguage();
    loadSearchHistory();
};
// 關閉搜尋面板
window.closeBibleSearch = () => {
    document.getElementById('bibleSearchPreview')?.classList.remove('show');
    const panel = document.getElementById('bibleSearchPanel');
    const trigger = document.getElementById('navBibleSearchBtn');
    document.getElementById('bibleSearchOverlay').classList.remove('show');
    setNavPanelState(panel, trigger, 'search', false);
    clearSearchInput();
    syncUiScrollLock();
};
// 更新搜尋面板語言
function updateSearchLanguage() {
    const input = document.getElementById('bibleSearchInput');
    const hint = document.getElementById('txtSearchHint');
    const historyTitle = document.getElementById('txtSearchHistory');
    const cancelBtn = document.getElementById('bibleSearchCancelText');
    if (currentLang === 'ko') {
        if (input) input.placeholder = '성경 검색 또는 주제 검색...';
        if (hint) hint.textContent = '키워드 또는 의미 검색 가능 (예: 게으름, 용기)';
        if (historyTitle) historyTitle.textContent = '최근 검색';
        if (cancelBtn) cancelBtn.textContent = '취소';
    } else {
        if (input) input.placeholder = '搜尋經文或主題...';
        if (hint) hint.textContent = '可輸入關鍵字或主題（例：懶惰、勇氣、愛）';
        if (historyTitle) historyTitle.textContent = '近期搜尋';
        if (cancelBtn) cancelBtn.textContent = '取消';
    }
}
// 清除搜尋輸入
window.clearSearchInput = () => {
    document.getElementById('bibleSearchInput').value = '';
    document.getElementById('bibleSearchClear').classList.remove('show');
    document.getElementById('bibleSearchResults').style.display = 'none';
    document.getElementById('bibleSearchAiLoading').style.display = 'none';
    document.getElementById('bibleSearchHint').style.display = 'block';
    document.getElementById('bibleSearchHistorySection').style.display = searchHistory.length > 0 ? 'block' : 'none';
    setBibleAiSearchState(false);
};
// 處理搜尋輸入
let bibleSearchPreviewDebounce = null;
function setBibleAiSearchState(active) {
    const wrap = document.querySelector('.bible-search-input-wrap');
    const btn = document.getElementById('bibleSearchAiBtn');
    wrap?.classList.toggle('ai-searching', active);
    if (btn) btn.disabled = active;
}
async function renderLocalBibleSearchPreview(keyword, options = {}) {
    const value = String(keyword || '').trim();
    const results = document.getElementById('bibleSearchResults');
    const hint = document.getElementById('bibleSearchHint');
    const historySection = document.getElementById('bibleSearchHistorySection');
    const aiLoading = document.getElementById('bibleSearchAiLoading');
    const token = options.immediate ? ++bibleSearchPreviewToken : bibleSearchPreviewToken;
    if (!value) {
        results.style.display = 'none';
        aiLoading.style.display = 'none';
        hint.style.display = searchHistory.length === 0 ? 'block' : 'none';
        historySection.style.display = searchHistory.length > 0 ? 'block' : 'none';
        return [];
    }
    results.innerHTML = `<div class="bible-search-no-result">${currentLang === 'ko' ? '성경 검색어를 읽는 중...' : '正在讀取聖經詞庫...'}</div>`;
    results.style.display = 'block';
    hint.style.display = 'none';
    historySection.style.display = 'none';
    aiLoading.style.display = 'none';
    const localResults = await searchBible(value);
    if (token !== bibleSearchPreviewToken) return [];
    renderSearchResults(localResults, value, false);
    results.style.display = 'block';
    if (options.saveHistory) addSearchHistory(value);
    return localResults;
}
window.handleSearchInput = (value) => {
    const clearBtn = document.getElementById('bibleSearchClear');
    const results = document.getElementById('bibleSearchResults');
    const hint = document.getElementById('bibleSearchHint');
    const historySection = document.getElementById('bibleSearchHistorySection');
    const aiLoading = document.getElementById('bibleSearchAiLoading');
    clearTimeout(bibleSearchPreviewDebounce);
    clearBtn?.classList.toggle('show', value.length > 0);
    if (value.length === 0) {
        results.style.display = 'none';
        aiLoading.style.display = 'none';
        hint.style.display = searchHistory.length === 0 ? 'block' : 'none';
        historySection.style.display = searchHistory.length > 0 ? 'block' : 'none';
    } else {
        hint.style.display = 'none';
        historySection.style.display = 'none';
        bibleSearchPreviewDebounce = setTimeout(() => {
            bibleSearchPreviewToken += 1;
            renderLocalBibleSearchPreview(value);
        }, 140);
    }
};
// 按 Enter 才執行搜尋
window.handleSearchKeydown = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const value = e.target.value.trim();
    if (!value || value.length < 1) return;
    e.target.blur();
    renderLocalBibleSearchPreview(value, { saveHistory: true, immediate: true });
};
window.runBibleAiSearch = async () => {
    const input = document.getElementById('bibleSearchInput');
    const value = input?.value.trim() || '';
    if (!value) {
        input?.focus();
        return;
    }
    input?.blur();
    const aiLoading = document.getElementById('bibleSearchAiLoading');
    aiLoading.style.display = 'flex';
    setBibleAiSearchState(true);
    const localResults = await renderLocalBibleSearchPreview(value, { saveHistory: true, immediate: true });
    aiLoading.style.display = 'flex';
    try {
        await searchBibleWithAI(value, localResults);
    } finally {
        setBibleAiSearchState(false);
    }
};
// 本地關鍵字搜尋（優先搜完整詞庫；失敗時退回已快取章節）
async function searchBible(keyword) {
    const index = await loadBibleSearchIndex();
    if (index.length > 0) {
        const results = [];
        const lower = keyword.toLowerCase();
        const allBooks = [...bibleBooks.oldTestament, ...bibleBooks.newTestament];
        const bookMap = new Map(allBooks.map(book => [book.id, book]));
        for (const item of index) {
            const [bookId, chapter, verse, koText = '', zhText = ''] = item;
            if (!zhText.toLowerCase().includes(lower) && !koText.toLowerCase().includes(lower)) continue;
            const book = bookMap.get(bookId);
            if (!book) continue;
            results.push({
                bookId, bookKo: book.ko, bookZh: book.zh,
                chapter: Number(chapter),
                verse, ko: koText, zh: zhText,
                type: 'keyword'
            });
            if (results.length >= 80) break;
        }
        return results;
    }
    const results = [];
    const lower = keyword.toLowerCase();
    for (const key in bibleCache) {
        const verses = bibleCache[key];
        if (!verses || !Array.isArray(verses)) continue;
        const [bookId, chapterStr] = key.split('_');
        const book = [...bibleBooks.oldTestament, ...bibleBooks.newTestament].find(b => b.id === bookId);
        if (!book) continue;
        for (const verse of verses) {
            if (verse.type === 'heading') continue;
            const zhText = verse.zh || '';
            const koText = verse.ko || '';
            if (zhText.toLowerCase().includes(lower) || koText.toLowerCase().includes(lower)) {
                results.push({
                    bookId, bookKo: book.ko, bookZh: book.zh,
                    chapter: parseInt(chapterStr),
                    verse: verse.verse, ko: koText, zh: zhText,
                    type: 'keyword'
                });
            }
        }
    }
    return results;
}
// AI 語意搜尋
async function searchBibleWithAI(keyword, localResults) {
    const aiLoading = document.getElementById('bibleSearchAiLoading');
    const results = document.getElementById('bibleSearchResults');
    const loadingText = document.getElementById('bibleSearchAiLoadingText');
    if (loadingText) loadingText.textContent = currentLang === 'ko' ? 'AI 분석 중...' : 'AI 語意分析中...';
    try {
        const prompt = `你是聖經語意搜尋助手。用戶搜尋「${keyword}」，請找出聖經中與此概念相關的章節（包含意義上相近的內容，不只是字面匹配）。
規則：
1. 回傳純JSON陣列，不要markdown
2. 最多回傳10個最相關的結果
3. 只使用我提供的書卷範圍
4. 格式：[{"bookId":"gen","chapter":1,"verse":1,"reason":"相關原因（一句話，${currentLang === 'ko' ? '한국어' : '中文'}）"}]
5. bookId 使用縮寫：gen exo lev num deu jos jdg rut 1sa 2sa 1ki 2ki 1ch 2ch ezr neh est job psa pro ecc sng isa jer lam ezk dan hos jol amo oba jon mic nam hab zep hag zec mal mat mrk luk jhn act rom 1co 2co gal eph php col 1th 2th 1ti 2ti tit phm heb jas 1pe 2pe 1jn 2jn 3jn jud rev
6. 只回傳已確定存在的章節（不要猜測）
7. 如果找不到相關內容，回傳空陣列 []
搜尋概念：${keyword}`;
        const response = await fetchAiWorker(prompt);
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        const text = data.text || data.response || data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        const aiSuggestions = JSON.parse(cleaned);
        if (!Array.isArray(aiSuggestions)) throw new Error('Invalid response');
        // 載入 AI 建議的章節
        const aiResults = [];
        for (const s of aiSuggestions.slice(0, 10)) {
            const chapterData = await fetchBibleChapter(s.bookId, s.chapter);
            if (!chapterData) continue;
            const verseData = chapterData.find(v => v.verse === s.verse);
            if (!verseData) {
                // 找不到該節，嘗試第1節
                const fallback = chapterData.find(v => v.verse === 1);
                if (!fallback) continue;
                const book = [...bibleBooks.oldTestament, ...bibleBooks.newTestament].find(b => b.id === s.bookId);
                if (!book) continue;
                aiResults.push({
                    bookId: s.bookId, bookKo: book.ko, bookZh: book.zh,
                    chapter: s.chapter, verse: 1,
                    ko: fallback.ko || '', zh: fallback.zh || '',
                    reason: s.reason, type: 'ai'
                });
            } else {
                const book = [...bibleBooks.oldTestament, ...bibleBooks.newTestament].find(b => b.id === s.bookId);
                if (!book) continue;
                aiResults.push({
                    bookId: s.bookId, bookKo: book.ko, bookZh: book.zh,
                    chapter: s.chapter, verse: s.verse,
                    ko: verseData.ko || '', zh: verseData.zh || '',
                    reason: s.reason, type: 'ai'
                });
            }
        }
        // 合併並去重
        const combined = [...localResults];
        for (const ai of aiResults) {
            const isDup = localResults.some(l => l.bookId === ai.bookId && l.chapter === ai.chapter && l.verse === ai.verse);
            if (!isDup) combined.push(ai);
        }
        renderSearchResults(combined, keyword, aiResults.length > 0);
        results.style.display = combined.length > 0 ? 'block' : 'none';
    } catch (e) {
        // AI 失敗時只顯示本地結果
        if (localResults.length > 0) {
            renderSearchResults(localResults, keyword, false);
            results.style.display = 'block';
        }
    } finally {
        aiLoading.style.display = 'none';
    }
}
// 渲染搜尋結果
function renderSearchResults(results, keyword, aiActive = false) {
    const container = document.getElementById('bibleSearchResults');
    if (results.length === 0) {
        container.innerHTML = `<div class="bible-search-no-result">${currentLang === 'ko' ? '검색 결과가 없습니다' : '找不到相關結果'}</div>`;
        return;
    }
    const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const safeKeyword = escapeRegExp(keyword);
    // 分組：關鍵字命中 / AI 建議
    const keywordResults = results.filter(r => r.type !== 'ai');
    const aiResults = results.filter(r => r.type === 'ai');
    const renderItem = (r, index) => {
        const abbr = bookAbbreviations[r.bookId] || { ko: r.bookId, zh: r.bookId };
        const refZh = `${abbr.zh} ${r.chapter}:${r.verse}`;
        const refKo = `${abbr.ko} ${r.chapter}:${r.verse}`;
        let zhText = r.zh || '';
        let koText = r.ko || '';
        try {
            zhText = zhText.replace(new RegExp(safeKeyword, 'g'), `<mark>${keyword}</mark>`);
            koText = koText.replace(new RegExp(safeKeyword, 'g'), `<mark>${keyword}</mark>`);
        } catch(e) {}
        const aiBadge = r.type === 'ai' ? `<span class="bible-search-ai-badge">AI</span>` : '';
        return `
            <div class="bible-search-result-item" onclick="window.openSearchPreview(${index})">
                <div class="bible-search-result-ref">${refKo} / ${refZh}${aiBadge}</div>
                ${koText ? `<div class="bible-search-result-text" style="color:#777;font-size:0.88rem;margin-bottom:3px;">${koText}</div>` : ''}
                <div class="bible-search-result-text">${zhText}</div>
            </div>`;
    };
    let html = '';
    if (keywordResults.length > 0) {
        if (aiActive || aiResults.length > 0) {
            html += `<div class="bible-search-result-group-title">${currentLang === 'ko' ? '직접 일치' : '直接相符'}</div>`;
        }
        html += keywordResults.slice(0, 30).map((r, i) => renderItem(r, results.indexOf(r))).join('');
    }
    if (aiResults.length > 0) {
        html += `<div class="bible-search-result-group-title">AI ${currentLang === 'ko' ? '관련 구절' : '語意相關'}</div>`;
        html += aiResults.map((r) => renderItem(r, results.indexOf(r))).join('');
    }
    if (!html) {
        html = `<div class="bible-search-no-result">${currentLang === 'ko' ? '검색 결과가 없습니다' : '找不到相關結果'}</div>`;
    }
    container.innerHTML = html;
    window.currentSearchResults = results;
}
// 開啟搜尋結果預覽
window.openSearchPreview = (index) => {
    const result = window.currentSearchResults[index];
    if (!result) return;
    window.currentSearchPreviewResult = result;
    const preview = document.getElementById('bibleSearchPreview');
    const title = document.getElementById('bibleSearchPreviewTitle');
    const body = document.getElementById('bibleSearchPreviewBody');
    const abbr = bookAbbreviations[result.bookId];
    title.textContent = currentLang === 'ko'
        ? `${result.bookKo} ${result.chapter}:${result.verse}`
        : `${result.bookZh} ${result.chapter}:${result.verse}`;
    // 渲染經文內容（可長按或右鍵複製）
    body.innerHTML = `
        <div class="bible-search-preview-verse"
             data-book-id="${result.bookId}"
             data-chapter="${result.chapter}"
             data-verse="${result.verse}"
             data-ko="${encodeURIComponent(result.ko)}"
             data-zh="${encodeURIComponent(result.zh)}"
             oncontextmenu="window.handlePreviewContextMenu(event, this)"
             ontouchstart="window.handlePreviewTouchStart(event, this)"
             ontouchend="window.handlePreviewTouchEnd(event, this)"
             ontouchmove="window.handlePreviewTouchMove(event, this)"
             onmousedown="window.handlePreviewMouseDown(event, this)"
             onmouseup="window.handlePreviewMouseUp(event, this)"
             onmouseleave="window.handlePreviewMouseLeave(event, this)">
            <div class="verse-num" style="color: var(--primary-green); font-weight: bold; margin-bottom: 10px; font-size: 1.15rem;">
                ${result.verse}
            </div>
            <div class="verse-text-ko" style="color: #555; font-size: 1.15rem; margin-bottom: 10px; line-height: 1.8; font-family: var(--font-bible-current);">
                ${result.ko}
            </div>
            <div class="verse-text-zh" style="font-size: 1.2rem; line-height: 1.9; font-family: var(--font-bible-current);">
                ${result.zh}
            </div>
        </div>
    `;
    preview.classList.add('show');
};
// 關閉搜尋預覽
window.closeSearchPreview = (openChapter = true) => {
    document.getElementById('bibleSearchPreview').classList.remove('show');
    if (!openChapter) return;
    const result = window.currentSearchPreviewResult;
    if (!result) return;
    const allBooks = [...bibleBooks.oldTestament, ...bibleBooks.newTestament];
    const book = allBooks.find(b => b.id === result.bookId);
    if (!book) return;
    window.closeBibleSearch();
    window.switchPage('bible');
    setTimeout(() => {
        selectBibleBook(book);
        setTimeout(() => openBibleChapter(book, result.chapter), 120);
    }, 80);
};
// 預覽頁長按相關變數
let previewLongPressTimer = null;
let previewLongPressElement = null;
let previewLongPressTriggered = false;
let previewTouchStartX = 0;
let previewTouchStartY = 0;
// 清除預覽頁長按狀態
function clearPreviewLongPressState() {
    if (previewLongPressTimer) {
        clearTimeout(previewLongPressTimer);
        previewLongPressTimer = null;
    }
    if (previewLongPressElement) {
        previewLongPressElement.classList.remove('long-press');
        previewLongPressElement = null;
    }
    previewLongPressTriggered = false;
}
// 觸發預覽頁長按成功
function triggerPreviewLongPress(event, element) {
    previewLongPressTriggered = true;
    element.classList.remove('long-press');
    element.classList.add('long-press-success');
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    setTimeout(() => {
        element.classList.remove('long-press-success');
        // 直接複製雙語版本
        copyPreviewVerse(element);
    }, 100);
}
// 複製預覽頁經文（雙語）
function copyPreviewVerse(element) {
    const verse = element.dataset.verse;
    const ko = decodeURIComponent(element.dataset.ko);
    const zh = decodeURIComponent(element.dataset.zh);
    const bookId = element.dataset.bookId;
    const chapter = element.dataset.chapter;
    const abbr = bookAbbreviations[bookId];
    const textToCopy = `${abbr.ko} ${chapter}:${verse} ${ko}\n${abbr.zh} ${chapter}:${verse} ${zh}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        const t = i18n[currentLang];
        alert(t.msgCopied || '已複製！');
    }).catch(err => {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        const t = i18n[currentLang];
        alert(t.msgCopied || '已複製！');
    });
}
// 預覽頁觸控開始
window.handlePreviewTouchStart = (event, element) => {
    clearPreviewLongPressState();
    previewLongPressElement = element;
    previewTouchStartX = event.touches[0].clientX;
    previewTouchStartY = event.touches[0].clientY;
    element.classList.add('long-press');
    previewLongPressTimer = setTimeout(() => {
        triggerPreviewLongPress(event, element);
    }, LONG_PRESS_DURATION);
};
// 預覽頁觸控結束
window.handlePreviewTouchEnd = (event, element) => {
    if (!previewLongPressTriggered) {
        clearPreviewLongPressState();
    }
};
// 預覽頁觸控移動
window.handlePreviewTouchMove = (event, element) => {
    if (previewLongPressTimer) {
        const touch = event.touches[0];
        const moveX = Math.abs(touch.clientX - previewTouchStartX);
        const moveY = Math.abs(touch.clientY - previewTouchStartY);
        if (moveX > 10 || moveY > 10) {
            clearPreviewLongPressState();
        }
    }
};
// 預覽頁滑鼠按下
window.handlePreviewMouseDown = (event, element) => {
    if (event.button !== 0) return;
    clearPreviewLongPressState();
    previewLongPressElement = element;
    element.classList.add('long-press');
    previewLongPressTimer = setTimeout(() => {
        triggerPreviewLongPress(event, element);
    }, LONG_PRESS_DURATION);
};
// 預覽頁滑鼠放開
window.handlePreviewMouseUp = (event, element) => {
    if (!previewLongPressTriggered) {
        clearPreviewLongPressState();
    }
};
// 預覽頁滑鼠離開
window.handlePreviewMouseLeave = (event, element) => {
    if (!previewLongPressTriggered) {
        clearPreviewLongPressState();
    }
};
// 預覽頁右鍵選單
window.handlePreviewContextMenu = (event, element) => {
    event.preventDefault();
    event.stopPropagation();
    clearPreviewLongPressState();
    showPreviewCopyMenu(event, element);
    return false;
};
// 頁面載入時初始化聖經
initBiblePage();
loadBibleCollections();
renderBibleCollections();
loadSearchHistory();
// 搜尋輸入框事件監聽（處理輸入法組字問題）
(function() {
    const searchInput = document.getElementById('bibleSearchInput');
    let isComposing = false; // 是否正在組字中
    // 開始組字（輸入法開始輸入）
    searchInput.addEventListener('compositionstart', () => {
        isComposing = true;
    });
    // 結束組字（輸入法完成輸入）
    searchInput.addEventListener('compositionend', (e) => {
        isComposing = false;
        // 組字完成後執行搜尋
        handleSearchInput(e.target.value);
    });
    // 一般輸入事件
    searchInput.addEventListener('input', (e) => {
        // 如果正在組字中，不執行搜尋
        if (isComposing) return;
        handleSearchInput(e.target.value);
    });
})();
