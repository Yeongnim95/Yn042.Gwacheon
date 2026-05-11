import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.');
const baseRoot = '/private/tmp/yn042-main/Yn042.Gwacheon-main';
const sourceRoot =
  '/Users/yeongnim/Library/Mobile Documents/com~apple~CloudDocs/우리교희/위리의 성경 JSON';

const bookMap = {
  창세기: 'gen',
  출애굽기: 'exo',
  레위기: 'lev',
  민수기: 'num',
  신명기: 'deu',
  여호수아: 'jos',
  사사기: 'jdg',
  룻기: 'rut',
  사무엘상: '1sa',
  사무엘하: '2sa',
  열왕기상: '1ki',
  열왕기하: '2ki',
  역대상: '1ch',
  역대하: '2ch',
  에스라: 'ezr',
  느헤미야: 'neh',
  에스더: 'est',
  욥기: 'job',
  시편: 'psa',
  잠언: 'pro',
  전도서: 'ecc',
  아가: 'sng',
  이사야: 'isa',
  예레미야: 'jer',
  예레미야애가: 'lam',
  '예레미야 애가': 'lam',
  에스겔: 'ezk',
  다니엘: 'dan',
  호세아: 'hos',
  요엘: 'jol',
  아모스: 'amo',
  오바댜: 'oba',
  요나: 'jon',
  미가: 'mic',
  나훔: 'nam',
  하박국: 'hab',
  스바냐: 'zep',
  학개: 'hag',
  스가랴: 'zec',
  말라기: 'mal',
  마태복음: 'mat',
  마가복음: 'mrk',
  누가복음: 'luk',
  요한복음: 'jhn',
  사도행전: 'act',
  로마서: 'rom',
  고린도전서: '1co',
  고린도후서: '2co',
  갈라디아서: 'gal',
  에베소서: 'eph',
  빌립보서: 'php',
  골로새서: 'col',
  데살로니가전서: '1th',
  데살로니가후서: '2th',
  디모데전서: '1ti',
  디모데후서: '2ti',
  디도서: 'tit',
  빌레몬서: 'phm',
  히브리서: 'heb',
  야고보서: 'jas',
  베드로전서: '1pe',
  베드로후서: '2pe',
  요한일서: '1jn',
  요한이서: '2jn',
  요한삼서: '3jn',
  유다서: 'jud',
  요한계시록: 'rev',
};

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }
  return files;
}

const sourceFiles = (await walk(sourceRoot)).sort();
const report = {
  sourceFiles: sourceFiles.length,
  mergedFiles: 0,
  changedFiles: 0,
  repairedFromLive: [],
  createdTargets: [],
  missingBookNames: [],
  invalid: [],
  verseMismatches: [],
};
const missingBookNames = new Set();

for (const [index, sourceFile] of sourceFiles.entries()) {
  let source;
  try {
    source = JSON.parse(await fs.readFile(sourceFile, 'utf8'));
  } catch (error) {
    report.invalid.push({ sourceFile, error: String(error) });
    continue;
  }

  const bookId = bookMap[source.book];
  const chapter = Number(source.chapter);
  if (!bookId) {
    missingBookNames.add(source.book || path.basename(path.dirname(sourceFile)));
    continue;
  }
  if (!chapter || !Array.isArray(source.verses)) {
    report.invalid.push({ sourceFile, error: 'Missing chapter or verses array' });
    continue;
  }

  const relativeTarget = path.join('bible', bookId, `${chapter}.json`);
  const targetFile = path.join(root, relativeTarget);
  const baseFile = path.join(baseRoot, relativeTarget);
  let target;
  try {
    target = JSON.parse(await fs.readFile(baseFile, 'utf8'));
    if (!Array.isArray(target)) throw new Error('Base JSON is not an array');
  } catch {
    try {
      target = JSON.parse(await fs.readFile(targetFile, 'utf8'));
      if (!Array.isArray(target)) throw new Error('Target JSON is not an array');
    } catch {
      target = [];
      report.createdTargets.push(targetFile);
      await fs.mkdir(path.dirname(targetFile), { recursive: true });
    }
  }

  const hasChinese = target.some((item) => item && typeof item === 'object' && item.zh);
  if (!hasChinese) {
    const liveUrl = `https://scoynim.dev/bible/${bookId}/${chapter}.json`;
    try {
      const response = await fetch(liveUrl, { cache: 'no-store' });
      if (response.ok) {
        const liveTarget = await response.json();
        if (Array.isArray(liveTarget) && liveTarget.some((item) => item && item.zh)) {
          target = liveTarget;
          report.repairedFromLive.push(targetFile);
        }
      }
    } catch {
      // Keep the local target. The report will show this file in createdTargets if it was missing.
    }
  }

  const original = JSON.stringify(target);
  const koreanByVerse = new Map();
  for (const verse of source.verses) {
    const verseNumber = Number(verse.verse);
    const existing = koreanByVerse.get(verseNumber);
    koreanByVerse.set(verseNumber, existing ? `${existing}\n${verse.text}` : verse.text);
  }
  const seen = new Set();

  for (const item of target) {
    if (!item || typeof item !== 'object' || item.verse == null) continue;
    const verseNumber = Number(item.verse);
    if (!koreanByVerse.has(verseNumber)) continue;
    item.ko = koreanByVerse.get(verseNumber);
    seen.add(verseNumber);
  }

  for (const [verseNumber] of koreanByVerse) {
    if (seen.has(verseNumber)) continue;
    target.push({ verse: verseNumber, ko: koreanByVerse.get(verseNumber) });
    report.verseMismatches.push({
      targetFile,
      verse: verseNumber,
      issue: 'Source verse not found as an independent verse in the Chinese target; appended as Korean-only verse',
    });
  }

  report.mergedFiles += 1;
  if (JSON.stringify(target) !== original) {
    await fs.writeFile(targetFile, `${JSON.stringify(target, null, 2)}\n`, 'utf8');
    report.changedFiles += 1;
  }

  if ((index + 1) % 100 === 0) {
      console.log(`Merged ${index + 1}/${sourceFiles.length}`);
  }
}

report.missingBookNames = [...missingBookNames];
report.repairedFromLiveCount = report.repairedFromLive.length;
report.createdTargetsCount = report.createdTargets.length;
report.verseMismatchesCount = report.verseMismatches.length;
report.repairedFromLive = report.repairedFromLive.slice(0, 20);
report.createdTargets = report.createdTargets.slice(0, 20);
report.verseMismatches = report.verseMismatches.slice(0, 20);
await fs.writeFile(
  path.join(root, 'bible-merge-report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8',
);

console.log(JSON.stringify(report, null, 2));
