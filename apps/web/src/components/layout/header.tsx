'use client';

import Link from 'next/link';
import { Film, Search, User, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './language-switcher';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Film className="h-6 w-6" />
          <span className="font-bold text-xl">CineFindr</span>
        </Link>

        <div className="ml-8 flex gap-6">
          <Link href="/search?type=movie" className="text-sm font-medium hover:text-primary">
            {t('common.movies')}
          </Link>
          <Link href="/search?type=series" className="text-sm font-medium hover:text-primary">
            {t('common.series')}
          </Link>
          <Link href="/genres" className="text-sm font-medium hover:text-primary">
            {t('common.genres')}
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Link href="/search">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </Link>

          <LanguageSwitcher />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

