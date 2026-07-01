const GITHUB_REPO = 'https://github.com/zhuhanyu-growprety/novel-map';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-ink mb-2">关于入坑地图</h1>
      <p className="text-sm text-ink-muted mb-6">个人产品项目 · vibe coding · 不剧透阅读决策辅助工具</p>

      <div className="space-y-6 text-ink-muted leading-relaxed">
        <section className="bg-card border border-paper-dark/60 rounded-xl p-6">
          <h2 className="font-serif text-lg text-ink mb-3">关于这个项目</h2>
          <p>
            「长篇网络小说不剧透入坑地图」是一个<strong className="text-ink">个人产品项目</strong>，
            用来帮助读者在不被关键剧情剧透的前提下，快速判断一本长篇小说是否适合自己。
            它更关注<strong className="text-ink">阅读决策</strong>，而不是替代阅读本身。
          </p>
        </section>

        <section className="bg-card border border-paper-dark/60 rounded-xl p-6">
          <h2 className="font-serif text-lg text-ink mb-3">它解决什么问题</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>长篇小说动辄几百章，试错成本高，不适合盲目开坑；</li>
            <li>很多推荐容易剧透关键反转，读前反而失去探索感；</li>
            <li>本项目用标签、适合/不适合人群、弃文风险区、建议坚持区间、不剧透时间线，帮助你在入坑前做更理性的判断。</li>
          </ul>
        </section>

        <section className="bg-card border border-paper-dark/60 rounded-xl p-6">
          <h2 className="font-serif text-lg text-ink mb-3">它不是小说资源站</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>本站不提供小说正文；</li>
            <li>不提供下载资源；</li>
            <li>不提供盗版阅读链接；</li>
            <li>不使用未经授权的小说封面；</li>
            <li>不以搬运正文或替代正版阅读为目的。</li>
          </ul>
          <p className="text-sm mt-3">
            若你决定阅读某部作品，请前往起点中文网、晋江文学城等<strong className="text-ink">正版平台</strong>支持作者。
          </p>
        </section>

        <section className="bg-card border border-paper-dark/60 rounded-xl p-6">
          <h2 className="font-serif text-lg text-ink mb-3">内容说明与免责声明</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>站内推荐语、标签、入坑说明、阅读体验判断为<strong className="text-ink">原创整理</strong>，不替代正版平台的官方信息；</li>
            <li>作品基础信息、章节节点、结局口径等可能存在「待核验」内容，页面会如实标注；</li>
            <li>不同读者的阅读体验会有差异，本站内容仅作为阅读决策参考，不构成阅读建议或消费指引；</li>
            <li>
              如发现信息错误、版权问题或不合适内容，欢迎通过{' '}
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                GitHub 仓库
              </a>{' '}
              向维护者反馈。
            </li>
          </ul>
        </section>

        <section className="bg-card border border-paper-dark/60 rounded-xl p-6">
          <h2 className="font-serif text-lg text-ink mb-3">项目实现说明</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>React + Vite 纯前端，无后端、无登录、无数据库；</li>
            <li>
              运行时数据来自本地 JSON 文件，新增书目后会自动进入书库、推荐和进度判断流程；
            </li>
            <li>收藏、阅读状态保存在浏览器 localStorage，不上传服务器；</li>
            <li>部署于 GitHub Pages，同时支持 Vercel 访问；</li>
            <li>这是一个用于展示产品思考、信息架构、推荐逻辑和前端实现能力的个人项目。</li>
          </ul>
        </section>

        <section className="bg-card border border-paper-dark/60 rounded-xl p-6">
          <h2 className="font-serif text-lg text-ink mb-3">隐私说明</h2>
          <p className="text-sm">
            收藏、阅读记录等个人数据仅保存在你的浏览器 localStorage 中，不会上传到任何服务器。
          </p>
        </section>
      </div>
    </div>
  );
}
