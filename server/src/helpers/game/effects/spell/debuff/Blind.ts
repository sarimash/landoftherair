import { ICharacter, IStatusEffect, Stat } from '../../../../../interfaces';
import { Effect, Player } from '../../../../../models';

export class Blind extends Effect {

  public apply(char: ICharacter, effect: IStatusEffect) {
    if (this.game.characterHelper.isPlayer(char)) {
      this.game.visibilityHelper.calculatePlayerFOV(char as Player);
    }
  }

  public unapply(char: ICharacter, effect: IStatusEffect) {
    if (this.game.characterHelper.isPlayer(char)) {
      this.game.visibilityHelper.calculatePlayerFOV(char as Player);
    }
  }

}
