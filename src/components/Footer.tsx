import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="container mt-16 border-t py-8 text-center text-xs text-muted-foreground">
      <p>{t('footer.builtWith')}</p>
      <p className="mt-1 inline-flex items-center gap-1.5">
        <ShieldCheck className="size-3.5" />
        {t('footer.privacy')}
      </p>
    </footer>
  );
}
