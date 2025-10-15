'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Bookmark, BookmarkCheck } from 'lucide-react';
import { useSavedTitles } from '@/lib/hooks/use-saved-titles';
import { Title } from '@/types/title';

interface TitleCardProps {
  title: Title;
}

export function TitleCard({ title }: TitleCardProps) {
  const { toggleSave, isSaved } = useSavedTitles();
  const saved = isSaved(title.id);
  
  const posterUrl = title.posterUrl || title.posterPath 
    ? `https://image.tmdb.org/t/p/w500${title.posterPath || title.posterUrl}` 
    : '/placeholder-poster.jpg';

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(title.id);
  };

  return (
    <div className="relative group">
      <Link href={`/title/${title.id}`}>
        <Card className="overflow-hidden hover:ring-2 ring-primary transition-all cursor-pointer">
          <div className="aspect-[2/3] relative">
            <Image
              src={posterUrl}
              alt={title.title || title.originalTitle}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
            />
            {title.rating > 0 && (
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold">{title.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-sm line-clamp-2">
              {title.title || title.originalTitle}
            </h3>
            {title.releaseDate && (
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(title.releaseDate).getFullYear()}
              </p>
            )}
          </div>
        </Card>
      </Link>
      <Button
        variant={saved ? 'default' : 'secondary'}
        size="icon"
        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={handleSaveClick}
        title={saved ? 'Remove from saved' : 'Save to watchlist'}
      >
        {saved ? (
          <BookmarkCheck className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

