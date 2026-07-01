import { Link } from 'react-router-dom';

export default function PartyAboutPage() {
  return (
    <div className="page-placeholder">
      <h1>关于聚会游戏合集</h1>
      <p>
        面向线下朋友聚会的无纸化游戏房间工具。用户可以创建房间、输入房间码加入，
        在房间内选择聚会游戏，手机负责发身份、发词、抽题、抽牌和阶段提示，
        真正的讨论、发言、投票都在线下完成。
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>
        当前版本：v0.1 静态前端骨架
      </p>
      <Link to="/" className="back-link">← 返回首页</Link>
    </div>
  );
}
