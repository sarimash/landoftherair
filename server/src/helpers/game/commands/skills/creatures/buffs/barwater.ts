import { ICharacter } from '../../../../../../interfaces';
import { SpellCommand } from '../../../../../../models/macro';

export class BarWater extends SpellCommand {

  aliases = ['barwater', 'cast barwater'];
  requiresLearn = true;
  canTargetSelf = true;
  spellRef = 'BarWater';

  canUse(caster: ICharacter, target: ICharacter): boolean {
    return super.canUse(caster, target) && !this.game.effectHelper.hasEffect(target, 'BarWater');
  }

}
