'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { t } = useTranslation();
  const userId = 'demo-user';

  const { data: profile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => api.getProfile(userId),
  });

  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: api.getGenres,
  });

  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    profile?.preferredGenres || []
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    profile?.preferredLanguages || ['en']
  );

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.updateProfile(userId, data),
  });

  const handleSave = () => {
    updateMutation.mutate({
      preferredGenres: selectedGenres,
      preferredLanguages: selectedLanguages,
    });
  };

  const toggleGenre = (genreName: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreName)
        ? prev.filter((g) => g !== genreName)
        : [...prev, genreName]
    );
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
            <CardTitle>{t('profile.preferredGenres')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {genres?.map((genre: any) => (
                <Button
                  key={genre.id}
                  variant={selectedGenres.includes(genre.name) ? 'default' : 'outline'}
                  onClick={() => toggleGenre(genre.name)}
                  className="w-full"
                >
                  {genre.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('profile.preferredLanguages')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={selectedLanguages.includes(lang.code) ? 'default' : 'outline'}
                  onClick={() =>
                    setSelectedLanguages((prev) =>
                      prev.includes(lang.code)
                        ? prev.filter((l) => l !== lang.code)
                        : [...prev, lang.code]
                    )
                  }
                  className="w-full"
                >
                  {lang.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : t('profile.save')}
          </Button>
        </div>

        {updateMutation.isSuccess && (
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-md">
            Profile updated successfully!
          </div>
        )}
      </div>
    </div>
  );
}

