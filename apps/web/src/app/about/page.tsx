import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">About CineFindr</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>What is CineFindr?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              CineFindr is a multilingual movie and series recommendation platform that helps you
              discover your next favorite content across all streaming platforms and languages.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Search across movies and TV series</li>
              <li>Multi-language support (English, Hindi, and more)</li>
              <li>Personalized recommendations based on your preferences</li>
              <li>Legal streaming provider links (Netflix, Prime Video, Disney+, etc.)</li>
              <li>Advanced filters by genre, year, rating, and more</li>
              <li>Dark mode support</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Attribution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This product uses the TMDb API but is not endorsed or certified by TMDb.
            </p>
            <p className="text-muted-foreground">
              All movie and series data, images, and metadata are provided by{' '}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                The Movie Database (TMDb)
              </a>
              .
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legal & Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              CineFindr only provides links to official, legal streaming platforms. We do not host
              or distribute any copyrighted content. All streaming links direct users to official
              provider websites.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

