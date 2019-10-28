import { Game } from '../helpers';
import { GameServerEvent, GameServerResponse, IServerAction } from '../interfaces';

export class ServerAction implements IServerAction {
  type = GameServerEvent.Default;
  requiresLoggedIn = true;
  requiredKeys: string[] = [];

  validate(args) {
    if (!this.requiredKeys || !this.requiredKeys.length) return true;

    return this.requiredKeys.every(key => typeof args[key] !== 'undefined');
  }

  async act(game: Game, { broadcast, emit, register, unregister }, data): Promise<void> {
    emit({ type: GameServerResponse.Error, error: 'No type specified.', data });
  }
}
