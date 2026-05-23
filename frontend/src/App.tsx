/**
 * App shell.....
 * Tiny home-rolled router (just `pathname` + `history.pushState`) — react-router
 * would be overkill for three routes, and the audience can read it in 20 seconds.
 * The header is the only shared chrome; pages render inside <main>.
 */
import { useEffect, useState } from 'react';
import { HomePage } from './pages/HomePage';
import { PresentationPage } from './pages/PresentationPage';
import { PlaygroundPage } from './pages/PlaygroundPage';

const ROUTES = ['/', '/presentation', '/playground'] as const;
type Route = (typeof ROUTES)[number];

function useRoute() {
  const [path, setPath] = useState<string>(() => window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const navigate = (to: string) => {
    if (to !== path) {
      window.history.pushState(null, '', to);
      setPath(to);
    }
  };
  return { path, navigate };
}

export default function App() {
  const { path, navigate } = useRoute();

  return (
    <div className="min-h-screen flex flex-col">
      <Header path={path} navigate={navigate} />
      <main className="flex-1">
        {path === '/presentation' ? (
          <PresentationPage />
        ) : path === '/playground' ? (
          <PlaygroundPage />
        ) : (
          <HomePage navigate={navigate} />
        )}
      </main>
    </div>
  );
}

function Header({
  path,
  navigate,
}: {
  path: string;
  navigate: (to: string) => void;
}) {
  const tabs: { to: Route; label: string }[] = [
    { to: '/presentation', label: 'Presentation' },
    { to: '/playground', label: 'Playground' },
  ];
  return (
    <header className="border-b border-line bg-surface">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded"
        >
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="font-semibold text-ink">Building with AI</span>
          <span className="hidden sm:inline text-sm text-ink-muted">
            — learning session
          </span>
        </button>
        <nav className="flex items-center gap-1">
          {tabs.map((t) => {
            const active = path === t.to || path.startsWith(t.to + '/');
            return (
              <button
                key={t.to}
                onClick={() => navigate(t.to)}
                className={[
                  'px-3 py-1.5 rounded-md text-sm font-medium transition',
                  active
                    ? 'bg-ink/[0.06] text-ink'
                    : 'text-ink-soft hover:text-ink hover:bg-ink/[0.04]',
                ].join(' ')}
              >
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
