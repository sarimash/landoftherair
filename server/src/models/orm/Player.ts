
import { merge } from 'lodash';
import { Cascade, Entity, IdentifiedReference, ManyToOne, MongoEntity, OneToOne, OnInit, PrimaryKey, Property, SerializedPrimaryKey } from 'mikro-orm';
import { ObjectID } from 'mongodb';
import uuid from 'uuid/v4';

import {
  Alignment, Allegiance, BaseClass, BGM, CharacterCurrency, Direction, initializePlayer,
  IPlayer, IStatusEffect, LearnedSpell, PROP_SERVER_ONLY, PROP_TEMPORARY, SkillBlock, StatBlock
} from '../../interfaces';

import { Account } from './Account';
import { CharacterItems } from './CharacterItems';

@Entity()
export class Player implements IPlayer, MongoEntity<Player> {

  @PrimaryKey() _id: ObjectID;
  @SerializedPrimaryKey() id: string;

  @ManyToOne() account: IdentifiedReference<Account, 'id'|'_id'>;

  // server-only props
  @Property(PROP_SERVER_ONLY()) createdAt = new Date();

  // temporary props
  @Property(PROP_TEMPORARY()) dir = Direction.South;
  @Property(PROP_TEMPORARY()) agro = {};
  @Property(PROP_TEMPORARY()) combatTicks = 0;
  @Property(PROP_TEMPORARY()) swimLevel = 0;
  @Property(PROP_TEMPORARY()) swimElement = '';
  @Property(PROP_TEMPORARY()) flaggedSkills = [];
  @Property(PROP_TEMPORARY()) actionQueue = { fast: [], slow: [] };
  @Property(PROP_TEMPORARY()) lastRegion = '';
  @Property(PROP_TEMPORARY()) lastRegionDesc = '';
  @Property(PROP_TEMPORARY()) bgmSetting = 'wilderness' as BGM;
  @Property(PROP_TEMPORARY()) partyName = '';
  @Property(PROP_TEMPORARY()) lastDeathLocation;
  @Property(PROP_TEMPORARY()) totalStats: StatBlock;

  // all characters have these props
  @Property() uuid: string;
  @Property() name: string;
  @Property() affiliation: string;
  @Property() allegiance: Allegiance;
  @Property() alignment: Alignment;
  @Property() baseClass: BaseClass;
  @Property() gender: 'male'|'female';

  @Property() level: number;
  @Property() highestLevel: number;
  @Property() currency: CharacterCurrency;

  @Property() map: string;
  @Property() x: number;
  @Property() y: number;
  @Property() z: number;

  @Property() stats: StatBlock;
  @Property() skills: SkillBlock;
  @Property() effects: { [effName: string]: IStatusEffect } = {};
  @Property() allegianceReputation: { [allegiance in Allegiance]?: number } = {};

  @OneToOne(
    () => CharacterItems,
    (item) => item.player,
    { cascade: [Cascade.ALL] }
  ) items: CharacterItems;

  // player-specific props
  @Property() exp: number;
  @Property() axp: number;
  @Property() charSlot: number;
  @Property() gainingAXP: boolean;

  @Property() hungerTicks: number;

  @Property() learnedSpells: { [spellName: string]: LearnedSpell };

  @Property() respawnPoint: { x: number, y: number, map: string };

  @OnInit()
  create() {
    if (!this.uuid) this.uuid = uuid();

    // TODO: waiting for new alpha then this should work (?)
    // const player = initializePlayer(this);
    // merge(this, player);
  }
}
