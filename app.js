// --- APP VERSION ---
const APP_VERSION = '2026.05.10.02';

// --- FIREBASE SETUP ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 【重要】請確認您的 Firebase Config
// ------------------------------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyBXnq1RzY0zxGE0trwLPR-PHtdfFCvRw0A",
    authDomain: "discourse-dissemination.firebaseapp.com",
    projectId: "discourse-dissemination",
    storageBucket: "discourse-dissemination.firebasestorage.app",
    messagingSenderId: "686407798490",
    appId: "1:686407798490:web:e41a5f2d007615fb6e5fe3",
    measurementId: "G-M0JHY4QED9"
};
// ------------------------------------------------------------------

let dbInstance;
let cloudEnabled = false;

try {
    if (firebaseConfig.apiKey) {
        const app = initializeApp(firebaseConfig);
        dbInstance = getFirestore(app);
        cloudEnabled = true;
        console.log("Firebase initialized successfully.");
    } else {
        console.warn("Firebase Config not found. Using Placeholder Mode.");
    }
} catch (e) {
    console.error("Firebase init failed:", e);
}

// --- 全域變數與邏輯 ---
let currentLang = localStorage.getItem('app_lang') || 'ko'; 
let localDb = [];
let offlineDb = [];
let sortDesc = true; 
let sortBy = 'date'; // 'date', 'id', 'name', 'activity'
let offlineSortDesc = true;
let isEditMode = false;
let isOfflineEditMode = false;

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
        menuHome: "홈", menuFaith: "나의 신앙", menuFruit: "열매 정보",
        devBadge: "개발 중",
        // 首頁
        homeSubtitle: "복음의 열매를 기록하고 관리하세요",
        homeCardBible: "성경", homeCardBibleDesc: "말씀을 읽고 복사하세요",
        homeCardEntry: "온라인 등록", homeCardEntryDesc: "새로운 만남을 기록하세요",
        homeCardBackend: "데이터 관리", homeCardBackendDesc: "기록된 데이터를 확인하세요",
        homeCardProfile: "개인정보", homeCardProfileDesc: "프로필을 설정하세요",
        homeStatTotal: "총 섭외자", homeStatWeek: "주간 교류",
        copyrightMain: "Yeongnim 개인 소유",
        // 首頁第二頁
        homeFeatBibleTitle: "성경", homeFeatBibleDesc: "말씀을 읽고, 묵상하고,\n마음에 새기는 시간",
        homeFeatAutoTitle: "신앙 자동화 관리", homeFeatAutoDesc: "신앙 생활을 체계적으로\n관리하고 성장하는 도구",
        homeFeatDataTitle: "교류 관리", homeFeatDataDesc: "기록된 데이터를 확인하고\n열매를 관리하세요",
        // 今日默想
        dailyVerseLabel: "오늘의 묵상", scrollHint: "아래로 스크롤",
        // 我的信仰
        btnDailyFaith: "매일 신앙 기록", btnFaithChart: "신앙 기록 차트",
        headerDailyFaith: "매일 신앙 기록", headerFaithChart: "신앙 기록 차트",
        txtDailyFaithDesc: "이 페이지에서 매일의 신앙 생활을 기록할 수 있습니다.",
        txtFaithChartDesc: "이 페이지에서 신앙 기록의 통계 차트를 볼 수 있습니다.",
        // 信仰自動化管理
        menuFaithAuto: "신앙 자동화 관리",
        btnAiCompose: "AI 통합 작문", headerAiCompose: "AI 통합 작문",
        txtAiComposeDesc: "섭외자의 번호를 입력하면 최신 대화 기록을 불러와, AI가 맞춤형 메시지를 생성합니다.",
        aiComposeStep1: "① 섭외자 번호 입력", aiComposeStep2: "② 최근 대화 내용",
        aiComposeStep3: "③ AI에게 지시하기", aiComposeStep4: "④ 생성 결과",
        aiComposePlaceholder: "예: 상대방의 관심사를 물어보고 다음 만남을 제안하는 메시지",
        aiComposeGenerate: "AI 메시지 생성", aiComposeCopy: "복사", aiComposeRetry: "다시 생성",
        aiComposeHint1: "상대방의 관심사 물어보기", aiComposeHint2: "다음 만남 약속잡기",
        aiComposeHint3: "격려 메시지", aiComposeHint4: "성경 말씀 나누기",
        faithCardAiCompose: "AI 통합 작문", faithCardAiComposeDesc: "AI를 활용하여 섭외자에게 보낼 메시지를 자동으로 생성합니다.",
        // 書籍
        menuBooks: "서적", btnBible: "성경",
        txtOldTestament: "구약성경 / 舊約聖經", txtNewTestament: "신약성경 / 新約聖經",
        txtBibleBack: "뒤로",
        // 果子資訊
        btnEntry: "등록 시스템", btnOfflineEntry: "오프라인 등록", 
        btnProfile: "개인정보", 
        btnBackend: "교류 관리", btnOfflineBackend: "오프라인 데이터",
        headerEntry: "등록 시스템", lblId: "번호", lblName: "이름",
        lblDate: "날짜", lblType: "회신 유형", lblContent: "내용",
        optMe: "내가 회신", optOther: "상대방 회신",
        phId: "0000-4999 사이의 4자리 번호 입력", phName: "예: 김철수", phContent: "대화 내용이나 기도 제목 입력...",
        btnSubmit: "등록하기", headerBackend: "교류 관리",
        txtSelectAll: "전체 선택", txtTotal: "섭외자: ", txtPerson: "명",
        txtWeeklyInteraction: "주간 교류: ",
        btnDelete: "선택 삭제", btnEdit: "편집", btnDone: "완료",
        colId: "번호", colName: "이름", colDate: "최근 날짜", colContent: "최신 내용",
        colActivity: "활동",
        activityHigh: "활발", activityNormal: "보통", activityLow: "저조",
        statusFound: "✔ 기존 데이터 발견: ", statusNew: "✚ 새로운 번호/이름입니다.",
        statusNewId: "✚ 새 섭외자! 추천 번호: ",
        alertIncomplete: "모든 항목을 입력해주세요.",
        alertUpdate: "업데이트 완료 (Cloud): ", alertCreate: "새 파일 생성 완료 (Cloud): ",
        alertConfirmDelete: "선택한 섭외자와 모든 기록을 영구적으로 삭제하시겠습니까?",
        alertDeleted: "삭제되었습니다.", alertDeleteLog: "이 기록을 삭제하시겠습니까?",
        tagMe: "본인", tagOther: "상대", msgEmpty: "(기록 없음)", msgCopied: "복사되었습니다!",
        msgCloudError: "Firebase 설정이 필요합니다. 코드를 확인해주세요.",
        errIdConflict: "오류: 이 번호는 이미 다른 사람에게 할당되어 있습니다.",
        errNameConflict: "오류: 이 이름은 이미 다른 번호를 사용 중입니다.",
        headerProfile: "개인정보 등록", lblProfileId: "번호", lblProfileName: "이름",
        lblProfileLocation: "거주지", lblProfilePhone: "휴대폰", lblProfileContact: "연락 방법",
        lblProfileContactId: "연락처 ID", lblProfileBirthday: "생일 / 나이", ageUnit: "세",
        lblProfileMbti: "MBTI", lblProfileJob: "직업",
        btnProfileSave: "저장하기", alertProfileSaved: "개인정보가 저장되었습니다.",
        alertProfileIdRequired: "번호를 먼저 입력해주세요.",
        popupLocation: "거주지", popupPhone: "휴대폰", popupContact: "연락 방법", popupContactId: "연락처 ID",
        popupBirthday: "생일", popupAge: "나이", popupMbti: "MBTI", popupJob: "직업",
        optContactNone: "선택하세요",
        // 線下登錄
        headerOfflineEntry: "오프라인 전도 등록", 
        lblOfflineId: "번호", lblOfflineName: "이름", lblOfflineDate: "날짜",
        lblOfflinePhone: "휴대폰", lblOfflineContactId: "연락처 ID", 
        lblOfflineContactMethod: "연락 방법",
        lblOfflineLocation: "장소", lblOfflineActivity: "활동", lblOfflineContent: "섭외 내용",
        phOfflineId: "5000 이상의 4자리 번호 입력", phOfflineContent: "섭외 내용 입력...",
        btnOfflineSubmit: "등록하기",
        errOfflineIdTooLow: "오류: 오프라인 번호는 5000 이상이어야 합니다.",
        statusOfflineNewId: "✚ 새 섭외자! 추천 번호: ",
        optOfflineContactNone: "선택하세요",
        // 線下後台
        headerOfflineBackend: "오프라인 데이터 관리",
        colOfflineId: "번호", colOfflineName: "이름", colOfflineDate: "최근 날짜",
        colOfflineLocation: "장소", colOfflineEvent: "활동", colOfflineActivity: "활동"
    },
    zh: {
        appTitle: "傳道整理系統", 
        // 主選單
        menuHome: "首頁", menuFaith: "我的信仰", menuFruit: "果子資訊",
        devBadge: "開發中",
        // 首頁
        homeSubtitle: "記錄並管理福音的果子",
        homeCardBible: "聖經", homeCardBibleDesc: "閱讀並複製經文",
        homeCardEntry: "線上登錄", homeCardEntryDesc: "記錄新的相遇",
        homeCardBackend: "資料管理", homeCardBackendDesc: "查看已記錄的資料",
        homeCardProfile: "個人資料", homeCardProfileDesc: "設定個人檔案",
        homeStatTotal: "總涉外者", homeStatWeek: "週間交流",
        copyrightMain: "Yeongnim個人所有",
        // 首頁第二頁
        homeFeatBibleTitle: "聖經", homeFeatBibleDesc: "閱讀、默想，\n將話語刻在心中",
        homeFeatAutoTitle: "信仰自動化管理", homeFeatAutoDesc: "系統化管理信仰生活，\n持續成長的工具",
        homeFeatDataTitle: "交流管理", homeFeatDataDesc: "確認記錄的數據，\n管理結出的果子",
        // 今日默想
        dailyVerseLabel: "今日默想", scrollHint: "向下滾動",
        // 我的信仰
        btnDailyFaith: "每日信仰記錄", btnFaithChart: "信仰記錄圖",
        headerDailyFaith: "每日信仰記錄", headerFaithChart: "信仰記錄圖",
        txtDailyFaithDesc: "在此頁面記錄每日的信仰生活。",
        txtFaithChartDesc: "在此頁面查看信仰記錄的統計圖表。",
        // 信仰自動化管理
        menuFaithAuto: "信仰自動化管理",
        btnAiCompose: "AI 整合作文", headerAiCompose: "AI 整合作文",
        txtAiComposeDesc: "輸入涉外者編號，自動抓取最新對話紀錄，由 AI 生成客製化訊息。",
        aiComposeStep1: "① 輸入涉外者編號", aiComposeStep2: "② 最近對話內容",
        aiComposeStep3: "③ 給 AI 的指示", aiComposeStep4: "④ 生成結果",
        aiComposePlaceholder: "例：詢問對方的興趣，並提議下次見面",
        aiComposeGenerate: "AI 生成訊息", aiComposeCopy: "複製", aiComposeRetry: "重新生成",
        aiComposeHint1: "詢問對方的興趣", aiComposeHint2: "約下次見面",
        aiComposeHint3: "鼓勵訊息", aiComposeHint4: "分享聖經話語",
        faithCardAiCompose: "AI 整合作文", faithCardAiComposeDesc: "利用 AI 自動生成要發送給涉外者的訊息。",
        // 書籍
        menuBooks: "書籍", btnBible: "聖經",
        txtOldTestament: "구약성경 / 舊約聖經", txtNewTestament: "신약성경 / 新約聖經",
        txtBibleBack: "返回",
        // 果子資訊
        btnEntry: "登錄系統", btnOfflineEntry: "線下登錄", 
        btnProfile: "個人資料", 
        btnBackend: "交流管理", btnOfflineBackend: "線下後台",
        headerEntry: "登錄系統", lblId: "編號", lblName: "姓名",
        lblDate: "日期", lblType: "回覆類型", lblContent: "回覆內容",
        optMe: "我回覆", optOther: "對方回覆",
        phId: "請輸入0000-4999間的4位編號", phName: "例: 金大中", phContent: "請輸入對話重點或備忘...",
        btnSubmit: "登錄資料", headerBackend: "交流管理",
        txtSelectAll: "全選", txtTotal: "涉外者人數: ", txtPerson: " 人",
        txtWeeklyInteraction: "週間交流: ",
        btnDelete: "刪除選取", btnEdit: "編輯", btnDone: "完成",
        colId: "編號", colName: "姓名", colDate: "最近日期", colContent: "最新內容",
        colActivity: "活躍度",
        activityHigh: "活躍", activityNormal: "一般", activityLow: "低活躍",
        statusFound: "✔ 已找到舊資料：", statusNew: "✚ 這是新的編號，請輸入姓名",
        statusNewId: "✚ 新朋友！系統建議編號：",
        alertIncomplete: "請填寫所有欄位",
        alertUpdate: "已更新資料 (雲端同步)：", alertCreate: "已建立新檔案 (雲端同步)：",
        alertConfirmDelete: "確定要永久刪除這些檔案及其所有紀錄嗎？",
        alertDeleted: "刪除完成！", alertDeleteLog: "確定要刪除這條紀錄嗎？",
        tagMe: "我", tagOther: "他", msgEmpty: "(尚無紀錄)", msgCopied: "已複製！",
        msgCloudError: "尚未設定雲端金鑰，無法儲存。請參閱說明設置 Firebase。",
        errIdConflict: "錯誤：此編號已經被其他人使用，請檢查。",
        errNameConflict: "錯誤：此姓名已經擁有另一個編號，請檢查。",
        headerProfile: "個人資料登錄", lblProfileId: "編號", lblProfileName: "姓名",
        lblProfileLocation: "居住地", lblProfilePhone: "手機", lblProfileContact: "聯絡方法",
        lblProfileContactId: "聯絡方式ID", lblProfileBirthday: "生日 / 年紀", ageUnit: "歲",
        lblProfileMbti: "MBTI", lblProfileJob: "職業",
        btnProfileSave: "儲存", alertProfileSaved: "個人資料已儲存。",
        alertProfileIdRequired: "請先輸入編號。",
        popupLocation: "居住地", popupPhone: "手機", popupContact: "聯絡方法", popupContactId: "聯絡方式ID",
        popupBirthday: "生日", popupAge: "年紀", popupMbti: "MBTI", popupJob: "職業",
        optContactNone: "請選擇",
        // 線下登錄
        headerOfflineEntry: "線下傳道登錄", 
        lblOfflineId: "編號", lblOfflineName: "姓名", lblOfflineDate: "日期",
        lblOfflinePhone: "手機", lblOfflineContactId: "聯絡方式ID", 
        lblOfflineContactMethod: "聯絡方法",
        lblOfflineLocation: "地點", lblOfflineActivity: "活動", lblOfflineContent: "涉外內容",
        phOfflineId: "請輸入5000以上的4位編號", phOfflineContent: "請輸入涉外內容...",
        btnOfflineSubmit: "登錄資料",
        errOfflineIdTooLow: "錯誤：線下編號必須為5000以上。",
        statusOfflineNewId: "✚ 新朋友！系統建議編號：",
        optOfflineContactNone: "請選擇",
        // 線下後台
        headerOfflineBackend: "線下後台資料",
        colOfflineId: "編號", colOfflineName: "姓名", colOfflineDate: "最近日期",
        colOfflineLocation: "地點", colOfflineEvent: "活動", colOfflineActivity: "活躍度"
    }
};

if (cloudEnabled) {
    const q = collection(dbInstance, "missionary_data");
    onSnapshot(q, (snapshot) => {
        localDb = [];
        snapshot.forEach((doc) => {
            localDb.push(doc.data());
        });
        window.firebaseLoaded = true;
        renderBackend();
        const activeId = document.getElementById('idInput').value;
        if(activeId) window.handleIdInput();
    });
    
    // 監聽線下資料
    const offlineQ = collection(dbInstance, "offline_missionary_data");
    onSnapshot(offlineQ, (snapshot) => {
        offlineDb = [];
        snapshot.forEach((doc) => {
            offlineDb.push(doc.data());
        });
        window.offlineFirebaseLoaded = true;
        renderOfflineBackend();
        const offlineActiveId = document.getElementById('offlineIdInput');
        if(offlineActiveId && offlineActiveId.value) window.handleOfflineIdInput();
    });
} else {
    document.getElementById('dataList').innerHTML = `<div style="padding:20px; text-align:center; color:red;">${i18n[currentLang].msgCloudError}</div>`;
    document.getElementById('offlineDataList').innerHTML = `<div style="padding:20px; text-align:center; color:red;">${i18n[currentLang].msgCloudError}</div>`;
}

// 頁面記憶超時設定（12小時 = 12 * 60 * 60 * 1000 毫秒）
// (頁面記憶已停用)

// ===== 滑動與點擊區分（後台用） =====
let backendTouchStartX = 0;
let backendTouchStartY = 0;
let isBackendSwiping = false;
const BACKEND_SWIPE_THRESHOLD = 10; // 移動超過10px視為滑動

document.addEventListener('touchstart', (e) => {
    backendTouchStartX = e.touches[0].clientX;
    backendTouchStartY = e.touches[0].clientY;
    isBackendSwiping = false;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    if (!backendTouchStartX || !backendTouchStartY) return;
    const deltaX = Math.abs(e.touches[0].clientX - backendTouchStartX);
    const deltaY = Math.abs(e.touches[0].clientY - backendTouchStartY);
    if (deltaX > BACKEND_SWIPE_THRESHOLD || deltaY > BACKEND_SWIPE_THRESHOLD) {
        isBackendSwiping = true;
    }
}, { passive: true });

window.isSwipeAction = () => isBackendSwiping;

// 頁面記憶已停用 — 每次開啟都回首頁

// Path → Page 映射（支援 clean URL 和舊版 hash 相容）
function getPageFromPath() {
    // 優先讀取 pathname
    const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
    if (path) {
        const reverseMap = {
            'home': 'home',
            'bible': 'bible',
            'entry': 'entry',
            'backend': 'backend',
            'profile': 'profile',
            'faith-auto': 'faithAuto',
            'faith-chart': 'faith-chart',
            'daily-faith': 'daily-faith',
            'ai-compose': 'ai-compose',
            'offline-entry': 'offline-entry',
            'offline-backend': 'offline-backend'
        };
        if (reverseMap[path]) return reverseMap[path];
    }
    // 向下相容：如果有舊版 hash URL，自動轉成 clean URL
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash) {
        const reverseMap = {
            'home': 'home', 'bible': 'bible', 'entry': 'entry',
            'backend': 'backend', 'profile': 'profile',
            'faith-auto': 'faithAuto', 'faith-chart': 'faith-chart',
            'daily-faith': 'daily-faith', 'ai-compose': 'ai-compose',
            'offline-entry': 'offline-entry',
            'offline-backend': 'offline-backend'
        };
        const page = reverseMap[hash];
        if (page) {
            // 自動把舊 hash URL 轉成 clean URL
            const pathMap = {
                'home': '/', 'bible': '/bible', 'entry': '/entry',
                'backend': '/backend', 'profile': '/profile',
                'faithAuto': '/faith-auto', 'faith-chart': '/faith-chart',
                'daily-faith': '/daily-faith', 'ai-compose': '/ai-compose',
                'offline-entry': '/offline-entry',
                'offline-backend': '/offline-backend'
            };
            history.replaceState(null, '', pathMap[page] || '/');
            return page;
        }
    }
    return 'home';
}

// 監聽瀏覽器上一頁/下一頁
window.addEventListener('popstate', () => {
    const page = getPageFromPath();
    if (page) {
        switchPage(page);
    }
});

window.onload = function() {
    document.querySelector('.lang-select').value = currentLang;
    
    // 處理 404.html SPA 路由轉址（?p=bible → /bible）
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPage = urlParams.get('p');
    if (redirectPage) {
        const pathMap = {
            'bible': '/bible', 'entry': '/entry', 'backend': '/backend',
            'profile': '/profile', 'faith-auto': '/faith-auto',
            'faith-chart': '/faith-chart', 'daily-faith': '/daily-faith',
            'ai-compose': '/ai-compose',
            'offline-entry': '/offline-entry', 'offline-backend': '/offline-backend',
            'home': '/'
        };
        const cleanPath = pathMap[redirectPage] || '/';
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
    updateDateInput();
    
    // 版本檢查已移除（Cloudflare 快取環境下不穩定，單人使用直接重新整理即可）
};

window.setLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem('app_lang', lang); // 永久儲存語言設定
    applyLanguage();
    renderBackend();
    renderOfflineBackend();
    const nameVal = document.getElementById('nameInput').value;
    window.updateReplyOption(nameVal);
};

function applyLanguage() {
    const t = i18n[currentLang];
    const map = {
        'txt-app-title': t.appTitle, 
        // 主選單
        'menu-home-title': t.menuHome, 'menu-faith-auto-title': t.menuFaithAuto, 'menu-fruit-title': t.menuFruit,
        'menu-books-title': t.menuBooks,
        // 首頁
        'home-subtitle': t.homeSubtitle,
        'home-card-bible': t.homeCardBible, 'home-card-bible-desc': t.homeCardBibleDesc,
        'home-card-entry': t.homeCardEntry, 'home-card-entry-desc': t.homeCardEntryDesc,
        'home-card-backend': t.homeCardBackend, 'home-card-backend-desc': t.homeCardBackendDesc,
        'home-card-profile': t.homeCardProfile, 'home-card-profile-desc': t.homeCardProfileDesc,
        'home-stat-total-label': t.homeStatTotal, 'home-stat-week-label': t.homeStatWeek,
        // 我的信仰
        'btn-daily-faith': t.btnDailyFaith, 'btn-faith-chart': t.btnFaithChart,
        'txt-daily-faith-header': t.headerDailyFaith, 'txt-faith-chart-header': t.headerFaithChart,
        'txt-daily-faith-desc': t.txtDailyFaithDesc, 'txt-faith-chart-desc': t.txtFaithChartDesc,
        // 信仰自動化 + AI整合作文
        'btn-ai-compose': t.btnAiCompose,
        'txt-ai-compose-header': t.headerAiCompose, 'txt-ai-compose-desc': t.txtAiComposeDesc,
        'ai-compose-step1-label': t.aiComposeStep1, 'ai-compose-step2-label': t.aiComposeStep2,
        'ai-compose-step3-label': t.aiComposeStep3, 'ai-compose-step4-label': t.aiComposeStep4,
        'btn-ai-compose-generate': t.aiComposeGenerate,
        'btn-compose-copy': t.aiComposeCopy, 'btn-compose-retry': t.aiComposeRetry,
        'faith-card-ai-compose': t.faithCardAiCompose, 'faith-card-ai-compose-desc': t.faithCardAiComposeDesc,
        // 書籍
        'btn-bible': t.btnBible,
        'txt-old-testament': t.txtOldTestament, 'txt-new-testament': t.txtNewTestament,
        'txt-bible-back': t.txtBibleBack,
        // 果子資訊
        'btn-entry': t.btnEntry, 'btn-offline-entry': t.btnOfflineEntry,
        'btn-profile': t.btnProfile, 
        'btn-backend': t.btnBackend, 'btn-offline-backend': t.btnOfflineBackend,
        'txt-entry-header': t.headerEntry, 'lbl-id': t.lblId, 'lbl-name': t.lblName,
        'lbl-date': t.lblDate, 'lbl-type': t.lblType, 'lbl-content': t.lblContent,
        'opt-me': t.optMe, 'opt-other': t.optOther, 'btn-submit': t.btnSubmit,
        'txt-backend-header': t.headerBackend, 'txt-select-all': t.txtSelectAll,
        'btn-delete': t.btnDelete, 'col-id': t.colId, 'col-name': t.colName,
        'col-activity': t.colActivity, 'col-date': t.colDate,
        'txt-profile-header': t.headerProfile, 'lbl-profile-id': t.lblProfileId,
        'lbl-profile-name': t.lblProfileName, 'lbl-profile-location': t.lblProfileLocation,
        'lbl-profile-phone': t.lblProfilePhone, 'lbl-profile-contact': t.lblProfileContact,
        'lbl-profile-contact-id': t.lblProfileContactId, 'lbl-profile-birthday': t.lblProfileBirthday,
        'age-unit': t.ageUnit, 'lbl-profile-mbti': t.lblProfileMbti, 'lbl-profile-job': t.lblProfileJob,
        'btn-profile-save': t.btnProfileSave, 'opt-contact-none': t.optContactNone,
        // 線下登錄
        'txt-offline-entry-header': t.headerOfflineEntry,
        'lbl-offline-id': t.lblOfflineId, 'lbl-offline-name': t.lblOfflineName,
        'lbl-offline-date': t.lblOfflineDate,
        'lbl-offline-location': t.lblOfflineLocation,
        'lbl-offline-activity': t.lblOfflineActivity, 'lbl-offline-content': t.lblOfflineContent,
        'btn-offline-submit': t.btnOfflineSubmit,
        // 線下後台
        'txt-offline-backend-header': t.headerOfflineBackend,
        'txt-offline-select-all': t.txtSelectAll, 'btn-offline-delete': t.btnDelete,
        'col-offline-id': t.colOfflineId, 'col-offline-name': t.colOfflineName,
        'col-offline-date': t.colOfflineDate, 'col-offline-location': t.colOfflineLocation,
        'col-offline-event': t.colOfflineEvent, 'col-offline-activity': t.colOfflineActivity
    };
    for (const [id, text] of Object.entries(map)) {
        const el = document.getElementById(id);
        if(el) {
            // 如果是後台標題，只更新第一個span
            if (id === 'txt-backend-header') {
                const span = el.querySelector('span');
                if (span) span.textContent = text;
            } else {
                el.textContent = text;
            }
        }
    }
    const editBtn = document.getElementById('btn-toggle-edit');
    if(editBtn) editBtn.textContent = isEditMode ? t.btnDone : t.btnEdit;
    
    const offlineEditBtn = document.getElementById('btn-offline-toggle-edit');
    if(offlineEditBtn) offlineEditBtn.textContent = isOfflineEditMode ? t.btnDone : t.btnEdit;

    document.getElementById('idInput').placeholder = t.phId;
    document.getElementById('nameInput').placeholder = t.phName;
    document.getElementById('content').placeholder = t.phContent;
    
    // 線下登錄 placeholder
    const offlineIdInput = document.getElementById('offlineIdInput');
    if(offlineIdInput) offlineIdInput.placeholder = t.phOfflineId;
    const offlineContent = document.getElementById('offlineContent');
    if(offlineContent) offlineContent.placeholder = t.phOfflineContent;
    
    // 更新開發中徽章
    const devBadge = document.querySelector('.dev-badge');
    if (devBadge) devBadge.textContent = t.devBadge;
    
    // 更新當前頁面標題
    const pageTitleEl = document.getElementById('current-page-title');
    const activeSection = document.querySelector('.page-section.active-section');
    if (pageTitleEl && activeSection) {
        const sectionId = activeSection.id;
        if (sectionId === 'homeSection') pageTitleEl.textContent = t.menuHome;
        else if (sectionId === 'dailyFaithSection') pageTitleEl.textContent = t.btnDailyFaith;
        else if (sectionId === 'faithChartSection') pageTitleEl.textContent = t.btnFaithChart;
        else if (sectionId === 'bibleSection') pageTitleEl.textContent = t.btnBible;
        else if (sectionId === 'entrySection') pageTitleEl.textContent = t.btnEntry;
        else if (sectionId === 'offlineEntrySection') pageTitleEl.textContent = t.btnOfflineEntry;
        else if (sectionId === 'profileSection') pageTitleEl.textContent = t.btnProfile;
        else if (sectionId === 'faithAutoSection') pageTitleEl.textContent = currentLang === 'ko' ? '신앙 자동화 관리' : '信仰自動化管理';
        else if (sectionId === 'aiComposeSection') pageTitleEl.textContent = currentLang === 'ko' ? 'AI 통합 작문' : 'AI 整合作文';
        else if (sectionId === 'backendSection') pageTitleEl.textContent = t.btnBackend;
        else if (sectionId === 'offlineBackendSection') pageTitleEl.textContent = t.btnOfflineBackend;
    }
    
    updateCounter();
    updateOfflineCounter();
    
    // 首頁第二頁翻譯
    const featBibleTitle = document.getElementById('home-feat-bible-title');
    const featBibleDesc = document.getElementById('home-feat-bible-desc');
    const featAutoTitle = document.getElementById('home-feat-auto-title');
    const featAutoDesc = document.getElementById('home-feat-auto-desc');
    const featDataTitle = document.getElementById('home-feat-data-title');
    const featDataDesc = document.getElementById('home-feat-data-desc');
    if (featBibleTitle) featBibleTitle.textContent = t.homeFeatBibleTitle;
    if (featBibleDesc) featBibleDesc.innerHTML = t.homeFeatBibleDesc.replace(/\n/g, '<br>');
    if (featAutoTitle) featAutoTitle.textContent = t.homeFeatAutoTitle;
    if (featAutoDesc) featAutoDesc.innerHTML = t.homeFeatAutoDesc.replace(/\n/g, '<br>');
    if (featDataTitle) featDataTitle.textContent = t.homeFeatDataTitle;
    if (featDataDesc) featDataDesc.innerHTML = t.homeFeatDataDesc.replace(/\n/g, '<br>');
    
    // AI 面板語言更新
    const aiTitle = document.getElementById('aiPanelTitle');
    const aiNote = document.getElementById('aiPanelNote');
    const aiInput = document.getElementById('aiPanelInput');
    if (aiTitle) aiTitle.textContent = currentLang === 'ko' ? 'AI 도우미' : 'AI 助手';
    if (aiNote) aiNote.innerHTML = currentLang === 'ko' 
        ? '경문: <b>창1:1-3 한</b> | 이동: <b>계1장 가</b> | 작문: <b>@번호 지시</b>' 
        : '經文: <b>創1:1-3 中</b> | 跳轉: <b>到 啟1章</b> | 作文: <b>@編號 指示</b>';
    if (aiInput) aiInput.placeholder = currentLang === 'ko' ? '창1:1 한 / 계1장 가 / @0012 지시' : '創1:1 中 / 到 啟1章 / @0012 指示';
    
    // 首頁第一頁標題和經文也更新
    if (document.getElementById('homeSection').classList.contains('active-section')) {
        initDailyVerse();
    }
    
    // 如果在首頁，重新載入天氣（更新語言）
    if (document.getElementById('homeSection').classList.contains('active-section')) {
        
    }
    
    // 更新訊息重點區塊語言
    updateMessagePointsLanguage();
}

// --- 邏輯修正區塊 ---

window.handleIdInput = () => {
    const t = i18n[currentLang];
    const idVal = document.getElementById('idInput').value.trim();
    
    if (!idVal) {
        document.getElementById('nameInput').value = '';
        document.getElementById('statusMsg').style.display = 'none';
        window.updateReplyOption(null);
        return;
    }

    const user = localDb.find(u => u.id === idVal);
    if (user) {
        document.getElementById('nameInput').value = user.name;
        showStatus(t.statusFound + user.name, 'found');
        window.updateReplyOption(user.name);
    } else {
        if(idVal.length >= 4) showStatus(t.statusNew, 'new');
        else document.getElementById('statusMsg').style.display = 'none';
        window.updateReplyOption(null);
    }
};

window.handleNameInput = () => {
    const t = i18n[currentLang];
    const nameVal = document.getElementById('nameInput').value.trim();
    
    if (!nameVal) {
        document.getElementById('idInput').value = '';
        document.getElementById('statusMsg').style.display = 'none';
        window.updateReplyOption(null);
        return;
    }

    const user = localDb.find(u => u.name === nameVal);
    if (user) {
        document.getElementById('idInput').value = user.id;
        showStatus(t.statusFound + user.id, 'found');
        window.updateReplyOption(user.name);
    } else {
        if (document.getElementById('idInput').value === '') {
            const newId = generateNewId();
            showStatus(t.statusNewId + newId, 'new');
            document.getElementById('idInput').value = newId; 
        }
        window.updateReplyOption(null);
    }
};

window.updateReplyOption = (name) => {
    const t = i18n[currentLang];
    const option = document.getElementById('opt-other');
    option.textContent = name ? `${t.optOther} (${name})` : t.optOther;
};

function showStatus(msg, type) {
    const el = document.getElementById('statusMsg');
    el.textContent = msg;
    el.className = `status-bar status-${type}`;
    el.style.display = 'block';
}

// ===== 訊息重點與需確認訊息功能 =====
const pointTags = {
    ko: ['학업', '학습', '직장', '가정', '감정', '직접 입력'],
    zh: ['學業', '學習', '工作', '家庭', '感情', '自訂']
};

let messagePointsCounter = 0;
let confirmPointsCounter = 0;

// 創建標籤選項HTML
function createTagOptions() {
    const tags = pointTags[currentLang] || pointTags.ko;
    return tags.map(tag => `<option value="${tag}">${tag}</option>`).join('');
}

// 新增訊息重點
window.addMessagePoint = () => {
    const list = document.getElementById('messagePointsList');
    const empty = document.getElementById('messagePointsEmpty');
    if (empty) empty.style.display = 'none';
    
    const itemId = `messagePoint_${messagePointsCounter++}`;
    const item = document.createElement('div');
    item.className = 'message-point-item';
    item.id = itemId;
    item.innerHTML = `
        <div class="message-point-header">
            <select class="message-point-tag-select" onchange="window.handleTagChange(this)">
                ${createTagOptions()}
            </select>
            <button class="message-point-remove" onclick="window.removeMessagePoint('${itemId}')">✕</button>
        </div>
        <textarea class="message-point-content" placeholder="${currentLang === 'ko' ? '내용을 입력하세요...' : '請輸入內容...'}" rows="2"></textarea>
    `;
    list.appendChild(item);
};

// 移除訊息重點
window.removeMessagePoint = (itemId) => {
    const item = document.getElementById(itemId);
    if (item) item.remove();
    
    const list = document.getElementById('messagePointsList');
    const empty = document.getElementById('messagePointsEmpty');
    if (list && list.querySelectorAll('.message-point-item').length === 0 && empty) {
        empty.style.display = 'block';
    }
};

// 新增需確認訊息
window.addConfirmPoint = () => {
    const list = document.getElementById('confirmPointsList');
    const empty = document.getElementById('confirmPointsEmpty');
    if (empty) empty.style.display = 'none';
    
    const itemId = `confirmPoint_${confirmPointsCounter++}`;
    const item = document.createElement('div');
    item.className = 'message-point-item';
    item.id = itemId;
    item.innerHTML = `
        <div class="message-point-header">
            <select class="message-point-tag-select" onchange="window.handleTagChange(this)">
                ${createTagOptions()}
            </select>
            <button class="message-point-remove" onclick="window.removeConfirmPoint('${itemId}')">✕</button>
        </div>
        <textarea class="message-point-content" placeholder="${currentLang === 'ko' ? '확인할 내용...' : '需確認的內容...'}" rows="2"></textarea>
    `;
    list.appendChild(item);
};

// 移除需確認訊息
window.removeConfirmPoint = (itemId) => {
    const item = document.getElementById(itemId);
    if (item) item.remove();
    
    const list = document.getElementById('confirmPointsList');
    const empty = document.getElementById('confirmPointsEmpty');
    if (list && list.querySelectorAll('.message-point-item').length === 0 && empty) {
        empty.style.display = 'block';
    }
};

// 處理標籤選擇變化（自訂選項）
window.handleTagChange = (selectEl) => {
    const lastOption = pointTags[currentLang]?.[5] || '직접 입력';
    if (selectEl.value === lastOption) {
        const customTag = prompt(currentLang === 'ko' ? '태그를 입력하세요:' : '請輸入自訂標籤:');
        if (customTag && customTag.trim()) {
            // 添加自訂選項
            const option = document.createElement('option');
            option.value = customTag.trim();
            option.textContent = customTag.trim();
            option.selected = true;
            selectEl.insertBefore(option, selectEl.lastElementChild);
        } else {
            // 取消則回到第一個選項
            selectEl.selectedIndex = 0;
        }
    }
};

// 獲取訊息重點數據
function getMessagePoints() {
    const list = document.getElementById('messagePointsList');
    const items = list.querySelectorAll('.message-point-item');
    const points = [];
    items.forEach(item => {
        const tag = item.querySelector('.message-point-tag-select')?.value || '';
        const content = item.querySelector('.message-point-content')?.value?.trim() || '';
        if (tag && content) {
            points.push({ tag, content });
        }
    });
    return points;
}

// 獲取需確認訊息數據
function getConfirmPoints() {
    const list = document.getElementById('confirmPointsList');
    const items = list.querySelectorAll('.message-point-item');
    const points = [];
    items.forEach(item => {
        const tag = item.querySelector('.message-point-tag-select')?.value || '';
        const content = item.querySelector('.message-point-content')?.value?.trim() || '';
        if (tag && content) {
            points.push({ tag, content });
        }
    });
    return points;
}

// 清空訊息重點和需確認訊息
function clearMessagePoints() {
    const msgList = document.getElementById('messagePointsList');
    const msgEmpty = document.getElementById('messagePointsEmpty');
    if (msgList) {
        msgList.querySelectorAll('.message-point-item').forEach(item => item.remove());
    }
    if (msgEmpty) msgEmpty.style.display = 'block';
    
    const confList = document.getElementById('confirmPointsList');
    const confEmpty = document.getElementById('confirmPointsEmpty');
    if (confList) {
        confList.querySelectorAll('.message-point-item').forEach(item => item.remove());
    }
    if (confEmpty) confEmpty.style.display = 'block';
}

// 更新訊息重點區塊的語言
function updateMessagePointsLanguage() {
    const t = i18n[currentLang];
    const isKo = currentLang === 'ko';
    
    // 更新標題
    const msgTitle = document.getElementById('messagePointsTitle');
    const confTitle = document.getElementById('confirmPointsTitle');
    const msgEmpty = document.getElementById('messagePointsEmpty');
    const confEmpty = document.getElementById('confirmPointsEmpty');
    
    if (msgTitle) msgTitle.textContent = isKo ? '📌 메시지 포인트' : '📌 訊息重點';
    if (confTitle) confTitle.textContent = isKo ? '❓ 확인 필요 사항' : '❓ 需確認的訊息';
    if (msgEmpty) msgEmpty.textContent = isKo ? '+ 버튼을 눌러 추가하세요' : '點擊 + 新增訊息重點';
    if (confEmpty) confEmpty.textContent = isKo ? '+ 버튼을 눌러 추가하세요' : '點擊 + 新增需確認的訊息';
    
    // 更新現有項目的選項和placeholder
    const tags = pointTags[currentLang] || pointTags.ko;
    document.querySelectorAll('.message-point-tag-select').forEach(select => {
        const currentValue = select.value;
        const isCustom = !tags.includes(currentValue);
        
        select.innerHTML = createTagOptions();
        
        if (isCustom && currentValue) {
            const option = document.createElement('option');
            option.value = currentValue;
            option.textContent = currentValue;
            option.selected = true;
            select.insertBefore(option, select.lastElementChild);
        } else if (tags.includes(currentValue)) {
            select.value = currentValue;
        }
    });
    
    document.querySelectorAll('#messagePointsList .message-point-content').forEach(input => {
        input.placeholder = isKo ? '내용을 입력하세요...' : '請輸入內容...';
    });
    
    document.querySelectorAll('#confirmPointsList .message-point-content').forEach(input => {
        input.placeholder = isKo ? '확인할 내용...' : '需確認的內容...';
    });
}

// ===== AI整理功能 =====
const AI_SETTINGS_KEY = 'ai_summary_settings';
let currentAiUid = null;
let currentAiLogIndex = null;
let currentAiSummary = null;

// 載入AI設定
function loadAiSettings() {
    try {
        const saved = localStorage.getItem(AI_SETTINGS_KEY);
        if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { provider: 'gemini' };
}

// Cloudflare Worker 代理 URL
const AI_WORKER_URL = 'https://gemini-proxy.may90613may90613.workers.dev';

// 觸發AI整理
window.triggerAiSummary = async (event, uid, logIndex) => {
    event.stopPropagation();
    
    const settings = loadAiSettings();
    
    currentAiUid = uid;
    currentAiLogIndex = logIndex;
    
    // 獲取內容
    const user = localDb.find(u => u.id === uid);
    if (!user || !user.logs) return;
    
    const sortedLogs = [...user.logs].sort((a, b) => {
        const dateA = a.date || '0000-00-00';
        const dateB = b.date || '0000-00-00';
        if (dateA !== dateB) return dateB.localeCompare(dateA);
        return (b.createdAt || 0) - (a.createdAt || 0);
    });
    
    const log = sortedLogs[logIndex];
    if (!log) return;
    
    // 找到該則內容的DOM元素並添加文字閃光動畫
    const targetRow = document.querySelector(`.detail-row[data-uid="${uid}"][data-idx="${logIndex}"]`);
    const contentText = targetRow?.querySelector('.log-content-text');
    const aiBtn = targetRow?.querySelector('.ai-summary-btn');
    
    if (contentText) {
        contentText.classList.add('ai-analyzing-text');
    }
    if (aiBtn) {
        aiBtn.classList.add('ai-analyzing-btn');
    }
    
    try {
        const summary = await callAiApi(settings.provider, settings.apiKey, log.content);
        currentAiSummary = summary;
        
        // 移除閃光動畫
        if (contentText) {
            contentText.classList.remove('ai-analyzing-text');
        }
        if (aiBtn) {
            aiBtn.classList.remove('ai-analyzing-btn');
        }
        
        // 顯示結果彈窗
        const overlay = document.getElementById('aiModalOverlay');
        const loading = document.getElementById('aiModalLoading');
        const content = document.getElementById('aiModalContent');
        const footer = document.getElementById('aiModalFooter');
        
        overlay.classList.add('show');
        loading.style.display = 'none';
        content.style.display = 'block';
        content.textContent = summary;
        footer.style.display = 'flex';
        document.getElementById('aiSaveBtn').style.display = 'inline-block';
        
        // 更新語言
        updateAiModalLanguage();
        
    } catch (error) {
        // 移除閃光動畫
        if (contentText) {
            contentText.classList.remove('ai-analyzing-text');
        }
        if (aiBtn) {
            aiBtn.classList.remove('ai-analyzing-btn');
        }
        
        // 顯示錯誤彈窗
        const overlay = document.getElementById('aiModalOverlay');
        const loading = document.getElementById('aiModalLoading');
        const content = document.getElementById('aiModalContent');
        const footer = document.getElementById('aiModalFooter');
        
        overlay.classList.add('show');
        loading.style.display = 'none';
        content.style.display = 'block';
        content.innerHTML = `<div style="color:#c62828;">❌ ${currentLang === 'ko' ? '오류 발생' : '發生錯誤'}: ${error.message}</div>`;
        footer.style.display = 'flex';
        document.getElementById('aiSaveBtn').style.display = 'none';
        
        updateAiModalLanguage();
    }
};

// 調用AI API (透過 Cloudflare Worker 代理)
async function callAiApi(provider, apiKey, content) {
    // 檢測內文主要語言（韓文字符範圍：AC00-D7AF）
    const koreanChars = (content.match(/[\uAC00-\uD7AF]/g) || []).length;
    const chineseChars = (content.match(/[\u4E00-\u9FFF]/g) || []).length;
    const isKoreanContent = koreanChars > chineseChars;
    
    const prompt = isKoreanContent 
        ? `다음 대화 내용의 핵심 포인트를 간결하게 요약해주세요. 중요한 정보, 질문, 약속 등을 포함해주세요. 반드시 한국어로만 답변해주세요:\n\n${content}`
        : `請簡潔地整理以下對話內容的重點。包含重要資訊、問題、約定等。請務必只用繁體中文回答：\n\n${content}`;
    
    // 透過 Cloudflare Worker 代理呼叫 Gemini API
    const response = await fetch(AI_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'AI API Error');
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
}

// 儲存AI摘要到Firebase
window.saveAiSummary = async () => {
    if (!currentAiUid || currentAiLogIndex === null || !currentAiSummary) return;
    
    const user = localDb.find(u => u.id === currentAiUid);
    if (!user) return;
    
    const sortedLogs = [...user.logs].sort((a, b) => {
        const dateA = a.date || '0000-00-00';
        const dateB = b.date || '0000-00-00';
        if (dateA !== dateB) return dateB.localeCompare(dateA);
        return (b.createdAt || 0) - (a.createdAt || 0);
    });
    
    const settings = loadAiSettings();
    const providerNames = { gemini: 'Gemini', openai: 'GPT', claude: 'Claude' };
    const today = new Date().toISOString().split('T')[0];
    
    sortedLogs[currentAiLogIndex].aiSummary = currentAiSummary;
    sortedLogs[currentAiLogIndex].aiProvider = providerNames[settings.provider] || 'AI';
    sortedLogs[currentAiLogIndex].aiSummaryDate = today;
    
    await updateDoc(doc(dbInstance, "missionary_data", currentAiUid), { logs: sortedLogs });
    
    window.closeAiModal();
    restoreExpand(currentAiUid);
    
    const t = i18n[currentLang];
    alert(currentLang === 'ko' ? 'AI 요약이 저장되었습니다.' : 'AI摘要已儲存！');
};

// 關閉AI彈窗
window.closeAiModal = (event) => {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('aiModalOverlay').classList.remove('show');
    document.getElementById('aiSaveBtn').style.display = '';
    currentAiUid = null;
    currentAiLogIndex = null;
    currentAiSummary = null;
};

// 更新AI彈窗語言
function updateAiModalLanguage() {
    const isKo = currentLang === 'ko';
    document.getElementById('aiModalTitle').textContent = isKo ? 'AI 요약' : 'AI 整理重點';
    document.getElementById('aiLoadingText').textContent = isKo ? '내용 분석 중...' : '正在分析內容...';
    document.getElementById('aiCancelBtn').textContent = isKo ? '취소' : '取消';
    document.getElementById('aiSaveBtn').textContent = isKo ? '요약 저장' : '儲存摘要';
}

// --- 核心資料操作 (Cloud) ---

window.submitData = async () => {
    if (!cloudEnabled) { alert(i18n[currentLang].msgCloudError); return; }

    const t = i18n[currentLang];
    const id = document.getElementById('idInput').value.trim();
    const name = document.getElementById('nameInput').value.trim();
    const date = document.getElementById('recordDate').value;
    const typeSelect = document.getElementById('replyType').value;
    const content = document.getElementById('content').value.trim();

    if (!id || !name || !date || !content) { alert(t.alertIncomplete); return; }

    const existingUserById = localDb.find(u => u.id === id);
    if (existingUserById && existingUserById.name !== name) {
        alert(t.errIdConflict + `\n(ID: ${id} -> ${existingUserById.name})`);
        return;
    }

    const existingUserByName = localDb.find(u => u.name === name);
    if (existingUserByName && existingUserByName.id !== id) {
        alert(t.errNameConflict + `\n(${name} -> ID: ${existingUserByName.id})`);
        return;
    }

    let typeLabel = (typeSelect === 'me') ? 'me' : 'other';
    const userRef = doc(dbInstance, "missionary_data", id);
    
    // 獲取訊息重點和需確認訊息
    const messagePoints = getMessagePoints();
    const confirmPoints = getConfirmPoints();
    
    // 使用時間戳記 (timestamp) 來進行秒數排序
    const timestamp = new Date().getTime();
    const newLogEntry = { 
        date, 
        type: typeLabel, 
        content, 
        createdAt: timestamp,
        messagePoints: messagePoints.length > 0 ? messagePoints : null,
        confirmPoints: confirmPoints.length > 0 ? confirmPoints : null
    };

    let updatedLogs = [];
    
    if (existingUserById) {
        updatedLogs = [...existingUserById.logs, newLogEntry];
        await setDoc(userRef, { id, name, logs: updatedLogs }, { merge: true });
        alert(t.alertUpdate + name);
    } else {
        updatedLogs = [newLogEntry];
        await setDoc(userRef, { id, name, logs: updatedLogs });
        alert(t.alertCreate + name);
    }
    document.getElementById('content').value = '';
    
    // 清空訊息重點和需確認訊息
    clearMessagePoints();
};

window.deleteSelected = async () => {
    if (!cloudEnabled) return;
    const t = i18n[currentLang];
    const checks = document.getElementsByName('selectUser');
    const toDelete = [];
    checks.forEach(c => { if(c.checked) toDelete.push(c.value); });

    if (toDelete.length === 0) return;
    if (confirm(t.alertConfirmDelete)) {
        for (const uid of toDelete) {
            await deleteDoc(doc(dbInstance, "missionary_data", uid));
        }
        document.getElementById('selectAll').checked = false;
        alert(t.alertDeleted);
        if (toDelete.includes(document.getElementById('idInput').value)) {
            document.getElementById('idInput').value = '';
            document.getElementById('nameInput').value = '';
        }
    }
};

// 刪除選項相關變數
let deleteTargetUid = null;
let deleteTargetLogIndex = null;

window.deleteSingleLog = async (event, uid, logIndex) => {
    if (!cloudEnabled) return;
    event.stopPropagation();
    
    deleteTargetUid = uid;
    deleteTargetLogIndex = logIndex;
    
    // 獲取該筆記錄的資料來判斷哪些選項可用
    const user = localDb.find(u => u.id === uid);
    if (!user) return;
    
    const sortedLogs = [...user.logs].sort((a, b) => {
        const dateA = a.date || '0000-00-00';
        const dateB = b.date || '0000-00-00';
        if (dateA !== dateB) return dateB.localeCompare(dateA);
        return (b.createdAt || 0) - (a.createdAt || 0);
    });
    
    const log = sortedLogs[logIndex];
    if (!log) return;
    
    // 更新選項狀態
    const hasAi = !!log.aiSummary;
    const hasPoints = log.messagePoints && log.messagePoints.length > 0;
    const hasConfirm = log.confirmPoints && log.confirmPoints.length > 0;
    
    document.getElementById('deleteOptionAi').classList.toggle('disabled', !hasAi);
    document.getElementById('deleteOptionPoints').classList.toggle('disabled', !hasPoints);
    document.getElementById('deleteOptionConfirm').classList.toggle('disabled', !hasConfirm);
    
    document.getElementById('deleteAi').checked = false;
    document.getElementById('deleteAi').disabled = !hasAi;
    document.getElementById('deletePoints').checked = false;
    document.getElementById('deletePoints').disabled = !hasPoints;
    document.getElementById('deleteConfirm').checked = false;
    document.getElementById('deleteConfirm').disabled = !hasConfirm;
    document.getElementById('deleteContent').checked = false;
    
    // 更新語言
    updateDeleteOptionsLanguage();
    
    // 顯示彈窗
    document.getElementById('deleteOptionsOverlay').classList.add('show');
};

window.closeDeleteOptions = (event) => {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('deleteOptionsOverlay').classList.remove('show');
    deleteTargetUid = null;
    deleteTargetLogIndex = null;
};

window.confirmDeleteOptions = async () => {
    if (!deleteTargetUid || deleteTargetLogIndex === null) return;
    
    const deleteContent = document.getElementById('deleteContent').checked;
    const deleteAi = document.getElementById('deleteAi').checked;
    const deletePoints = document.getElementById('deletePoints').checked;
    const deleteConfirm = document.getElementById('deleteConfirm').checked;
    
    // 至少要選擇一項
    if (!deleteContent && !deleteAi && !deletePoints && !deleteConfirm) {
        alert(currentLang === 'ko' ? '삭제할 항목을 선택해주세요.' : '請選擇要刪除的項目。');
        return;
    }
    
    const user = localDb.find(u => u.id === deleteTargetUid);
    if (!user) return;
    
    const sortedLogs = [...user.logs].sort((a, b) => {
        const dateA = a.date || '0000-00-00';
        const dateB = b.date || '0000-00-00';
        if (dateA !== dateB) return dateB.localeCompare(dateA);
        return (b.createdAt || 0) - (a.createdAt || 0);
    });
    
    if (deleteContent) {
        // 刪除整則記錄
        sortedLogs.splice(deleteTargetLogIndex, 1);
    } else {
        // 部分刪除
        const log = sortedLogs[deleteTargetLogIndex];
        if (deleteAi) {
            delete log.aiSummary;
            delete log.aiProvider;
            delete log.aiSummaryDate;
        }
        if (deletePoints) {
            log.messagePoints = [];
        }
        if (deleteConfirm) {
            log.confirmPoints = [];
        }
    }
    
    await updateDoc(doc(dbInstance, "missionary_data", deleteTargetUid), {
        logs: sortedLogs
    });
    
    window.closeDeleteOptions();
    restoreExpand(deleteTargetUid);
};

function updateDeleteOptionsLanguage() {
    const isKo = currentLang === 'ko';
    document.getElementById('deleteOptionsTitle').textContent = isKo ? '🗑️ 삭제 항목 선택' : '🗑️ 選擇刪除項目';
    document.getElementById('deleteContentLabel').textContent = isKo ? '📝 답장 내용 (전체 삭제)' : '📝 回覆內文（整則刪除）';
    document.getElementById('deleteAiLabel').textContent = isKo ? '✦ AI 분석 결과' : '✦ AI 分析結果';
    document.getElementById('deletePointsLabel').textContent = isKo ? '📌 메시지 포인트' : '📌 訊息重點';
    document.getElementById('deleteConfirmLabel').textContent = isKo ? '❓ 확인 필요 메시지' : '❓ 需確認訊息';
    document.getElementById('deleteOptionsCancelBtn').textContent = isKo ? '취소' : '取消';
    document.getElementById('deleteOptionsConfirmBtn').textContent = isKo ? '삭제 확인' : '確認刪除';
}

window.editDate = (event, uid, logIndex, el) => {
    if (!isEditMode) return;
    if (window.isSwipeAction && window.isSwipeAction()) return; // 滑動時不觸發
    event.stopPropagation();
    if (el.querySelector('input')) return;

    const originalDate = el.innerText;
    const input = document.createElement('input');
    input.type = 'date'; input.value = originalDate; input.style.width = '100%';
    el.innerHTML = ''; el.appendChild(input); input.focus();

    input.onblur = async () => {
        const newDate = input.value;
        if (newDate && newDate !== originalDate) {
            const user = localDb.find(u => u.id === uid);
            const sortedLogs = [...user.logs].sort((a, b) => {
                const dateA = a.date || '0000-00-00';
                const dateB = b.date || '0000-00-00';
                if (dateA !== dateB) return dateB.localeCompare(dateA);
                const timeA = a.createdAt || 0;
                const timeB = b.createdAt || 0;
                return timeB - timeA;
            });
            sortedLogs[logIndex].date = newDate;
            await updateDoc(doc(dbInstance, "missionary_data", uid), { logs: sortedLogs });
            restoreExpand(uid);
        } else {
            el.innerHTML = originalDate;
        }
    };
    input.onclick = (e) => e.stopPropagation();
};

window.editContent = (event, uid, logIndex, el) => {
    if (!isEditMode) return;
    if (window.isSwipeAction && window.isSwipeAction()) return; // 滑動時不觸發
    event.stopPropagation();
    if (el.querySelector('textarea')) return;

    const originalText = el.innerText;
    const input = document.createElement('textarea');
    input.value = originalText; input.style.width = '100%'; input.style.padding='4px'; input.rows = 3;
    el.innerHTML = ''; el.appendChild(input); input.focus();

    input.onblur = async () => {
        const newText = input.value.trim();
        if (newText && newText !== originalText) {
            const user = localDb.find(u => u.id === uid);
            const sortedLogs = [...user.logs].sort((a, b) => {
                const dateA = a.date || '0000-00-00';
                const dateB = b.date || '0000-00-00';
                if (dateA !== dateB) return dateB.localeCompare(dateA);
                const timeA = a.createdAt || 0;
                const timeB = b.createdAt || 0;
                return timeB - timeA;
            });
            sortedLogs[logIndex].content = newText;
            await updateDoc(doc(dbInstance, "missionary_data", uid), { logs: sortedLogs });
            restoreExpand(uid);
        } else {
            el.innerText = originalText;
        }
    };
    input.onclick = (e) => e.stopPropagation();
};

function renderBackend() {
    if (!cloudEnabled) return;
    const t = i18n[currentLang];
    const listContainer = document.getElementById('dataList');
    
    // 如果 Firebase 還沒回傳資料，顯示載入動畫
    if (!window.firebaseLoaded) {
        listContainer.innerHTML = '<div class="loading-dots-wrapper"><div class="loading-dots"><span></span><span></span><span></span></div></div>';
        if (typeof updateCounter === 'function') updateCounter();
        return;
    }
    
    listContainer.innerHTML = '';

    // 排序輔助函數：主要以選擇的日期排序，同一天則以 createdAt (秒級) 排序
    const sortByDateThenTime = (a, b) => {
        const dateA = a.date || '0000-00-00';
        const dateB = b.date || '0000-00-00';
        // 比較日期 (日期晚的靠前)
        if (dateA !== dateB) {
            return dateB.localeCompare(dateA);
        }
        // 同一天則比較 createdAt (時間晚的靠前)
        const timeA = a.createdAt || 0;
        const timeB = b.createdAt || 0;
        return timeB - timeA;
    };

    const processedUsers = localDb.map(user => {
        // 排序邏輯：主要以選擇的日期排序，同一天則以 createdAt 排序
        const sortedLogs = [...user.logs].sort(sortByDateThenTime);
        const lastLog = sortedLogs[0] || { date: '0000-00-00', content: t.msgEmpty, createdAt: 0 };
        return { ...user, logs: sortedLogs, lastLog };
    });

    processedUsers.sort((a, b) => {
        let compareResult = 0;
        
        if (sortBy === 'date') {
            const dateA = a.lastLog.date || '0000-00-00';
            const dateB = b.lastLog.date || '0000-00-00';
            const timeA = a.lastLog.createdAt || 0;
            const timeB = b.lastLog.createdAt || 0;
            if (dateA !== dateB) {
                compareResult = dateB.localeCompare(dateA);
            } else {
                compareResult = timeB - timeA;
            }
        } else if (sortBy === 'id') {
            compareResult = a.id.localeCompare(b.id, undefined, { numeric: true });
        } else if (sortBy === 'name') {
            compareResult = a.name.localeCompare(b.name, 'ko');
        } else if (sortBy === 'activity') {
            // 活躍度排序：high > normal > low
            const getActivityScore = (user) => {
                const lastLogDate = user.lastLog.date !== '0000-00-00' ? new Date(user.lastLog.date) : null;
                if (!lastLogDate) return 0;
                const daysDiff = Math.floor((new Date() - lastLogDate) / (1000 * 60 * 60 * 24));
                if (daysDiff <= 3) return 3;
                if (daysDiff <= 7) return 2;
                return 1;
            };
            compareResult = getActivityScore(b) - getActivityScore(a);
        }
        
        return sortDesc ? compareResult : -compareResult;
    });

    processedUsers.forEach(user => {
        const card = document.createElement('div');
        card.className = 'user-card';
        const displayDate = user.lastLog.date === '0000-00-00' ? '-' : user.lastLog.date;

        // 計算活躍度（3天內活躍、3-7天一般、7天以上低活躍）
        const now = new Date();
        const lastLogDate = user.lastLog.date !== '0000-00-00' ? new Date(user.lastLog.date) : null;
        let activityLevel = 'low';
        let activityText = t.activityLow;
        let activityClass = 'activity-low';
        
        if (lastLogDate) {
            const daysDiff = Math.floor((now - lastLogDate) / (1000 * 60 * 60 * 24));
            if (daysDiff <= 3) {
                activityLevel = 'high';
                activityText = t.activityHigh;
                activityClass = 'activity-high';
            } else if (daysDiff <= 7) {
                activityLevel = 'normal';
                activityText = t.activityNormal;
                activityClass = 'activity-normal';
            }
        }

        // 獲取用戶首字母作為頭像
        const avatarLetter = user.name ? user.name.charAt(0).toUpperCase() : '?';
        
        // 獲取個人資料
        const profile = user.profile || {};
        const locationText = profile.location || '-';
        const phoneText = profile.phone || '-';
        const contactText = profile.contact || '-';
        const contactIdText = profile.contactId || '-';
        const jobText = profile.job || '-';
        
        // 計算生日和年紀顯示
        let birthdayText = '-';
        let ageText = '-';
        if (profile.birthYear && profile.birthMonth && profile.birthDay) {
            birthdayText = `${profile.birthYear}/${profile.birthMonth.padStart(2,'0')}/${profile.birthDay.padStart(2,'0')}`;
            // 重新計算年齡
            const today = new Date();
            const birthDate = new Date(parseInt(profile.birthYear), parseInt(profile.birthMonth) - 1, parseInt(profile.birthDay));
            let calculatedAge = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                calculatedAge--;
            }
            ageText = calculatedAge >= 0 ? calculatedAge + t.ageUnit : '-';
        } else if (profile.birthMonth && profile.birthDay) {
            birthdayText = `${profile.birthMonth.padStart(2,'0')}/${profile.birthDay.padStart(2,'0')}`;
            ageText = profile.age ? profile.age + t.ageUnit : '-';
        } else if (profile.age) {
            ageText = profile.age + t.ageUnit;
        }
        
        const mbtiText = profile.mbti || '-';

        const summaryHtml = `
            <div class="user-summary grid-row" onclick="window.toggleDetails('${user.id}')">
                <div class="check-cell" onclick="event.stopPropagation()">
                    <input type="checkbox" name="selectUser" value="${user.id}">
                </div>
                <div class="avatar-cell" style="position:relative;" onclick="event.stopPropagation()">
                    <div class="user-avatar" onclick="window.toggleProfilePopup('${user.id}')">${avatarLetter}</div>
                    <div class="profile-popup" id="popup-${user.id}">
                        <div class="profile-popup-item">
                            <span class="profile-popup-label">${t.popupLocation}</span>
                            <span class="profile-popup-value">${locationText}</span>
                        </div>
                        <div class="profile-popup-item">
                            <span class="profile-popup-label">${t.popupPhone}</span>
                            <span class="profile-popup-value">${phoneText}</span>
                        </div>
                        <div class="profile-popup-item">
                            <span class="profile-popup-label">${t.popupContact}</span>
                            <span class="profile-popup-value">${contactText}</span>
                        </div>
                        <div class="profile-popup-item">
                            <span class="profile-popup-label">${t.popupContactId}</span>
                            <span class="profile-popup-value">${contactIdText}</span>
                        </div>
                        <div class="profile-popup-item">
                            <span class="profile-popup-label">${t.popupBirthday}</span>
                            <span class="profile-popup-value">${birthdayText}</span>
                        </div>
                        <div class="profile-popup-item">
                            <span class="profile-popup-label">${t.popupAge}</span>
                            <span class="profile-popup-value">${ageText}</span>
                        </div>
                        <div class="profile-popup-item">
                            <span class="profile-popup-label">${t.popupMbti}</span>
                            <span class="profile-popup-value">${mbtiText}</span>
                        </div>
                        <div class="profile-popup-item">
                            <span class="profile-popup-label">${t.popupJob}</span>
                            <span class="profile-popup-value">${jobText}</span>
                        </div>
                    </div>
                </div>
                <div style="font-weight:bold; color:#666;">${user.id}</div>
                <div><span class="activity-badge ${activityClass}">${activityText}</span></div>
                <div style="font-weight:bold; font-size:1.05rem;">${user.name}</div>
                <div class="col-date" style="color:#2e7d32;">${displayDate}</div>
                <div class="action-cell"></div>
            </div>`;

        let logsHtml = '';
        user.logs.forEach((log, idx) => {
            const typeText = log.type === 'me' ? t.tagMe : t.tagOther;
            const typeClass = log.type === 'me' ? 'tag-me' : 'tag-other';
            
            // 生成AI摘要HTML（如果有）
            let aiSummaryHtml = '';
            if (log.aiSummary) {
                const aiTitle = currentLang === 'ko' ? '✦ AI 요약' : '✦ AI 摘要';
                const providerName = log.aiProvider || 'AI';
                aiSummaryHtml = `
                    <div class="ai-summary-container">
                        <div class="ai-summary-header">${aiTitle}</div>
                        <div class="ai-summary-content">${log.aiSummary}</div>
                        <div class="ai-summary-meta">${providerName} · ${log.aiSummaryDate || ''}</div>
                    </div>`;
            }
            
            // 生成訊息重點和需確認訊息的HTML
            let pointsHtml = '';
            if ((log.messagePoints && log.messagePoints.length > 0) || 
                (log.confirmPoints && log.confirmPoints.length > 0)) {
                pointsHtml = '<div class="log-points-container">';
                
                if (log.messagePoints && log.messagePoints.length > 0) {
                    const msgTitle = currentLang === 'ko' ? '📌 메시지 포인트' : '📌 訊息重點';
                    pointsHtml += `<div class="log-points-section"><div class="log-points-title">${msgTitle}</div>`;
                    log.messagePoints.forEach(point => {
                        pointsHtml += `<div class="log-point-item"><span class="log-point-tag">${point.tag}</span><span class="log-point-content">${point.content}</span></div>`;
                    });
                    pointsHtml += '</div>';
                }
                
                if (log.confirmPoints && log.confirmPoints.length > 0) {
                    const confTitle = currentLang === 'ko' ? '❓ 확인 필요' : '❓ 需確認';
                    pointsHtml += `<div class="log-points-section"><div class="log-points-title">${confTitle}</div>`;
                    log.confirmPoints.forEach(point => {
                        pointsHtml += `<div class="log-point-item"><span class="log-point-tag confirm">${point.tag}</span><span class="log-point-content">${point.content}</span></div>`;
                    });
                    pointsHtml += '</div>';
                }
                
                pointsHtml += '</div>';
            }
            
            logsHtml += `
                <div class="detail-row grid-row" data-uid="${user.id}" data-idx="${idx}">
                    <div class="check-cell"></div>
                    <div></div>
                    <div><span class="tag ${typeClass}">${typeText}</span></div>
                    <div class="editable detail-date-cell" onclick="window.editDate(event, '${user.id}', ${idx}, this)">${log.date}<button class="ai-summary-btn" onclick="window.triggerAiSummary(event, '${user.id}', ${idx})" title="AI整理">✦AI</button></div>
                    <div class="editable copyable detail-content-cell" onclick="window.editContent(event, '${user.id}', ${idx}, this)" ondblclick="window.copyContent(event, this)"><span class="log-content-text">${log.content}</span>${aiSummaryHtml}${pointsHtml}</div>
                    <div class="action-cell">
                        <button class="btn-remove-log" onclick="window.deleteSingleLog(event, '${user.id}', ${idx})">✕</button>
                    </div>
                </div>`;
        });

        card.innerHTML = summaryHtml + `<div class="user-details" id="details-${user.id}">${logsHtml}</div>`;
        listContainer.appendChild(card);
    });

    if (isEditMode) {
        document.getElementById('dataListContainer').classList.add('edit-mode');
    }
    updateCounter();
}

// 雙擊複製對話內容
window.copyContent = (event, element) => {
    event.stopPropagation();
    event.preventDefault();
    
    const content = element.textContent || element.innerText;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(content).then(() => {
            // 顯示複製成功提示
            showCopyToast();
        }).catch(err => {
            console.error('複製失敗:', err);
            fallbackCopy(content);
        });
    } else {
        fallbackCopy(content);
    }
};

// 備用複製方法
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showCopyToast();
    } catch (err) {
        console.error('備用複製方法失敗:', err);
    }
    document.body.removeChild(textArea);
}

// 顯示複製成功提示
function showCopyToast() {
    const t = i18n[currentLang];
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.textContent = t.msgCopied || '已複製！';
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 1500);
}

// 切換個人資訊彈出框
window.toggleProfilePopup = (uid) => {
    const popup = document.getElementById(`popup-${uid}`);
    const allPopups = document.querySelectorAll('.profile-popup');
    allPopups.forEach(p => {
        if (p.id !== `popup-${uid}`) {
            p.classList.remove('show');
        }
    });
    popup.classList.toggle('show');
};

// 點擊其他地方關閉彈出框
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-avatar') && !e.target.closest('.profile-popup')) {
        document.querySelectorAll('.profile-popup').forEach(p => p.classList.remove('show'));
    }
});

window.toggleEditMode = () => {
    isEditMode = !isEditMode;
    const container = document.getElementById('dataListContainer');
    const controls = document.getElementById('editControls');
    const btn = document.getElementById('btn-toggle-edit');
    const t = i18n[currentLang];

    if (isEditMode) {
        container.classList.add('edit-mode');
        controls.style.display = 'flex';
        btn.textContent = t.btnDone;
        btn.classList.add('editing');
    } else {
        container.classList.remove('edit-mode');
        controls.style.display = 'none';
        btn.textContent = t.btnEdit;
        btn.classList.remove('editing');
        const checks = document.getElementsByName('selectUser');
        checks.forEach(c => c.checked = false);
        document.getElementById('selectAll').checked = false;
    }
};

window.toggleDetails = (uid) => {
    if (window.isSwipeAction && window.isSwipeAction()) return; // 滑動時不觸發
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    const details = document.getElementById(`details-${uid}`);
    const summary = details.previousElementSibling;
    if (details.style.display === 'block') {
        details.style.display = 'none';
        summary.classList.remove('expanded');
    } else {
        details.style.display = 'block';
        summary.classList.add('expanded');
    }
};

function restoreExpand(uid) {
    setTimeout(() => {
        const d = document.getElementById(`details-${uid}`);
        if(d) { d.style.display = 'block'; d.previousElementSibling.classList.add('expanded'); }
    }, 100); 
}

window.toggleSortBy = (field) => {
    if (sortBy === field) {
        sortDesc = !sortDesc;
    } else {
        sortBy = field;
        sortDesc = true;
    }
    // 更新所有排序圖示
    ['Id', 'Activity', 'Name', 'Date'].forEach(f => {
        const icon = document.getElementById('sortIcon' + f);
        if (icon) icon.textContent = '';
    });
    const activeIcon = document.getElementById('sortIcon' + field.charAt(0).toUpperCase() + field.slice(1));
    if (activeIcon) activeIcon.textContent = sortDesc ? '▼' : '▲';
    renderBackend();
};
window.toggleSort = () => { window.toggleSortBy('date'); }; // 保留舊函數相容性
window.toggleOfflineSort = () => { offlineSortDesc = !offlineSortDesc; document.getElementById('offlineSortIcon').textContent = offlineSortDesc ? '▼' : '▲'; renderOfflineBackend(); };
window.toggleSelectAll = () => { const m = document.getElementById('selectAll'); document.getElementsByName('selectUser').forEach(c => c.checked = m.checked); };
window.toggleOfflineSelectAll = () => { const m = document.getElementById('offlineSelectAll'); document.getElementsByName('selectOfflineUser').forEach(c => c.checked = m.checked); };

window.toggleMenu = () => {
    const dropdown = document.getElementById('menuDropdown');
    const toggle = document.querySelector('.menu-toggle');
    dropdown.classList.toggle('show');
    toggle.classList.toggle('open');
};

// 點擊其他地方關閉選單
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('menuDropdown');
    const toggle = document.querySelector('.menu-toggle');
    if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
        toggle.classList.remove('open');
    }
});

window.switchPage = (page) => {
    const t = i18n[currentLang];
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    
    // 關閉選單
    document.getElementById('menuDropdown').classList.remove('show');
    document.querySelector('.menu-toggle').classList.remove('open');
    
    // 更新 URL（clean URL，無 #）
    const pathMap = {
        'home': '/',
        'bible': '/bible',
        'entry': '/entry',
        'backend': '/backend',
        'profile': '/profile',
        'faithAuto': '/faith-auto',
        'faith-chart': '/faith-chart',
        'daily-faith': '/daily-faith',
        'ai-compose': '/ai-compose',
        'offline-entry': '/offline-entry',
        'offline-backend': '/offline-backend'
    };
    const newPath = pathMap[page] || '/';
    if (window.location.pathname !== newPath) {
        history.pushState(null, '', newPath);
    }
    
    // 更新當前頁面標題
    const pageTitleEl = document.getElementById('current-page-title');
    
    // 根據頁面自動展開對應的子選單
    document.querySelectorAll('.menu-category').forEach(c => c.classList.remove('open'));
    
    // 隱藏功能按鈕群組（預設）
    document.getElementById('bibleFabContainer').classList.remove('show');
    if (page !== 'bible') {
        closeBibleChaptersPopover();
    }
    // 重置搜尋按鈕
    document.getElementById('bibleFabMain').classList.remove('active');
    
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
    } else if (page === 'daily-faith') {
        document.getElementById('dailyFaithSection').classList.add('active-section');
        document.getElementById('btn-daily-faith')?.classList.add('active');
        document.getElementById('menu-category-faith').classList.add('open');
        pageTitleEl.textContent = t.btnDailyFaith;
    } else if (page === 'faithAuto') {
        document.getElementById('faithAutoSection').classList.add('active-section');
        document.getElementById('menu-category-faith-auto').classList.add('open');
        pageTitleEl.textContent = currentLang === 'ko' ? '신앙 자동화 관리' : '信仰自動化管理';
    } else if (page === 'ai-compose') {
        document.getElementById('aiComposeSection').classList.add('active-section');
        document.getElementById('btn-ai-compose')?.classList.add('active');
        document.getElementById('menu-category-faith-auto').classList.add('open');
        pageTitleEl.textContent = currentLang === 'ko' ? 'AI 통합 작문' : 'AI 整合作文';
        applyComposeLanguage();
    } else if (page === 'faith-chart') {
        document.getElementById('faithChartSection').classList.add('active-section');
        document.getElementById('btn-faith-chart')?.classList.add('active');
        document.getElementById('menu-category-faith').classList.add('open');
        pageTitleEl.textContent = t.btnFaithChart;
    } else if (page === 'bible') {
        document.getElementById('bibleSection').classList.add('active-section');
        document.getElementById('btn-bible').classList.add('active');
        document.getElementById('menu-category-books').classList.add('open');
        pageTitleEl.textContent = t.btnBible;
        // 重置聖經頁面到書卷列表
        document.getElementById('bibleBooksList').style.display = 'block';
        document.getElementById('bibleContentView').classList.remove('show');
        // 顯示功能按鈕群組
        document.getElementById('bibleFabContainer').classList.add('show');
    } else if (page === 'entry') { 
        document.getElementById('entrySection').classList.add('active-section'); 
        document.getElementById('btn-entry').classList.add('active');
        document.getElementById('menu-category-fruit').classList.add('open');
        pageTitleEl.textContent = t.btnEntry;
    } else if (page === 'offline-entry') {
        document.getElementById('offlineEntrySection').classList.add('active-section'); 
        document.getElementById('btn-offline-entry').classList.add('active');
        document.getElementById('menu-category-fruit').classList.add('open');
        pageTitleEl.textContent = t.btnOfflineEntry;
    } else if (page === 'profile') {
        document.getElementById('profileSection').classList.add('active-section'); 
        document.getElementById('btn-profile').classList.add('active');
        document.getElementById('menu-category-fruit').classList.add('open');
        pageTitleEl.textContent = t.btnProfile;
    } else if (page === 'backend') { 
        document.getElementById('backendSection').classList.add('active-section'); 
        document.getElementById('btn-backend').classList.add('active'); 
        document.getElementById('menu-category-fruit').classList.add('open');
        pageTitleEl.textContent = t.btnBackend;
        renderBackend(); 
    } else if (page === 'offline-backend') {
        document.getElementById('offlineBackendSection').classList.add('active-section'); 
        document.getElementById('btn-offline-backend').classList.add('active');
        document.getElementById('menu-category-fruit').classList.add('open');
        pageTitleEl.textContent = t.btnOfflineBackend;
        renderOfflineBackend(); 
    }

    setTimeout(updateScrollTopButton, 0);
};

// 切換子選單
window.toggleSubMenu = (category) => {
    const categoryEl = document.getElementById(`menu-category-${category}`);
    if (categoryEl) {
        categoryEl.classList.toggle('open');
    }
};

function updateCounter() {
    const t = i18n[currentLang];
    document.getElementById('txt-total-count').textContent = t.txtTotal + localDb.length + t.txtPerson;
    
    // 計算週間交流人數（最近7天內有記錄的人數）
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyInteractionCount = localDb.filter(user => {
        if (!user.logs || user.logs.length === 0) return false;
        return user.logs.some(log => {
            const logDate = new Date(log.date);
            return logDate >= oneWeekAgo;
        });
    }).length;
    
    document.getElementById('txt-interaction-count').textContent = t.txtWeeklyInteraction + weeklyInteractionCount + t.txtPerson;
}

// ===== 每日經文系統（首爾時間 UTC+9） =====
const DAILY_VERSE_KEY = 'daily_verse_cache';
const DAILY_VERSE_HISTORY_KEY = 'daily_verse_history';

// 一次性清除舊版快取
const VERSE_CACHE_VERSION = '2026.05.04.v3';
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

function getVerseHistory() {
    try {
        const data = JSON.parse(localStorage.getItem(DAILY_VERSE_HISTORY_KEY) || '[]');
        const now = Date.now();
        const sixtyDays = 60 * 24 * 60 * 60 * 1000;
        return data.filter(item => (now - item.timestamp) < sixtyDays);
    } catch (e) { return []; }
}

function recordVerseUsed(verseKey) {
    const history = getVerseHistory();
    history.push({ key: verseKey, timestamp: Date.now() });
    localStorage.setItem(DAILY_VERSE_HISTORY_KEY, JSON.stringify(history));
}

function getDailyVerse() {
    const todaySeed = getDailySeed();
    
    const cached = localStorage.getItem(DAILY_VERSE_KEY);
    if (cached) {
        try {
            const cacheData = JSON.parse(cached);
            if (cacheData.seed === todaySeed) return cacheData;
        } catch(e) {}
    }
    
    // 每日默想經文池（固定清單，涵蓋常用章節）
    const versePool = [
        { ko: '창세기 1:1', zh: '創世記 1:1', textKo: '태초에 하나님이 천지를 창조하시니라', textZh: '起初，神創造天地。' },
        { ko: '시편 23:1', zh: '詩篇 23:1', textKo: '여호와는 나의 목자시니 내가 부족함이 없으리로다', textZh: '耶和華是我的牧者，我必不致缺乏。' },
        { ko: '요한복음 3:16', zh: '約翰福音 3:16', textKo: '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니', textZh: '神愛世人，甚至將他的獨生子賜給他們。' },
        { ko: '빌립보서 4:13', zh: '腓立比書 4:13', textKo: '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라', textZh: '我靠著那加給我力量的，凡事都能做。' },
        { ko: '예레미야 29:11', zh: '耶利米書 29:11', textKo: '여호와의 말씀이니라 너희를 향한 나의 생각은 내가 아나니', textZh: '耶和華說：我知道我向你們所懷的意念。' },
        { ko: '마태복음 6:33', zh: '馬太福音 6:33', textKo: '너희는 먼저 그의 나라와 그의 의를 구하라', textZh: '你們要先求他的國和他的義。' },
        { ko: '이사야 40:31', zh: '以賽亞書 40:31', textKo: '오직 여호와를 앙망하는 자는 새 힘을 얻으리니', textZh: '但那等候耶和華的必重新得力。' },
        { ko: '로마서 8:28', zh: '羅馬書 8:28', textKo: '우리가 알거니와 하나님을 사랑하는 자 곧 그 뜻대로 부르심을 입은 자들에게는', textZh: '我們曉得萬事都互相效力，叫愛神的人得益處。' },
        { ko: '시편 119:105', zh: '詩篇 119:105', textKo: '주의 말씀은 내 발에 등이요 내 길에 빛이니이다', textZh: '你的話是我腳前的燈，是我路上的光。' },
        { ko: '요한복음 14:6', zh: '約翰福音 14:6', textKo: '예수께서 가라사대 내가 곧 길이요 진리요 생명이니', textZh: '耶穌說：我就是道路、真理、生命。' },
        { ko: '고린도전서 13:13', zh: '哥林多前書 13:13', textKo: '그런즉 믿음 소망 사랑 이 세 가지는 항상 있을 것인데', textZh: '如今常存的有信、有望、有愛；這三樣，其中最大的是愛。' },
        { ko: '신명기 31:6', zh: '申命記 31:6', textKo: '강하고 담대하라 두려워 말라', textZh: '你們當剛強壯膽，不要懼怕。' },
        { ko: '시편 46:1', zh: '詩篇 46:1', textKo: '하나님은 우리의 피난처시요 힘이시니', textZh: '神是我們的避難所，是我們的力量。' },
        { ko: '잠언 3:5', zh: '箴言 3:5', textKo: '너는 마음을 다하여 여호와를 의뢰하고', textZh: '你要專心仰賴耶和華，不可倚靠自己的聰明。' },
        { ko: '마태복음 11:28', zh: '馬太福音 11:28', textKo: '수고하고 무거운 짐 진 자들아 다 내게로 오라', textZh: '凡勞苦擔重擔的人可以到我這裡來，我就使你們得安息。' },
    ];
    
    const idx = Math.floor(seededRandom(todaySeed * 7 + 13) * versePool.length);
    const v = versePool[idx];
    
    const result = {
        seed: todaySeed,
        reference: { ko: v.ko, zh: v.zh },
        text: { ko: v.textKo, zh: v.textZh }
    };
    
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

// 首頁（不再需要滾動監聽器）
let homeScrollHandler = null;
let homeScrollContainer = null;

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
    
    const verse = getDailyVerse();
    
    if (labelEl) labelEl.textContent = currentLang === 'ko' ? '매일묵상' : '每日默想';
    if (refEl) refEl.textContent = currentLang === 'ko' ? verse.reference.ko : verse.reference.zh;
    if (textEl) textEl.textContent = currentLang === 'ko' ? verse.text.ko : verse.text.zh;
    
    const homeContainer = document.querySelector('#homeSection .home-container');
    if (homeContainer) homeContainer.scrollTo(0, 0);
    
    setTimeout(() => { slide1.classList.add('loaded'); }, 100);
    setTimeout(() => { slide1.classList.add('verse-show'); }, 1200);
    
    initHomeFeatureAnimations();
}

function setupHomeScrollListener(container) {}

function cleanupDailyVerse() {
    document.body.classList.remove('home-active');
    document.documentElement.style.backgroundColor = '#f5f0e8';
    const themeColorMeta = document.getElementById('themeColorMeta');
    if (themeColorMeta) themeColorMeta.setAttribute('content', '#f5f0e8');
    const slide1 = document.getElementById('dailyVerseSection');
    if (slide1) { slide1.classList.remove('loaded'); slide1.classList.remove('verse-show'); }
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

function updateOfflineCounter() {
    const t = i18n[currentLang];
    const offlineTotalEl = document.getElementById('txt-offline-total-count');
    if (offlineTotalEl) {
        offlineTotalEl.textContent = t.txtTotal + offlineDb.length + t.txtPerson;
    }
    
    // 計算週間交流人數
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyInteractionCount = offlineDb.filter(user => {
        if (!user.logs || user.logs.length === 0) return false;
        return user.logs.some(log => {
            const logDate = new Date(log.date);
            return logDate >= oneWeekAgo;
        });
    }).length;
    
    const offlineInteractionEl = document.getElementById('txt-offline-interaction-count');
    if (offlineInteractionEl) {
        offlineInteractionEl.textContent = t.txtWeeklyInteraction + weeklyInteractionCount + t.txtPerson;
    }
}

function generateNewId() {
    if (localDb.length === 0) return '0001';
    const maxId = localDb.reduce((max, u) => Math.max(max, parseInt(u.id, 10)), 0);
    return String(maxId + 1).padStart(4, '0');
}

function generateNewOfflineId() {
    if (offlineDb.length === 0) return '5000';
    const maxId = offlineDb.reduce((max, u) => Math.max(max, parseInt(u.id, 10)), 5000);
    return String(maxId + 1);
}

// --- 個人資料頁面功能 ---
function showProfileStatus(msg, type) {
    const el = document.getElementById('profileStatusMsg');
    el.textContent = msg;
    el.className = `status-bar status-${type}`;
    el.style.display = 'block';
}

window.handleProfileIdInput = () => {
    const t = i18n[currentLang];
    const idVal = document.getElementById('profileIdInput').value.trim();
    
    if (!idVal) {
        document.getElementById('profileNameInput').value = '';
        document.getElementById('profileLocation').value = '';
        document.getElementById('profilePhone').value = '';
        document.getElementById('profileContact').value = '';
        document.getElementById('profileContactId').value = '';
        document.getElementById('profileBirthYear').value = '';
        document.getElementById('profileBirthMonth').value = '';
        document.getElementById('profileBirthDay').value = '';
        document.getElementById('profileAge').value = '';
        document.getElementById('profileMbti').value = '';
        document.getElementById('profileJob').value = '';
        document.getElementById('profileStatusMsg').style.display = 'none';
        return;
    }

    const user = localDb.find(u => u.id === idVal);
    if (user) {
        document.getElementById('profileNameInput').value = user.name;
        showProfileStatus(t.statusFound + user.name, 'found');
        // 載入現有個人資料
        const profile = user.profile || {};
        document.getElementById('profileLocation').value = profile.location || '';
        document.getElementById('profilePhone').value = profile.phone || '';
        document.getElementById('profileContact').value = profile.contact || '';
        document.getElementById('profileContactId').value = profile.contactId || '';
        document.getElementById('profileBirthYear').value = profile.birthYear || '';
        document.getElementById('profileBirthMonth').value = profile.birthMonth || '';
        document.getElementById('profileBirthDay').value = profile.birthDay || '';
        document.getElementById('profileMbti').value = profile.mbti || '';
        document.getElementById('profileJob').value = profile.job || '';
        // 如果有完整生日資料，重新計算年齡
        if (profile.birthYear && profile.birthMonth && profile.birthDay) {
            window.calculateAge();
        } else {
            document.getElementById('profileAge').value = profile.age || '';
        }
    } else {
        if(idVal.length >= 4) showProfileStatus(t.statusNew, 'new');
        else document.getElementById('profileStatusMsg').style.display = 'none';
        document.getElementById('profileLocation').value = '';
        document.getElementById('profilePhone').value = '';
        document.getElementById('profileContact').value = '';
        document.getElementById('profileContactId').value = '';
        document.getElementById('profileBirthYear').value = '';
        document.getElementById('profileBirthMonth').value = '';
        document.getElementById('profileBirthDay').value = '';
        document.getElementById('profileAge').value = '';
        document.getElementById('profileMbti').value = '';
        document.getElementById('profileJob').value = '';
    }
};

window.handleProfileNameInput = () => {
    const t = i18n[currentLang];
    const nameVal = document.getElementById('profileNameInput').value.trim();
    
    if (!nameVal) {
        document.getElementById('profileIdInput').value = '';
        document.getElementById('profileLocation').value = '';
        document.getElementById('profilePhone').value = '';
        document.getElementById('profileContact').value = '';
        document.getElementById('profileContactId').value = '';
        document.getElementById('profileBirthYear').value = '';
        document.getElementById('profileBirthMonth').value = '';
        document.getElementById('profileBirthDay').value = '';
        document.getElementById('profileAge').value = '';
        document.getElementById('profileMbti').value = '';
        document.getElementById('profileJob').value = '';
        document.getElementById('profileStatusMsg').style.display = 'none';
        return;
    }

    const user = localDb.find(u => u.name === nameVal);
    if (user) {
        document.getElementById('profileIdInput').value = user.id;
        showProfileStatus(t.statusFound + user.name, 'found');
        // 載入現有個人資料
        const profile = user.profile || {};
        document.getElementById('profileLocation').value = profile.location || '';
        document.getElementById('profilePhone').value = profile.phone || '';
        document.getElementById('profileContact').value = profile.contact || '';
        document.getElementById('profileContactId').value = profile.contactId || '';
        document.getElementById('profileBirthYear').value = profile.birthYear || '';
        document.getElementById('profileBirthMonth').value = profile.birthMonth || '';
        document.getElementById('profileBirthDay').value = profile.birthDay || '';
        document.getElementById('profileMbti').value = profile.mbti || '';
        document.getElementById('profileJob').value = profile.job || '';
        // 如果有完整生日資料，重新計算年齡
        if (profile.birthYear && profile.birthMonth && profile.birthDay) {
            window.calculateAge();
        } else {
            document.getElementById('profileAge').value = profile.age || '';
        }
    } else {
        if (document.getElementById('profileIdInput').value === '') {
            const newId = generateNewId();
            showProfileStatus(t.statusNewId + newId, 'new');
            document.getElementById('profileIdInput').value = newId; 
        }
    }
};

window.saveProfile = async () => {
    if (!cloudEnabled) { alert(i18n[currentLang].msgCloudError); return; }
    
    const t = i18n[currentLang];
    const id = document.getElementById('profileIdInput').value.trim();
    const name = document.getElementById('profileNameInput').value.trim();
    
    if (!id) { 
        alert(t.alertProfileIdRequired); 
        return; 
    }

    const location = document.getElementById('profileLocation').value.trim();
    const phone = document.getElementById('profilePhone').value.trim();
    const contact = document.getElementById('profileContact').value;
    const contactId = document.getElementById('profileContactId').value.trim();

    const userRef = doc(dbInstance, "missionary_data", id);
    const existingUser = localDb.find(u => u.id === id);
    
    const birthYear = document.getElementById('profileBirthYear').value.trim();
    const birthMonth = document.getElementById('profileBirthMonth').value.trim();
    const birthDay = document.getElementById('profileBirthDay').value.trim();
    const age = document.getElementById('profileAge').value.trim();
    const mbti = document.getElementById('profileMbti').value.trim().toUpperCase();
    const job = document.getElementById('profileJob').value.trim();
    
    const profileData = { 
        location, phone, contact, contactId,
        birthYear, birthMonth, birthDay, age, mbti, job
    };

    if (existingUser) {
        await updateDoc(userRef, { profile: profileData });
    } else if (name) {
        await setDoc(userRef, { id, name, logs: [], profile: profileData });
    } else {
        alert(t.alertIncomplete);
        return;
    }

    alert(t.alertProfileSaved);
};

// 生日年份輸入處理（自動跳轉到月份）
window.handleBirthYearInput = (input) => {
    // 只允許數字
    input.value = input.value.replace(/[^0-9]/g, '');
    
    // 輸入滿4位後自動跳到月份
    if (input.value.length === 4) {
        document.getElementById('profileBirthMonth').focus();
    }
    window.calculateAge();
};

// 生日月份輸入處理（自動跳轉到日期）
window.handleBirthMonthInput = (input) => {
    // 只允許數字
    input.value = input.value.replace(/[^0-9]/g, '');
    
    // 輸入滿2位後自動跳到日期
    if (input.value.length === 2) {
        document.getElementById('profileBirthDay').focus();
    }
    window.calculateAge();
};

// 生日日期輸入處理（自動跳轉到年齡）
window.handleBirthDayInput = (input) => {
    // 只允許數字
    input.value = input.value.replace(/[^0-9]/g, '');
    
    // 輸入滿2位後自動跳到年齡（或完成輸入）
    if (input.value.length === 2) {
        document.getElementById('profileAge').focus();
    }
    window.calculateAge();
};

// 計算年齡
window.calculateAge = () => {
    const yearInput = document.getElementById('profileBirthYear').value.trim();
    const monthInput = document.getElementById('profileBirthMonth').value.trim();
    const dayInput = document.getElementById('profileBirthDay').value.trim();
    
    // 只有年月日都填寫時才自動計算年齡
    if (yearInput && monthInput && dayInput && 
        yearInput.length === 4 && monthInput.length >= 1 && dayInput.length >= 1) {
        
        const year = parseInt(yearInput, 10);
        const month = parseInt(monthInput, 10);
        const day = parseInt(dayInput, 10);
        
        if (!isNaN(year) && !isNaN(month) && !isNaN(day) && 
            month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            
            const today = new Date();
            const birthDate = new Date(year, month - 1, day);
            
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            // 如果還沒過生日，年齡減1
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age >= 0 && age < 150) {
                document.getElementById('profileAge').value = age;
            }
        }
    }
};

// --- 線下登錄功能 ---
function showOfflineStatus(msg, type) {
    const el = document.getElementById('offlineStatusMsg');
    el.textContent = msg;
    el.className = `status-bar status-${type}`;
    el.style.display = 'block';
}

window.handleOfflineIdInput = () => {
    const t = i18n[currentLang];
    const idVal = document.getElementById('offlineIdInput').value.trim();
    
    if (!idVal) {
        document.getElementById('offlineNameInput').value = '';
        document.getElementById('offlineStatusMsg').style.display = 'none';
        return;
    }

    const idNum = parseInt(idVal, 10);
    if (idNum < 5000) {
        showOfflineStatus(t.errOfflineIdTooLow, 'new');
        return;
    }

    const user = offlineDb.find(u => u.id === idVal);
    if (user) {
        document.getElementById('offlineNameInput').value = user.name;
        showOfflineStatus(t.statusFound + user.name, 'found');
    } else {
        showOfflineStatus(t.statusNew, 'new');
    }
};

window.handleOfflineNameInput = () => {
    const t = i18n[currentLang];
    const nameVal = document.getElementById('offlineNameInput').value.trim();
    
    if (!nameVal) {
        document.getElementById('offlineIdInput').value = '';
        document.getElementById('offlineStatusMsg').style.display = 'none';
        return;
    }

    const user = offlineDb.find(u => u.name === nameVal);
    if (user) {
        document.getElementById('offlineIdInput').value = user.id;
        showOfflineStatus(t.statusFound + user.id, 'found');
    } else {
        if (document.getElementById('offlineIdInput').value === '') {
            const newId = generateNewOfflineId();
            showOfflineStatus(t.statusOfflineNewId + newId, 'new');
            document.getElementById('offlineIdInput').value = newId; 
        }
    }
};

// Google Maps 地點搜尋功能
window.openGoogleMaps = () => {
    const locationInput = document.getElementById('offlineLocation');
    const currentValue = locationInput.value.trim();
    
    // 構建 Google Maps 搜尋 URL
    let mapsUrl;
    if (currentValue) {
        // 如果已有地點名稱，直接搜尋該地點
        mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentValue)}`;
    } else {
        // 如果沒有輸入，打開 Google Maps 首頁讓用戶搜尋
        mapsUrl = `https://www.google.com/maps`;
    }
    
    // 在新視窗打開 Google Maps
    window.open(mapsUrl, '_blank');
};

window.submitOfflineData = async () => {
    if (!cloudEnabled) { alert(i18n[currentLang].msgCloudError); return; }

    const t = i18n[currentLang];
    const id = document.getElementById('offlineIdInput').value.trim();
    const name = document.getElementById('offlineNameInput').value.trim();
    const date = document.getElementById('offlineRecordDate').value;
    const location = document.getElementById('offlineLocation').value.trim();
    const activity = document.getElementById('offlineActivity').value.trim();
    const content = document.getElementById('offlineContent').value.trim();

    if (!id || !name || !date) { alert(t.alertIncomplete); return; }

    const idNum = parseInt(id, 10);
    if (idNum < 5000) {
        alert(t.errOfflineIdTooLow);
        return;
    }

    const existingUserById = offlineDb.find(u => u.id === id);
    if (existingUserById && existingUserById.name !== name) {
        alert(t.errIdConflict + `\n(ID: ${id} -> ${existingUserById.name})`);
        return;
    }

    const existingUserByName = offlineDb.find(u => u.name === name);
    if (existingUserByName && existingUserByName.id !== id) {
        alert(t.errNameConflict + `\n(${name} -> ID: ${existingUserByName.id})`);
        return;
    }

    try {
        const userRef = doc(dbInstance, "offline_missionary_data", id);
        const timestamp = new Date().getTime();
        const newLogEntry = { date, location, activity, content, createdAt: timestamp };

        let updatedLogs = [];
        
        if (existingUserById) {
            updatedLogs = [...existingUserById.logs, newLogEntry];
            await setDoc(userRef, { id, name, logs: updatedLogs }, { merge: true });
            alert(t.alertUpdate + name);
        } else {
            updatedLogs = [newLogEntry];
            await setDoc(userRef, { id, name, logs: updatedLogs });
            alert(t.alertCreate + name);
        }

        // 清空表單
        document.getElementById('offlineLocation').value = '';
        document.getElementById('offlineActivity').value = '';
        document.getElementById('offlineContent').value = '';
    } catch (error) {
        console.error('線下資料上傳錯誤:', error);
        alert('上傳失敗: ' + error.message);
    }
};

// --- 線下後台功能 ---
function renderOfflineBackend() {
    if (!cloudEnabled) return;
    const t = i18n[currentLang];
    const listContainer = document.getElementById('offlineDataList');
    if (!listContainer) return;
    
    if (!window.offlineFirebaseLoaded) {
        listContainer.innerHTML = '<div class="loading-dots-wrapper"><div class="loading-dots"><span></span><span></span><span></span></div></div>';
        return;
    }
    
    listContainer.innerHTML = '';

    // 排序輔助函數：主要以選擇的日期排序，同一天則以 createdAt (秒級) 排序
    const sortByDateThenTime = (a, b) => {
        const dateA = a.date || '0000-00-00';
        const dateB = b.date || '0000-00-00';
        if (dateA !== dateB) {
            return dateB.localeCompare(dateA);
        }
        const timeA = a.createdAt || 0;
        const timeB = b.createdAt || 0;
        return timeB - timeA;
    };

    const processedUsers = offlineDb.map(user => {
        const sortedLogs = [...user.logs].sort(sortByDateThenTime);
        const lastLog = sortedLogs[0] || { date: '0000-00-00', content: t.msgEmpty, createdAt: 0 };
        return { ...user, logs: sortedLogs, lastLog };
    });

    processedUsers.sort((a, b) => {
        const dateA = a.lastLog.date || '0000-00-00';
        const dateB = b.lastLog.date || '0000-00-00';
        const timeA = a.lastLog.createdAt || 0;
        const timeB = b.lastLog.createdAt || 0;
        
        if (offlineSortDesc) {
            if (dateA !== dateB) return dateB.localeCompare(dateA);
            return timeB - timeA;
        } else {
            if (dateA !== dateB) return dateA.localeCompare(dateB);
            return timeA - timeB;
        }
    });

    processedUsers.forEach(user => {
        const card = document.createElement('div');
        card.className = 'user-card';
        const displayDate = user.lastLog.date === '0000-00-00' ? '-' : user.lastLog.date;

        // 計算活躍度
        const now = new Date();
        const lastLogDate = user.lastLog.date !== '0000-00-00' ? new Date(user.lastLog.date) : null;
        let activityText = t.activityLow;
        let activityClass = 'activity-low';
        
        if (lastLogDate) {
            const daysDiff = Math.floor((now - lastLogDate) / (1000 * 60 * 60 * 24));
            if (daysDiff <= 3) {
                activityText = t.activityHigh;
                activityClass = 'activity-high';
            } else if (daysDiff <= 7) {
                activityText = t.activityNormal;
                activityClass = 'activity-normal';
            }
        }

        const avatarLetter = user.name ? user.name.charAt(0).toUpperCase() : '?';
        const locationText = user.lastLog.location || '-';

        const summaryHtml = `
            <div class="user-summary offline-grid-row" onclick="window.toggleOfflineDetails('${user.id}')">
                <div class="check-cell" onclick="event.stopPropagation()">
                    <input type="checkbox" name="selectOfflineUser" value="${user.id}">
                </div>
                <div class="avatar-cell" style="position:relative;">
                    <div class="user-avatar">${avatarLetter}</div>
                </div>
                <div style="font-weight:bold; color:#666;">${user.id}</div>
                <div><span class="activity-badge ${activityClass}">${activityText}</span></div>
                <div style="font-weight:bold; font-size:1.05rem;">${user.name}</div>
                <div style="color:#2e7d32;">${displayDate}</div>
                <div style="color:#555;">${locationText}</div>
                <div class="action-cell"></div>
            </div>`;

        let logsHtml = '';
        user.logs.forEach((log, idx) => {
            logsHtml += `
                <div class="detail-row offline-grid-row">
                    <div class="check-cell"></div>
                    <div></div>
                    <div></div>
                    <div style="font-size:0.85rem; color:#888;">${log.contactMethod || '-'}</div>
                    <div style="font-size:0.85rem; color:#888;">${log.activity || '-'}</div>
                    <div style="color:#1565c0;">${log.date}</div>
                    <div style="white-space:pre-wrap; word-break:break-word;">${log.content || '-'}</div>
                    <div class="action-cell">
                        <button class="btn-remove-log" onclick="window.deleteOfflineSingleLog(event, '${user.id}', ${idx})">✕</button>
                    </div>
                </div>`;
        });

        card.innerHTML = summaryHtml + `<div class="user-details" id="offline-details-${user.id}">${logsHtml}</div>`;
        listContainer.appendChild(card);
    });

    if (isOfflineEditMode) {
        document.getElementById('offlineDataListContainer').classList.add('edit-mode');
    }
    updateOfflineCounter();
}

window.toggleOfflineEditMode = () => {
    isOfflineEditMode = !isOfflineEditMode;
    const container = document.getElementById('offlineDataListContainer');
    const controls = document.getElementById('offlineEditControls');
    const btn = document.getElementById('btn-offline-toggle-edit');
    const t = i18n[currentLang];

    if (isOfflineEditMode) {
        container.classList.add('edit-mode');
        controls.style.display = 'flex';
        btn.textContent = t.btnDone;
        btn.classList.add('editing');
    } else {
        container.classList.remove('edit-mode');
        controls.style.display = 'none';
        btn.textContent = t.btnEdit;
        btn.classList.remove('editing');
        const checks = document.getElementsByName('selectOfflineUser');
        checks.forEach(c => c.checked = false);
        document.getElementById('offlineSelectAll').checked = false;
    }
};

window.toggleOfflineDetails = (uid) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    const details = document.getElementById(`offline-details-${uid}`);
    const summary = details.previousElementSibling;
    if (details.style.display === 'block') {
        details.style.display = 'none';
        summary.classList.remove('expanded');
    } else {
        details.style.display = 'block';
        summary.classList.add('expanded');
    }
};

window.deleteOfflineSelected = async () => {
    if (!cloudEnabled) return;
    const t = i18n[currentLang];
    const checked = [...document.getElementsByName('selectOfflineUser')].filter(c => c.checked).map(c => c.value);
    if (checked.length === 0) return;
    if (confirm(t.alertConfirmDelete)) {
        for (const uid of checked) {
            await deleteDoc(doc(dbInstance, "offline_missionary_data", uid));
        }
        alert(t.alertDeleted);
    }
};

window.deleteOfflineSingleLog = async (event, uid, logIndex) => {
    if (!cloudEnabled) return;
    event.stopPropagation();
    const t = i18n[currentLang];
    if(confirm(t.alertDeleteLog)) {
        const user = offlineDb.find(u => u.id === uid);
        if(user) {
            const sortedLogs = [...user.logs].sort((a, b) => {
                const dateA = a.date || '0000-00-00';
                const dateB = b.date || '0000-00-00';
                if (dateA !== dateB) return dateB.localeCompare(dateA);
                const timeA = a.createdAt || 0;
                const timeB = b.createdAt || 0;
                return timeB - timeA;
            });
            sortedLogs.splice(logIndex, 1);
            
            await updateDoc(doc(dbInstance, "offline_missionary_data", uid), {
                logs: sortedLogs
            });
        }
    }
};

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

async function fetchBibleChapter(bookId, chapter) {
    const key = `${bookId}_${chapter}`;
    if (bibleCache[key]) return bibleCache[key];
    try {
        const res = await fetch(`/bible/${bookId}/${chapter}.json`);
        if (!res.ok) { bibleCache[key] = null; return null; }
        const data = await res.json();
        bibleCache[key] = data;
        return data;
    } catch(e) {
        bibleCache[key] = null;
        return null;
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
    '1jn': { ko: '요일', zh: '約壹' },
    '2jn': { ko: '요이', zh: '約貳' },
    '3jn': { ko: '요삼', zh: '約參' },
    'jud': { ko: '유', zh: '猶' },
    'rev': { ko: '계', zh: '啟' }
};

let currentBibleBook = null;
let currentBibleChapter = null;
let selectedVerseData = null;
let activeBibleBookButton = null;

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
        btn.innerHTML = `<span class="ko">${book.ko}</span><span class="zh">${book.zh}</span>`;
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
    
    currentBibleBook = book;
    
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

window.addEventListener('resize', () => positionBibleChaptersPopover());
window.addEventListener('scroll', () => positionBibleChaptersPopover(), { passive: true });

// 開啟聖經章節
async function openBibleChapter(book, chapter) {
    const booksList = document.getElementById('bibleBooksList');
    const contentView = document.getElementById('bibleContentView');
    const contentTitle = document.getElementById('bibleContentTitle');
    const versesContainer = document.getElementById('bibleVerses');
    
    // 記錄當前章節
    currentBibleChapter = chapter;
    
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
}

// 關閉聖經內容，返回書卷列表
window.closeBibleContent = () => {
    const booksList = document.getElementById('bibleBooksList');
    const contentView = document.getElementById('bibleContentView');
    
    contentView.classList.remove('show');
    booksList.style.display = 'block';
    
    // 回到剛才選擇的書卷附近
    if (activeBibleBookButton) {
        setTimeout(() => {
            activeBibleBookButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
};

// 返回頂部
window.scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

function updateScrollTopButton() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (!scrollTopBtn) return;

    const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const pageCanScroll = document.documentElement.scrollHeight > window.innerHeight + 80;
    const isHome = document.body.classList.contains('home-active');
    const isBible = document.getElementById('bibleSection')?.classList.contains('active-section');

    if ((isHome || isBible || pageCanScroll) && scrollY > 180) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
}

// 監聽滾動事件，顯示/隱藏返回頂部按鈕
window.addEventListener('scroll', updateScrollTopButton, { passive: true });
window.addEventListener('resize', updateScrollTopButton);
document.addEventListener('DOMContentLoaded', updateScrollTopButton);

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

window.toggleAiPanel = () => {
    const panel = document.getElementById('aiPanel');
    const overlay = document.getElementById('aiPanelOverlay');
    const isOpen = panel.classList.contains('show');
    
    if (isOpen) {
        panel.classList.remove('show');
        overlay.classList.remove('show');
    } else {
        panel.classList.add('show');
        overlay.classList.add('show');
        document.getElementById('aiPanelInput').focus();
        // 載入快取結果
        loadAiPanelCache();
    }
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
    const editSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" style="vertical-align:middle;margin-right:4px"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>';
    container.innerHTML = results.map(r => {
        const composeLink = r.composeUserId 
            ? `<button class="ai-panel-compose-link" onclick="window.openFullCompose('${r.composeUserId}')">${editSvg}${currentLang === 'ko' ? 'AI 통합 작문 열기' : '開啟 AI 整合作文'}</button>` 
            : '';
        const copiedLabel = r.success && !r.isPreview ? `<div class="result-copied">${checkSvg} ${currentLang === 'ko' ? '복사됨' : '已複製'}</div>` : '';
        return `
        <div class="ai-panel-result-item ${r.success ? 'success' : 'error'}">
            <div class="result-query">${searchSvg}${r.query}</div>
            <div class="result-text">${r.text}</div>
            ${copiedLabel}
            ${composeLink}
            <div class="result-time">${new Date(r.timestamp).toLocaleTimeString()}</div>
        </div>`;
    }).join('');
}

window.openFullCompose = (userId) => {
    // 關閉 AI 面板，跳到 AI 整合作文頁面，帶入 ID
    window.toggleAiPanel();
    window.switchPage('ai-compose');
    setTimeout(() => {
        const idInput = document.getElementById('aiComposeIdInput');
        if (idInput) {
            idInput.value = userId;
            window.loadComposeTarget(userId);
        }
    }, 300);
};

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

function parseBibleQuery(input) {
    const bookLookup = buildBookLookup();
    
    // 判斷語言
    let language = 'both';
    const langPatterns = [
        { regex: /(?:중국어|중|中文|中)\s*$/i, lang: 'zh' },
        { regex: /(?:한국어|한|韓文|韓)\s*$/i, lang: 'ko' },
        { regex: /(?:전부|전체|全部|全|都|다|all|양쪽|兩個)\s*$/i, lang: 'both' },
    ];
    let cleanInput = input.trim();
    for (const p of langPatterns) {
        if (p.regex.test(cleanInput)) {
            language = p.lang;
            cleanInput = cleanInput.replace(p.regex, '').trim();
            break;
        }
    }
    if (language === 'both') {
        const hasKorean = /[\uAC00-\uD7AF]/.test(cleanInput);
        const hasChinese = /[\u4E00-\u9FFF]/.test(cleanInput);
        if (hasKorean && !hasChinese) language = 'ko';
        else if (hasChinese && !hasKorean) language = 'zh';
    }
    
    // 拆分多段引用：分號、；、以及空格+書名開頭
    // 例：啟1:1-2 創1:2-7、9 → ['啟1:1-2', '創1:2-7、9']
    // 例：啟1:1;創1:2 → ['啟1:1', '創1:2']
    const rawSegments = cleanInput.split(/[;；]/);
    const segments = [];
    for (const raw of rawSegments) {
        const trimmed = raw.trim();
        if (!trimmed) continue;
        // 進一步用空格拆分，但只在空格後跟書名（非數字開頭）時才拆
        const spaceSegs = trimmed.split(/\s+/);
        let current = spaceSegs[0];
        for (let i = 1; i < spaceSegs.length; i++) {
            const s = spaceSegs[i];
            // 如果這個片段以非數字開頭（新書名），就是新的引用
            if (/^[^\d]/.test(s)) {
                segments.push(current);
                current = s;
            } else {
                // 否則合併（可能是 "1:2-7" 這種）
                current += ' ' + s;
            }
        }
        segments.push(current);
    }
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
            let bookId = bookName ? (bookLookup[bookName] || bookLookup[bookName.toLowerCase()]) : lastBookId;
            if (!bookId && bookName) {
                const sortedKeys = Object.keys(bookLookup).sort((a, b) => b.length - a.length);
                for (const key of sortedKeys) {
                    if (bookName.endsWith(key) || bookName.startsWith(key)) {
                        bookId = bookLookup[key];
                        break;
                    }
                }
            }
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
            let bookId = bookName ? (bookLookup[bookName] || bookLookup[bookName.toLowerCase()]) : lastBookId;
            if (!bookId && bookName) {
                const sortedKeys = Object.keys(bookLookup).sort((a, b) => b.length - a.length);
                for (const key of sortedKeys) {
                    if (bookName.endsWith(key) || bookName.startsWith(key)) {
                        bookId = bookLookup[key];
                        break;
                    }
                }
            }
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
            bookId = bookLookup[bookName] || bookLookup[bookName.toLowerCase()];
            if (!bookId) {
                const sortedKeys = Object.keys(bookLookup).sort((a, b) => b.length - a.length);
                for (const key of sortedKeys) {
                    if (bookName.endsWith(key) || bookName.startsWith(key)) {
                        bookId = bookLookup[key];
                        break;
                    }
                }
            }
        }
        if (!bookId) bookId = lastBookId;
        if (!bookId) continue;
        lastBookId = bookId;
        
        const verses = [];
        if (/^(all|전부|전체|全部|全)$/i.test(verseStr)) {
            queries.push({ bookId, chapter, verses: 'all' });
            continue;
        }
        const parts = verseStr.split(/[,、，]+/);
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

async function formatBibleResult(parsed) {
    const { queries, language } = parsed;
    let fullText = '';
    let foundCount = 0;
    
    for (const q of queries) {
        const abbr = bookAbbreviations[q.bookId] || { ko: q.bookId, zh: q.bookId };
        // Fetch chapter data (uses cache if already loaded)
        const chapterData = await fetchBibleChapter(q.bookId, q.chapter);
        if (!chapterData) {
            const allBooks = [...bibleBooks.oldTestament, ...bibleBooks.newTestament];
            const bookInfo = allBooks.find(b => b.id === q.bookId);
            const name = bookInfo ? (currentLang === 'ko' ? bookInfo.ko : bookInfo.zh) : q.bookId;
            fullText += `[${name} ${q.chapter}${currentLang === 'ko' ? '장' : '章'} - ${currentLang === 'ko' ? '미수록' : '尚未收錄'}]\n`;
            continue;
        }
        const verses = q.verses === 'all'
            ? chapterData.filter(v => v.verse).map(v => v.verse)
            : q.verses;
        
        for (const vNum of verses) {
            const vd = chapterData.find(v => v.verse === vNum);
            if (!vd) continue;
            foundCount++;
            if (language === 'ko') {
                fullText += `${abbr.ko} ${q.chapter}:${vNum} ${vd.ko || ''}\n`;
            } else if (language === 'zh') {
                fullText += `${abbr.zh} ${q.chapter}:${vNum} ${vd.zh || ''}\n`;
            } else {
                fullText += `${abbr.ko} ${q.chapter}:${vNum} ${vd.ko}\n${abbr.zh} ${q.chapter}:${vNum} ${vd.zh}\n\n`;
            }
        }
    }
    return { text: fullText.trim(), foundCount };
}

window.aiPanelSearch = async () => {
    const input = document.getElementById('aiPanelInput');
    const sendBtn = document.querySelector('.ai-panel-send');
    const resultContainer = document.getElementById('aiPanelResult');
    
    const query = input.value.trim();
    if (!query) return;
    
    // 模式 1：跳轉到聖經章節
    // 「到 啟5章」「去 創1章」「계 1장 가」「계 1장 세요」「계 1장 가지」
    const navMatch = query.match(/^(?:到|去|가|가자|가세요|가요|가지)\s*([^\d]*?)(\d+)\s*(?:章|장)\s*$/);
    const navMatch2 = query.match(/^([^\d]*?)(\d+)\s*(?:章|장)\s*(?:가|가자|가세요|가요|가지|세요|요)\s*$/);
    const nav = navMatch || navMatch2;
    if (nav) {
        const bookLookup = buildBookLookup();
        const bookName = nav[1].trim();
        const chapter = parseInt(nav[2]);
        let bookId = bookLookup[bookName] || bookLookup[bookName.toLowerCase()];
        if (!bookId) {
            const sortedKeys = Object.keys(bookLookup).sort((a, b) => b.length - a.length);
            for (const key of sortedKeys) {
                if (bookName.endsWith(key) || bookName.startsWith(key)) {
                    bookId = bookLookup[key];
                    break;
                }
            }
        }
        if (bookId) {
            const allBooks = [...bibleBooks.oldTestament, ...bibleBooks.newTestament];
            const book = allBooks.find(b => b.id === bookId);
            if (book && chapter >= 1 && chapter <= book.chapters) {
                // 關閉 AI 面板，切到聖經頁面，打開該章節
                window.toggleAiPanel();
                window.switchPage('bible');
                setTimeout(() => {
                    selectBibleBook(book);
                    setTimeout(() => openBibleChapter(book, chapter), 300);
                }, 300);
                input.value = '';
                return;
            }
        }
    }
    
    // 模式 2：@編號 = 回覆生成模式
    const composeMatch = query.match(/^@(\d{1,4})\s*(.*)/);
    if (composeMatch) {
        await aiPanelCompose(composeMatch[1].padStart(4, '0'), composeMatch[2].trim(), input, sendBtn, resultContainer);
        return;
    }
    
    // --- 聖經查詢模式（先本地解析，失敗時用 AI 輔助） ---
    sendBtn.disabled = true;
    let loadingEl = null;
    try {
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
- language: "ko"=韓文,"zh"=中文,"both"=兩者
- 語言觸發詞：中/中文/중/중국어→zh; 韓/韓文/한/한국어→ko; 全/全部/都/다/all→both
- 沒指定語言時，根據輸入語言判斷
- 支援關鍵字：到/去/까지/가/세요/요/가지/~/-（章對章）

範例：
"創1:1-3 中"→{"queries":[{"bookId":"gen","chapter":1,"verses":[1,2,3]}],"language":"zh"}
"啟5章 韓"→{"queries":[{"bookId":"rev","chapter":5,"verses":"all"}],"language":"ko"}
"啟1章到3章 全"→{"queries":[{"bookId":"rev","chapter":1,"verses":"all"},{"bookId":"rev","chapter":2,"verses":"all"},{"bookId":"rev","chapter":3,"verses":"all"}],"language":"both"}
"창1:1;계3:5 다"→{"queries":[{"bookId":"gen","chapter":1,"verses":[1]},{"bookId":"rev","chapter":3,"verses":[5]}],"language":"both"}

無法解析→{"queries":[]}

輸入：${query}`;

    const response = await fetch(AI_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    });
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    const aiText = data.text || data.response || data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = aiText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    return JSON.parse(cleaned);
}

// --- AI 面板：回覆生成模式 ---
async function aiPanelCompose(userId, instruction, input, sendBtn, resultContainer) {
    sendBtn.disabled = true;
    
    const user = localDb.find(u => u.id === userId);
    if (!user) {
        const errItem = { 
            query: `@${userId}`, 
            text: currentLang === 'ko' ? `ID ${userId}를 찾을 수 없습니다` : `找不到 ID ${userId}`, 
            success: false, timestamp: Date.now() 
        };
        saveAiPanelResult(errItem);
        sendBtn.disabled = false;
        return;
    }
    
    // 如果沒有指示，先顯示對話預覽讓使用者知道下一步
    if (!instruction) {
        const sortedLogs = [...user.logs].sort((a, b) => {
            const dA = a.date || '0000-00-00', dB = b.date || '0000-00-00';
            if (dA !== dB) return dB.localeCompare(dA);
            return (b.createdAt || 0) - (a.createdAt || 0);
        });
        const lastLog = sortedLogs[0];
        if (!lastLog) {
            const errItem = { query: `@${userId}`, text: currentLang === 'ko' ? '대화 기록이 없습니다' : '無對話紀錄', success: false, timestamp: Date.now() };
            saveAiPanelResult(errItem);
            sendBtn.disabled = false;
            return;
        }
        const typeLabel = lastLog.type === 'me' ? (currentLang === 'ko' ? '본인' : '我') : (currentLang === 'ko' ? '상대방' : '對方');
        const preview = `👤 ${user.name} (${userId})\n📅 ${lastLog.date} [${typeLabel}]\n\n${lastLog.content.substring(0, 150)}${lastLog.content.length > 150 ? '...' : ''}`;
        const hint = currentLang === 'ko' 
            ? `\n\n💡 빠른 생성: @${userId} [지시]\n예: @${userId} 관심사 물어보기\n\n📝 상세 작문 → AI 통합 작문 페이지`
            : `\n\n💡 快速生成：@${userId} [指示]\n例：@${userId} 詢問興趣\n\n📝 詳細作文 → AI 整合作文頁面`;
        
        const previewItem = { query: `@${userId}`, text: preview + hint, success: true, timestamp: Date.now(), isPreview: true, composeUserId: userId };
        saveAiPanelResult(previewItem);
        input.value = `@${userId} `;
        input.focus();
        sendBtn.disabled = false;
        return;
    }
    
    // 有指示 → 開始生成
    const loadingEl = document.createElement('div');
    loadingEl.className = 'ai-panel-loading';
    loadingEl.textContent = currentLang === 'ko' ? '메시지 생성 중...' : '訊息生成中...';
    resultContainer.prepend(loadingEl);
    
    const sortedLogs = [...user.logs].sort((a, b) => {
        const dA = a.date || '0000-00-00', dB = b.date || '0000-00-00';
        if (dA !== dB) return dB.localeCompare(dA);
        return (b.createdAt || 0) - (a.createdAt || 0);
    });
    const lastLog = sortedLogs[0];
    if (!lastLog) { loadingEl.remove(); sendBtn.disabled = false; return; }
    
    const koreanChars = (lastLog.content.match(/[\uAC00-\uD7AF]/g) || []).length;
    const chineseChars = (lastLog.content.match(/[\u4E00-\u9FFF]/g) || []).length;
    const isKoreanContent = koreanChars > chineseChars;
    
    // 收集使用者過去的回覆來分析寫作風格
    const myReplies = sortedLogs
        .filter(log => log.type === 'me' && log.content && log.content.length > 10)
        .slice(0, 3).map(log => log.content.substring(0, 150));
    const hasStyleRef = myReplies.length > 0;
    const styleSection = hasStyleRef 
        ? `\n\n【寫作風格參考】\n${myReplies.map((r, i) => `範例${i+1}: ${r}`).join('\n')}`
        : '';
    const styleRule = hasStyleRef ? '\n6. 分析使用者過去的回覆風格，生成的訊息要貼近使用者的寫作習慣' : '';
    
    const prompt = `你是一個傳道訊息寫作助手。請根據以下資訊，幫我寫一段要發給對方的訊息。

嚴格規則：
1. 只能根據「對方最後一篇對話內容」和「使用者的指示」來寫，絕對不可以捏造對方沒提到的事情
2. 不可以畫蛇添足，不要加入任何未被提及的話題或資訊
3. 語氣要自然親切，像朋友之間的對話
4. 回覆語言必須是${isKoreanContent ? '韓文' : '中文'}（與對方對話語言一致）
5. 只回覆訊息內容本身，不要加任何解釋或前言${styleRule}

對方名稱：${user.name}
對方最後一篇對話（${lastLog.date}，${lastLog.type === 'me' ? '我方回覆' : '對方回覆'}）：
${lastLog.content}
${lastLog.messagePoints ? '\n訊息重點：' + lastLog.messagePoints.map(p => `[${p.tag}] ${p.content}`).join('、') : ''}
${lastLog.confirmPoints ? '\n需確認事項：' + lastLog.confirmPoints.map(p => `[${p.tag}] ${p.content}`).join('、') : ''}
${styleSection}

使用者的指示：${instruction}`;
    
    try {
        const response = await fetch(AI_WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        const result = data.text || data.response || data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (!result) throw new Error(currentLang === 'ko' ? '응답이 비어 있습니다' : '回應為空');
        
        await navigator.clipboard.writeText(result);
        const label = currentLang === 'ko' ? ' (복사됨!)' : ' (已複製！)';
        const cacheItem = { query: `@${userId} ${instruction}`, text: `→ ${user.name}\n\n${result}\n\n${label}`, success: true, timestamp: Date.now() };
        saveAiPanelResult(cacheItem);
        input.value = '';
    } catch (err) {
        const cacheItem = { query: `@${userId} ${instruction}`, text: '❌ ' + err.message, success: false, timestamp: Date.now() };
        saveAiPanelResult(cacheItem);
    } finally {
        loadingEl.remove();
        sendBtn.disabled = false;
    }
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

語言判斷規則（language 欄位）：
- "zh" = 只要中文。觸發詞：中文、中、중국어、중
- "ko" = 只要韓文。觸發詞：韓文、韓、한국어、한
- "both" = 兩種都要。觸發詞：全部、全、都、다、all、兩個、양쪽
- 如果沒有任何語言關鍵字，根據用戶主要輸入語言推斷：中文書名輸入→"zh"，韓文書名輸入→"ko"
- 語言關鍵字可能出現在經文引用的前面或後面，甚至用空格或不用空格分隔

輸入格式範例（都要能正確解析）：
- "創1:1-4 中" → gen 1章 1-4節 language=zh
- "창1:1-4 한국어" → gen 1章 1-4節 language=ko
- "創1:1-4 全部" → gen 1章 1-4節 language=both
- "창1:1-4 중" → gen 1章 1-4節 language=zh
- "창1:1-4 다" → gen 1章 1-4節 language=both
- "Gen 1:1-4 all" → gen 1章 1-4節 language=both
- "賽2:4 韓" → isa 2章 4節 language=ko
- "사2:4 중국어" → isa 2章 4節 language=zh

- 如果無法解析，返回 { "error": "無法識別的經文格式" }

用戶輸入：${query}`;
    
    // UI 狀態
    btn.classList.add('loading');
    btn.disabled = true;
    resultDiv.classList.remove('show');
    
    try {
        const response = await fetch(AI_WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        
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

// 手機觸控開始
window.handleVerseTouchStart = (event, element) => {
    // 如果已在複製模式，記錄觸控起始位置
    if (isCopyModeActive) {
        copyModeTouchStartX = event.touches[0].clientX;
        copyModeTouchStartY = event.touches[0].clientY;
        copyModeTouchMoved = false;
        return;
    }
    
    clearLongPressState();
};

// 手機觸控結束
window.handleVerseTouchEnd = (event, element) => {
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
    // 如果在複製模式，檢測是否滑動
    if (isCopyModeActive) {
        const touch = event.touches[0];
        const moveX = Math.abs(touch.clientX - copyModeTouchStartX);
        const moveY = Math.abs(touch.clientY - copyModeTouchStartY);
        
        // 移動超過10px視為滑動
        if (moveX > 10 || moveY > 10) {
            copyModeTouchMoved = true;
        }
        return;
    }
    
    if (longPressTimer) {
        const touch = event.touches[0];
        const moveX = Math.abs(touch.clientX - touchStartX);
        const moveY = Math.abs(touch.clientY - touchStartY);
        
        // 移動超過10px則取消長按
        if (moveX > 10 || moveY > 10) {
            clearLongPressState();
        }
    }
};

// 電腦滑鼠按下（左鍵長按）
window.handleVerseMouseDown = (event, element) => {
    // 只處理左鍵
    if (event.button !== 0) return;
    
    // 如果已在複製模式，不需要長按計時
    if (isCopyModeActive) {
        return;
    }
    
    clearLongPressState();
};

// 電腦滑鼠放開
window.handleVerseMouseUp = (event, element) => {
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
    if (!longPressTriggered && !isCopyModeActive) {
        clearLongPressState();
    }
};

// 電腦右鍵選單 - 也進入複製模式
window.handleVerseContextMenu = (event, element) => {
    clearLongPressState();
    return true;
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
        clearLongPressState();
    }
}, { passive: true });

// ===== 聖經搜尋功能 =====
const SEARCH_HISTORY_KEY = 'bible_search_history';
const MAX_HISTORY_ITEMS = 5;
let searchHistory = [];

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

// 從歷史搜尋
window.searchFromHistory = (keyword) => {
    document.getElementById('bibleSearchInput').value = keyword;
    handleSearchInput(keyword);
};

// 開啟搜尋面板
window.openBibleSearch = () => {
    document.getElementById('bibleSearchPanel').classList.add('show');
    document.getElementById('bibleSearchOverlay').classList.add('show');
    document.getElementById('bibleSearchInput').focus();
    
    // 更新搜尋提示語言
    updateSearchLanguage();
    loadSearchHistory();
};

// 關閉搜尋面板
window.closeBibleSearch = () => {
    document.getElementById('bibleSearchPanel').classList.remove('show');
    document.getElementById('bibleSearchOverlay').classList.remove('show');
    clearSearchInput();
};

// 更新搜尋面板語言
function updateSearchLanguage() {
    const input = document.getElementById('bibleSearchInput');
    const hint = document.getElementById('txtSearchHint');
    const historyTitle = document.getElementById('txtSearchHistory');
    
    if (currentLang === 'ko') {
        input.placeholder = '성경 검색...';
        hint.innerHTML = '2자 이상 입력하세요';
        historyTitle.textContent = '최근 검색';
    } else {
        input.placeholder = '搜尋經文...';
        hint.innerHTML = '請輸入2個字以上';
        historyTitle.textContent = '近期搜尋';
    }
}

// 清除搜尋輸入
window.clearSearchInput = () => {
    document.getElementById('bibleSearchInput').value = '';
    document.getElementById('bibleSearchClear').classList.remove('show');
    document.getElementById('bibleSearchResults').style.display = 'none';
    document.getElementById('bibleSearchHint').style.display = 'block';
    document.getElementById('bibleSearchHistorySection').style.display = searchHistory.length > 0 ? 'block' : 'none';
};

// 處理搜尋輸入
window.handleSearchInput = (value) => {
    const clearBtn = document.getElementById('bibleSearchClear');
    const results = document.getElementById('bibleSearchResults');
    const hint = document.getElementById('bibleSearchHint');
    const historySection = document.getElementById('bibleSearchHistorySection');
    
    if (value.length > 0) {
        clearBtn.classList.add('show');
    } else {
        clearBtn.classList.remove('show');
    }
    
    if (value.length >= 2) {
        // 執行搜尋
        const searchResults = searchBible(value);
        renderSearchResults(searchResults, value);
        results.style.display = 'block';
        hint.style.display = 'none';
        historySection.style.display = 'none';
        
        // 加入搜尋歷史
        addSearchHistory(value);
    } else {
        results.style.display = 'none';
        hint.style.display = 'block';
        historySection.style.display = searchHistory.length > 0 ? 'block' : 'none';
    }
};

// 搜尋聖經
function searchBible(keyword) {
    const results = [];
    const lowerKeyword = keyword.toLowerCase();
    
    // 搜尋已快取的章節（只搜尋已載入的）
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
            if (zhText.includes(keyword) || koText.includes(keyword)) {
                results.push({
                    bookId, bookKo: book.ko, bookZh: book.zh,
                    chapter: parseInt(chapterStr),
                    verse: verse.verse, ko: koText, zh: zhText
                });
            }
        }
    }
    
    return results;
}

// 渲染搜尋結果
function renderSearchResults(results, keyword) {
    const container = document.getElementById('bibleSearchResults');
    
    if (results.length === 0) {
        container.innerHTML = `
            <div class="bible-search-no-result">
                ${currentLang === 'ko' ? '검색 결과가 없습니다' : '找不到相關結果'}
            </div>
        `;
        return;
    }
    
    // 安全處理關鍵字中的特殊字符
    const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const safeKeyword = escapeRegExp(keyword);
    
    container.innerHTML = results.slice(0, 50).map((r, index) => {
        const abbr = bookAbbreviations[r.bookId];
        const refKo = `${abbr.ko} ${r.chapter}:${r.verse}`;
        const refZh = `${abbr.zh} ${r.chapter}:${r.verse}`;
        
        // 高亮關鍵字
        const highlightedZh = r.zh.replace(new RegExp(safeKeyword, 'g'), `<mark>${keyword}</mark>`);
        const highlightedKo = r.ko.replace(new RegExp(safeKeyword, 'g'), `<mark>${keyword}</mark>`);
        
        return `
            <div class="bible-search-result-item" onclick="window.openSearchPreview(${index})">
                <div class="bible-search-result-ref">${refKo} / ${refZh}</div>
                <div class="bible-search-result-text" style="color: #666; font-size: 0.9rem; margin-bottom: 5px;">${highlightedKo}</div>
                <div class="bible-search-result-text">${highlightedZh}</div>
            </div>
        `;
    }).join('');
    
    // 儲存結果供預覽使用
    window.currentSearchResults = results;
}

// 開啟搜尋結果預覽
window.openSearchPreview = (index) => {
    const result = window.currentSearchResults[index];
    if (!result) return;
    
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
            <div class="verse-text-ko" style="color: #555; font-size: 1.15rem; margin-bottom: 10px; line-height: 1.8; font-family: 'Noto Serif KR', 'Noto Serif TC', serif;">
                ${result.ko}
            </div>
            <div class="verse-text-zh" style="font-size: 1.2rem; line-height: 1.9; font-family: 'Noto Serif TC', 'Noto Serif KR', serif;">
                ${result.zh}
            </div>
        </div>
    `;
    
    preview.classList.add('show');
};

// 關閉搜尋預覽
window.closeSearchPreview = () => {
    document.getElementById('bibleSearchPreview').classList.remove('show');
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


// ===== AI 整合作文功能 =====
function applyComposeLanguage() {
    const t = i18n[currentLang];
    const instructionInput = document.getElementById('aiComposeInstruction');
    if (instructionInput) instructionInput.placeholder = t.aiComposePlaceholder;
    // 更新提示標籤
    const hints = document.querySelectorAll('#aiComposeHints .hint-tag');
    const hintTexts = [t.aiComposeHint1, t.aiComposeHint2, t.aiComposeHint3, t.aiComposeHint4];
    hints.forEach((hint, i) => { if (hintTexts[i]) hint.textContent = hintTexts[i]; });
}

window.loadComposeTarget = (idVal) => {
    const nameEl = document.getElementById('aiComposeTargetName');
    const previewStep = document.getElementById('aiComposePreviewStep');
    const instructionStep = document.getElementById('aiComposeInstructionStep');
    const resultStep = document.getElementById('aiComposeResultStep');
    const previewBox = document.getElementById('aiComposePreview');
    
    // 隱藏後續步驟
    previewStep.style.display = 'none';
    instructionStep.style.display = 'none';
    resultStep.style.display = 'none';
    nameEl.textContent = '';
    
    if (!idVal || idVal.length < 4) return;
    
    const user = localDb.find(u => u.id === idVal);
    if (!user) {
        nameEl.textContent = currentLang === 'ko' ? '(찾을 수 없음)' : '（找不到）';
        nameEl.style.color = '#e53935';
        return;
    }
    
    nameEl.textContent = user.name;
    nameEl.style.color = '';
    
    // 找最新一筆對話（按日期+時間排序）
    const sortedLogs = [...user.logs].sort((a, b) => {
        const dA = a.date || '0000-00-00', dB = b.date || '0000-00-00';
        if (dA !== dB) return dB.localeCompare(dA);
        return (b.createdAt || 0) - (a.createdAt || 0);
    });
    
    const lastLog = sortedLogs[0];
    if (!lastLog) {
        previewBox.textContent = currentLang === 'ko' ? '(대화 기록 없음)' : '（無對話紀錄）';
        previewStep.style.display = 'block';
        return;
    }
    
    const typeLabel = lastLog.type === 'me' 
        ? (currentLang === 'ko' ? '[본인 회신]' : '[我回覆]')
        : (currentLang === 'ko' ? '[상대방 회신]' : '[對方回覆]');
    
    let previewText = `${lastLog.date} ${typeLabel}\n${lastLog.content}`;
    
    // 加上訊息重點
    if (lastLog.messagePoints && lastLog.messagePoints.length > 0) {
        previewText += '\n\n📌 ' + (currentLang === 'ko' ? '메시지 포인트:' : '訊息重點:');
        lastLog.messagePoints.forEach(p => { previewText += `\n• [${p.tag}] ${p.content}`; });
    }
    if (lastLog.confirmPoints && lastLog.confirmPoints.length > 0) {
        previewText += '\n\n❓ ' + (currentLang === 'ko' ? '확인 필요:' : '需確認:');
        lastLog.confirmPoints.forEach(p => { previewText += `\n• [${p.tag}] ${p.content}`; });
    }
    
    previewBox.textContent = previewText;
    previewStep.style.display = 'block';
    instructionStep.style.display = 'block';
};

window.appendHint = (el) => {
    const input = document.getElementById('aiComposeInstruction');
    if (input.value) input.value += '、' + el.textContent;
    else input.value = el.textContent;
    input.focus();
};

window.generateCompose = async () => {
    const idVal = document.getElementById('aiComposeIdInput').value.trim();
    const instruction = document.getElementById('aiComposeInstruction').value.trim();
    const resultStep = document.getElementById('aiComposeResultStep');
    const resultBox = document.getElementById('aiComposeResult');
    const generateBtn = document.getElementById('btn-ai-compose-generate');
    
    if (!idVal || !instruction) {
        alert(currentLang === 'ko' ? '번호와 지시 사항을 입력해주세요.' : '請輸入編號和指示內容。');
        return;
    }
    
    const user = localDb.find(u => u.id === idVal);
    if (!user || !user.logs || user.logs.length === 0) return;
    
    const sortedLogs = [...user.logs].sort((a, b) => {
        const dA = a.date || '0000-00-00', dB = b.date || '0000-00-00';
        if (dA !== dB) return dB.localeCompare(dA);
        return (b.createdAt || 0) - (a.createdAt || 0);
    });
    const lastLog = sortedLogs[0];
    
    // 判斷對話語言
    const koreanChars = (lastLog.content.match(/[\uAC00-\uD7AF]/g) || []).length;
    const chineseChars = (lastLog.content.match(/[\u4E00-\u9FFF]/g) || []).length;
    const isKoreanContent = koreanChars > chineseChars;
    
    // 收集使用者過去的回覆（type === 'me'）來分析寫作風格
    const myReplies = sortedLogs
        .filter(log => log.type === 'me' && log.content && log.content.length > 10)
        .slice(0, 5) // 最多取最近5筆
        .map(log => log.content.substring(0, 200)); // 每筆最多200字
    
    const hasStyleRef = myReplies.length > 0;
    
    const styleSection = hasStyleRef 
        ? `\n\n【寫作風格參考】
以下是使用者過去回覆此人的訊息範例，請分析其語氣、用詞習慣和風格，生成的訊息要盡量貼近這個風格：
${myReplies.map((r, i) => `--- 範例 ${i + 1} ---\n${r}`).join('\n')}`
        : '';
    
    const styleRule = hasStyleRef 
        ? '6. 仔細分析使用者過去的回覆風格（語氣、用詞、表達方式），生成的訊息必須貼近使用者的寫作習慣'
        : '';
    
    const prompt = `你是一個傳道訊息寫作助手。請根據以下資訊，幫我寫一段要發給對方的訊息。

嚴格規則：
1. 只能根據「對方最後一篇對話內容」和「使用者的指示」來寫，絕對不可以捏造對方沒提到的事情
2. 不可以畫蛇添足，不要加入任何未被提及的話題或資訊
3. 語氣要自然親切，像朋友之間的對話
4. 回覆語言必須是${isKoreanContent ? '韓文' : '中文'}（與對方對話語言一致）
5. 只回覆訊息內容本身，不要加任何解釋或前言
${styleRule}

對方名稱：${user.name}
對方最後一篇對話（${lastLog.date}，${lastLog.type === 'me' ? '我方回覆' : '對方回覆'}）：
${lastLog.content}
${lastLog.messagePoints ? '\n訊息重點：' + lastLog.messagePoints.map(p => `[${p.tag}] ${p.content}`).join('、') : ''}
${lastLog.confirmPoints ? '\n需確認事項：' + lastLog.confirmPoints.map(p => `[${p.tag}] ${p.content}`).join('、') : ''}
${styleSection}

使用者的指示：${instruction}`;
    
    // UI loading
    generateBtn.disabled = true;
    generateBtn.textContent = currentLang === 'ko' ? '생성 중...' : '生成中...';
    resultStep.style.display = 'block';
    resultBox.textContent = currentLang === 'ko' ? '생성 중...' : '生成中...';
    resultBox.style.opacity = '0.5';
    
    try {
        const response = await fetch(AI_WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        const result = data.text || data.response || data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        if (!result) throw new Error(currentLang === 'ko' ? '응답이 비어 있습니다' : '回應為空');
        
        resultBox.textContent = result;
        resultBox.style.opacity = '1';
    } catch (err) {
        resultBox.textContent = err.message || 'Error';
        resultBox.style.opacity = '1';
    } finally {
        const t = i18n[currentLang];
        generateBtn.disabled = false;
        generateBtn.textContent = t.aiComposeGenerate;
    }
};

window.copyComposeResult = async () => {
    const text = document.getElementById('aiComposeResult').textContent;
    if (!text) return;
    try {
        await navigator.clipboard.writeText(text);
        const btn = document.getElementById('btn-compose-copy');
        const orig = btn.textContent;
        btn.textContent = currentLang === 'ko' ? '✅ 복사됨!' : '✅ 已複製！';
        setTimeout(() => { btn.textContent = orig; }, 1500);
    } catch (e) {}
};
