import { Link, NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: '首页', end: true },
  { to: '/books', label: '书库' },
  { to: '/recommend', label: '智能推荐' },
  { to: '/progress', label: '进度判断' },
  { to: '/favorites', label: '我的书架' },
  { to: '/compare', label: '对比' },
  { to: '/about', label: '关于' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-paper-dark/60">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="font-serif text-lg font-semibold text-ink shrink-0">
          入坑地图
        </Link>
        <nav className="flex flex-wrap gap-1 justify-end">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `px-2.5 py-1 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-accent/15 text-accent font-medium'
                    : 'text-ink-muted hover:text-ink hover:bg-paper-dark/50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-paper-dark/40 py-6 text-center text-xs text-ink-muted">
        长篇网络小说不剧透入坑地图 · 读前决策助手 · 非小说正文站
      </footer>
    </div>
  );
}
