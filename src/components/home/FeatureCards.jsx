const FEATURES = [
  { icon: '🌐', title: '打开网页就能玩', desc: '无需下载，浏览器直接开局' },
  { icon: '🃏', title: '不用准备卡牌和纸笔', desc: '手机自动发牌与记录' },
  { icon: '🔑', title: '房间码快速加入', desc: '四位码即可进入同一房间' },
  { icon: '🎉', title: '适合多人线下聚会', desc: '破冰暖场，欢乐加倍' },
];

export default function FeatureCards() {
  return (
    <section className="home-features">
      {FEATURES.map((item) => (
        <article key={item.title} className="home-feature-card card">
          <span className="home-feature-icon" aria-hidden="true">{item.icon}</span>
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </article>
      ))}
    </section>
  );
}
