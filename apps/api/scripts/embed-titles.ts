import { PrismaClient } from '@prisma/client';
import { pipeline } from '@xenova/transformers';

const prisma = new PrismaClient();
const MODEL_NAME = process.env.EMBEDDING_MODEL || 'Xenova/all-MiniLM-L6-v2';

async function generateEmbedding(text: string, embedder: any): Promise<number[]> {
  const result = await embedder(text, { pooling: 'mean', normalize: true });
  return Array.from(result.data);
}

async function main() {
  console.log('Loading embedding model...');
  const embedder = await pipeline('feature-extraction', MODEL_NAME);
  console.log('✅ Model loaded');

  const titlesWithoutEmbeddings = await prisma.title.findMany({
    where: {
      embedding: null,
    },
  });

  console.log(`Found ${titlesWithoutEmbeddings.length} titles without embeddings`);

  let processed = 0;

  for (const title of titlesWithoutEmbeddings) {
    try {
      const text = [
        title.originalTitle,
        title.overview || '',
        title.genres.join(' '),
        (title.cast as any)?.slice(0, 5).map((c: any) => c.name).join(' ') || '',
      ]
        .filter(Boolean)
        .join('. ');

      const embedding = await generateEmbedding(text, embedder);

      await prisma.$executeRaw`
        INSERT INTO embeddings (id, title_id, vector, created_at, updated_at)
        VALUES (gen_random_uuid()::text, ${title.id}, ${JSON.stringify(embedding)}::vector, NOW(), NOW())
        ON CONFLICT (title_id) DO UPDATE SET vector = ${JSON.stringify(embedding)}::vector, updated_at = NOW()
      `;

      processed++;
      if (processed % 10 === 0) {
        console.log(`Processed ${processed}/${titlesWithoutEmbeddings.length} titles`);
      }
    } catch (error) {
      console.error(`Error embedding title ${title.id}:`, error.message);
    }
  }

  console.log(`✅ Processed ${processed} title embeddings`);
}

main()
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

