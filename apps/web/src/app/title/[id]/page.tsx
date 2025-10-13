import { Metadata } from 'next';
import { TitleDetail } from '@/components/title/title-detail';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Title Details - CineFindr`,
  };
}

export default function TitlePage({ params }: PageProps) {
  return <TitleDetail id={params.id} />;
}

