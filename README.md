# 长篇网络小说不剧透入坑地图

读前决策助手 — 帮你判断一本长篇网络小说值不值得继续读。

## 技术栈

- React + Vite
- React Router
- Tailwind CSS v4
- localStorage

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 页面

- `/` 首页
- `/books` 小说列表
- `/books/:id` 小说详情
- `/recommend` 智能推荐
- `/progress` 阅读进度判断
- `/favorites` 收藏 / 阅读记录
- `/compare` 对比
- `/about` 关于

## 数据架构

全站唯一数据源为 **`src/data/books.seed.json`**。

所有页面通过 `src/lib/books.js` 读取数据，**没有写死书名、id 或书目数量**。新增小说后，以下能力自动生效：

| 能力 | 说明 |
|------|------|
| 书库页 `/books` | `getBooks()` 返回全部书目；筛选器选项由 `getFilterOptions()` 从数据聚合 |
| 详情页 `/books/:id` | `getBookById(id)` 按 id 查找，支持任意 `book_xxx` |
| 推荐页 `/recommend` | `recommendBooks()` 遍历全部书目打分 |
| 进度判断 `/progress` | 下拉列表与建议逻辑基于单本书字段 |
| 对比页 `/compare` | `getBooks()` 列出全部可选书目 |
| 收藏页 `/favorites` | localStorage 存 id，通过 `getBookById` 渲染 |
| 首页推荐模块 | `getHomeRecommendationSections()` 按 badge 动态筛选 |

> 注意：项目根目录的 `books.seed.json` 为初始备份，**运行时只读取 `src/data/books.seed.json`**。请只修改后者。

---

## 如何新增一本小说

只需在 `src/data/books.seed.json` 数组末尾追加一个对象，保存后刷新页面即可（开发模式下 Vite 会热更新）。

### 1. 分配唯一 id

```json
"id": "book_011"
```

id 必须唯一，详情页路由为 `/books/book_011`。

### 2. 按 schema 填写字段

可复制现有书目（如 `book_001`）作为模板，修改各字段：

```json
{
  "id": "book_011",
  "title": "书名",
  "author": "作者",
  "platform": "连载平台",
  "officialUrl": "https://...",
  "status": "已完结",
  "frontDisplayBadges": ["慢热后劲型", "设定党友好"],
  "hookSummary": "不剧透的入坑简介，1-3 句",
  "basic": {
    "categories": ["玄幻"],
    "tags": ["标签1", "标签2"],
    "lengthType": "长篇",
    "totalChapters": 1000,
    "endingType": "HE",
    "endingConfidence": "中"
  },
  "readerFit": {
    "oneSentenceIntro": "一句话介绍",
    "suitableFor": ["适合人群1"],
    "notSuitableFor": ["不适合人群1"],
    "readerTypes": ["剧情党"]
  },
  "readingExperience": {
    "slowBurnLevel": 3,
    "plotComplexity": 4,
    "romanceWeight": 2,
    "plotWeight": 5,
    "emotionType": "情绪描述",
    "quitRisk": {
      "range": "前10%",
      "reason": "弃文风险原因"
    },
    "stickUntil": {
      "displayText": "建议至少读到哪里",
      "chapter": null,
      "progressRange": "前10%-15%",
      "confidence": "中"
    }
  },
  "dropDecision": {
    "ifAtBeginning": "刚开始读不下去时…",
    "ifAtQuitRiskRange": "卡在风险区时…",
    "safeToDropAfter": "可以合理放弃的时机…"
  },
  "highlightMap": [
    {
      "progressRange": "前10%",
      "chapterRange": "待核验",
      "type": "阶段类型",
      "spoilerFreeText": "不剧透描述",
      "lightSpoilerText": "轻微剧透（详情页默认折叠）",
      "emotion": ["好奇"],
      "importance": 4,
      "confidence": "中"
    }
  ],
  "expectationWarnings": {
    "slowBurn": "慢热程度描述",
    "abuseLevel": "低/中等/高",
    "misunderstandingLevel": "轻微",
    "endingConcern": "结局顾虑",
    "controversy": "争议点",
    "otherWarnings": ["其他提醒"]
  },
  "routes": {
    "forTrialReader": "试读党路线",
    "forPlotReader": "剧情党路线",
    "forCPReader": "CP 党路线",
    "ifYouWantToDrop": "想弃文时"
  },
  "verification": {
    "basicInfo": "高",
    "chapterNodes": "中",
    "readerDiscussion": "高",
    "notes": ["备注"]
  }
}
```

### 3. 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `id` | 是 | 唯一标识，格式建议 `book_NNN` |
| `title` / `author` / `platform` / `status` | 是 | 基础展示信息 |
| `frontDisplayBadges` | 推荐 | 出现在卡片和筛选器；新 badge 会自动加入书库筛选 |
| `hookSummary` | 推荐 | 书库卡片简介 |
| `basic.totalChapters` | 否 | 数字则进度页支持输入章节；`null` 则用手动区间 |
| `readingExperience.*Level` / `*Weight` | 推荐 | 1-5 评分，用于筛选和推荐算法 |
| `highlightMap[].progressRange` | 推荐 | 使用 `前10%` / `10%-25%` / `25%-50%` / `50%-75%` / `后25%` |
| 待核验字段 | — | 可填 `null` 或「待核验」，前端会如实展示 |

### 4. 验证

```bash
npm run build   # 确认 JSON 格式正确
npm run dev     # 本地检查各页面
```

- 书库页应显示新书
- 访问 `/books/book_011` 应进入详情页
- 推荐页搜索相关关键词应能匹配到新书
- 对比页勾选列表应包含新书

### 5. 不需要改代码的地方

- 不需要修改 React 组件
- 不需要修改路由
- 不需要修改推荐关键词规则（规则按 tags/badges/评分匹配，新书自动参与）

若希望新书出现在首页某个推荐模块，为其 `frontDisplayBadges` 添加对应标签即可（如 `慢热后劲型`、`副本党友好`）。
