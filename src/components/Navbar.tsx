import { Github, Waves } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/features/language/LanguageSwitcher';

const GITHUB_URL = 'https://github.com/KadylBakyt/ai-audio-analyzer';

interface NavbarProps {
  onNavigateHome: () => void;
}

export function Navbar({ onNavigateHome }: NavbarProps) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass border-x-0 border-t-0">
        <nav className="container flex h-16 items-center justify-between gap-2">
          <button
            onClick={onNavigateHome}
            className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={t('app.name')}
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-lg transition-transform group-hover:scale-105">
              <Waves className="size-5" />
            </span>
            <span className="hidden flex-col items-start leading-tight sm:flex">
              <span className="text-sm font-bold">{t('app.name')}</span>
              <span className="text-[11px] text-muted-foreground">{t('app.tagline')}</span>
            </span>
          </button>

          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button variant="ghost" size="icon" asChild aria-label={t('nav.github')}>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener" title={t('nav.github')}>
                <Github className="size-5" />
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
