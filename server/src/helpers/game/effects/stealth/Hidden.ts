import { BaseClass, ICharacter, IStatusEffect, Stat } from '../../../../interfaces';
import { Effect } from '../../../../models';

export class Hidden extends Effect {

  create(char: ICharacter, effect: IStatusEffect) {
    effect.effectInfo.potency = this.game.characterHelper.getStealth(char);
    effect.effectInfo.statChanges = { [Stat.Stealth]: effect.effectInfo.potency };
  }

  // update everyone in sight so they can't see us (maybe)
  apply(char: ICharacter) {
    const { state } = this.game.worldManager.getMap(char.map);
    state.triggerPlayerUpdateInRadius(char.x, char.y);
  }

  tick(char: ICharacter) {

    // thieves have to use their stealth bar
    if (char.baseClass === BaseClass.Thief) {
      const { state } = this.game.worldManager.getMap(char.map);
      const targets = state.getAllInRange(char, 4, [char.uuid], false);
      const numHostile = targets.filter(x => this.game.targettingHelper.checkTargetForHostility(char, x));
      if (numHostile.length === 0) return;

      const hostileReduction = this.game.traitHelper.traitLevelValue(char, 'ImprovedHide');
      const totalReduction = Math.max(1, numHostile.length - hostileReduction);

      this.game.characterHelper.manaDamage(char, totalReduction);

      if (char.mp.current <= 0) {
        this.game.effectHelper.removeEffectByName(char, 'Hidden');
      }
    }

    if (this.game.visibilityHelper.canContinueHidingAtSpot(char)) return;

    this.game.effectHelper.removeEffectByName(char, 'Hidden');
  }

  // update everyone in sight so they can see us again (if they couldn't before)
  unapply(char: ICharacter) {
    const { state } = this.game.worldManager.getMap(char.map);
    state.triggerPlayerUpdateInRadius(char.x, char.y);
  }

}
