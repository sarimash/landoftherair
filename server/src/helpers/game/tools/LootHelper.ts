
import { Injectable } from 'injection-js';
import { get, isString, random } from 'lodash';
import { LootTable } from 'lootastic';

import { Allegiance, INPC, ISimpleItem, ItemSlot, Rollable } from '../../../interfaces';
import { BaseService } from '../../../models/BaseService';

@Injectable()
export class LootHelper extends BaseService {

  constructor(
    // private holidayHelper: HolidayHelper
    // private content: ContentManager
  ) {
    super();
  }

  public init() {}

  // choose items to drop with replacing, aka, pick from the same pool each time (no removals)
  public chooseWithReplacement(choices: Rollable[]|string[], number = 1, bonus = 0) {
    if (choices.length === 0) return [];
    const table = new LootTable(this.applyBonusToTable(choices, bonus));
    return table.chooseWithReplacement(number);
  }

  // choose items to drop without replacing, aka, keep taking from the pool
  public chooseWithoutReplacement(choices: Rollable[]|string[], number = 1, bonus = 0) {
    if (choices.length === 0) return [];
    const table = new LootTable(this.applyBonusToTable(choices, bonus));
    return table.chooseWithoutReplacement(number);
  }

  // try to drop each item in the loot table
  private tryEachItem(choices: Rollable[]|string[], bonus = 0) {
    if (choices.length === 0) return [];
    const table = new LootTable(this.applyBonusToTable(choices, bonus));
    return table.tryToDropEachItem(0);
  }

  private applyBonusToTable(dropTable: any[], bonus = 0): Rollable[]|string[] {
    return dropTable.map(dt => {
      if (isString(dt)) return dt;

      if (dt.noLuckBonus) return dt;

      if (dt.maxChance) {
        dt.chance = Math.min(dt.maxChance, dt.chance + bonus);
      } else {
        dt.chance += bonus;
      }

      return dt;
    });
  }

  // filter out things that can't actually drop. basically, just holiday stuff
  private filterDropTable(dropTable: Rollable[]) {
    return dropTable.filter(item => item.requireHoliday ? this.game.holidayHelper.isHoliday(item.requireHoliday) : true);
  }

  // depending on the npc, they may boost their drop rates
  private getNPCBonusMultiplier(npc: INPC): number {
    if (npc.name.includes('elite')) return 2;
    return 1;
  }

  public getNPCLoot(npc: INPC, bonus = 0): ISimpleItem[] {

    const map = this.game.worldManager.getMap(npc.map)?.map;
    if (!map) return [];

    const { mapDroptables, regionDroptables } = map;

    // npcs can give bonuses in certain circumstances
    const npcBonus = this.getNPCBonusMultiplier(npc);
    bonus *= npcBonus;

    const isNaturalResource = npc.allegiance === Allegiance.NaturalResource;

    const rolledResults: any[] = [];

    // get region drops
    if (!isNaturalResource && regionDroptables.length > 0) {
      rolledResults.push(...this.tryEachItem(this.filterDropTable(regionDroptables.drops)));
    }

    // get map drops
    if (!isNaturalResource && mapDroptables.length > 0) {
      rolledResults.push(...this.tryEachItem(this.filterDropTable(mapDroptables.drops)));
    }

    // get npc drops
    if ((npc.drops?.length ?? 0) > 0) {
      rolledResults.push(...this.tryEachItem(this.filterDropTable(npc.drops ?? [])));
    }

    // check what they're guaranteed to drop
    if ((npc.copyDrops?.length ?? 0) > 0) {

      // make a rollable object out of copyDrops
      const drops = (npc.copyDrops ?? []).map(({ result, chance }) => {

        // hands are always dropped...
        if (result.includes('Hand')) return;

        // grab the item if it exists
        const item = get(npc.items, result);
        if (!item) return null;

        return { result: item.name, chance };
      }).filter(Boolean);

      // roll the drops if we have any
      if (drops.length > 0) {
        rolledResults.push(...this.tryEachItem(this.filterDropTable(drops as Rollable[])));
      }
    }

    // check npc drop pools
    // drop pools are special because you always get X of Y items guaranteed
    // not everything is randomly dropped
    if (npc.dropPool) {
      const { items, choose, replace } = npc.dropPool;
      const numChoices = random(choose.min, choose.max);
      if (numChoices > 0 && items.length > 0) {

        const filtered = this.filterDropTable(items);
        const results = replace ? this.chooseWithReplacement(filtered) : this.chooseWithoutReplacement(filtered);

        rolledResults.push(...results);
      }
    }

    // roll all of the items
    const rolledItems: ISimpleItem[] = rolledResults.map(x => this.game.itemCreator.getSimpleItem(x));

    // we always drop the hands - the golden rule (except greens)
    if (!this.game.traitHelper.rollTraitValue(npc, 'DeathGrip')) {
      if (npc.items.equipment[ItemSlot.RightHand]) rolledItems.push(npc.items.equipment[ItemSlot.RightHand] as ISimpleItem);
      if (npc.items.equipment[ItemSlot.LeftHand]) rolledItems.push(npc.items.equipment[ItemSlot.LeftHand] as ISimpleItem);
    }

    return rolledItems;
  }

}
