import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const champions = [
  { riotId: 'Ahri', name: 'Ahri', title: 'the Nine-Tailed Fox', tags: ['Mage', 'Assassin'], winRate: 52.3, pickRate: 14.2, banRate: 8.5, avgKda: 2.8, avgCs: 168, tier: 'S' },
  { riotId: 'Zed', name: 'Zed', title: 'the Master of Shadows', tags: ['Assassin'], winRate: 50.1, pickRate: 11.8, banRate: 18.2, avgKda: 2.6, avgCs: 198, tier: 'A' },
  { riotId: 'LeBlanc', name: 'LeBlanc', title: 'the Deceiver', tags: ['Mage', 'Assassin'], winRate: 51.4, pickRate: 9.3, banRate: 12.1, avgKda: 2.9, avgCs: 162, tier: 'S' },
  { riotId: 'Jinx', name: 'Jinx', title: 'the Loose Cannon', tags: ['Marksman'], winRate: 53.2, pickRate: 16.7, banRate: 9.4, avgKda: 3.1, avgCs: 220, tier: 'S' },
  { riotId: 'LeeSin', name: 'Lee Sin', title: 'the Blind Monk', tags: ['Fighter', 'Assassin'], winRate: 48.9, pickRate: 13.4, banRate: 7.2, avgKda: 2.4, avgCs: 140, tier: 'B' },
  { riotId: 'Thresh', name: 'Thresh', title: 'the Chain Warden', tags: ['Support', 'Fighter'], winRate: 50.8, pickRate: 12.9, banRate: 6.8, avgKda: 3.4, avgCs: 22, tier: 'A' },
  { riotId: 'Yasuo', name: 'Yasuo', title: 'the Unforgiven', tags: ['Fighter', 'Assassin'], winRate: 49.2, pickRate: 15.3, banRate: 22.4, avgKda: 2.2, avgCs: 195, tier: 'B' },
  { riotId: 'Lulu', name: 'Lulu', title: 'the Fae Sorceress', tags: ['Support', 'Mage'], winRate: 52.7, pickRate: 10.1, banRate: 4.3, avgKda: 3.8, avgCs: 24, tier: 'S' },
  { riotId: 'Darius', name: 'Darius', title: 'the Hand of Noxus', tags: ['Fighter', 'Tank'], winRate: 51.8, pickRate: 12.6, banRate: 11.3, avgKda: 2.7, avgCs: 185, tier: 'A' },
  { riotId: 'Syndra', name: 'Syndra', title: 'the Dark Sovereign', tags: ['Mage', 'Assassin'], winRate: 51.1, pickRate: 8.7, banRate: 5.6, avgKda: 2.5, avgCs: 172, tier: 'A' },
  { riotId: 'Caitlyn', name: 'Caitlyn', title: 'the Sheriff of Piltover', tags: ['Marksman'], winRate: 51.9, pickRate: 14.8, banRate: 7.1, avgKda: 2.9, avgCs: 225, tier: 'A' },
  { riotId: 'Lux', name: 'Lux', title: 'the Lady of Luminosity', tags: ['Mage', 'Support'], winRate: 52.1, pickRate: 13.5, banRate: 5.9, avgKda: 3.2, avgCs: 155, tier: 'S' },
  { riotId: 'Vi', name: 'Vi', title: 'the Piltover Enforcer', tags: ['Fighter', 'Assassin'], winRate: 51.3, pickRate: 8.2, banRate: 3.4, avgKda: 2.6, avgCs: 138, tier: 'A' },
  { riotId: 'Kai\'Sa', name: "Kai'Sa", title: 'Daughter of the Void', tags: ['Marksman', 'Assassin'], winRate: 52.5, pickRate: 17.3, banRate: 10.2, avgKda: 3.0, avgCs: 215, tier: 'S' },
  { riotId: 'Ekko', name: 'Ekko', title: 'the Boy Who Shattered Time', tags: ['Assassin', 'Fighter'], winRate: 50.7, pickRate: 9.8, banRate: 6.7, avgKda: 2.7, avgCs: 158, tier: 'A' },
  { riotId: 'Orianna', name: 'Orianna', title: 'the Lady of Clockwork', tags: ['Mage', 'Support'], winRate: 50.4, pickRate: 7.6, banRate: 3.2, avgKda: 2.6, avgCs: 175, tier: 'A' },
  { riotId: 'Blitzcrank', name: 'Blitzcrank', title: 'the Great Steam Golem', tags: ['Tank', 'Fighter'], winRate: 53.4, pickRate: 11.2, banRate: 14.6, avgKda: 3.1, avgCs: 18, tier: 'S' },
  { riotId: 'Ezreal', name: 'Ezreal', title: 'the Prodigal Explorer', tags: ['Marksman', 'Mage'], winRate: 49.8, pickRate: 18.4, banRate: 8.9, avgKda: 2.8, avgCs: 210, tier: 'B' },
  { riotId: 'Akali', name: 'Akali', title: 'the Rogue Assassin', tags: ['Assassin'], winRate: 49.5, pickRate: 10.4, banRate: 15.7, avgKda: 2.5, avgCs: 178, tier: 'B' },
  { riotId: 'Malphite', name: 'Malphite', title: 'Shard of the Monolith', tags: ['Tank', 'Fighter'], winRate: 52.9, pickRate: 9.1, banRate: 6.4, avgKda: 2.3, avgCs: 155, tier: 'A' },
];

const summonerData = [
  { name: 'Faker', level: 500, profileIcon: 4580, region: 'KR' },
  { name: 'Doublelift', level: 387, profileIcon: 4066, region: 'NA1' },
  { name: 'Caps', level: 412, profileIcon: 3569, region: 'EUW1' },
  { name: 'Uzi', level: 398, profileIcon: 4702, region: 'KR' },
  { name: 'Showmaker', level: 445, profileIcon: 5329, region: 'KR' },
  { name: 'TheShy', level: 423, profileIcon: 4877, region: 'KR' },
  { name: 'Canyon', level: 456, profileIcon: 3891, region: 'KR' },
  { name: 'Knight', level: 389, profileIcon: 5126, region: 'KR' },
];

const rankedData = [
  { queue: 'RANKED_SOLO_5x5', tier: 'CHALLENGER', rank: 'I', lp: 1247, wins: 312, losses: 201 },
  { queue: 'RANKED_FLEX_SR', tier: 'GRANDMASTER', rank: 'I', lp: 876, wins: 189, losses: 132 },
  { queue: 'RANKED_SOLO_5x5', tier: 'MASTER', rank: 'I', lp: 420, wins: 287, losses: 234 },
  { queue: 'RANKED_SOLO_5x5', tier: 'DIAMOND', rank: 'I', lp: 89, wins: 198, losses: 176 },
  { queue: 'RANKED_SOLO_5x5', tier: 'PLATINUM', rank: 'II', lp: 67, wins: 143, losses: 128 },
  { queue: 'RANKED_SOLO_5x5', tier: 'GOLD', rank: 'III', lp: 34, wins: 112, losses: 108 },
  { queue: 'RANKED_SOLO_5x5', tier: 'SILVER', rank: 'I', lp: 78, wins: 89, losses: 94 },
  { queue: 'RANKED_SOLO_5x5', tier: 'MASTER', rank: 'I', lp: 156, wins: 267, losses: 198 },
];

const positions = ['TOP', 'JUNGLE', 'MID', 'BOT', 'SUPPORT'];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomItems(): number[] {
  const itemPool = [3157, 3089, 3165, 3040, 3135, 3285, 3115, 3026, 3031, 3153, 3142, 3147, 3074, 3078, 3053, 3065, 3082, 3143, 3083, 3110, 3190, 3109, 3107, 3504, 3222, 3364, 3340, 3363];
  const count = randomInt(3, 6);
  const items: number[] = [];
  for (let i = 0; i < count; i++) {
    items.push(randomChoice(itemPool));
  }
  return items;
}

async function main() {
  console.log('Seeding database...');

  await prisma.matchParticipant.deleteMany();
  await prisma.match.deleteMany();
  await prisma.rankedStats.deleteMany();
  await prisma.championStats.deleteMany();
  await prisma.champion.deleteMany();
  await prisma.summoner.deleteMany();

  const createdChampions: Record<string, string> = {};
  for (const champ of champions) {
    const { winRate, pickRate, banRate, avgKda, avgCs, tier, ...champData } = champ;
    const champion = await prisma.champion.create({
      data: {
        ...champData,
        imageUrl: `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${champ.riotId.replace(/[' ]/g, '')}.png`,
        stats: {
          create: {
            winRate,
            pickRate,
            banRate,
            avgKda,
            avgCs,
            gamesPlayed: randomInt(50000, 500000),
            tier,
          },
        },
      },
    });
    createdChampions[champ.riotId] = champion.id;
  }
  console.log(`Created ${champions.length} champions`);

  const createdSummoners: string[] = [];
  for (let i = 0; i < summonerData.length; i++) {
    const summoner = await prisma.summoner.create({
      data: {
        ...summonerData[i],
        rankedStats: {
          create: {
            ...rankedData[i],
          },
        },
      },
    });
    createdSummoners.push(summoner.id);
  }
  console.log(`Created ${summonerData.length} summoners`);

  const champIds = Object.values(createdChampions);
  const now = new Date();

  for (let m = 0; m < 30; m++) {
    const playedAt = new Date(now.getTime() - m * 45 * 60 * 1000);
    const duration = randomInt(1200, 2400);
    const summonerIdx = randomInt(0, createdSummoners.length - 1);
    const summonerId = createdSummoners[summonerIdx];
    const win = Math.random() > 0.5;

    await prisma.match.create({
      data: {
        gameId: `NA1_${7000000 + m}`,
        gameMode: 'CLASSIC',
        duration,
        playedAt,
        participants: {
          create: {
            summonerId,
            championId: randomChoice(champIds),
            kills: randomInt(0, 18),
            deaths: randomInt(0, 12),
            assists: randomInt(0, 24),
            cs: randomInt(100, 300),
            gold: randomInt(8000, 20000),
            items: randomItems(),
            win,
            lpChange: win ? randomInt(15, 25) : randomInt(-25, -15),
            position: randomChoice(positions),
            damage: randomInt(10000, 65000),
            visionScore: randomInt(8, 80),
          },
        },
      },
    });
  }
  console.log('Created 30 matches');
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
