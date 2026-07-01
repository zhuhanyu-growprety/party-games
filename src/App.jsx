import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PartyHomePage from './pages/PartyHomePage';
import RoomPage from './pages/RoomPage';
import GamesLibraryPage from './pages/GamesLibraryPage';
import GameDetailPage from './pages/GameDetailPage';
import PartyAboutPage from './pages/PartyAboutPage';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
      <div className="app-shell">
        <Routes>
          <Route index element={<PartyHomePage />} />
          <Route path="room/:code" element={<RoomPage />} />
          <Route path="games" element={<GamesLibraryPage />} />
          <Route path="games/:id" element={<GameDetailPage />} />
          <Route path="about" element={<PartyAboutPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
