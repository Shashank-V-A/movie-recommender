'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('cinefindr-language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      setCurrentLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
    i18n.changeLanguage(langCode);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save language to localStorage for persistence
      localStorage.setItem('cinefindr-language', currentLanguage);
      
      // Save to backend (optional - for user profiles)
      // For now, we'll just use localStorage for simplicity
      
      // Show success message
      alert('Language preference saved successfully!');
    } catch (error) {
      console.error('Failed to save language preference:', error);
      alert('Failed to save language preference. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{t('profile.preferences')}</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Language Settings</CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose your preferred language for the website interface. This setting will be saved and remembered for your next visit.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={currentLanguage === lang.code ? 'default' : 'outline'}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="w-full h-12 text-sm"
                >
                  {lang.name}
                </Button>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                  ℹ️
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">Current Language: {languages.find(l => l.code === currentLanguage)?.name}</p>
                  <p>Changes take effect immediately. Click "Save Language" to make this setting permanent.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-8"
          >
            {isSaving ? 'Saving...' : 'Save Language'}
          </Button>
        </div>
      </div>
    </div>
  );
}

