
import { DamageClass } from './building-blocks';

export interface ISpellData {
  spellName: string;                    // the name of the spell
  maxSkillForGain: number;              // the max skill we can gain skill points from this spell for
  mpCost: number;                       // the mp cost of the skill

  castTime?: number;                    // the time (in seconds) it takes to channel this spell
  cooldown?: number;                    // the cooldown (in seconds) for recasting this spell
  damageClass?: DamageClass;            // the damage class of the spell
  willSaveThreshold?: number;           // the will save threshold. will roll (1, defWIL) and if it's >= willSaveThreshold, it saves
  willSavePercent?: number;             // the % damage reduced when will save is met
  potencyMultiplier?: number;           // the overall multiplier to the potency of the skill
  bonusRollsMin?: number;               // the number of bonus rolls this spell will roll at minimum (default 0)
  bonusRollsMax?: number;               // the number of bonus rolls this spell will roll at maximum (default 0)
  skillMultiplierChanges?: number[][];  // the skill multiplier buffs when you reach a certain skill threshold

  spellMeta: {
    aoe?: boolean;                      // whether or not this spell is an aoe
    aoeRangeTrait?: string;             // the trait that boosts the aoe of this spell
    allowDirectional?: boolean;         // whether or not the spell can be directionally targetted
    bonusAgro?: number;                 // bonus agro given from the caster to the target - primarily used for debuffs
    canBeResisted?: boolean;            // whether or not the spell can be resisted outright
    noReflect?: boolean;                // whether or not the spell can NOT be reflected (useful for cures, etc)
    staticPotency?: boolean;            // whether or not the potency for this spell should be static (buffs should be consistent)
    creatureSummoned?: string[];        // if this spell summons a creature, this is the npc id
    doesHeal?: boolean;                 // if the spell does a heal (inverse attack), it calls this first
    doesAttack?: boolean;               // if the spell does an attack, it calls this first
    doesOvertime?: boolean;             // if the spell has an over-time component, it is applied automatically
    extraAttackTrait?: string;          // if the spell doesAttack and can get bonus attack procs, this trait is what specifies how many
    noHostileTarget?: boolean;          // if the spell heals or buffs, this is set to true so it can't hit enemies
    casterMessage?: string;             // if the spell sends a message to the caster, it sends this if the caster is NOT the target
    casterAttackMessage?: string;       // if the spell does an attack, this is the unformatted message to send to the caster
    casterSfx?: string;                 // if the spell attacks or sends the caster a message, it uses this SFX
    targetMessage?: string;             // if the spell sends a message to the target, it sends this
    targetAttackMessage?: string;       // if the spell does an attack, this is the unformatted message to send to the caster
    targetSfx?: string;                 // if the spell does NOT attack, this is the SFX it sends along with targetMessage
    targetsParty?: boolean;             // if the spell targets the entire casters party (aka, powerwords)
    range?: number;                     // if the spell is an aoe, this is the default range from the center it targets (default 0)
    resistLowerTrait?: string;          // if the spell canBeResisted, this trait will improve the chance of the spell cast going through
    spellRef: string;                   // the reference to the spell for casting purposes
    useSkillAsPotency?: boolean;        // if true, the spell will use only the casters skill as the potency (unless there is already a potency set)
    fizzledBy?: string[];               // if set, the spell will not take hold on any target if they contain an effect listed in this array
  };

}
