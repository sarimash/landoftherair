import { Game } from '../../helpers';
import { GameAction, GameServerEvent, GameServerResponse } from '../../interfaces';
import { ServerAction } from '../../models/ServerAction';

export class ChatAction extends ServerAction {
  type = GameServerEvent.Chat;
  requiredKeys = ['content'];

  async act(game: Game, { broadcast }, data) {
    data.content = game.profanityHelper.cleanMessage(data.content);

    try {
      game.messageHelper.sendMessage(data.username, data.content);

    } catch (e) {
      game.logger.error('ChatAction', e);
      return { message: 'Could not send chat message? Try again, or if this persists contact a GM.' };
    }

    return {};
  }
}
