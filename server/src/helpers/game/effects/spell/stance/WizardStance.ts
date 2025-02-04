import { DamageArgs, DamageClass, ICharacter, IStatusEffect, Skill, Stat } from '../../../../../interfaces';
import { Effect } from '../../../../../models';

export class WizardStance extends Effect {

  public override create(char: ICharacter, effect: IStatusEffect) {

    this.game.messageHelper.sendLogMessageToRadius(char, 4, { message: `${char.name} takes on a wizardly stance.` });

    const skill = this.game.characterHelper.getSkillLevel(char, Skill.Conjuration) + 1;

    this.game.effectHelper.removeEffectByName(char, 'Absorption');
    this.game.effectHelper.removeEffectByName(char, 'Protection');

    const absorptionData = this.game.spellManager.getSpellData('Absorption');
    const protectionData = this.game.spellManager.getSpellData('Protection');

    const absorptionPotency = this.game.spellManager.getPotency(char, char, absorptionData);
    const protectionPotency = this.game.spellManager.getPotency(char, char, protectionData);

    effect.effectInfo.statChanges = {
      [Stat.PhysicalResist]: Math.floor(protectionPotency * 1.5),
      [Stat.MagicalResist]: Math.floor(absorptionPotency * 1.5),
      [Stat.EnergyBoostPercent]: skill
    };
  }

  public override incoming(
    effect: IStatusEffect,
    char: ICharacter,
    attacker: ICharacter | null,
    damageArgs: DamageArgs,
    currentDamage: number
  ): number {
    if (!attacker || damageArgs.damageClass === DamageClass.Physical) return currentDamage;
    if (this.game.characterHelper.isDead(attacker)) return currentDamage;

    if (this.game.effectHelper.hasEffect(char, 'ImbueEnergy')
    && this.game.characterHelper.hasLearned(char, 'MagicMissile')) {
      this.game.commandHandler.getSkillRef('MagicMissile').use(char, attacker);

    } else {
      this.game.damageHelperMagic.magicalAttack(char, attacker, {
        atkMsg: 'You unleash energetic fury on %0!',
        defMsg: '%0 hit you with a burst of energetic power!',
        damage: effect.effectInfo.potency,
        damageClass: DamageClass.Energy
      });
    }

    return currentDamage;
  }

}
