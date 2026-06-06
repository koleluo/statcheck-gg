import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let cachedVersion: string | null = null;
let cachedChampionIdMap: Record<number, string> | null = null;

export async function getLatestVersion(): Promise<string> {
  if (cachedVersion) return cachedVersion;
  const { data } = await axios.get<string[]>('https://ddragon.leagueoflegends.com/api/versions.json', {
    timeout: 8000,
  });
  cachedVersion = data[0];
  return cachedVersion;
}

export async function getChampionIdMap(): Promise<Record<number, string>> {
  if (cachedChampionIdMap) return cachedChampionIdMap;
  const version = await getLatestVersion();
  const { data } = await axios.get(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`,
    { timeout: 8000 }
  );
  const map: Record<number, string> = {};
  for (const champ of Object.values(data.data) as Array<{ key: string; id: string }>) {
    map[parseInt(champ.key)] = champ.id;
  }
  cachedChampionIdMap = map;
  return map;
}

export async function syncAllChampions(): Promise<void> {
  const version = await getLatestVersion();
  const { data } = await axios.get(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`,
    { timeout: 8000 }
  );

  interface DDChampion {
    id: string;
    name: string;
    title: string;
    tags: string[];
    image: { full: string };
  }

  const champions = Object.values(data.data) as DDChampion[];
  console.log(`Syncing ${champions.length} champions from Data Dragon ${version}...`);

  for (const champ of champions) {
    await prisma.champion.upsert({
      where: { riotId: champ.id },
      update: {
        name: champ.name,
        title: champ.title,
        imageUrl: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.image.full}`,
        tags: champ.tags,
      },
      create: {
        riotId: champ.id,
        name: champ.name,
        title: champ.title,
        imageUrl: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.image.full}`,
        tags: champ.tags,
      },
    });
  }

  console.log('Champion sync complete');
}
