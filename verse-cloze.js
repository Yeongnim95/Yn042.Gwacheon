const STORAGE_KEY = 'verse_cloze_progress_v1';
const SPLIT_PUNCTUATION = new Set(['，', '；', '。']);
const TRAILING_PUNCTUATION = new Set(['」', '』', '）', '】', '》', '〉', '”', '’']);
const ANSWER_CHARACTER = /[\p{L}\p{N}\p{M}]/u;
const icons = {
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 5.5c2.2-.9 4.6-.6 7.5 1.1v12.2c-2.7-1.6-5.1-2-7.5-1.1z"/><path d="M19.5 5.5c-2.2-.9-4.6-.6-7.5 1.1v12.2c2.7-1.6 5.1-2 7.5-1.1z"/><path d="M12 6.6v12.2"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4 10-10"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5"/><path d="M19 12a7 7 0 1 0-2 5"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    hint: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M8.3 14.7A7 7 0 1 1 15.7 14.7C14.7 15.5 14 16.2 14 18h-4c0-1.8-.7-2.5-1.7-3.3z"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>'
};
const state = {
    root: null,
    books: null,
    fetchChapter: null,
    allBooks: [],
    view: 'books',
    selectedBook: null,
    chapter: null,
    verses: [],
    selectionMode: 'single',
    selectionStart: null,
    selectionEnd: null,
    session: null,
    autoAdvanceTimer: null,
    activeHintInput: null,
    loading: false
};
function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
function isAnswerCharacter(character) {
    return ANSWER_CHARACTER.test(character);
}
function hasAnswerCharacters(value) {
    return Array.from(value).some(isAnswerCharacter);
}
function normalizeAnswerCharacter(character) {
    return character === '裏' ? '裡' : character;
}
function normalizeAnswerText(value) {
    return Array.from(String(value ?? ''), normalizeAnswerCharacter).join('');
}
export function splitVerseSegments(text) {
    const characters = Array.from(String(text ?? ''));
    const segments = [];
    let current = '';
    for (let index = 0; index < characters.length; index += 1) {
        const character = characters[index];
        current += character;
        if (!SPLIT_PUNCTUATION.has(character)) continue;
        while (index + 1 < characters.length && TRAILING_PUNCTUATION.has(characters[index + 1])) {
            current += characters[index + 1];
            index += 1;
        }
        if (hasAnswerCharacters(current)) segments.push(current);
        else if (segments.length) segments[segments.length - 1] += current;
        current = '';
    }
    if (current) {
        if (hasAnswerCharacters(current)) segments.push(current);
        else if (segments.length) segments[segments.length - 1] += current;
    }
    return segments;
}
export function createVerseLevels(text) {
    const segments = splitVerseSegments(text);
    if (!segments.length) return [];
    if (segments.length === 1) {
        return [{ activeSegments: [0], isFinal: true }];
    }
    const levels = segments.map((_, index) => ({ activeSegments: [index], isFinal: false }));
    levels.push({ activeSegments: segments.map((_, index) => index), isFinal: true });
    return levels;
}
export function diffVerseCharacters(actualValue, expectedValue) {
    const actual = Array.from(String(actualValue ?? ''));
    const expected = Array.from(String(expectedValue ?? ''));
    const rows = expected.length + 1;
    const columns = actual.length + 1;
    const table = Array.from({ length: rows }, () => Array(columns).fill(0));
    for (let row = 0; row < rows; row += 1) table[row][0] = row;
    for (let column = 0; column < columns; column += 1) table[0][column] = column;
    for (let row = 1; row < rows; row += 1) {
        for (let column = 1; column < columns; column += 1) {
            const substitutionCost = normalizeAnswerCharacter(expected[row - 1]) === normalizeAnswerCharacter(actual[column - 1]) ? 0 : 1;
            table[row][column] = Math.min(
                table[row - 1][column] + 1,
                table[row][column - 1] + 1,
                table[row - 1][column - 1] + substitutionCost
            );
        }
    }
    const result = [];
    let row = expected.length;
    let column = actual.length;
    while (row > 0 || column > 0) {
        if (
            row > 0 && column > 0 &&
            normalizeAnswerCharacter(expected[row - 1]) === normalizeAnswerCharacter(actual[column - 1]) &&
            table[row][column] === table[row - 1][column - 1]
        ) {
            result.push({ character: actual[column - 1], status: 'correct' });
            row -= 1;
            column -= 1;
        } else if (
            row > 0 && column > 0 &&
            table[row][column] === table[row - 1][column - 1] + 1
        ) {
            result.push({ character: actual[column - 1], status: 'wrong' });
            row -= 1;
            column -= 1;
        } else if (column > 0 && table[row][column] === table[row][column - 1] + 1) {
            result.push({ character: actual[column - 1], status: 'extra' });
            column -= 1;
        } else {
            result.push({ character: '□', status: 'missing' });
            row -= 1;
        }
    }
    return result.reverse();
}
function loadSavedProgress() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        if (!saved || saved.version !== 1) return null;
        if (!state.allBooks.some(book => book.id === saved.bookId)) return null;
        return saved;
    } catch (error) {
        return null;
    }
}
function saveProgress() {
    if (!state.session) return;
    const { book, chapter, selectedVerses, verseIndex, levelIndex } = state.session;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: 1,
        bookId: book.id,
        chapter,
        startVerse: selectedVerses[0].verse,
        endVerse: selectedVerses[selectedVerses.length - 1].verse,
        verseIndex,
        levelIndex,
        savedAt: Date.now()
    }));
}
function clearSavedProgress() {
    localStorage.removeItem(STORAGE_KEY);
}
function formatReference(book, chapter, startVerse, endVerse = startVerse) {
    const range = Number(startVerse) === Number(endVerse) ? startVerse : `${startVerse}-${endVerse}`;
    return `${book.zh} ${chapter}:${range}`;
}
function formatSavedTime(timestamp) {
    try {
        return new Intl.DateTimeFormat('zh-TW', {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(timestamp));
    } catch (error) {
        return '';
    }
}
function setLoading(isLoading) {
    state.loading = isLoading;
    state.root?.classList.toggle('is-loading', isLoading);
    state.root?.setAttribute('aria-busy', String(isLoading));
}
function renderShell(content, options = {}) {
    const { title = '經文填空遊戲', subtitle = '中文經文', backAction = '' } = options;
    state.activeHintInput = null;
    state.root.innerHTML = `
        <div class="verse-cloze-app">
            <header class="verse-cloze-header">
                <div class="verse-cloze-heading">
                    ${backAction ? `<button type="button" class="verse-cloze-icon-button" data-action="${backAction}" aria-label="返回">${icons.arrowLeft}</button>` : `<span class="verse-cloze-heading-icon">${icons.book}</span>`}
                    <div>
                        <h1>${escapeHtml(title)}</h1>
                        <p>${escapeHtml(subtitle)}</p>
                    </div>
                </div>
            </header>
            ${content}
        </div>`;
}
function renderResumeCard(compact = false) {
    const saved = loadSavedProgress();
    const savedBook = saved ? state.allBooks.find(book => book.id === saved.bookId) : null;
    if (!saved || !savedBook) return '';
    return `
        <section class="verse-cloze-resume ${compact ? 'is-compact' : ''}" aria-label="未完成練習">
            <div>
                <span class="verse-cloze-eyebrow">上次練習</span>
                <strong>${escapeHtml(formatReference(savedBook, saved.chapter, saved.startVerse, saved.endVerse))}</strong>
                <small>${escapeHtml(formatSavedTime(saved.savedAt))}</small>
            </div>
            <div class="verse-cloze-resume-actions">
                <button type="button" class="verse-cloze-secondary-button" data-action="restart-saved">${icons.refresh}<span>重新開始</span></button>
                <button type="button" class="verse-cloze-primary-button" data-action="continue-saved">${icons.play}<span>繼續</span></button>
            </div>
        </section>`;
}
function renderBooks() {
    state.view = 'books';
    const renderGroup = (title, books) => `
        <section class="verse-cloze-book-section">
            <h2>${escapeHtml(title)}</h2>
            <div class="verse-cloze-book-grid">
                ${books.map(book => {
                    const longestNameLength = Math.max(Array.from(book.zh || '').length, Array.from(book.ko || '').length);
                    const nameSizeClass = longestNameLength >= 7 ? ' is-very-long-name' : (longestNameLength >= 6 ? ' is-long-name' : '');
                    return `
                    <button type="button" class="verse-cloze-book-button${nameSizeClass}" data-action="select-book" data-book-id="${escapeHtml(book.id)}">
                        <span>${escapeHtml(book.zh)}</span>
                        ${icons.chevronRight}
                    </button>`;
                }).join('')}
            </div>
        </section>`;
    renderShell(`
        <div class="verse-cloze-body">
            ${renderResumeCard()}
            <div class="verse-cloze-step" aria-label="步驟"><b>1</b><span>選擇書卷</span><i></i><b>2</b><span>選擇章節</span><i></i><b>3</b><span>選擇經文</span></div>
            ${renderGroup('舊約聖經', state.books.oldTestament)}
            ${renderGroup('新約聖經', state.books.newTestament)}
        </div>`);
}
function renderChapters() {
    state.view = 'chapters';
    const book = state.selectedBook;
    const chapters = Array.from({ length: book.chapters }, (_, index) => index + 1);
    renderShell(`
        <div class="verse-cloze-body">
            ${renderResumeCard(true)}
            <div class="verse-cloze-step" aria-label="步驟"><b class="done">✓</b><span>${escapeHtml(book.zh)}</span><i></i><b>2</b><span>選擇章節</span><i></i><b>3</b><span>選擇經文</span></div>
            <div class="verse-cloze-chapter-grid">
                ${chapters.map(chapter => `<button type="button" data-action="select-chapter" data-chapter="${chapter}">第 ${chapter} 章</button>`).join('')}
            </div>
        </div>`, {
        title: book.zh,
        subtitle: '選擇章節',
        backAction: 'back-to-books'
    });
}
async function openVerseSelection(chapter) {
    if (state.loading) return;
    setLoading(true);
    try {
        const chapterData = await state.fetchChapter(state.selectedBook.id, chapter);
        const verses = Array.isArray(chapterData)
            ? chapterData.filter(item => item && item.verse != null && String(item.zh || '').trim())
            : [];
        if (!verses.length) throw new Error('No Chinese verses found');
        state.chapter = Number(chapter);
        state.verses = verses;
        state.selectionStart = null;
        state.selectionEnd = null;
        renderVerses();
    } catch (error) {
        renderLoadMessage('這一章暫時無法載入，請稍後再試。', 'back-to-chapters');
    } finally {
        setLoading(false);
    }
}
function renderVerses() {
    state.view = 'verses';
    const saved = loadSavedProgress();
    const savedStartVerse = Number(saved?.startVerse);
    const savedEndVerse = saved?.bookId === state.selectedBook.id &&
        Number(saved.chapter) === state.chapter &&
        Number.isInteger(savedStartVerse) &&
        savedStartVerse <= Number(saved.endVerse) &&
        state.verses.some(verse => Number(verse.verse) === savedStartVerse) &&
        state.verses.some(verse => Number(verse.verse) === Number(saved.endVerse))
        ? Number(saved.endVerse)
        : null;
    const savedVerses = savedEndVerse === null ? [] : state.verses.filter(verse => {
        const number = Number(verse.verse);
        return number >= savedStartVerse && number <= savedEndVerse && createVerseLevels(verse.zh).length;
    });
    const savedIndex = Math.min(Math.max(Math.trunc(Number(saved?.verseIndex) || 0), 0), savedVerses.length - 1);
    const savedCurrentVerse = savedVerses.length ? Number(savedVerses[savedIndex].verse) : null;
    const start = Number(state.selectionStart);
    const end = Number(state.selectionEnd || state.selectionStart);
    const selectedCount = state.selectionStart == null ? 0 : state.verses.filter(verse => {
        const value = Number(verse.verse);
        return value >= Math.min(start, end) && value <= Math.max(start, end);
    }).length;
    const isReady = state.selectionMode === 'single'
        ? state.selectionStart != null
        : state.selectionStart != null && state.selectionEnd != null;
    renderShell(`
        <div class="verse-cloze-body verse-cloze-selection-body">
            ${savedCurrentVerse === null ? renderResumeCard(true) : ''}
            <div class="verse-cloze-step" aria-label="步驟"><b class="done">✓</b><span>${escapeHtml(state.selectedBook.zh)}</span><i></i><b class="done">✓</b><span>第 ${state.chapter} 章</span><i></i><b>3</b><span>選擇經文</span></div>
            <div class="verse-cloze-mode" role="group" aria-label="選取方式">
                <button type="button" data-action="set-mode" data-mode="single" class="${state.selectionMode === 'single' ? 'active' : ''}">單節</button>
                <button type="button" data-action="set-mode" data-mode="range" class="${state.selectionMode === 'range' ? 'active' : ''}">連續範圍</button>
            </div>
            <div class="verse-cloze-selection-help">${state.selectionMode === 'single' ? '選擇一節經文' : '依序選擇開始與結束經節'}</div>
            <div class="verse-cloze-verse-list">
                ${state.verses.map(verse => {
                    const number = Number(verse.verse);
                    const selected = state.selectionStart != null && number >= Math.min(start, end) && number <= Math.max(start, end);
                    const savedRange = savedCurrentVerse !== null && state.selectionStart == null && number >= savedStartVerse && number <= savedEndVerse;
                    const verseButton = `<button type="button" data-action="select-verse" data-verse="${number}" class="verse-cloze-verse-button${selected ? ' selected' : ''}${savedRange ? ' is-saved-range' : ''}">
                        <strong>${escapeHtml(verse.verse)}</strong><span>${escapeHtml(verse.zh)}</span>
                    </button>`;
                    if (number !== savedCurrentVerse) return verseButton;
                    const savedRangeLabel = savedStartVerse === savedEndVerse
                        ? `第 ${savedStartVerse} 節`
                        : `${savedStartVerse}–${savedEndVerse} 節`;
                    return `<div class="verse-cloze-verse-progress">
                        ${verseButton}
                        <div class="verse-cloze-verse-resume" aria-label="上次練習">
                            <span>上次練習 <strong>${escapeHtml(savedRangeLabel)}</strong></span>
                            <button type="button" data-action="continue-saved">${icons.play}<span>繼續</span></button>
                        </div>
                    </div>`;
                }).join('')}
            </div>
            <div class="verse-cloze-selection-bar">
                <span>${selectedCount ? `已選 ${selectedCount} 節` : '尚未選擇經文'}</span>
                <button type="button" class="verse-cloze-primary-button" data-action="start-game" ${isReady ? '' : 'disabled'}>${icons.play}<span>開始練習</span></button>
            </div>
        </div>`, {
        title: `${state.selectedBook.zh} 第 ${state.chapter} 章`,
        subtitle: '選擇單節或連續範圍',
        backAction: 'back-to-chapters'
    });
}
function selectVerse(verseNumber) {
    const number = Number(verseNumber);
    if (state.selectionMode === 'single') {
        state.selectionStart = number;
        state.selectionEnd = number;
    } else if (state.selectionStart == null || state.selectionEnd != null) {
        state.selectionStart = number;
        state.selectionEnd = null;
    } else {
        state.selectionEnd = number;
        if (state.selectionEnd < state.selectionStart) {
            [state.selectionStart, state.selectionEnd] = [state.selectionEnd, state.selectionStart];
        }
    }
    renderVerses();
}
function beginSession(selectedVerses, verseIndex = 0, levelIndex = 0) {
    const preparedVerses = selectedVerses.map(verse => ({
        ...verse,
        text: String(verse.zh || '').trim(),
        segments: splitVerseSegments(verse.zh),
        levels: createVerseLevels(verse.zh)
    })).filter(verse => verse.levels.length);
    if (!preparedVerses.length) return;
    state.session = {
        book: state.selectedBook,
        chapter: state.chapter,
        selectedVerses: preparedVerses,
        verseIndex: Math.min(Math.max(Number(verseIndex) || 0, 0), preparedVerses.length - 1),
        levelIndex: Math.max(Number(levelIndex) || 0, 0),
        completedRounds: 0,
        correct: false
    };
    const currentVerse = state.session.selectedVerses[state.session.verseIndex];
    state.session.levelIndex = Math.min(state.session.levelIndex, currentVerse.levels.length - 1);
    saveProgress();
    renderGame();
}
function startSelectedGame() {
    if (state.selectionStart == null) return;
    const start = Math.min(state.selectionStart, state.selectionEnd ?? state.selectionStart);
    const end = Math.max(state.selectionStart, state.selectionEnd ?? state.selectionStart);
    const selected = state.verses.filter(verse => Number(verse.verse) >= start && Number(verse.verse) <= end);
    beginSession(selected);
}
async function restoreSavedProgress(restart = false) {
    const saved = loadSavedProgress();
    if (!saved || state.loading) return;
    const book = state.allBooks.find(item => item.id === saved.bookId);
    if (!book) return;
    setLoading(true);
    try {
        const chapterData = await state.fetchChapter(book.id, saved.chapter);
        const selected = (chapterData || []).filter(item => item?.verse != null && item.zh && Number(item.verse) >= saved.startVerse && Number(item.verse) <= saved.endVerse);
        if (!selected.length) throw new Error('Saved verses unavailable');
        state.selectedBook = book;
        state.chapter = Number(saved.chapter);
        state.verses = (chapterData || []).filter(item => item?.verse != null && item.zh);
        state.selectionStart = Number(saved.startVerse);
        state.selectionEnd = Number(saved.endVerse);
        beginSession(selected, restart ? 0 : saved.verseIndex, restart ? 0 : saved.levelIndex);
    } catch (error) {
        clearSavedProgress();
        renderLoadMessage('上次的進度已無法讀取，請重新選擇經文。', 'back-to-books');
    } finally {
        setLoading(false);
    }
}
function renderLoadMessage(message, backAction) {
    renderShell(`
        <div class="verse-cloze-message" role="alert">
            <p>${escapeHtml(message)}</p>
            <button type="button" class="verse-cloze-secondary-button" data-action="${backAction}">${icons.arrowLeft}<span>返回</span></button>
        </div>`);
}
function renderActiveSegment(segment, segmentIndex, activeSegments, inputCounter) {
    if (!activeSegments.has(segmentIndex)) return escapeHtml(segment);
    const characters = Array.from(segment);
    let html = '';
    let run = '';
    const flushRun = () => {
        if (!run) return;
        const index = inputCounter.value;
        inputCounter.value += 1;
        const length = Array.from(run).length;
        html += `<span class="verse-cloze-input-group">
            <input type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" data-cloze-input data-input-index="${index}" data-answer="${escapeHtml(run)}" aria-label="填入第 ${index + 1} 個空格" style="--answer-length:${Math.min(Math.max(length, 2), 18)}" maxlength="${Math.max(length + 8, 12)}">
        </span>`;
        run = '';
    };
    characters.forEach(character => {
        if (isAnswerCharacter(character)) run += character;
        else {
            flushRun();
            html += `<span class="verse-cloze-punctuation">${escapeHtml(character)}</span>`;
        }
    });
    flushRun();
    return html;
}
function getRoundCounts() {
    const session = state.session;
    let total = 0;
    let current = 0;
    session.selectedVerses.forEach((verse, verseIndex) => {
        verse.levels.forEach((_, levelIndex) => {
            total += 1;
            if (verseIndex < session.verseIndex || (verseIndex === session.verseIndex && levelIndex <= session.levelIndex)) current += 1;
        });
    });
    return { total, current };
}
function renderGame() {
    clearTimeout(state.autoAdvanceTimer);
    state.view = 'game';
    const session = state.session;
    const verse = session.selectedVerses[session.verseIndex];
    const level = verse.levels[session.levelIndex];
    const activeSegments = new Set(level.activeSegments);
    const inputCounter = { value: 0 };
    const prompt = verse.segments.map((segment, index) => renderActiveSegment(segment, index, activeSegments, inputCounter)).join('');
    const rounds = getRoundCounts();
    const passageRef = formatReference(
        session.book,
        session.chapter,
        session.selectedVerses[0].verse,
        session.selectedVerses[session.selectedVerses.length - 1].verse
    );
    const percent = Math.round(((rounds.current - 1) / rounds.total) * 100);
    renderShell(`
        <div class="verse-cloze-game">
            <div class="verse-cloze-progress-row">
                <span>總進度 ${rounds.current} / ${rounds.total}</span>
                <button type="button" data-action="change-passage">更換經文</button>
            </div>
            <div class="verse-cloze-progress" aria-label="總進度"><span style="width:${percent}%"></span></div>
            <section class="verse-cloze-question">
                <div class="verse-cloze-question-meta">
                    <span>${escapeHtml(`${session.book.zh} ${session.chapter}:${verse.verse}`)}</span>
                    <strong>${level.isFinal ? '完整驗收' : `第 ${session.levelIndex + 1} 關`}</strong>
                </div>
                <div class="verse-cloze-prompt">${prompt}</div>
                <div class="verse-cloze-diff-list" aria-live="polite"></div>
                <div class="verse-cloze-status" aria-live="polite"></div>
            </section>
            <div class="verse-cloze-game-actions">
                <button type="button" class="verse-cloze-hint-button" data-action="show-hint" hidden>${icons.hint}<span>提示</span></button>
                <div class="verse-cloze-answer-actions">
                    <button type="button" class="verse-cloze-primary-button" data-action="check-answer">${icons.check}<span>確認答案</span></button>
                    <button type="button" class="verse-cloze-primary-button verse-cloze-next-button" data-action="next-round" hidden>${icons.chevronRight}<span>下一關</span></button>
                </div>
            </div>
        </div>`, {
        title: passageRef,
        subtitle: '逐段填入經文內容',
        backAction: 'back-to-verses'
    });
    activateClozeInput(state.root.querySelector('[data-cloze-input]'));
}
function updateHintButton() {
    const button = state.root?.querySelector('[data-action="show-hint"]');
    if (!button) return;
    const input = state.activeHintInput;
    const canShow = Boolean(
        input &&
        input.isConnected &&
        !input.readOnly &&
        !String(input.value || '').trim()
    );
    button.hidden = !canShow;
}
function activateClozeInput(input) {
    if (!input || !input.isConnected || input.readOnly) return;
    state.activeHintInput = input;
    input.focus({ preventScroll: true });
    updateHintButton();
}
function applyHint() {
    const input = state.activeHintInput;
    if (!input || !input.isConnected || input.readOnly || String(input.value || '').trim()) {
        updateHintButton();
        return;
    }
    const firstCharacter = Array.from(input.dataset.answer || '')[0];
    if (!firstCharacter) return;
    input.value = firstCharacter;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus({ preventScroll: true });
    updateHintButton();
}
function renderDiff(diff, index) {
    const chars = diff.map(item => `<span class="${item.status}" aria-label="${item.status === 'missing' ? '缺少一字' : ''}">${escapeHtml(item.character)}</span>`).join('');
    return `<div class="verse-cloze-diff"><small>第 ${index + 1} 格</small><div>${chars}</div></div>`;
}
function checkAnswer() {
    if (!state.session || state.session.correct) return;
    state.activeHintInput = null;
    updateHintButton();
    const inputs = [...state.root.querySelectorAll('[data-cloze-input]')];
    if (!inputs.length) return;
    let allCorrect = true;
    const diffRows = [];
    inputs.forEach((input, index) => {
        const expected = input.dataset.answer || '';
        const actual = input.value.trim();
        const correct = normalizeAnswerText(actual) === normalizeAnswerText(expected);
        input.classList.toggle('correct', correct);
        input.classList.toggle('incorrect', !correct);
        input.setAttribute('aria-invalid', String(!correct));
        if (!correct) {
            allCorrect = false;
            diffRows.push(renderDiff(diffVerseCharacters(actual, expected), index));
        }
    });
    const status = state.root.querySelector('.verse-cloze-status');
    const diffList = state.root.querySelector('.verse-cloze-diff-list');
    diffList.innerHTML = diffRows.join('');
    if (!allCorrect) {
        status.className = 'verse-cloze-status error';
        status.textContent = '還有不一致的地方，修改紅框內容後再試一次。';
        state.root.querySelector('[data-cloze-input].incorrect')?.focus();
        return;
    }
    state.session.correct = true;
    inputs.forEach(input => { input.readOnly = true; });
    status.className = 'verse-cloze-status success';
    status.textContent = '正確';
    state.root.querySelector('[data-action="check-answer"]').hidden = true;
    state.root.querySelector('[data-action="next-round"]').hidden = false;
    state.autoAdvanceTimer = setTimeout(advanceRound, 600);
}
function advanceRound() {
    clearTimeout(state.autoAdvanceTimer);
    const session = state.session;
    if (!session || !session.correct) return;
    session.completedRounds += 1;
    const verse = session.selectedVerses[session.verseIndex];
    if (session.levelIndex + 1 < verse.levels.length) {
        session.levelIndex += 1;
    } else if (session.verseIndex + 1 < session.selectedVerses.length) {
        session.verseIndex += 1;
        session.levelIndex = 0;
    } else {
        clearSavedProgress();
        renderComplete();
        return;
    }
    session.correct = false;
    saveProgress();
    renderGame();
}
function renderComplete() {
    state.view = 'complete';
    const session = state.session;
    const rounds = session.selectedVerses.reduce((total, verse) => total + verse.levels.length, 0);
    const reference = formatReference(session.book, session.chapter, session.selectedVerses[0].verse, session.selectedVerses[session.selectedVerses.length - 1].verse);
    renderShell(`
        <div class="verse-cloze-complete">
            <span class="verse-cloze-complete-icon">${icons.check}</span>
            <h2>完成練習</h2>
            <strong>${escapeHtml(reference)}</strong>
            <p>已完成 ${rounds} 關</p>
            <div>
                <button type="button" class="verse-cloze-secondary-button" data-action="choose-another">${icons.book}<span>選擇其他經文</span></button>
                <button type="button" class="verse-cloze-primary-button" data-action="repeat-game">${icons.refresh}<span>再練一次</span></button>
            </div>
        </div>`);
}
function handleClick(event) {
    const input = event.target.closest?.('[data-cloze-input]');
    if (input) {
        activateClozeInput(input);
        return;
    }
    const button = event.target.closest('[data-action]');
    if (!button || !state.root.contains(button) || button.disabled) {
        state.activeHintInput = null;
        updateHintButton();
        return;
    }
    const action = button.dataset.action;
    if (action !== 'show-hint') {
        state.activeHintInput = null;
        updateHintButton();
    }
    if (action === 'select-book') {
        state.selectedBook = state.allBooks.find(book => book.id === button.dataset.bookId);
        if (state.selectedBook) renderChapters();
    } else if (action === 'select-chapter') {
        void openVerseSelection(Number(button.dataset.chapter));
    } else if (action === 'select-verse') {
        selectVerse(Number(button.dataset.verse));
    } else if (action === 'set-mode') {
        state.selectionMode = button.dataset.mode === 'range' ? 'range' : 'single';
        state.selectionStart = null;
        state.selectionEnd = null;
        renderVerses();
    } else if (action === 'start-game') {
        startSelectedGame();
    } else if (action === 'check-answer') {
        checkAnswer();
    } else if (action === 'next-round') {
        advanceRound();
    } else if (action === 'show-hint') {
        applyHint();
    } else if (action === 'continue-saved') {
        void restoreSavedProgress(false);
    } else if (action === 'restart-saved') {
        void restoreSavedProgress(true);
    } else if (action === 'repeat-game') {
        beginSession(state.session.selectedVerses);
    } else if (action === 'choose-another') {
        state.selectionStart = null;
        state.selectionEnd = null;
        renderVerses();
    } else if (action === 'back-to-books') {
        renderBooks();
    } else if (action === 'back-to-chapters') {
        renderChapters();
    } else if (action === 'back-to-verses' || action === 'change-passage') {
        clearTimeout(state.autoAdvanceTimer);
        renderVerses();
    }
}
function handleInput(event) {
    const input = event.target.closest('[data-cloze-input]');
    if (!input) return;
    input.classList.remove('correct', 'incorrect');
    input.removeAttribute('aria-invalid');
    state.session.correct = false;
    const status = state.root.querySelector('.verse-cloze-status');
    const diffList = state.root.querySelector('.verse-cloze-diff-list');
    if (status) {
        status.className = 'verse-cloze-status';
        status.textContent = '';
    }
    if (diffList) diffList.innerHTML = '';
    if (state.activeHintInput === input) updateHintButton();
}
function handleKeydown(event) {
    if (event.key !== 'Enter' || event.isComposing || !event.target.matches('[data-cloze-input]')) return;
    event.preventDefault();
    const inputs = [...state.root.querySelectorAll('[data-cloze-input]')];
    const index = inputs.indexOf(event.target);
    if (index >= 0 && index < inputs.length - 1) {
        activateClozeInput(inputs[index + 1]);
    } else {
        checkAnswer();
    }
}
export function mountVerseCloze({ root, books, fetchChapter }) {
    if (!root || !books || typeof fetchChapter !== 'function') {
        throw new Error('Verse cloze configuration is incomplete');
    }
    state.root = root;
    state.books = books;
    state.fetchChapter = fetchChapter;
    state.allBooks = [...books.oldTestament, ...books.newTestament];
    if (root.dataset.eventsBound !== 'true') {
        root.addEventListener('click', handleClick);
        root.addEventListener('input', handleInput);
        root.addEventListener('keydown', handleKeydown);
        root.dataset.eventsBound = 'true';
    }
    renderBooks();
}
