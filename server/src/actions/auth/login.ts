import { Game } from '../../helpers';
import { GameAction, GameServerEvent, GameServerResponse } from '../../interfaces';
import { ServerAction } from '../../models/ServerAction';

export class LoginAction extends ServerAction {
  type = GameServerEvent.Login;
  requiredKeys = ['username', 'password'];

  async act(game: Game, { broadcast, emit }, data) {

    if (!data.username) throw new Error('Must specify username.');
    if (!data.password) throw new Error('Must specify password.');

    const account = await game.accountDB.getAccount(data.username);
    if (!account) throw new Error(`Username not registered.`);

    if (!game.accountDB.checkPassword(data, account)) throw new Error('Password does not match.');

    try {
      const simpleAccount = await game.accountDB.simpleAccount(account);
      delete simpleAccount.password;
      delete simpleAccount.players;

      broadcast({
        action: GameAction.ChatAddUser,
        user: simpleAccount
      });

      game.lobbyManager.addAccount(account);

      emit({
        type: GameServerResponse.Login,
        account,
        motd: game.lobbyManager.motd,
        onlineUsers: game.lobbyManager.onlineUsers
      });

      emit({
        action: GameAction.SetCharacterCreateInformation,
        charCreateInfo: game.contentManager.charSelectData
      });

    } catch (e) {
      game.logger.error('LoginAction', e);
      throw new Error('Could not login username?');
    }
  }
}
