import { FEATURE_ICONS } from './homeIcons';

const FEATURES = [
  { title: '打开网页就能玩', desc: '无需下载，浏览器直接开局' },
  { title: '不用准备卡牌和纸笔', desc: '手机自动发牌与记录' },
  { title: '房间码快速加入', desc: '四位码即可进入同一房间' },
  { title: '适合多人线下聚会', desc: '破冰暖场，欢乐加倍' },
];

export default function FeatureCards() {
  return (
    <section className="home-features">
      {FEATURES.map((item, index) => {
        const Icon = FEATURE_ICONS[index];
        return (
          <article key={item.title} className="home-feature-card">
            <span className="home-feature-icon" aria-hidden="true">
              <Icon size={22} strokeWidth={1.75} />
            </span>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </article>
        );
      })}
    </section>
  );
}
