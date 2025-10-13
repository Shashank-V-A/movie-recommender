import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">CineFindr</h3>
            <p className="text-sm text-muted-foreground">
              Discover movies and series across all platforms and languages.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Discover</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search" className="hover:text-primary">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/search?type=series" className="hover:text-primary">
                  Series
                </Link>
              </li>
              <li>
                <Link href="/genres" className="hover:text-primary">
                  Genres
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/profile" className="hover:text-primary">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-primary">
                  Saved
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  TMDB Attribution
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} CineFindr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

