
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { IAccount } from '../interfaces';
import { Login, Logout, SetCharacterSlotInformation } from './actions';

const defaultAccount: () => IAccount = () => {
  return {
    username: '',
    email: '',
    players: [],

    isGameMaster: false,
    isTester: false,
    isSubscribed: false,

    subscriptionEndsTimestamp: -1,
    trialEndsTimestamp: -1
  };
};

@State<IAccount>({
  name: 'account',
  defaults: defaultAccount()
})
@Injectable()
export class AccountState {

  @Selector()
  static account(state: IAccount) {
    return state;
  }

  @Selector()
  static loggedIn(state: IAccount) {
    return !!state.username;
  }

  @Action(Login)
  login(ctx: StateContext<IAccount>, { info }: Login) {
    window.document.title = `[${info.account.username}] Land of the Rair`;

    info.account.players = info.account.players.reduce((prev, cur) => {
      prev[cur.charSlot] = cur;
      return prev;
    }, []);

    if (info.account.players.length < 4) info.account.players.length = 4;

    ctx.setState(Object.assign({}, ctx.getState(), info.account));
  }

  @Action(Logout)
  logout(ctx: StateContext<IAccount>, { }: Logout) {
    window.document.title = 'Land of the Rair';
    ctx.setState(defaultAccount());
  }

  @Action(SetCharacterSlotInformation)
  setCharacter(ctx: StateContext<IAccount>, { characterInfo, slot }: SetCharacterSlotInformation) {
    const state = ctx.getState();

    const players = [...state.players];
    players[slot] = characterInfo;

    ctx.patchState({ players });
  }

}
