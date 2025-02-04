import { BaseClass, IPlayer, Skill } from '../interfaces';
import { initializeCharacter } from './character';

export const initializePlayer = (char: Partial<IPlayer> = {}): IPlayer => {

  const baseChar = initializeCharacter(char);

  return {
    ...baseChar,
    username: char.username ?? '',
    subscriptionTier: char.subscriptionTier ?? 0,
    z: char.z ?? 0,
    charSlot: char.charSlot ?? 0,
    exp: char.exp ?? 1000,
    axp: char.axp ?? 0,
    gainingAXP: char.gainingAXP ?? false,
    highestLevel: char.highestLevel ?? 1,
    swimLevel: char.swimLevel ?? 0,
    swimElement: char.swimElement ?? '',
    corpseRef: char.corpseRef ?? undefined,
    flaggedSkills: char.flaggedSkills ?? [Skill.Martial],
    skillTicks: 0,
    lastTileDesc: '',
    lastRegionDesc: '',
    paidSkills: char.paidSkills ?? { },
    bgmSetting: char.bgmSetting ?? 'wilderness',
    hungerTicks: char.hungerTicks ?? 0,
    partyName: char.partyName ?? '',
    respawnPoint: char.respawnPoint ?? { x: 14, y: 14, map: 'Tutorial' },
    lastDeathLocation: char.lastDeathLocation ?? undefined,
    dailyItems: char.dailyItems ?? {},
    traits: char.traits ?? { tp: 0, ap: 0, traitsLearned: {}, savedBuilds: {} },
    ancientLevel: char.ancientLevel ?? 0,
    items: char.items ?? { equipment: {}, sack: { items: [] }, belt: { items: [] }, buyback: [] },
    statistics: char.statistics ?? {
      statistics: {}, baseClass: BaseClass.Traveller, name: 'Unknown', level: 0, xp: 0, charSlot: 0, username: ''
    },
    lockers: char.lockers ?? { lockers: {} },
    bank: char.bank ?? { deposits: {} },
    accountLockers: char.accountLockers ?? { lockers: {}, materials: {}, pouch: { items: [] } },
    quests: char.quests ?? {
      permanentQuestCompletion: {}, npcDailyQuests: {}, activeQuestProgress: {}, questKillWatches: {}, questStats: {}
    },
    runes: char.runes ?? [],
    learnedRunes: char.learnedRunes ?? [],
    tradeskills: char.tradeskills ?? {},
    learnedRecipes: char.learnedRecipes ?? [],
    teleportLocations: char.teleportLocations ?? {},
    sessionStatistics: char.sessionStatistics ?? { statistics: {}, start: Date.now(), end: 0, baseClass: '', name: '', level: 0 }
  };
};
