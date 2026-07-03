import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, LogIn, Smile, ScanLine } from 'lucide-react';
import { getNickname, setNickname, setRoomRole } from '../lib/storage';
import { normalizeRoomCode, isValidRoomCode } from '../lib/room';
import { startHostRoom } from '../lib/roomEntry';
import { publicAsset } from '../lib/assetPaths';
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
    startHostRoom(navigate, nickname);
  }

  function handleGameCardClick(gameId) {
    startHostRoom(navigate, nickname, gameId);
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
      <div className="home-bg" aria-hidden="true">
        <div className="home-bg-glow home-bg-glow--purple" />
        <div className="home-bg-glow home-bg-glow--blue" />
        <div className="home-bg-glow home-bg-glow--pink" />
        <div className="home-bg-stars" />
      </div>

      <HomeNav />

      <main className="home-main">
        <div className="home-intro-block">
          <section className="home-hero">
            <div className="home-hero-text">
              <h1 className="home-title">聚会游戏合集</h1>
              <p className="home-subtitle">不带卡牌也能快速开局的聚会游戏房间工具</p>
              <div className="home-desc">
                <p>面向朋友聚会、宿舍夜聊、生日局、轰趴和破冰场景。</p>
                <p>手机负责发身份、发词、抽题和阶段提示。</p>
                <p>真正的讨论与投票留在现场。</p>
              </div>
            </div>
            <div className="home-hero-illustration">
              <div className="home-hero-image-frame">
                <img
                  className="home-hero-image"
                  src={publicAsset('illustrations/home-hero.png')}
                  alt=""
                  aria-hidden="true"
                />
              </div>
            </div>
          </section>

          <section className="home-action-bar">
          <div className="home-action-group">
            <label htmlFor="nickname">昵称</label>
            <div className="home-input-wrap">
              <input
                id="nickname"
                className="home-input"
                type="text"
                placeholder="请输入你的昵称"
                value={nickname}
                onChange={(e) => setNicknameInput(e.target.value)}
                maxLength={20}
              />
              <Smile size={16} strokeWidth={1.75} className="home-input-icon" aria-hidden="true" />
            </div>
          </div>

          <button type="button" className="btn btn-primary home-btn-create" onClick={handleCreate}>
            <Home size={18} strokeWidth={2} aria-hidden="true" />
            创建房间
          </button>

          <div className="home-action-group">
            <label htmlFor="room-code">房间码</label>
            <div className="home-input-wrap">
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
              <ScanLine size={16} strokeWidth={1.75} className="home-input-icon" aria-hidden="true" />
            </div>
          </div>

          <button type="button" className="btn btn-blue home-btn-join" onClick={handleJoin}>
            <LogIn size={18} strokeWidth={2} aria-hidden="true" />
            加入房间
          </button>

          {error && <p className="home-error">{error}</p>}
        </section>
        </div>

        <FeatureCards />
        <GameCarousel onGameClick={handleGameCardClick} />
      </main>
    </div>
  );
}
