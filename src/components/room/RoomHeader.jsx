import { Users } from 'lucide-react';
import { useState } from 'react';

export default function RoomHeader({ code, nickname, isHost, onCopy, onInvite, onExit }) {
  const [copied, setCopied] = useState(false);
  const displayName = nickname || '成员1';

  function handleCopy() {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <header className="room-header">
      <div className="room-header-left">
        <span className="room-header-logo" aria-hidden="true">
          <Users size={18} strokeWidth={2} />
        </span>
        <span className="room-header-brand">聚会游戏合集</span>
      </div>

      <div className="room-header-center">
        <div className="room-code-badge">
          <span className="room-code-label">房间码</span>
          <span className="room-code-value">{code}</span>
          <button type="button" className="btn btn-ghost btn-sm room-copy-btn" onClick={handleCopy}>
            {copied ? '已复制' : '复制房间码'}
          </button>
        </div>
      </div>

      <div className="room-header-right">
        <div className="room-user-info">
          <span className="room-user-avatar" aria-hidden="true">
            {displayName.charAt(0)}
          </span>
          <span className="room-user-name">{displayName}</span>
          {isHost && <span className="room-host-badge">房主</span>}
        </div>
        <button type="button" className="btn btn-primary btn-sm room-invite-btn" onClick={onInvite}>
          邀请朋友
        </button>
        <button type="button" className="btn btn-secondary btn-sm room-exit-btn" onClick={onExit}>
          退出房间
        </button>
      </div>
    </header>
  );
}
