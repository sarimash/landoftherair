import { DamageClass, ItemSlot } from './building-blocks';
import { ISimpleItem } from './item';
import { SoundEffect } from './sfx';

export enum CombatEffect {
  BlockMiss = 'block-miss',
  BlockArmor = 'block-armor',
  BlockWeapon = 'block-weapon',
  BlockShield = 'block-shield',
  BlockOffhand = 'block-offhand',
  HitWeak = 'hit-min',
  HitNormal = 'hit-mid',
  HitStrong = 'hit-max',
  HitHeal = 'hit-heal',
  HitMagic = 'hit-magic'
}

export interface OnesidedDamageArgs {
  damage: number;
  damageClass: DamageClass;
  damageMessage: string;
  suppressIfNegative?: boolean;
  overrideSfx?: SoundEffect;
}

export interface PhysicalAttackArgs {
  isPunch?: boolean;
  isKick?: boolean;
  isThrow?: boolean;
  isOffhand?: boolean;
  isMug?: boolean;
  isBackstab?: boolean;
  isCounterAttack?: boolean;
  isAssassinate?: boolean;
  throwHand?: ItemSlot;
  attackRange?: number;
  damageMult?: number;
  accuracyLoss?: number;
  offhandMultiplier?: number;
  backstabIgnoreRange?: boolean;
  attackerName?: string;
  damageClass?: DamageClass;
}

export interface MagicalAttackArgs {
  atkMsg?: string;
  defMsg?: string;
  damage?: number;
  damageClass?: DamageClass;
  isOverTime?: boolean;
  isAoE?: boolean;
  sfx?: SoundEffect;
}

export interface DamageArgs {
  damage: number;
  damageClass: DamageClass;
  isMelee?: boolean;
  attackerDamageMessage?: string;
  defenderDamageMessage?: string;
  attackerWeapon?: ISimpleItem;
  isRanged?: boolean;
  isOverTime?: boolean;
  isHeal?: boolean;
  isWeak?: boolean;
  isStrong?: boolean;
  isAttackerVisible?: boolean;
  customSfx?: SoundEffect;
}
