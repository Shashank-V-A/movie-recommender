import { TitleCard } from './title-card';

interface TitleRowProps {
  title: string;
  titles: any[];
}

export function TitleRow({ title, titles }: TitleRowProps) {
  if (!titles?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {titles.slice(0, 6).map((title) => (
          <TitleCard key={title.id} title={title} />
        ))}
      </div>
    </section>
  );
}

