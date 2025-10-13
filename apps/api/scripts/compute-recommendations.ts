import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const CONTENT_WEIGHT = parseFloat(process.env.RECO_CONTENT_WEIGHT || '0.6');
const COLLAB_WEIGHT = parseFloat(process.env.RECO_COLLAB_WEIGHT || '0.4');

async function computeCollaborativeScores() {
  console.log('Computing collaborative scores...');

  const users = await prisma.user.findMany({
    select: { id: true },
  });

  for (const user of users) {
    const interactions = await prisma.interaction.findMany({
      where: {
        userId: user.id,
        event: { in: ['LIKE', 'SAVE', 'COMPLETE'] },
      },
      include: { title: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    if (interactions.length === 0) continue;

    const likedGenres = [...new Set(interactions.flatMap((i) => i.title.genres))];
    const likedTitleIds = interactions.map((i) => i.titleId);

    const similarTitles = await prisma.title.findMany({
      where: {
        id: { notIn: likedTitleIds },
        genres: { hasSome: likedGenres },
      },
      take: 100,
    });

    for (const title of similarTitles) {
      const genreOverlap = title.genres.filter((g) => likedGenres.includes(g)).length;
      const collabScore = genreOverlap / Math.max(title.genres.length, 1);

      await prisma.recoScore.upsert({
        where: {
          userId_titleId: {
            userId: user.id,
            titleId: title.id,
          },
        },
        update: {
          score: collabScore,
          metadata: { method: 'collaborative', genreOverlap },
        },
        create: {
          userId: user.id,
          titleId: title.id,
          score: collabScore,
          metadata: { method: 'collaborative', genreOverlap },
        },
      });
    }

    console.log(`Computed scores for user ${user.id}`);
  }
}

async function computeHybridScores() {
  console.log('Computing hybrid scores...');

  const scores = await prisma.recoScore.findMany({
    include: {
      title: {
        include: { embedding: true },
      },
    },
  });

  for (const score of scores) {
    if (!score.title.embedding) continue;

    const userInteractions = await prisma.interaction.findMany({
      where: {
        userId: score.userId,
        event: { in: ['LIKE', 'SAVE', 'COMPLETE'] },
      },
      include: {
        title: { include: { embedding: true } },
      },
      take: 10,
    });

    const validInteractions = userInteractions.filter((i) => i.title.embedding);

    if (validInteractions.length === 0) continue;

    let totalContentSim = 0;
    for (const interaction of validInteractions) {
      const similarity = await prisma.$queryRaw<{ similarity: number }[]>`
        SELECT 1 - (e1.vector <=> e2.vector) as similarity
        FROM embeddings e1, embeddings e2
        WHERE e1.title_id = ${score.titleId}
          AND e2.title_id = ${interaction.titleId}
      `;

      if (similarity[0]) {
        totalContentSim += similarity[0].similarity;
      }
    }

    const avgContentSim = totalContentSim / validInteractions.length;
    const hybridScore = CONTENT_WEIGHT * avgContentSim + COLLAB_WEIGHT * score.score;

    await prisma.recoScore.update({
      where: { id: score.id },
      data: {
        score: hybridScore,
        metadata: {
          ...((score.metadata as any) || {}),
          contentSim: avgContentSim,
          collabScore: score.score,
          hybridScore,
        },
      },
    });
  }

  console.log('✅ Hybrid scores computed');
}

async function main() {
  try {
    await computeCollaborativeScores();
    await computeHybridScores();
    console.log('🎉 Recommendation computation completed!');
  } catch (error) {
    console.error('Error computing recommendations:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

