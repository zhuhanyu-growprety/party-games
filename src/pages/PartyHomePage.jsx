import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNickname, setNickname, setRoomRole, setCreatedRoomCode } from '../lib/storage';
import { generateRoomCode, normalizeRoomCode, isValidRoomCode } from '../lib/room';
import HomeNav from '../components/home/HomeNav';
import FeatureCards from '../components/home/FeatureCards';
import GameCarousel from '../components/home/GameCarousel';
import '../styles/home.css';

export default function PartyHomePage() {
  const navigate = useNavigate();
  const [nickname, setNicknameInput] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = getNickname();
    if (saved) setNicknameInput(saved);
  }, []);

  function saveNickname() {
    if (nickname.trim()) {
      setNickname(nickname);
    }
  }

  function handleCreate() {
    saveNickname();
    const code = generateRoomCode();
    setRoomRole('host');
    setCreatedRoomCode(code);
    navigate(`/room/${code}`);
  }

  function handleJoin() {
    setError('');
    const code = normalizeRoomCode(joinCode);
    if (!code) {
      setError('请输入房间码');
      return;
    }
    if (!isValidRoomCode(code)) {
      setError('房间码为 4 位大写字母或数字');
      return;
    }
    saveNickname();
    setRoomRole('member');
    navigate(`/room/${code}`);
  }

  return (
    <div className="home-page">
      <HomeNav />

      <main className="home-main">
        <section className="home-hero">
          <div className="home-hero-text">
            <h1 className="home-title">聚会游戏合集</h1>
            <p className="home-subtitle">不带卡牌，也能轻松开玩</p>
            <p className="home-desc">
              面向朋友聚会、宿舍夜聊、生日局、轰趴和破冰场景的线下游戏房间工具。
              手机负责发身份、发词、抽题和阶段提示，真正的讨论与投票留在现场。
            </p>
          </div>
          <div className="home-hero-illustration" aria-hidden="true">
            <div className="home-illust-scene">
              <span>🧑</span>
              <span>👩</span>
              <span>🧑‍🦱</span>
              <span>👨</span>
              <div className="home-illust-phone">📱</div>
            </div>
          </div>
        </section>

        <section className="home-action-bar card">
          <div className="home-action-group">
            <label htmlFor="nickname">昵称</label>
            <input
              id="nickname"
              className="home-input"
              type="text"
              placeholder="请输入你的昵称"
              value={nickname}
              onChange={(e) => setNicknameInput(e.target.value)}
              maxLength={20}
            />
          </div>

          <button type="button" className="btn btn-primary home-btn-create" onClick={handleCreate}>
            <span aria-hidden="true">🏠</span>
            创建房间
          </button>

          <div className="home-action-group">
            <label htmlFor="room-code">房间码</label>
            <input
              id="room-code"
              className="home-input home-input-code"
              type="text"
              placeholder="输入房间码加入"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 4))}
              maxLength={4}
              autoComplete="off"
            />
          </div>

          <button type="button" className="btn btn-blue home-btn-join" onClick={handleJoin}>
            <span aria-hidden="true">→</span>
            加入房间
          </button>

          {error && <p className="home-error">{error}</p>}
        </section>

        <FeatureCards />
        <GameCarousel />
      </main>
    </div>
  );
}
