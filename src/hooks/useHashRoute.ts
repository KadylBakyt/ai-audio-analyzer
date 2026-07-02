import * as React from 'react';

export type Route = 'home' | 'settings';

function parseHash(): Route {
  return window.location.hash.replace(/^#\/?/, '') === 'settings' ? 'settings' : 'home';
}

/**
 * Minimal dependency-free hash router. Keeps the app to a single library-free
 * navigation model while still giving Settings its own shareable URL (#/settings).
 */
export function useHashRoute() {
  const [route, setRoute] = React.useState<Route>(parseHash);

  React.useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = React.useCallback((next: Route) => {
    window.location.hash = next === 'home' ? '/' : '/settings';
    // Scroll to top on navigation for a page-like feel.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { route, navigate };
}
