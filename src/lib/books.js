/**
 * 书目数据访问层
 * 唯一数据源：src/data/books.seed.json
 * 所有页面通过本模块读取数据，新增小说只需在 JSON 中添加对象即可。
 */
import booksData from '../data/books.seed.json';

const STORAGE_KEY = 'novel-map-reading-state';
export const READING_STATE_EVENT = 'novel-map-state-change';

const PROGRESS_RANGES = ['前10%', '10%-25%', '25%-50%', '50%-75%', '后25%'];

const RANGE_BOUNDS = {
  '前10%': [0, 10],
  '10%-25%': [10, 25],
  '25%-50%': [25, 50],
  '50%-75%': [50, 75],
  '后25%': [75, 100],
};

function parseQuitRange(rangeStr) {
  if (!rangeStr) return null;
  if (rangeStr === '前10%') return [0, 10];
  const match = rangeStr.match(/前(\d+)%[-—]?(\d+)?%/);
  if (match) {
    const end = match[2] ? Number(match[2]) : Number(match[1]);
    return [0, end];
  }
  const single = rangeStr.match(/(\d+)%/);
  if (single) return [0, Number(single[1])];
  return null;
}

function rangesOverlap(a, b) {
  const [a0, a1] = RANGE_BOUNDS[a] || [0, 0];
  const [b0, b1] = b;
  return a0 < b1 && b0 < a1;
}

function notifyStateChange() {
  window.dispatchEvent(new CustomEvent(READING_STATE_EVENT));
}

export function getBooks() {
  return booksData;
}

export function getBooksCount() {
  return booksData.length;
}

export function getBookById(id) {
  return booksData.find((b) => b.id === id) ?? null;
}

function scoreTitleAuthorMatch(book, q) {
  const title = (book.title || '').toLowerCase();
  const author = (book.author || '').toLowerCase();
  if (title === q) return { matched: true, score: 100, type: 'title' };
  if (title.includes(q)) return { matched: true, score: 90 + Math.min(9, q.length), type: 'title' };
  if (author === q) return { matched: true, score: 85, type: 'author' };
  if (author.includes(q)) return { matched: true, score: 75 + Math.min(9, q.length), type: 'author' };
  return { matched: false, score: 0, type: null };
}

/** 按书名或作者筛选，用于进度页搜索与推荐页书名命中 */
export function searchBooksByTitleOrAuthor(query, books = booksData) {
  const q = query.toLowerCase().trim();
  if (!q) return [...books];
  return books
    .map((book) => ({ book, ...scoreTitleAuthorMatch(book, q) }))
    .filter((item) => item.matched)
    .sort((a, b) => b.score - a.score || a.book.title.localeCompare(b.book.title, 'zh-CN'))
    .map((item) => item.book);
}

export function bookExists(id) {
  return booksData.some((b) => b.id === id);
}

export function getAllCategories() {
  const set = new Set();
  booksData.forEach((b) => {
    b.basic?.categories?.forEach((c) => set.add(c));
    b.basic?.tags?.forEach((t) => set.add(t));
  });
  return [...set].sort();
}

export function getAllBadges() {
  const set = new Set();
  booksData.forEach((b) => {
    b.frontDisplayBadges?.forEach((badge) => set.add(badge));
  });
  return [...set].sort();
}

/** 从数据中提取筛选器选项，新增书的 categories/tags/badges 会自动出现 */
export function getFilterOptions() {
  return {
    categories: getAllCategories(),
    badges: getAllBadges(),
  };
}

/** 首页快捷标签：仅展示数据中实际存在的 badge */
const QUICK_CHIP_CONFIG = [
  { label: '慢热后劲型', action: 'recommend' },
  { label: '开局上头型', action: 'recommend' },
  { label: 'CP张力强', action: 'recommend' },
  { label: '甜文低门槛', action: 'recommend' },
  { label: '副本党友好', action: 'filter' },
  { label: '非恋爱向', action: 'filter' },
  { label: '强情绪', action: 'filter' },
  { label: '群像爆发型', action: 'filter' },
  { label: '前期门槛高', action: 'filter' },
];

export function getQuickChips() {
  const badges = new Set(getAllBadges());
  return QUICK_CHIP_CONFIG.filter((c) => badges.has(c.label));
}

function pickBooks(books, predicate, limit = 3) {
  return books.filter(predicate).slice(0, limit);
}

/** 首页推荐模块：按 badge/属性从全书动态筛选 */
export function getHomeRecommendationSections(displayLimit = 3) {
  const books = getBooks();
  const todayMatched = pickBooks(books, (b) => b.frontDisplayBadges?.includes('开局上头型'), displayLimit);

  return [
    {
      key: 'todayPick',
      title: '今日适合入坑',
      books: todayMatched.length ? todayMatched : books.slice(0, displayLimit),
    },
    {
      key: 'slowBurn',
      title: '慢热但后劲强',
      books: pickBooks(books, (b) => b.frontDisplayBadges?.includes('慢热后劲型'), displayLimit),
    },
    {
      key: 'sweet',
      title: '甜文低门槛',
      books: pickBooks(
        books,
        (b) => b.frontDisplayBadges?.includes('甜文低门槛') || b.readingExperience?.romanceWeight >= 4,
        displayLimit,
      ),
    },
    {
      key: 'dungeon',
      title: '副本党友好',
      books: pickBooks(books, (b) => b.frontDisplayBadges?.includes('副本党友好'), displayLimit),
    },
    {
      key: 'setting',
      title: '设定党友好',
      books: pickBooks(books, (b) => b.frontDisplayBadges?.includes('设定党友好'), displayLimit),
    },
  ];
}

export function filterBooks(filters = {}) {
  let result = [...booksData];
  const {
    category,
    slowBurnMin,
    slowBurnMax,
    romanceMin,
    romanceMax,
    plotMin,
    plotMax,
    badge,
    sortBy,
  } = filters;

  if (category) {
    result = result.filter(
      (b) =>
        b.basic?.categories?.includes(category) ||
        b.basic?.tags?.includes(category)
    );
  }

  if (slowBurnMin != null) {
    result = result.filter((b) => b.readingExperience.slowBurnLevel >= slowBurnMin);
  }
  if (slowBurnMax != null) {
    result = result.filter((b) => b.readingExperience.slowBurnLevel <= slowBurnMax);
  }
  if (romanceMin != null) {
    result = result.filter((b) => b.readingExperience.romanceWeight >= romanceMin);
  }
  if (romanceMax != null) {
    result = result.filter((b) => b.readingExperience.romanceWeight <= romanceMax);
  }
  if (plotMin != null) {
    result = result.filter((b) => b.readingExperience.plotWeight >= plotMin);
  }
  if (plotMax != null) {
    result = result.filter((b) => b.readingExperience.plotWeight <= plotMax);
  }
  if (badge) {
    result = result.filter((b) => b.frontDisplayBadges?.includes(badge));
  }

  if (sortBy) {
    const sorters = {
      slowBurnAsc: (a, b) => a.readingExperience.slowBurnLevel - b.readingExperience.slowBurnLevel,
      plotComplexityAsc: (a, b) => a.readingExperience.plotComplexity - b.readingExperience.plotComplexity,
      romanceDesc: (a, b) => b.readingExperience.romanceWeight - a.readingExperience.romanceWeight,
      plotDesc: (a, b) => b.readingExperience.plotWeight - a.readingExperience.plotWeight,
    };
    if (sorters[sortBy]) result.sort(sorters[sortBy]);
  }

  return result;
}

const KEYWORD_RULES = [
  { keys: ['cp', '感情线', '磕cp', '磕'], prefs: { romanceWeight: { min: 4 }, badges: ['CP张力强'] }, label: 'CP 张力强' },
  { keys: ['恋爱', '言情', '感情', '谈恋', '爱情'], prefs: { romanceWeight: { min: 3 } }, label: '恋爱 / 感情向' },
  { keys: ['甜', '甜文', '低门槛', '小甜'], prefs: { badges: ['甜文低门槛'], romanceWeight: { min: 3 }, slowBurn: { max: 3 } }, label: '甜文低门槛' },
  { keys: ['不要太虐', '不虐', '少虐', '轻虐', '别虐'], prefs: { abuseLevel: 'low' }, label: '避雷高虐' },
  { keys: ['慢热', '后劲', '细水长流'], prefs: { slowBurn: { min: 4 }, badges: ['慢热后劲型'] }, label: '慢热后劲型' },
  { keys: ['不想慢热', '不要慢热', '不慢热', '开局上头', '快节奏', '前期不慢'], prefs: { slowBurn: { max: 2 }, badges: ['开局上头型'] }, label: '开局上头 / 不想慢热' },
  { keys: ['设定复杂', '设定党', '世界观', '体系'], prefs: { plotComplexity: { min: 4 }, badges: ['设定党友好'] }, label: '设定党 / 复杂世界观' },
  { keys: ['无限流', '副本', '闯关'], prefs: { badges: ['副本党友好'], categories: ['无限流'] }, label: '无限流 / 副本' },
  { keys: ['古言', '宅斗', '宫廷'], prefs: { badges: ['古言宅斗'], categories: ['古言', '宅斗'] }, label: '古言 / 宅斗' },
  { keys: ['修仙', '玄幻', '仙侠'], prefs: { categories: ['玄幻', '修仙', '仙侠'] }, label: '修仙 / 玄幻' },
  { keys: ['刑侦', '悬疑', '推理', '破案'], prefs: { categories: ['悬疑', '刑侦', '推理'] }, label: '刑侦 / 悬疑' },
  { keys: ['群像', '多线'], prefs: { badges: ['群像爆发型'], tags: ['群像'] }, label: '群像向' },
  { keys: ['非恋爱', '无cp', '剧情向', '不看感情'], prefs: { romanceWeight: { max: 2 }, badges: ['非恋爱向'] }, label: '非恋爱向' },
  { keys: ['强情绪', '情绪拉满', '虐心', '燃'], prefs: { badges: ['强情绪'] }, label: '强情绪向' },
  { keys: ['吓人', '恐怖', '别吓人'], prefs: { avoidTags: ['克苏鲁', '克系', '恐怖'] }, label: '避雷恐怖氛围' },
  { keys: ['长篇', '超长篇'], prefs: { lengthType: '超长篇' }, label: '长篇体量' },
  { keys: ['he', '大团圆'], prefs: { endingType: 'HE' }, label: 'HE 结局偏好' },
];

function bookTextBlob(book) {
  return [
    book.title,
    book.hookSummary,
    book.readerFit?.oneSentenceIntro,
    ...(book.frontDisplayBadges || []),
    ...(book.basic?.categories || []),
    ...(book.basic?.tags || []),
    ...(book.readerFit?.suitableFor || []),
    book.readingExperience?.emotionType,
  ].join(' ').toLowerCase();
}

function matchText(book, text) {
  return bookTextBlob(book).includes(text.toLowerCase());
}

function buildBookWarnings(book, activeRules) {
  const warnings = [];
  const ew = book.expectationWarnings || {};

  activeRules.forEach((rule) => {
    if (rule.prefs?.abuseLevel === 'low') {
      const abuse = ew.abuseLevel;
      if (abuse && !['低', '轻微', '无', '较低'].some((a) => abuse.includes(a))) {
        warnings.push(`虐点等级为「${abuse}」，可能偏重`);
      }
    }
    if (rule.prefs?.romanceWeight?.min >= 3 && book.readingExperience.romanceWeight <= 2) {
      warnings.push('感情线权重较低，可能不符合恋爱向期待');
    }
    if (rule.prefs?.slowBurn?.max != null && book.readingExperience.slowBurnLevel >= 4) {
      warnings.push(`慢热程度 ${book.readingExperience.slowBurnLevel}/5，前期可能较慢`);
    }
  });

  if (ew.slowBurn && ew.slowBurn.includes('慢热')) warnings.push(ew.slowBurn);
  if (ew.controversy && ew.controversy !== '无' && !ew.controversy.includes('无明显')) {
    warnings.push(ew.controversy);
  }
  (ew.otherWarnings || []).slice(0, 2).forEach((w) => warnings.push(w));
  (book.readerFit?.notSuitableFor || []).slice(0, 1).forEach((w) => {
    warnings.push(`可能不适合：${w}`);
  });

  return [...new Set(warnings)].slice(0, 4);
}

function buildBookReasons(book, activeRules, q) {
  const reasons = [];
  const exp = book.readingExperience;
  const badges = book.frontDisplayBadges || [];

  activeRules.forEach((rule) => {
    const { prefs } = rule;
    if (prefs.badges) {
      prefs.badges.forEach((badge) => {
        if (badges.includes(badge)) reasons.push(`标签「${badge}」与你的偏好高度吻合`);
      });
    }
    if (prefs.categories) {
      prefs.categories.forEach((cat) => {
        if (book.basic?.categories?.includes(cat)) reasons.push(`类型为「${cat}」，符合你想看的方向`);
        else if (book.basic?.tags?.includes(cat)) reasons.push(`含「${cat}」元素，贴近你的搜索`);
      });
    }
    if (prefs.tags) {
      prefs.tags.forEach((tag) => {
        if (book.basic?.tags?.includes(tag)) reasons.push(`标签「${tag}」匹配`);
      });
    }
    if (prefs.romanceWeight?.min != null && exp.romanceWeight >= prefs.romanceWeight.min) {
      reasons.push(`感情线权重 ${exp.romanceWeight}/5，${exp.romanceWeight >= 4 ? 'CP 存在感强' : '有一定感情线'}`);
    }
    if (prefs.romanceWeight?.max != null && exp.romanceWeight <= prefs.romanceWeight.max) {
      reasons.push(`感情线权重 ${exp.romanceWeight}/5，主线导向明显`);
    }
    if (prefs.slowBurn?.min != null && exp.slowBurnLevel >= prefs.slowBurn.min) {
      reasons.push(`慢热 ${exp.slowBurnLevel}/5，适合愿意等后劲的你`);
    }
    if (prefs.slowBurn?.max != null && exp.slowBurnLevel <= prefs.slowBurn.max) {
      reasons.push(`慢热 ${exp.slowBurnLevel}/5，开局相对好进入`);
    }
    if (prefs.plotComplexity?.min != null && exp.plotComplexity >= prefs.plotComplexity.min) {
      reasons.push(`剧情复杂度 ${exp.plotComplexity}/5，设定/线索层次丰富`);
    }
    if (prefs.endingType && book.basic?.endingType?.includes(prefs.endingType)) {
      reasons.push(`结局类型为 ${book.basic.endingType}`);
    }
    if (prefs.abuseLevel === 'low') {
      const abuse = book.expectationWarnings?.abuseLevel;
      if (abuse && ['低', '轻微', '无', '较低', '中等'].some((a) => abuse.includes(a))) {
        reasons.push(`虐点「${abuse}」，整体相对可控`);
      }
    }
  });

  ruleLoop: for (const rule of activeRules) {
    for (const k of rule.keys) {
      if (q.includes(k) && matchText(book, k)) {
        reasons.push(`简介/标签命中「${k}」`);
        break ruleLoop;
      }
    }
  }

  if (book.readerFit?.suitableFor?.length) {
    reasons.push(`适合：${book.readerFit.suitableFor.slice(0, 2).join('、')}`);
  }

  if (reasons.length < 2 && book.hookSummary) {
    const snippet = book.hookSummary.slice(0, 48) + (book.hookSummary.length > 48 ? '…' : '');
    reasons.push(`亮点：${snippet}`);
  }

  return [...new Set(reasons)].slice(0, 5);
}

export function recommendBooks(query, limit = 5) {
  const q = query.toLowerCase().trim();
  const titleAuthorMatches = searchBooksByTitleOrAuthor(query);

  if (titleAuthorMatches.length > 0) {
    const results = titleAuthorMatches.slice(0, limit).map((book, i) => {
      const match = scoreTitleAuthorMatch(book, q);
      const reasons = [];
      if (match.type === 'title') {
        reasons.push(`书名命中「${query.trim()}」`);
      } else {
        reasons.push(`作者命中「${query.trim()}」`);
      }
      if (book.readerFit?.oneSentenceIntro) {
        reasons.push(book.readerFit.oneSentenceIntro);
      } else if (book.hookSummary) {
        reasons.push(book.hookSummary.slice(0, 60) + (book.hookSummary.length > 60 ? '…' : ''));
      }
      return {
        book,
        score: Math.min(98, 96 - i * 2),
        rawScore: match.score,
        reasons,
        warnings: ['暂无明显劝退信号，但仍建议先试读再决定'],
        stickUntil: book.readingExperience?.stickUntil?.displayText || '信息待核验',
      };
    });

    return {
      detectedPrefs: [`书名/作者匹配（${titleAuthorMatches.length} 本）`],
      results,
    };
  }

  const detectedPrefs = [];
  const activeRules = [];

  KEYWORD_RULES.forEach((rule) => {
    if (rule.keys.some((k) => q.includes(k))) {
      activeRules.push(rule);
      if (rule.label) detectedPrefs.push(rule.label);
    }
  });

  const scored = booksData.map((book) => {
    let rawScore = 0;

    activeRules.forEach((rule) => {
      const { prefs } = rule;
      let ruleScore = 0;

      if (prefs.badges) {
        prefs.badges.forEach((badge) => {
          if (book.frontDisplayBadges?.includes(badge)) ruleScore += 25;
        });
      }
      if (prefs.categories) {
        prefs.categories.forEach((cat) => {
          if (book.basic?.categories?.includes(cat) || book.basic?.tags?.includes(cat)) ruleScore += 22;
        });
      }
      if (prefs.tags) {
        prefs.tags.forEach((tag) => {
          if (book.basic?.tags?.includes(tag)) ruleScore += 20;
        });
      }
      if (prefs.romanceWeight) {
        const rw = book.readingExperience.romanceWeight;
        if (prefs.romanceWeight.min != null && rw >= prefs.romanceWeight.min) {
          ruleScore += 18 + (rw - prefs.romanceWeight.min) * 5;
        }
        if (prefs.romanceWeight.max != null && rw <= prefs.romanceWeight.max) {
          ruleScore += 18 + (prefs.romanceWeight.max - rw) * 5;
        }
      }
      if (prefs.slowBurn) {
        const level = book.readingExperience.slowBurnLevel;
        if (prefs.slowBurn.min != null && level >= prefs.slowBurn.min) ruleScore += 15;
        if (prefs.slowBurn.max != null && level <= prefs.slowBurn.max) ruleScore += 15;
      }
      if (prefs.plotComplexity?.min != null && book.readingExperience.plotComplexity >= prefs.plotComplexity.min) {
        ruleScore += 15;
      }
      if (prefs.endingType && book.basic?.endingType?.includes(prefs.endingType)) ruleScore += 12;
      if (prefs.lengthType && book.basic?.lengthType === prefs.lengthType) ruleScore += 8;
      if (prefs.abuseLevel === 'low') {
        const abuse = book.expectationWarnings?.abuseLevel;
        if (abuse && ['低', '轻微', '无', '较低'].some((a) => abuse.includes(a))) ruleScore += 15;
        else ruleScore -= 10;
      }
      if (prefs.avoidTags) {
        prefs.avoidTags.forEach((tag) => {
          if (book.basic?.tags?.some((t) => t.includes(tag)) || bookTextBlob(book).includes(tag)) {
            ruleScore -= 35;
          }
        });
      }

      rawScore += ruleScore;
    });

    activeRules.forEach((rule) => {
      rule.keys.forEach((k) => {
        if (q.includes(k) && matchText(book, k)) rawScore += 12;
      });
    });

    if (rawScore === 0 && activeRules.length > 0) {
      activeRules.forEach((rule) => {
        rule.keys.forEach((k) => {
          if (matchText(book, k)) rawScore += 8;
        });
      });
    }

    const reasons = buildBookReasons(book, activeRules, q);
    const warnings = buildBookWarnings(book, activeRules);

    const score = rawScore > 0
      ? Math.min(98, Math.round(52 + rawScore * 0.55))
      : 0;

    return {
      book,
      score,
      rawScore,
      reasons,
      warnings: warnings.length ? warnings : ['暂无明显劝退信号，但仍建议先试读再决定'],
      stickUntil: book.readingExperience?.stickUntil?.displayText || '信息待核验',
    };
  });

  scored.sort((a, b) => b.rawScore - a.rawScore || b.score - a.score);
  const top = scored.filter((s) => s.rawScore > 0).slice(0, limit);

  if (top.length === 0) {
    const fallback = [...scored].sort((a, b) => b.book.readingExperience.plotWeight - a.book.readingExperience.plotWeight);
    return {
      detectedPrefs: detectedPrefs.length ? detectedPrefs : ['未识别到明确偏好，为你展示综合口碑推荐'],
      results: fallback.slice(0, limit).map((s, i) => ({
        ...s,
        score: 65 - i * 5,
        reasons: s.reasons.length > 1 ? s.reasons : [`${s.book.title}：${s.book.readerFit?.oneSentenceIntro || s.book.hookSummary?.slice(0, 60)}`],
      })),
    };
  }

  return { detectedPrefs, results: top };
}

export function getProgressRange(book, chapter) {
  const total = book.basic?.totalChapters;
  if (typeof total !== 'number' || total <= 0) return null;
  const pct = (chapter / total) * 100;
  if (pct <= 10) return '前10%';
  if (pct <= 25) return '10%-25%';
  if (pct <= 50) return '25%-50%';
  if (pct <= 75) return '50%-75%';
  return '后25%';
}

export function getProgressRanges() {
  return PROGRESS_RANGES;
}

function findHighlightForRange(book, range) {
  return book.highlightMap?.find((h) => h.progressRange === range) ?? null;
}

function isInQuitRisk(book, range) {
  const quitRange = book.readingExperience?.quitRisk?.range;
  if (!quitRange || !range) return false;
  if (quitRange === range) return true;
  const bounds = parseQuitRange(quitRange);
  if (bounds) return rangesOverlap(range, bounds);
  return quitRange.includes(range);
}

export function getProgressAdvice(book, input) {
  const { chapter, progressRange: manualRange } = input;
  const total = book.basic?.totalChapters;
  let range = manualRange;
  let chapterInfo = null;

  if (typeof chapter === 'number' && chapter > 0) {
    if (typeof total === 'number') {
      const pct = Math.round((chapter / total) * 100);
      range = getProgressRange(book, chapter);
      chapterInfo = { chapter, total, pct };
    }
  }

  if (!range) {
    return {
      range: null,
      needsManualRange: true,
      message: '该书章节数待核验，请选择进度区间后再获取建议',
    };
  }

  const highlight = findHighlightForRange(book, range);
  const inQuitRisk = isInQuitRisk(book, range);
  const nextIdx = PROGRESS_RANGES.indexOf(range);
  const nextRange = nextIdx < PROGRESS_RANGES.length - 1 ? PROGRESS_RANGES[nextIdx + 1] : null;
  const nextHighlight = nextRange ? findHighlightForRange(book, nextRange) : null;

  const stageLabel = highlight?.stageName || highlight?.type || range;
  const emotions = highlight?.emotion || [];

  let verdict = 'continue';
  let verdictLabel = '建议继续读';
  let dropAdvice = book.dropDecision?.ifAtBeginning;

  if (range === '前10%' || inQuitRisk) {
    dropAdvice = inQuitRisk
      ? book.dropDecision?.ifAtQuitRiskRange
      : book.dropDecision?.ifAtBeginning;
    verdict = 'caution';
    verdictLabel = inQuitRisk ? '仍在弃文风险区，建议谨慎判断' : '开局阶段，别急着下定论';
  } else if (nextHighlight) {
    dropAdvice = book.dropDecision?.safeToDropAfter;
    verdict = 'continue';
    verdictLabel = '已过主要风险区，可以继续';
  } else {
    dropAdvice = book.dropDecision?.safeToDropAfter;
    verdict = 'continue';
    verdictLabel = '接近尾声，可按个人节奏读完';
  }

  const canSafelyDrop = !inQuitRisk && range !== '前10%';

  const headline = chapterInfo
    ? `你读到第 ${chapterInfo.chapter} 章（约全书 ${chapterInfo.pct}%），正处于「${stageLabel}」`
    : `你目前处在「${stageLabel}」（${range}）`;

  const emotionHint = emotions.length ? `这个阶段常见感受：${emotions.join('、')}。` : '';

  const riskParagraph = inQuitRisk
    ? `⚠ 你仍在弃文风险区（${book.readingExperience?.quitRisk?.range}）。${book.readingExperience?.quitRisk?.reason || ''}`
    : '✓ 你已度过主要弃文风险区，可以更从容地判断自己是否喜欢这本书。';

  const nextParagraph = nextHighlight
    ? `再往后（${nextRange}），${nextHighlight.spoilerFreeText}`
    : '你已接近尾声，后续主要是收束与情绪落地。';

  const assistantMessage = [
    headline + '。',
    emotionHint,
    highlight?.spoilerFreeText,
    riskParagraph,
    dropAdvice,
    book.readingExperience?.stickUntil?.displayText
      ? `试读建议：${book.readingExperience.stickUntil.displayText}`
      : null,
    canSafelyDrop ? '如果到此仍完全无感，可以合理考虑放弃。' : null,
  ].filter(Boolean).join('\n\n');

  return {
    range,
    chapterInfo,
    needsManualRange: typeof total !== 'number',
    stageName: stageLabel,
    currentExperience: highlight?.spoilerFreeText || '该阶段体验信息待核验',
    emotions,
    nextExpectation: nextHighlight?.spoilerFreeText || '后续高光信息待核验',
    nextRange,
    inQuitRisk,
    quitReason: book.readingExperience?.quitRisk?.reason,
    stickUntil: book.readingExperience?.stickUntil?.displayText,
    suggestion: verdict,
    verdictLabel,
    dropAdvice,
    canSafelyDrop,
    highlight,
    headline,
    riskParagraph,
    nextParagraph,
    assistantMessage,
  };
}

export function getReadingState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          favorites: [],
          wantToRead: [],
          reading: [],
          finished: [],
          dropped: [],
          recentViews: [],
          progress: {},
        };
  } catch {
    return {
      favorites: [],
      wantToRead: [],
      reading: [],
      finished: [],
      dropped: [],
      recentViews: [],
      progress: {},
    };
  }
}

export function saveReadingState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  notifyStateChange();
}

export function updateBookStatus(bookId, status) {
  const state = getReadingState();
  const lists = ['favorites', 'wantToRead', 'reading', 'finished', 'dropped'];
  lists.forEach((list) => {
    state[list] = state[list].filter((id) => id !== bookId);
  });
  if (status && lists.includes(status)) {
    if (!state[status].includes(bookId)) state[status].push(bookId);
  }
  saveReadingState(state);
  return state;
}

export function addRecentView(bookId) {
  const state = getReadingState();
  state.recentViews = [bookId, ...state.recentViews.filter((id) => id !== bookId)].slice(0, 10);
  saveReadingState(state);
}

export function saveProgress(bookId, progress) {
  const state = getReadingState();
  state.progress[bookId] = { ...state.progress[bookId], ...progress, updatedAt: Date.now() };
  saveReadingState(state);
}

export function getBookStatus(bookId) {
  const state = getReadingState();
  if (state.favorites.includes(bookId)) return 'favorites';
  if (state.wantToRead.includes(bookId)) return 'wantToRead';
  if (state.reading.includes(bookId)) return 'reading';
  if (state.finished.includes(bookId)) return 'finished';
  if (state.dropped.includes(bookId)) return 'dropped';
  return null;
}

export function getHomeRecommendations() {
  return Object.fromEntries(
    getHomeRecommendationSections(3).map((s) => [s.key, s.books]),
  );
}

export { PROGRESS_RANGES };
