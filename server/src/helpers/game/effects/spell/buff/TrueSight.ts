import { ICharacter } from '../../../../../interfaces';
import { Effect, Player } from '../../../../../models';

export class TrueSight extends Effect {

  // update everyone in sight so they can't see us (maybe)
  override apply(char: ICharacter) {
    if (this.game.characterHelper.isPlayer(char)) {
      const state = this.game.worldManager.getMap(char.map)?.state;
      if (!state) return;

      state.triggerFullUpdateForPlayer(char as Player);
    }
  }

  // update everyone in sight so they can see us again (if they couldn't before)
  override unapply(char: ICharacter) {
    if (this.game.characterHelper.isPlayer(char)) {
      const state = this.game.worldManager.getMap(char.map)?.state;
      if (!state) return;

      state.triggerFullUpdateForPlayer(char as Player);
    }
  }

}
