'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleLanguage} title="Switch language">
      <Globe className="h-5 w-5" />
      <span className="sr-only">Switch language</span>
    </Button>
  );
}

